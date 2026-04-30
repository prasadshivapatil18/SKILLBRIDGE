import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { loadEnvConfig } from "@next/env";

// Load environment variables before any other imports
loadEnvConfig(process.cwd());

// Now import everything else
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

// Using require to ensure env vars are loaded first
const { db } = require("./lib/firebase-admin");
const { createNotification } = require("./lib/notifications");


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Room tracking
const rooms = new Map<string, Set<string>>();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware (permissive: verifies token if present, allows anonymous in dev)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        (socket as any).user = decoded;
      } catch (err) {
        console.warn("Invalid token from", socket.id, "- allowing as anonymous");
      }
    }

    next();
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      console.log(`User ${socket.id} joining room: ${roomId}`);
      
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      
      const room = rooms.get(roomId)!;
      
      // Notify current user of existing users in the room
      const existingUsers = Array.from(room);
      socket.emit("existing-users", existingUsers);
      
      // Add user to the room tracker
      room.add(socket.id);
      
      // Notify others in the room
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ offer, to }: { offer: any, to: string }) => {
      console.log(`Relaying offer from ${socket.id} to ${to}`);
      socket.to(to).emit("offer", {
        offer,
        from: socket.id
      });
    });

    socket.on("answer", ({ answer, to }: { answer: any, to: string }) => {
      console.log(`Relaying answer from ${socket.id} to ${to}`);
      socket.to(to).emit("answer", {
        answer,
        from: socket.id
      });
    });

    socket.on("ice-candidate", ({ candidate, to }: { candidate: any, to: string }) => {
      console.log(`Relaying ice-candidate from ${socket.id} to ${to}`);
      socket.to(to).emit("ice-candidate", {
        candidate,
        from: socket.id
      });
    });

    socket.on("send-message", ({ roomId, message }: { roomId: string, message: any }) => {
      if (!roomId) return;
      
      const broadcastData = {
        ...message,
        senderId: socket.id,
        timestamp: new Date().toISOString()
      };
      
      io.to(roomId).emit("receive-message", broadcastData);
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach(roomId => {
        if (rooms.has(roomId)) {
          const room = rooms.get(roomId)!;
          room.delete(socket.id);
          socket.to(roomId).emit("user-left", socket.id);
          
          if (room.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      
      // Start background tasks
      startSessionReminders();
    });

  // Background Task: Session Reminders
  async function startSessionReminders() {
    console.log("Starting session reminder background task...");

    setInterval(async () => {
      try {
        const now = new Date();
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
        const thirtyFiveMinutesLater = new Date(now.getTime() + 35 * 60 * 1000);

        // Fetch upcoming sessions that haven't had a reminder sent
        const snapshot = await db.collection("sessions")
          .where("status", "==", "upcoming")
          .where("reminderSent", "==", false)
          .get();

        for (const doc of snapshot.docs) {
          const session = doc.data();
          const { date, time, participants, title } = session;

          // Parse "YYYY-MM-DD" and "h:mm AM/PM"
          try {
            const [year, month, day] = date.split("-").map(Number);
            let [timeStr, modifier] = time.split(" ");
            let [hours, minutes] = timeStr.split(":").map(Number);

            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            const sessionStartTime = new Date(year, month - 1, day, hours, minutes);

            // Check if session starts in ~30 minutes
            if (sessionStartTime >= thirtyMinutesLater && sessionStartTime <= thirtyFiveMinutesLater) {
              console.log(`Sending 30min reminder for session: ${title}`);

              // Notify both participants
              for (const email of participants) {
                await createNotification({
                  userEmail: email,
                  title: "Session Starting Soon!",
                  message: `Your session "${title}" begins in 30 minutes. Get ready!`,
                  type: "session",
                  link: `/session/${doc.id}`
                });
              }

              // Mark reminder as sent
              await db.collection("sessions").doc(doc.id).update({
                reminderSent: true
              });
            }
          } catch (parseError) {
            console.error("Error parsing session date/time:", parseError);
          }
        }
      } catch (error) {
        console.error("Error in session reminder task:", error);
      }
    }, 60000); // Check every minute
  }
});

