"use client";

import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Discovery() {
  const [mounted, setMounted] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupSessionData, setGroupSessionData] = useState({
    title: "",
    topic: "",
    date: "",
    time: "",
    description: ""
  });
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupSessions, setGroupSessions] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { email } = JSON.parse(storedUser);
      
      try {
        const [mentorsRes, requestsRes, groupsRes] = await Promise.all([
          fetch(`/api/discovery?email=${email}`),
          fetch(`/api/requests?email=${email}&type=outgoing`),
          fetch(`/api/sessions/group`)
        ]);
        
        const mentorsData = await mentorsRes.json();
        const requestsData = await requestsRes.json();
        const groupsData = await groupsRes.json();
        
        if (mentorsRes.ok) setMentors(mentorsData.data);
        if (groupsRes.ok) setGroupSessions(groupsData.data);
        
        // Track which users already have pending requests
        if (requestsRes.ok) {
          const pending = new Set<string>(
            requestsData.data
              .filter((r: any) => r.status === "pending")
              .map((r: any) => r.receiverEmail)
          );
          setSentRequests(pending);
        }
      } catch (err) {
        console.error("Failed to fetch discovery data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  const filteredMentors = mentors.filter(mentor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = mentor.fullName?.toLowerCase().includes(query);
    const skillMatch = mentor.expertise?.some((s: any) => {
      const name = typeof s === "string" ? s : s.name;
      return name?.toLowerCase().includes(query);
    });
    const emailMatch = mentor.email?.toLowerCase().includes(query);
    return nameMatch || skillMatch || emailMatch;
  });

  const handleProposeSwap = async (mentor: any) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const { email } = JSON.parse(storedUser);
    setSendingTo(mentor.id);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: email,
          receiverEmail: mentor.email || mentor.id,
          skillWanted: typeof mentor.expertise?.[0] === "string" ? mentor.expertise[0] : mentor.expertise?.[0]?.name || "",
          skillOffered: "",
          message: ""
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSentRequests(prev => new Set([...prev, mentor.email || mentor.id]));
        alert(`[OK] Swap request sent to ${mentor.fullName}!`);
      } else {
        alert(`[!] ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to send swap request:", err);
      alert("[X] Failed to send request. Please try again.");
    } finally {
      setSendingTo(null);
    }
  };

  const handleHostGroupSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const { email, fullName } = JSON.parse(storedUser);
    setIsCreatingGroup(true);

    try {
      const res = await fetch("/api/sessions/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...groupSessionData,
          hostEmail: email,
          hostName: fullName
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert("Group session created successfully!");
        setGroupSessions(prev => [data.data, ...prev]);
        setIsGroupModalOpen(false);
        setGroupSessionData({ title: "", topic: "", date: "", time: "", description: "" });
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to create group session:", err);
      alert("Failed to create group session.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

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
              filteredMentors.map((mentor, index) => {
                const alreadySent = sentRequests.has(mentor.email || mentor.id);
                const isSending = sendingTo === mentor.id;
                
                return (
                  <div key={mentor.id} className="card-level-2 p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-2 h-full bg-secondary-400"></div>
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-xl shadow-inner">
                          {typeof mentor.fullName === "string" ? mentor.fullName.split(' ').map((n: string) => n[0]).join('') : "?"}
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-50 text-secondary-700 text-xs font-bold mb-2">
                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                            Match Score: {index === 0 ? '98%' : index === 1 ? '85%' : `${Math.max(50, 90 - index * 8)}%`}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">{typeof mentor.fullName === "string" ? mentor.fullName : "Mentor"}</h3>
                          <p className="text-sm text-slate-500 mb-4">
                            {typeof mentor.bio === "string" ? (mentor.bio.length > 60 ? `${mentor.bio.substring(0, 60)}...` : mentor.bio) : "Student"} - <span className="font-medium text-slate-600">Knows {typeof mentor.expertise?.[0] === "string" ? mentor.expertise[0] : (mentor.expertise?.[0]?.name || "Various")}</span>
                          </p>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Can Teach You</p>
                            <div className="flex gap-2 flex-wrap">
                              {Array.isArray(mentor.expertise) && mentor.expertise.map((skill: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                  {typeof skill === "string" ? skill : (skill?.name || "Skill")}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        {alreadySent ? (
                          <button disabled className="flex-1 sm:flex-none px-6 py-2.5 bg-green-100 text-green-700 font-bold rounded-xl cursor-not-allowed flex items-center gap-2 justify-center">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Request Sent
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleProposeSwap(mentor)}
                            disabled={isSending}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                          >
                            {isSending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                              </>
                            ) : (
                              "Propose Swap"
                            )}
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedUser(mentor);
                            setIsProfileModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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
              <h4 className="font-bold text-slate-800 mb-2">Can&apos;t find a perfect match?</h4>
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

              <div className="space-y-4 relative min-h-[100px]">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                {groupSessions.length > 0 ? (
                  groupSessions.map((cls, i) => {
                    const isFull = (cls.participants?.length || 0) >= (cls.maxParticipants || 10);
                    return (
                      <div key={cls.id} className="relative pl-8 group cursor-pointer">
                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center ring-4 ring-slate-100`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${isFull ? 'bg-slate-300' : 'bg-primary-500'}`}></div>
                        </div>
                        <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">
                            {typeof cls.title === "string" ? cls.title : "Community Session"}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-slate-500">
                              {typeof cls.date === "string" ? cls.date : ""} @ {typeof cls.time === "string" ? cls.time : ""}
                            </p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center ${
                              isFull ? 'bg-slate-100 text-slate-500' : 'bg-primary-50 text-primary-700'
                            }`}>
                              {isFull ? 'Full' : `${(cls.maxParticipants || 10) - (cls.participants?.length || 0)} left`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400">No group sessions yet.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsGroupModalOpen(true)}
                className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-600 hover:border-primary-200 hover:text-primary-600 font-bold rounded-xl transition-colors text-sm"
              >
                Host a Group Session
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
            
            <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-3xl">
                    {typeof selectedUser.fullName === "string" ? selectedUser.fullName.split(' ').map((n: string) => n[0]).join('') : "?"}
                  </div>
                </div>
                <div className="flex gap-2 pb-2">
                  <button 
                    onClick={() => {
                      handleProposeSwap(selectedUser);
                      setIsProfileModalOpen(false);
                    }}
                    className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Propose Swap
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">{typeof selectedUser.fullName === "string" ? selectedUser.fullName : "User Profile"}</h2>
                  <p className="text-slate-500 font-medium mb-4">
                    {typeof selectedUser.department === "string" ? selectedUser.department : "Student"} • Year {typeof selectedUser.year === "string" || typeof selectedUser.year === "number" ? selectedUser.year : "1"}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">About</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {typeof selectedUser.bio === "string" ? selectedUser.bio : "No bio available for this student."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(selectedUser.expertise) ? selectedUser.expertise.map((skill: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-bold">
                            {typeof skill === "string" ? skill : (skill?.name || "Skill")}
                          </span>
                        )) : <span className="text-slate-400 text-xs">None listed</span>}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(selectedUser.interests) ? selectedUser.interests.map((skill: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold">
                            {typeof skill === "string" ? skill : (skill?.name || "Skill")}
                          </span>
                        )) : <span className="text-slate-400 text-xs">None listed</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-secondary-50 border border-secondary-100 text-center">
                    <p className="text-2xl font-black text-secondary-600">{typeof selectedUser.credits === "number" ? selectedUser.credits : 0}</p>
                    <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-tighter">Skill Credits</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        {typeof selectedUser.email === "string" ? selectedUser.email : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Host Group Session Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGroupModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Host Group Session</h2>
            <p className="text-slate-500 text-sm mb-6">Share your expertise with multiple students at once.</p>
            
            <form onSubmit={handleHostGroupSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Session Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Advanced React Patterns"
                  value={groupSessionData.title}
                  onChange={(e) => setGroupSessionData({...groupSessionData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Topic / Skill</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., React, JavaScript, UI Design"
                  value={groupSessionData.topic}
                  onChange={(e) => setGroupSessionData({...groupSessionData, topic: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Date</label>
                  <input 
                    required
                    type="date" 
                    value={groupSessionData.date}
                    onChange={(e) => setGroupSessionData({...groupSessionData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Time</label>
                  <input 
                    required
                    type="time" 
                    value={groupSessionData.time}
                    onChange={(e) => setGroupSessionData({...groupSessionData, time: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="What will students learn in this session?"
                  value={groupSessionData.description}
                  onChange={(e) => setGroupSessionData({...groupSessionData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreatingGroup}
                  className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
                >
                  {isCreatingGroup ? "Creating..." : "Create Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

