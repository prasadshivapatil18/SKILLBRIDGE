"use client";

import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Discovery() {
  const [mounted, setMounted] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchMentors = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { email } = JSON.parse(storedUser);
      
      try {
        const res = await fetch(`/api/discovery?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setMentors(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch discovery mentors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [mounted]);

  const filteredMentors = mentors.filter(mentor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = mentor.fullName?.toLowerCase().includes(query);
    const skillMatch = mentor.expertise?.some((s: string) => s.toLowerCase().includes(query));
    const emailMatch = mentor.email?.toLowerCase().includes(query);
    return nameMatch || skillMatch || emailMatch;
  });
  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading Discovery...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 animate-fade-in-up flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Discovery</h1>
            <p className="text-slate-600 max-w-2xl">
              Discover students with the skills you want to learn and share what you know.
            </p>
          </div>
          
          <div className="relative group w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search by name or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Matches */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-100">
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Finding your perfect skill matches...</p>
              </div>
            ) : filteredMentors.length > 0 ? (
              filteredMentors.map((mentor, index) => (
                <div key={mentor.id} className="card-level-2 p-6 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-secondary-400"></div>
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-xl shadow-inner">
                        {mentor.fullName?.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-50 text-secondary-700 text-xs font-bold mb-2">
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                          Match Score: {index === 0 ? '98%' : index === 1 ? '85%' : '72%'}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{mentor.fullName}</h3>
                        <p className="text-sm text-slate-500 mb-4">{mentor.bio?.substring(0, 50)}... • <span className="font-medium text-slate-600">Knows {mentor.expertise?.[0]}</span></p>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Can Teach You</p>
                          <div className="flex gap-2 flex-wrap">
                            {mentor.expertise?.map((skill: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                        Propose Swap
                      </button>
                      <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No users found</h3>
                <p className="text-slate-500">Try searching for a different name or skill.</p>
              </div>
            )}

            {/* Empty state / Search more */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mt-8 bg-slate-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Can't find a perfect match?</h4>
              <p className="text-slate-500 text-sm mb-4">Expand your department search or post a public request.</p>
              <button className="text-primary-600 font-bold text-sm hover:underline">
                Browse all categories
              </button>
            </div>
          </div>

          {/* Right Column - Upcoming Classes */}
          <div className="animate-fade-in-up delay-200">
            <div className="card-level-1 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Group Sessions</h2>
                <Link href="/calendar" className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors flex items-center group">
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              </div>

              <div className="space-y-4 relative">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                {[
                  { title: "Git for Beginners", time: "Today @ 4:00 PM", slots: "8 slots left", color: "bg-primary-500", ring: "ring-primary-100" },
                  { title: "Intro to React.js", time: "Tomorrow @ 2:00 PM", slots: "3 slots left", color: "bg-tertiary-500", ring: "ring-tertiary-100" },
                  { title: "Python for Beginners", time: "Fri @ 11:00 AM", slots: "Full", color: "bg-slate-300", ring: "ring-slate-50" }
                ].map((cls, i) => (
                  <div key={i} className="relative pl-8 group cursor-pointer">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center ring-4 ${cls.ring}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${cls.color}`}></div>
                    </div>
                    <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{cls.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500">{cls.time}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center ${
                          cls.slots === 'Full' ? 'bg-slate-100 text-slate-500' : 'bg-primary-50 text-primary-700'
                        }`}>
                          {cls.slots}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-600 hover:border-primary-200 hover:text-primary-600 font-bold rounded-xl transition-colors text-sm">
                Host a Group Session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
