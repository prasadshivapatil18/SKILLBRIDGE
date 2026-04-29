"use client";

import Link from "next/link";
import { useState } from "react";

export default function Session() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

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
            <p className="text-xs text-primary-400 font-medium">00:45:12</p>
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
          <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative group">
            <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center">
               <div className="w-32 h-32 bg-primary-900 text-primary-300 rounded-full flex items-center justify-center text-5xl font-bold mb-4 shadow-inner">
                 MT
               </div>
               <p className="text-slate-400">Marcus is sharing screen...</p>
            </div>
            
            {/* Simulated Code Editor Overlay */}
            <div className="absolute inset-x-8 inset-y-8 bg-[#1e1e1e] rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col opacity-95">
              <div className="h-10 bg-[#2d2d2d] flex items-center px-4 gap-4 text-xs font-mono">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 bg-[#1e1e1e] text-slate-300 rounded-t-md mt-2">script.py</div>
              </div>
              <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 leading-relaxed">
                <div className="flex"><span className="w-8 text-slate-600 select-none">1</span><span className="text-purple-400">def</span> <span className="text-blue-400">process_data</span>(data):</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">2</span>  results = []</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">3</span>  <span className="text-purple-400">for</span> item <span className="text-purple-400">in</span> data:</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">4</span>    name = item.get(<span className="text-green-400">'user_name'</span>, <span className="text-green-400">'Unknown'</span>)</div>
                <div className="flex bg-primary-500/20"><span className="w-8 text-slate-600 select-none">5</span>    <span className="text-blue-400">print</span>(<span className="text-green-400">f"Processing: </span><span className="text-orange-400">{"{"}</span>name<span className="text-orange-400">{"}"}</span><span className="text-green-400">"</span>) <span className="text-slate-500 italic"># Debug line</span></div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">6</span>    results.append(name.upper())</div>
                <div className="flex"><span className="w-8 text-slate-600 select-none">7</span>  <span className="text-purple-400">return</span> results</div>
              </div>
            </div>

            {/* Peer Name Tag */}
            <div className="absolute bottom-4 left-4 glass-dark px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-sm font-medium">Marcus Thorne</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">mic</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 glass-dark rounded-2xl flex items-center justify-center gap-4 px-6 border border-slate-700/50 relative">
            {/* Self Video (PiP) */}
            <div className="absolute left-6 bottom-full mb-4 w-48 aspect-video bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                <span className="material-symbols-outlined text-4xl text-slate-500">
                  {camOn ? "person" : "videocam_off"}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 glass-dark px-2 py-0.5 text-xs rounded">You</div>
            </div>

            <button 
              onClick={() => setMicOn(!micOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <span className="material-symbols-outlined">
                {micOn ? "mic" : "mic_off"}
              </span>
            </button>
            <button 
              onClick={() => setCamOn(!camOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                camOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <span className="material-symbols-outlined">
                {camOn ? "videocam" : "videocam_off"}
              </span>
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">present_to_all</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">mood</span>
            </button>
            <button className="w-16 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all ml-4 shadow-lg shadow-red-500/20">
              <span className="material-symbols-outlined">call_end</span>
            </button>
          </div>
        </div>

        {/* Chat / Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
          <div className="h-14 border-b border-slate-800 flex items-center px-4 gap-4">
            <button className="text-sm font-bold text-white border-b-2 border-primary-500 h-full flex items-center">Chat</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-300 h-full flex items-center">Files (2)</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            <div className="text-center text-xs text-slate-500 mb-2">Today 4:00 PM</div>
            
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-secondary-900 text-secondary-400 flex items-center justify-center font-bold text-xs shrink-0">MT</div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-200">Marcus</span>
                  <span className="text-[10px] text-slate-500">4:12 PM</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300">
                  Try adding a print statement on line 5 to debug the name variable.
                </div>
              </div>
            </div>

            <div className="flex gap-3 max-w-[85%] self-end flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary-900 text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">You</div>
              <div className="items-end flex flex-col">
                <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                  <span className="font-bold text-sm text-slate-200">You</span>
                  <span className="text-[10px] text-slate-500">4:13 PM</span>
                </div>
                <div className="bg-primary-600 p-3 rounded-2xl rounded-tr-none text-sm text-white">
                  Got it! Like this?
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Message Marcus..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-white text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
