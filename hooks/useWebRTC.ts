"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  senderId: string;
  text: string;
  timestamp: string;
}

const getIceServers = () => {
  const servers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  if (process.env.NEXT_PUBLIC_TURN_SERVER_URL) {
    servers.push({
      urls: process.env.NEXT_PUBLIC_TURN_SERVER_URL,
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    });
  }

  return { iceServers: servers };
};

const ICE_SERVERS = getIceServers();

export function useWebRTC(roomId: string, token?: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);

  const socketRef = useRef<Socket | null>(null);
  const pcMap = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const createPeerConnection = useCallback((peerId: string, socket: Socket) => {
    if (pcMap.current.has(peerId)) {
      return pcMap.current.get(peerId)!;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.set(peerId, event.streams[0]);
        return next;
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        pc.close();
        pcMap.current.delete(peerId);
        setRemoteStreams((prev) => {
          const next = new Map(prev);
          next.delete(peerId);
          return next;
        });
      }
    };

    // Add local tracks to new peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pcMap.current.set(peerId, pc);
    return pc;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 1. Get Local Stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // 2. Connect to Socket
        const socket = io(typeof window !== "undefined" ? window.location.origin : undefined, {
          path: "/socket.io",
          transports: ["websocket", "polling"],
          auth: { token }
        });
        socketRef.current = socket;

        socket.on("connect_error", (err) => {
          console.error("Connection Error:", err.message);
          setError(err.message);
          setIsConnected(false);
        });

        socket.on("connect", () => {
          setIsConnected(true);
          setSocketId(socket.id);
          socket.emit("join-room", roomId);
        });

        socket.on("existing-users", async (users: string[]) => {
          for (const userId of users) {
            const pc = createPeerConnection(userId, socket);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { offer, to: userId });
          }
        });

        socket.on("user-joined", (userId: string) => {
          createPeerConnection(userId, socket);
        });

        socket.on("offer", async ({ offer, from }: { offer: RTCSessionDescriptionInit, from: string }) => {
          const pc = createPeerConnection(from, socket);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { answer, to: from });
        });

        socket.on("answer", async ({ answer, from }: { answer: RTCSessionDescriptionInit, from: string }) => {
          const pc = pcMap.current.get(from);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on("ice-candidate", async ({ candidate, from }: { candidate: RTCIceCandidateInit, from: string }) => {
          const pc = pcMap.current.get(from);
          if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socket.on("user-left", (userId: string) => {
          const pc = pcMap.current.get(userId);
          if (pc) {
            pc.close();
            pcMap.current.delete(userId);
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.delete(userId);
              return next;
            });
          }
        });

        socket.on("receive-message", (message: ChatMessage) => {
          setMessages((prev) => [...prev, message]);
        });

      } catch (err: any) {
        setError(err.message || "Failed to access camera/microphone");
      }
    };

    init();

    return () => {
      mounted = false;
      // Cleanup
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      pcMap.current.forEach(pc => pc.close());
      pcMap.current.clear();
      socketRef.current?.disconnect();
    };
  }, [roomId, createPeerConnection]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, []);

  const leaveCall = useCallback(() => {
    socketRef.current?.disconnect();
    pcMap.current.forEach(pc => pc.close());
    pcMap.current.clear();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsConnected(false);
    setMessages([]);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("send-message", {
        roomId,
        message: { text }
      });
    }
  }, [roomId, isConnected]);

  return {
    localStream,
    remoteStreams,
    isConnected,
    error,
    toggleAudio,
    toggleVideo,
    leaveCall,
    messages,
    sendMessage,
    socketId
  };
}
