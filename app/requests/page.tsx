"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function RequestsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchRequests = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { email } = JSON.parse(storedUser);

      try {
        const [inRes, outRes] = await Promise.all([
          fetch(`/api/requests?email=${email}&type=incoming`),
          fetch(`/api/requests?email=${email}&type=outgoing`)
        ]);

        const inData = await inRes.json();
        const outData = await outRes.json();

        if (inRes.ok) setIncomingRequests(inData.data || []);
        if (outRes.ok) setOutgoingRequests(outData.data || []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [mounted]);

  const handleAction = async (requestId: string, action: 'accept' | 'decline') => {
    setActionLoading(requestId);
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action })
      });

      if (res.ok) {
        if (action === 'accept') {
          setIncomingRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r)
          );
          alert("[OK] Request accepted! A session has been created.");
        } else {
          setIncomingRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, status: 'declined' } : r)
          );
        }
      }
    } catch (err) {
      console.error("Failed to update request:", err);
      alert("[X] Failed to update. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending');
  const historyIncoming = incomingRequests.filter(r => r.status !== 'pending');
  const displayedRequests = activeTab === 'incoming' ? pendingIncoming : outgoingRequests;

  const totalReceived = incomingRequests.length;
  const totalSent = outgoingRequests.length;
  const totalAccepted = [...incomingRequests, ...outgoingRequests].filter(r => r.status === 'accepted').length;
  const totalAll = totalReceived + totalSent;
  const acceptanceRate = totalAll > 0 ? Math.round((totalAccepted / totalAll) * 100) : 0;

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const avatarColors = [
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-rose-100 text-rose-600",
    "bg-orange-100 text-orange-600",
    "bg-emerald-100 text-emerald-600",
    "bg-cyan-100 text-cyan-600",
    "bg-amber-100 text-amber-600",
  ];

  const getAvatarColor = (name: string) => {
    const hash = (name || "").split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading Requests...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pb-16">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-500 text-3xl">swap_horizontal_circle</span>
                Swap Requests
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'incoming' ? 'Review your incoming skill exchange invitations.' : 'Track the invitations you sent to other students.'}
              </p>
            </div>
            
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setActiveTab('incoming')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'incoming' 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Incoming
                {pendingIncoming.length > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingIncoming.length}</span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('outgoing')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'outgoing' 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Outgoing
                {outgoingRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {outgoingRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Active Requests List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                {activeTab === 'incoming' ? 'Pending For You' : 'Invitations Sent'} ({displayedRequests.length})
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Sort by Recent
              </div>
            </div>

            {loading ? (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Fetching your requests...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedRequests.map((req, i) => {
                  const displayName = activeTab === 'incoming' ? req.senderName : req.receiverName;
                  const displayEmail = activeTab === 'incoming' ? req.senderEmail : req.receiverEmail;
                  const isProcessing = actionLoading === req.id;
                  
                  return (
                    <div 
                      key={req.id} 
                      className="card-level-2 p-0 overflow-hidden bg-white group animate-fade-in-up"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Left: User Info */}
                        <div className="md:w-64 p-6 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center text-center">
                          <div className={`w-20 h-20 rounded-full ${getAvatarColor(displayName)} flex items-center justify-center text-2xl font-black mb-4 shadow-inner group-hover:scale-105 transition-transform duration-500`}>
                            {getInitials(displayName)}
                          </div>
                          <h3 className="font-bold text-slate-900 leading-tight">
                            {typeof displayName === "string" ? displayName : "Student"}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium mb-3">{displayEmail}</p>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${
                            req.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                            req.status === 'accepted' ? 'bg-green-50 border-green-200 text-green-600' :
                            'bg-red-50 border-red-200 text-red-600'
                          }`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {req.status === 'pending' ? 'pending' : req.status === 'accepted' ? 'check_circle' : 'cancel'}
                            </span>
                            {req.status}
                          </div>
                        </div>

                        {/* Middle: Request Details */}
                        <div className="flex-1 p-6">
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {activeTab === 'incoming' ? 'Wants to Learn' : 'Your Goal'}
                              </p>
                              <p className="font-bold text-primary-600 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">school</span>
                                {typeof req.skillWanted === "string" ? req.skillWanted : (req.skillWanted?.name || "General")}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {activeTab === 'incoming' ? 'Offers Expertise' : 'You Offered'}
                              </p>
                              <p className="font-bold text-secondary-600 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                                {typeof req.skillOffered === "string" ? req.skillOffered : (req.skillOffered?.name || "General")}
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 relative">
                            <span className="material-symbols-outlined absolute -top-3 -left-1 text-slate-200 text-4xl rotate-180">format_quote</span>
                            <p className="text-sm text-slate-600 italic relative z-10 leading-relaxed">
                              &quot;{req.message || `I'd love to swap skills with you!`}&quot;
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                                <span className="material-symbols-outlined text-[18px] text-primary-500">calendar_today</span>
                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                                <span className="material-symbols-outlined text-[18px] text-primary-500">schedule</span>
                                {req.createdAt ? new Date(req.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Flexible'}
                              </div>
                            </div>

                            {activeTab === 'outgoing' && (
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                                req.status === 'accepted' ? 'bg-green-50 border-green-100 text-green-600' :
                                req.status === 'declined' ? 'bg-red-50 border-red-100 text-red-600' :
                                'bg-amber-50 border-amber-100 text-amber-600'
                              }`}>
                                <span className="material-symbols-outlined text-[18px]">
                                  {req.status === 'accepted' ? 'check_circle' : req.status === 'declined' ? 'cancel' : 'pending'}
                                </span>
                                {req.status}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions (Only for Incoming Pending) */}
                        {activeTab === 'incoming' && req.status === 'pending' && (
                          <div className="p-6 md:w-48 bg-white flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100">
                            <button 
                              onClick={() => handleAction(req.id, 'accept')}
                              disabled={isProcessing}
                              className="flex-1 md:flex-none py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                  Accept
                                </>
                              )}
                            </button>
                            <button 
                              onClick={() => handleAction(req.id, 'decline')}
                              disabled={isProcessing}
                              className="flex-1 md:flex-none py-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[20px]">cancel</span>
                              Decline
                            </button>
                          </div>
                        )}

                        {/* Right: Status badge for already-acted incoming */}
                        {activeTab === 'incoming' && req.status !== 'pending' && (
                          <div className="p-6 md:w-48 bg-white flex md:flex-col gap-3 justify-center items-center border-t md:border-t-0 md:border-l border-slate-100">
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                              req.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {req.status === 'accepted' ? '[OK] Accepted' : '[X] Declined'}
                            </div>
                            {req.status === 'accepted' && (req.roomId || req.sessionId) && (
                              <>
                                <Link 
                                  href={`/call/${req.roomId || req.sessionId}`}
                                  className="w-full py-2 bg-primary-500 text-white text-[10px] font-black rounded-lg text-center hover:bg-primary-600 transition-colors"
                                >
                                  Join Room
                                </Link>
                                <p className="text-[9px] text-slate-400 font-mono text-center mt-1 truncate" title={req.roomId || req.sessionId}>Room: {(req.roomId || req.sessionId)?.slice(0, 8)}...</p>
                              </>
                            )}
                          </div>
                        )}

                        {/* Right: Info (Only for Outgoing) */}
                        {activeTab === 'outgoing' && (
                          <div className="p-6 md:w-48 bg-white flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100">
                            {req.status === 'accepted' && (req.roomId || req.sessionId) ? (
                              <>
                                <Link 
                                  href={`/call/${req.roomId || req.sessionId}`}
                                  className="flex-1 md:flex-none py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
                                >
                                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                                  Join Session
                                </Link>
                                <p className="text-[9px] text-slate-400 font-mono text-center truncate" title={req.roomId || req.sessionId}>Room: {(req.roomId || req.sessionId)?.slice(0, 8)}...</p>
                              </>
                            ) : req.status === 'accepted' ? (
                              <div className="text-center">
                                <p className="text-xs font-bold text-slate-500 italic">Session ready on dashboard</p>
                              </div>
                            ) : req.status === 'pending' ? (
                              <div className="text-center">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span className="material-symbols-outlined text-amber-500">hourglass_top</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500">Waiting for response</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span className="material-symbols-outlined text-red-400">sentiment_dissatisfied</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500">Request declined</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {displayedRequests.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        {activeTab === 'incoming' ? 'inbox' : 'send'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} requests</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      {activeTab === 'incoming' 
                        ? 'You are all caught up! No one has sent you a request recently.' 
                        : "You haven't sent any invitations yet. Start exploring to find partners!"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-8 animate-fade-in-up delay-300">
            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-[80px]"></div>
              
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 relative z-10">Request Activity</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-400">arrow_downward</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">Received</span>
                  </div>
                  <span className="text-xl font-black">{totalReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-400">arrow_upward</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">Sent</span>
                  </div>
                  <span className="text-xl font-black">{totalSent}</span>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acceptance Rate</span>
                    <span className="text-sm font-bold text-green-400">{acceptanceRate}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700" style={{ width: `${acceptanceRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Preview (Only shown on Incoming tab) */}
            {activeTab === 'incoming' && (
              <div className="card-level-1 p-8 bg-white border border-slate-100 relative overflow-hidden">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">history</span>
                  Recent History
                </h3>
                
                <div className="space-y-4">
                  {historyIncoming.length > 0 ? historyIncoming.slice(0, 5).map(req => (
                    <div key={req.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className={`w-10 h-10 rounded-xl ${getAvatarColor(req.senderName)} flex items-center justify-center text-xs font-black shrink-0`}>
                        {getInitials(req.senderName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {typeof req.senderName === "string" ? req.senderName : "Student"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {typeof req.skillWanted === "string" ? req.skillWanted : (req.skillWanted?.name || "Skill")}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        req.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 italic text-center py-4">No history yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
