"use client";

import Link from "next/link";
import { useState } from "react";

export default function Session() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'Marcus', text: 'Try adding a print statement on line 5 to debug the name variable.', time: '4:12 PM', isMe: false },
    { sender: 'You', text: 'Got it! Like this?', time: '4:13 PM', isMe: true }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [time, setTime] = useState(2712); // 45:12 in seconds

  // Live Timer Effect
  useState(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  });

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
            <h1 className="font-bold text-white text-sm">Advanced Python Tutoring</h1>
            <p className="text-xs text-primary-400 font-medium">{formatTime(time)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary-400">group_add</span>
            Invite
          </button>
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Video Area */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Main Video (Peer) */}
          <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden relative group shadow-2xl">
            <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center">
               <div className="w-32 h-32 bg-primary-900 text-primary-300 rounded-full flex items-center justify-center text-5xl font-bold mb-4 shadow-inner">
                 MT
               </div>
               <p className="text-slate-400">Marcus is sharing screen...</p>
            </div>
            
            {/* Simulated Code Editor Overlay */}
            <div className="absolute inset-x-8 inset-y-8 bg-[#1e1e1e] rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-700 overflow-hidden flex flex-col opacity-98 scale-95 group-hover:scale-100 transition-transform duration-700">
              <div className="h-10 bg-[#2d2d2d] flex items-center px-4 gap-4 text-xs font-mono">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 bg-[#1e1e1e] text-slate-300 rounded-t-md mt-2">script.py</div>
              </div>
              <div className="flex-1 p-6 font-mono text-sm overflow-auto text-slate-300 leading-relaxed scrollbar-hide">
                <div className="flex"><span className="w-8 text-slate-600 select-none">1</span><span className="text-purple-400">def</span> <span className="text-blue-400">process_data</span>(data):</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">2</span>  results = []</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">3</span>  <span className="text-purple-400">for</span> item <span className="text-purple-400">in</span> data:</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">4</span>    name = item.get(<span className="text-green-400">'user_name'</span>, <span className="text-green-400">'Unknown'</span>)</div>
                <div className="flex bg-primary-500/20 rounded"><span className="w-8 text-slate-600 select-none">5</span>    <span className="text-blue-400">print</span>(<span className="text-green-400">f"Processing: </span><span className="text-orange-400">{"{"}</span>name<span className="text-orange-400">{"}"}</span><span className="text-green-400">"</span>) <span className="text-slate-500 italic"># Debug line</span></div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">6</span>    results.append(name.upper())</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">7</span>  <span className="text-purple-400">return</span> results</div>
              </div>
            </div>

            {/* AI Assistant Floating Suggestion */}
            <div className={`absolute top-6 right-6 w-64 bg-slate-900/95 backdrop-blur border border-primary-500/30 p-4 rounded-2xl shadow-2xl transition-all duration-500 ${aiOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary-400 text-sm">auto_awesome</span>
                <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">AI Assistance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Marcus is currently looking at your <span className="text-primary-400 font-bold">List Comprehension</span> logic. You might want to suggest a more Pythonic way.
              </p>
              <button className="mt-3 w-full py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-[10px] font-bold rounded-lg uppercase tracking-tighter transition-colors">
                Apply Suggestion
              </button>
            </div>

            {/* Peer Name Tag */}
            <div className="absolute bottom-4 left-4 glass-dark px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-medium">Marcus Thorne</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">mic</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 glass-dark rounded-[2.5rem] flex items-center justify-center gap-4 px-8 border border-white/5 relative shadow-2xl">
            {/* Self Video (PiP) */}
            <div className="absolute left-6 bottom-full mb-6 w-48 aspect-video bg-slate-800 rounded-2xl border-2 border-slate-700/50 overflow-hidden shadow-2xl group/pip">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                {camOn ? (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-500">person</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-3xl text-slate-600 mb-1">videocam_off</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Camera Off</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 glass-dark px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">You (Host)</div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMicOn(!micOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  micOn ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                <span className="material-symbols-outlined">
                  {micOn ? "mic" : "mic_off"}
                </span>
              </button>
              <button 
                onClick={() => setCamOn(!camOn)}
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
              <button className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">mood</span>
              </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-800 mx-2"></div>

            <Link 
              href="/dashboard"
              className="w-16 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/30 active:scale-95"
            >
              <span className="material-symbols-outlined">call_end</span>
            </Link>
          </div>
        </div>

        {/* Chat / Sidebar */}
        <div className={`bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-500 ${chatOpen ? 'w-96' : 'w-0 overflow-hidden border-none'}`}>
          <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between">
            <div className="flex gap-6 h-full">
              <button className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-primary-500 h-full flex items-center">Chat</button>
              <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 h-full flex items-center">Files (2)</button>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
            <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Session started 4:00 PM</div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'self-end flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 shadow-lg ${
                  msg.isMe ? 'bg-primary-900 text-primary-400 order-2' : 'bg-secondary-900 text-secondary-400'
                }`}>
                  {msg.sender === 'Marcus' ? 'MT' : 'YO'}
                </div>
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
    </div>
  );
}
