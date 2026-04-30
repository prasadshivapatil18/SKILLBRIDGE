import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

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
        console.warn("Invalid token from", socket.id, "— allowing as anonymous");
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
    });
});
