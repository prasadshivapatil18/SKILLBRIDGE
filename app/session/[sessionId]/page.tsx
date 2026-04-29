"use client";

import Link from "next/link";
import { useState, useEffect, useRef, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { WebRTCSignaling } from "../../../lib/webrtc-signaling";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();
  
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const signalingRef = useRef<WebRTCSignaling | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [time, setTime] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth");
      return;
    }
    const user = JSON.parse(storedUser);
    setCurrentUser(user);

    const initCall = async () => {
      try {
        // 1. Fetch Session Details
        const res = await fetch(`/api/requests?sessionId=${sessionId}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Session not found");
        setSessionData(data.data);

        // 2. Setup WebRTC
        const signaling = new WebRTCSignaling(sessionId);
        signalingRef.current = signaling;

        const streams = await signaling.setupLocalStream();
        if (localVideoRef.current) localVideoRef.current.srcObject = streams.local;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = streams.remote;

        // 3. Determine Role & Connect
        // In our data model, the session is created from a request.
        // We'll assume the person who accepted (receiver) is the host for the signaling logic, 
        // or just use a consistent rule (e.g. alphabetical email).
        // Let's check who the current user is.
        const isHost = user.email < (data.data.senderEmail || data.data.receiverEmail); // Simple stable rule
        
        if (isHost) {
          await signaling.createCall();
        } else {
          await signaling.joinCall();
        }

        setLoading(false);
      } catch (err) {
        console.error("Video call setup failed:", err);
        setLoading(false);
      }
    };

    initCall();

    return () => {
      signalingRef.current?.cleanup();
    };
  }, [sessionId, router]);

  // Live Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setNewMessage("");
  };

  const toggleMic = () => {
    if (signalingRef.current?.localStream) {
      const audioTrack = signalingRef.current.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleCam = () => {
    if (signalingRef.current?.localStream) {
      const videoTrack = signalingRef.current.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !camOn;
        setCamOn(!camOn);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold">Initializing Secure Connection...</p>
        <p className="text-slate-400 mt-2 text-sm">Setting up WebRTC and Camera</p>
      </div>
    );
  }

  const partnerName = currentUser?.email === sessionData?.senderEmail ? sessionData?.receiverName : sessionData?.senderName;

  return (
    <div className="h-screen bg-slate-900 text-slate-200 flex flex-col font-[family-name:var(--font-lexend)] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-slate-900 z-0"></div>

      {/* Header */}
      <header className="h-16 px-6 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 hover:text-white">arrow_back</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">swap_horiz</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div>
            <h1 className="font-bold text-white text-sm">{sessionData?.skillWanted} Swap Session</h1>
            <p className="text-xs text-primary-400 font-medium">{formatTime(time)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary-400">group_add</span>
            Invite
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Video Area */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Main Video (Remote Peer) */}
          <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden relative group shadow-2xl">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover mirror-mode"
            />
            
            {!remoteVideoRef.current?.srcObject && (
              <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center">
                 <div className="w-32 h-32 bg-primary-900 text-primary-300 rounded-full flex items-center justify-center text-5xl font-bold mb-4 shadow-inner">
                   {partnerName?.[0] || "?"}
                 </div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for {partnerName} to join...</p>
              </div>
            )}

            {/* Peer Name Tag */}
            <div className="absolute bottom-6 left-6 glass-dark px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-bold">{partnerName || "Peer"}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 glass-dark rounded-[2.5rem] flex items-center justify-center gap-4 px-8 border border-white/5 relative shadow-2xl">
            {/* Self Video (PiP) */}
            <div className="absolute left-6 bottom-full mb-6 w-56 aspect-video bg-slate-800 rounded-3xl border-2 border-primary-500/30 overflow-hidden shadow-2xl group/pip">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover mirror-mode"
              />
              {!camOn && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-slate-600 mb-1">videocam_off</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 glass-dark px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">You</div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMic}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  micOn ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                <span className="material-symbols-outlined">
                  {micOn ? "mic" : "mic_off"}
                </span>
              </button>
              <button 
                onClick={toggleCam}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  camOn ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                <span className="material-symbols-outlined">
                  {camOn ? "videocam" : "videocam_off"}
                </span>
              </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-800 mx-2"></div>

            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">present_to_all</span>
              </button>
              <button 
                onClick={() => setAiOpen(!aiOpen)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  aiOpen ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-800 mx-2"></div>

            <button 
              onClick={() => router.push("/dashboard")}
              className="w-16 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              <span className="material-symbols-outlined">call_end</span>
            </button>
          </div>
        </div>

        {/* Chat / Sidebar */}
        <div className={`bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-500 ${chatOpen ? 'w-96' : 'w-0 overflow-hidden border-none'}`}>
          <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between">
            <div className="flex gap-6 h-full">
              <button className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-primary-500 h-full flex items-center">Chat</button>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
            <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Live Session Chat</div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'self-end flex-row-reverse' : ''}`}>
                <div className={`${msg.isMe ? 'items-end' : ''} flex flex-col`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-xs text-slate-300">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.isMe 
                      ? 'bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-500/10' 
                      : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="relative group">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..." 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-white text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Chat Toggle (when closed) */}
        {!chatOpen && (
          <button 
            onClick={() => setChatOpen(true)}
            className="absolute right-6 bottom-24 w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-2xl z-50 animate-bounce-subtle"
          >
            <span className="material-symbols-outlined">chat</span>
          </button>
        )}
      </main>

      <style jsx>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
