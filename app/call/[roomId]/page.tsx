"use client";

import { useParams, useRouter } from "next/navigation";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoTile from "@/app/components/VideoTile";
import { useState, useEffect, useRef } from "react";

export default function CallPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId || "";
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setEmail(JSON.parse(storedUser).email);
    }
  }, []);

  const {
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
  } = useWebRTC(roomId);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleAudio = () => {
    toggleAudio();
    setIsMicOn(!isMicOn);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsCamOn(!isCamOn);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    leaveCall();
    if (timerRef.current) clearInterval(timerRef.current);
    const mins = Math.floor(sessionTime / 60);
    // User gets 1 credit for every 15 mins
    const earnedCredits = Math.floor(mins / 15);
    
    // Update credits in background
    if (earnedCredits > 0 && email) {
      fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          credits: earnedCredits, 
          action: "increment_credits" 
        })
      }).catch(err => console.error("Failed to update credits:", err));
    }
    
    router.push(`/call/${roomId}/summary?duration=${sessionTime}&credits=${earnedCredits}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (text && isConnected) {
      sendMessage(text);
      setMessageInput("");
    }
  };

  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showChat]);

  useEffect(() => {
    // Silent context injection — not shown in UI
    // We do this by directly posting to the API, not via sendMessage
    // so it doesn't appear in the visible chat history
    fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `The user is currently in a WebRTC video call. 
                      Room ID: ${roomId}. If they ask about call issues, 
                      help them troubleshoot audio, video, or connectivity.`
          },
          {
            role: "user", 
            content: "I just joined a video call."
          }
        ]
      })
    }).catch(() => {}); // silent — don't surface errors for context injection
  }, [roomId]);

  if (error) {
    return (
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden font-[family-name:var(--font-lexend)]">
      {/* Header */}
      <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">videocam</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Room: {roomId}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                  <span className="material-symbols-outlined text-[12px] text-primary-400">timer</span>
                  <span className="text-[10px] font-mono font-bold text-gray-300">{formatTime(sessionTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Grid */}
        <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${showChat ? 'mr-0 lg:mr-4' : ''}`}>
          <div className={`grid gap-6 auto-rows-[300px] ${
            showChat 
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {/* Local Video */}
            {localStream && (
              <div className="relative">
                <VideoTile stream={localStream} muted={true} label="You" />
                {!isCamOn && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-3xl">
                    <span className="material-symbols-outlined text-4xl text-gray-600">videocam_off</span>
                  </div>
                )}
              </div>
            )}

            {/* Remote Videos */}
            {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
              <VideoTile key={peerId} stream={stream} label={`Peer: ${peerId.slice(0, 4)}`} />
            ))}

            {remoteStreams.size === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-500 text-3xl animate-pulse">group</span>
                </div>
                <h3 className="text-lg font-bold text-gray-400">Waiting for others to join...</h3>
                <p className="text-sm text-gray-600 mt-1">Share the Room ID to start the call</p>
              </div>
            )}
          </div>
        </main>

        {/* Chat Sidebar */}
        <aside className={`w-full lg:w-96 bg-gray-900 border-l border-white/5 flex flex-col transition-all duration-300 transform ${
          showChat ? 'translate-x-0' : 'translate-x-full fixed right-0 h-full'
        } ${!showChat && 'hidden lg:flex pointer-events-none opacity-0 lg:w-0 lg:border-none'}`}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500 text-lg">chat</span>
                In-call Messages
              </h2>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                isConnected ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
              }`}>
                <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                {isConnected ? 'Online' : 'Reconnecting'}
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="lg:hidden p-1 hover:bg-white/5 rounded-lg">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 px-10 text-center">
                <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                <p className="text-xs">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === socketId;
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-primary-600 text-white rounded-br-none' 
                          : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/5'
                      }`}>
                        <p className="break-words">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 px-1">
                        {isMe ? 'You' : `User ${msg.senderId.slice(0, 4)}`} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-gray-900/80 border-t border-white/5">
            <div className="relative group">
              <input 
                type="text" 
                placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!isConnected}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit"
                disabled={!messageInput.trim() || !isConnected}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:bg-primary-600 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* Footer Controls */}
      <footer className="h-24 px-8 border-t border-white/5 bg-gray-900/80 backdrop-blur-xl flex items-center justify-center gap-6">
        <button 
          onClick={handleToggleAudio}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isMicOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
          }`}
        >
          <span className="material-symbols-outlined">{isMicOn ? 'mic' : 'mic_off'}</span>
        </button>

        <button 
          onClick={handleToggleVideo}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isCamOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
          }`}
        >
          <span className="material-symbols-outlined">{isCamOn ? 'videocam' : 'videocam_off'}</span>
        </button>

        <button 
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative ${
            showChat ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          <span className="material-symbols-outlined">chat</span>
          {messages.length > 0 && !showChat && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
              {messages.length}
            </span>
          )}
        </button>

        <div className="w-[1px] h-10 bg-white/10 mx-2"></div>

        <button 
          onClick={handleLeave}
          className="px-8 h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-red-600/20 active:scale-95"
        >
          <span className="material-symbols-outlined">call_end</span>
          Leave Room
        </button>
      </footer>
    </div>
  );
}
