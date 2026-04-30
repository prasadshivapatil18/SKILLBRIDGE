"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("1h");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/auth");
        return;
      }

      const { email } = JSON.parse(storedUser);
      
      try {
        const [userRes, sessionsRes, requestsRes] = await Promise.all([
          fetch(`/api/user/profile?email=${email}`),
          fetch(`/api/sessions?email=${email}&status=upcoming`),
          fetch(`/api/requests?email=${email}&type=incoming`)
        ]);

        const userData = await userRes.json();
        const sessionsData = await sessionsRes.json();
        const requestsData = await requestsRes.json();
        
        if (userRes.ok) {
          setUser(userData.data);
        } else {
          router.push("/onboarding");
          return;
        }

        if (sessionsRes.ok) setSessions(sessionsData.data);
        if (requestsRes.ok) setRequests(requestsData.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRescheduleAction = async (sessionId: string, action: 'accept' | 'reject' | 'propose') => {
    setActionLoading(sessionId);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const { email } = JSON.parse(storedUser);

    try {
      const body = {
        sessionId,
        action,
        userEmail: email,
        ...(action === 'propose' && { date: newDate, time: newTime, duration: newDuration })
      };

      const res = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(`[OK] Reschedule ${action}ed successfully!`);
        setRescheduleModalOpen(false);
        // Refresh sessions
        const updatedRes = await fetch(`/api/sessions?email=${email}&status=upcoming`);
        const updatedData = await updatedRes.json();
        if (updatedRes.ok) setSessions(updatedData.data);
      } else {
        const error = await res.json();
        alert(`[X] Error: ${error.error || "Failed to update session"}`);
      }
    } catch (err) {
      console.error("Reschedule error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome back, {user?.fullName?.split(" ")[0] || "Student"}
          </h1>
          <p className="text-slate-600">You have {user?.credits || 0} credits available for swapping.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-100">
            {/* Upcoming Sessions */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">calendar_today</span>
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {sessions.length > 0 ? (
                  sessions.map((session, i) => (
                    <div key={i} className="card-level-1 p-5 group hover:border-primary-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-primary-500`}>
                            {session.partnerName?.split(' ').map((n: string) => n[0]).join('') || '??'}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">{session.title}</h3>
                            <p className="text-sm text-slate-500">
                              with <span className="font-medium text-slate-700">{session.partnerName}</span> - {session.time} - {session.date}
                            </p>
                          </div>
                        </div>
                        <Link 
                          href={`/call/${session.roomId || session.id}`}
                          className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">videocam</span>
                          Join Call
                        </Link>
                      </div>

                      {/* Room ID Display */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary-600 text-sm">meeting_room</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room ID</p>
                            <p className="text-xs font-mono font-bold text-slate-700">{session.roomId || session.id}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(session.roomId || session.id);
                            alert("[OK] Room ID copied to clipboard!");
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-colors active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          Copy
                        </button>
                      </div>

                      {/* Reschedule Request Banner */}
                      {session.rescheduleRequest && session.rescheduleRequest.status === 'pending' && (
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-pulse">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-amber-500">schedule_send</span>
                              <div>
                                <p className="text-xs font-black text-amber-700 uppercase tracking-wider">
                                  {session.rescheduleRequest.proposedBy === user?.email ? "Waiting for Approval" : "Reschedule Proposed"}
                                </p>
                                <p className="text-sm text-amber-600 font-medium">
                                  {session.rescheduleRequest.date} at {session.rescheduleRequest.time} ({session.rescheduleRequest.duration})
                                </p>
                              </div>
                            </div>
                            
                            {session.rescheduleRequest.proposedBy !== user?.email && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleRescheduleAction(session.id, 'accept')}
                                  disabled={actionLoading === session.id}
                                  className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleRescheduleAction(session.id, 'reject')}
                                  disabled={actionLoading === session.id}
                                  className="px-4 py-2 bg-white border border-amber-200 text-amber-600 text-xs font-bold rounded-xl hover:bg-amber-50 transition-all disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Reschedule Button */}
                      {!session.rescheduleRequest && (
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => {
                              setSelectedSession(session);
                              setNewDate(session.date);
                              setNewTime(session.time);
                              setNewDuration(session.duration || "1h");
                              setRescheduleModalOpen(true);
                            }}
                            className="text-xs font-bold text-slate-400 hover:text-primary-500 flex items-center gap-1.5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                            Reschedule Session
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="card-level-1 p-10 text-center border-dashed">
                    <p className="text-slate-400 italic">No upcoming sessions. Why not discover a mentor?</p>
                    <Link href="/discovery" className="text-primary-600 font-bold mt-2 inline-block hover:underline">Find matches</Link>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Swap Requests */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary-500">waving_hand</span>
                  Recent Swap Requests
                </h2>
                <Link href="/requests" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.length > 0 ? (
                  requests.filter((r: any) => r.status === "pending").map((req, i) => (
                    <div key={req.id || i} className="card-level-2 p-5 border-t-4 border-t-secondary-400 flex flex-col h-full group hover:border-secondary-500 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform bg-primary-50 text-primary-600`}>
                          {req.senderName?.split(' ').map((n: string) => n[0]).join('') || '??'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{req.senderName}</h4>
                          <p className="text-xs text-slate-500">wants to learn <span className="font-medium text-slate-700">{req.skillWanted}</span></p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4 flex-1">
                        <p className="mb-2">&quot;{req.message || `I can teach you ${req.skillOffered} in exchange!`}&quot;</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {req.proposedTime || 'Flexible'}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button 
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/requests", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ requestId: req.id, action: "accept" })
                              });
                              if (res.ok) {
                                setRequests(prev => prev.filter((r: any) => r.id !== req.id));
                                alert("[OK] Request accepted! A session has been created.");
                              }
                            } catch (err) {
                              console.error("Failed to accept:", err);
                            }
                          }}
                          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-lg shadow-primary-500/10 active:scale-95"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/requests", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ requestId: req.id, action: "decline" })
                              });
                              if (res.ok) {
                                setRequests(prev => prev.filter((r: any) => r.id !== req.id));
                              }
                            } catch (err) {
                              console.error("Failed to decline:", err);
                            }
                          }}
                          className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 card-level-1 p-10 text-center border-dashed">
                    <p className="text-slate-400 italic">No pending requests at the moment.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Instant Meeting Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black mb-2">Need an Instant Swap?</h2>
                    <p className="text-primary-100 font-medium">Generate a private link and share it with any peer to start a session immediately.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const { v4: uuidv4 } = require('uuid');
                      const roomId = uuidv4();
                      router.push(`/call/${roomId}`);
                    }}
                    className="px-8 py-4 bg-white text-primary-600 font-black rounded-2xl shadow-xl hover:bg-primary-50 transition-all active:scale-95 flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined">video_call</span>
                    Start New Call
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center gap-4">
                  <p className="text-sm font-bold text-primary-200 uppercase tracking-widest whitespace-nowrap">Join existing room:</p>
                  <div className="flex-1 w-full relative">
                    <input 
                      type="text" 
                      id="roomInput"
                      placeholder="Enter Room ID (e.g. uuid)..." 
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-32 text-sm text-white placeholder-primary-300 focus:outline-none focus:bg-white/20 transition-all"
                    />
                    <button 
                      onClick={() => {
                        const roomId = (document.getElementById('roomInput') as HTMLInputElement).value;
                        if (roomId) router.push(`/call/${roomId}`);
                      }}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-primary-400 hover:bg-primary-300 text-white font-bold rounded-lg text-xs transition-colors"
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Skills */}
          <div className="space-y-6 animate-fade-in-up delay-200">
            <div className="card-level-1 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">My Skills <span className="text-slate-500 font-normal text-sm">(Teaching)</span></h2>
                <button className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>

              <div className="space-y-4">
                {user?.expertise?.length > 0 ? (
                  user.expertise.map((skill: any, i: number) => {
                    const skillName = typeof skill === "string" ? skill : skill.name;
                    const skillIcon = typeof skill === "string" ? (i % 2 === 0 ? "psychology" : "school") : skill.icon;
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${i % 2 === 0 ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'} flex items-center justify-center`}>
                            <span className="material-symbols-outlined">{skillIcon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{skillName}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <span className="text-tertiary-500 font-bold">
                                {typeof skill === "string" ? "New" : skill.level}
                              </span> 
                              ({typeof skill === "string" ? 0 : skill.sessions} sessions)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-sm italic">No expertise added yet.</p>
                )}
              </div>
            </div>

            <div className="card-level-1 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-50 rounded-bl-full -z-10"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Skills I Want <span className="text-slate-500 font-normal text-sm">(Learning)</span></h2>
                <button className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <div className="space-y-4">
                {user?.interests?.length > 0 ? (
                  user.interests.map((skill: any, i: number) => {
                    const skillName = typeof skill === "string" ? skill : skill.name;
                    return (
                      <div key={i} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center group">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{skillName}</h4>
                          <p className="text-xs text-primary-600 mt-0.5">Searching for Partner...</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary-500 transition-colors animate-pulse">search</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-sm italic">No interests added yet.</p>
                )}
              </div>
            </div>
            
            {/* Credit Balance */}
            <a href="/history" className="block group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                <h2 className="text-sm font-medium text-slate-300 mb-1">Available Credits</h2>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-white">{user?.credits || 0}</span>
                  <span className="text-sm font-medium text-secondary-400 mb-1">credits</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-xs text-slate-400">
                  <span>Earned: {user?.credits || 0}</span>
                  <span>Spent: 0</span>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-primary-400 transition-colors">
                  View full ledger
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRescheduleModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">edit_calendar</span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Reschedule Session</h3>
                  <p className="text-xs text-slate-500 font-medium">Propose new timings to your partner</p>
                </div>
              </div>
              <button onClick={() => setRescheduleModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-400 transition-colors shadow-sm border border-transparent hover:border-slate-100">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Proposed Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">New Time</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">schedule</span>
                    <input 
                      type="text" 
                      value={newTime}
                      placeholder="e.g. 4:30 PM"
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Duration</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">timer</span>
                    <select 
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
                    >
                      <option value="30m">30 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="1.5h">1.5 Hours</option>
                      <option value="2h">2 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-[20px] mt-0.5">info</span>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  The session timings will only update once your partner accepts this proposal.
                </p>
              </div>

              <button 
                onClick={() => handleRescheduleAction(selectedSession.id, 'propose')}
                disabled={actionLoading === selectedSession?.id}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {actionLoading === selectedSession?.id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Send Proposal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
