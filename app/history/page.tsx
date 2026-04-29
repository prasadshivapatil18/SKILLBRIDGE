"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { email } = JSON.parse(storedUser);
      
      try {
        const res = await fetch(`/api/sessions?email=${email}&status=completed`);
        const data = await res.json();
        if (res.ok) {
          setHistory(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.skill?.toLowerCase().includes(query) ||
      item.partnerName?.toLowerCase().includes(query)
    );
  });

  const totalCreditsEarned = filteredHistory.reduce((acc, item) => item.type === 'taught' ? acc + (item.credits || 0) : acc, 0);
  const totalCreditsSpent = filteredHistory.reduce((acc, item) => item.type === 'learned' ? acc + Math.abs(item.credits || 0) : acc, 0);

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pb-16">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-500 text-3xl">history</span>
                Learning History
              </h1>
              <p className="text-slate-500 font-medium mt-1">A comprehensive record of your skill-bartering journey and credit flow.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Earned</p>
                  <p className="text-xl font-black text-slate-900 leading-none">+{totalCreditsEarned}</p>
                </div>
              </div>
              <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">payments</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Spent</p>
                  <p className="text-xl font-black text-slate-900 leading-none">-{totalCreditsSpent}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up delay-100">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button className="px-6 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-bold shadow-sm">All Sessions</button>
            <button className="px-6 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-sm font-bold transition-all">Taught</button>
            <button className="px-6 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-sm font-bold transition-all">Learned</button>
          </div>
          
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search by skill or partner..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium w-80 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* History Table/List */}
        <div className="space-y-4 animate-fade-in-up delay-200">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your journey...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item, i) => (
              <div 
                key={item.id} 
                className="card-level-1 p-6 bg-white flex items-center justify-between group hover:border-primary-200 transition-all"
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* Type Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    item.type === 'taught' ? 'bg-secondary-50 text-secondary-600' : 'bg-primary-50 text-primary-600'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {item.type === 'taught' ? 'campaign' : 'school'}
                    </span>
                  </div>

                  {/* Skill & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{item.skill}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        item.type === 'taught' ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {item.date || "Past Session"}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {item.duration || "1h"}
                      </span>
                    </div>
                  </div>

                  {/* Partner */}
                  <div className="flex items-center gap-3 px-6 border-x border-slate-100">
                    <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform text-slate-600`}>
                      {item.partnerName?.split(' ').map((n: string) => n[0]).join('') || "??"}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Partner</p>
                      <p className="text-sm font-bold text-slate-700">{item.partnerName || "Peer Student"}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="px-6 border-r border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rating</p>
                    <div className="flex items-center justify-center gap-1 text-tertiary-600 font-black">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      {item.rating || 5}
                    </div>
                  </div>

                  {/* Credit Impact */}
                  <div className="w-32 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Credit Impact</p>
                    <p className={`text-xl font-black ${
                      item.type === 'taught' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {item.type === 'taught' ? `+${item.credits || 0}` : `-${item.credits || 0}`}
                    </p>
                  </div>
                </div>

                {/* More Action */}
                <button className="ml-6 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">history_edu</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No history yet</h3>
              <p className="text-slate-500">Complete your first skill swap to see it here!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
