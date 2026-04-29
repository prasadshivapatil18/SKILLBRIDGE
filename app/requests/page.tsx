"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface SwapRequest {
  id: string;
  sender: {
    name: string;
    avatar: string;
    initials: string;
    major: string;
    rating: number;
    avatarColor: string;
  };
  skillWanted: string;
  skillOffered: string;
  message: string;
  timeSlot: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [requests, setRequests] = useState<SwapRequest[]>([
    {
      id: "1",
      sender: {
        name: "Sarah Chen",
        avatar: "",
        initials: "SC",
        major: "Computer Science Junior",
        rating: 4.9,
        avatarColor: "bg-purple-100 text-purple-600"
      },
      skillWanted: "UI Design with Figma",
      skillOffered: "Advanced Python",
      message: "Hey! I saw you're looking for Python help. I'd love to learn some UI design tips for my latest project in exchange!",
      timeSlot: "4:00 PM - 5:30 PM",
      date: "Tomorrow, Oct 12",
      status: 'pending'
    },
    {
      id: "2",
      sender: {
        name: "Marcus Thorne",
        avatar: "",
        initials: "MT",
        major: "Digital Arts Senior",
        rating: 4.8,
        avatarColor: "bg-blue-100 text-blue-600"
      },
      skillWanted: "Video Editing",
      skillOffered: "Classical Guitar",
      message: "I need help with Premiere Pro color grading. I can teach you some fingerstyle guitar basics!",
      timeSlot: "2:00 PM - 3:00 PM",
      date: "Friday, Oct 14",
      status: 'pending'
    },
    {
      id: "3",
      sender: {
        name: "Elena Rodriguez",
        avatar: "",
        initials: "ER",
        major: "Linguistics Sophmore",
        rating: 5.0,
        avatarColor: "bg-rose-100 text-rose-600"
      },
      skillWanted: "Python Basics",
      skillOffered: "Spanish Conversation",
      message: "Hola! I'm struggling with loops in Python. Want to practice Spanish while helping me out?",
      timeSlot: "11:00 AM - 12:00 PM",
      date: "Monday, Oct 17",
      status: 'pending'
    }
  ]);

  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([
    {
      id: "o1",
      sender: {
        name: "Alex Rivera",
        avatar: "",
        initials: "AR",
        major: "Business Administration",
        rating: 4.7,
        avatarColor: "bg-orange-100 text-orange-600"
      },
      skillWanted: "Marketing Strategy",
      skillOffered: "Advanced Excel",
      message: "Hey Alex! I saw you're looking for Marketing help. I can help you with your Excel sheets in return.",
      timeSlot: "10:00 AM - 11:30 AM",
      date: "Oct 15",
      status: 'accepted'
    },
    {
      id: "o2",
      sender: {
        name: "Jamie V.",
        avatar: "",
        initials: "JV",
        major: "Mechanical Engineering",
        rating: 4.5,
        avatarColor: "bg-emerald-100 text-emerald-600"
      },
      skillWanted: "Math Tutoring",
      skillOffered: "3D Modeling",
      message: "Looking for some help with Calculus. I'm pretty good at SolidWorks if you need a hand!",
      timeSlot: "5:00 PM - 6:00 PM",
      date: "Oct 18",
      status: 'pending'
    },
    {
      id: "o3",
      sender: {
        name: "Leo Kim",
        avatar: "",
        initials: "LK",
        major: "Philosophy Sophmore",
        rating: 4.2,
        avatarColor: "bg-slate-100 text-slate-600"
      },
      skillWanted: "Creative Writing",
      skillOffered: "Logic Basics",
      message: "I'd like to improve my storytelling. I can teach you formal logic!",
      timeSlot: "1:00 PM - 2:00 PM",
      date: "Oct 20",
      status: 'rejected'
    }
  ]);

  const handleAction = (id: string, action: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const pendingIncoming = requests.filter(r => r.status === 'pending');
  const historyIncoming = requests.filter(r => r.status !== 'pending');

  const displayedRequests = activeTab === 'incoming' ? pendingIncoming : outgoingRequests;

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
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'incoming' 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Incoming
              </button>
              <button 
                onClick={() => setActiveTab('outgoing')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'outgoing' 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Outgoing
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

            <div className="space-y-4">
              {displayedRequests.map((req, i) => (
                <div 
                  key={req.id} 
                  className="card-level-2 p-0 overflow-hidden bg-white group animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left: User Info */}
                    <div className="md:w-64 p-6 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-full ${req.sender.avatarColor} flex items-center justify-center text-2xl font-black mb-4 shadow-inner group-hover:scale-105 transition-transform duration-500`}>
                        {req.sender.initials}
                      </div>
                      <h3 className="font-bold text-slate-900 leading-tight">{req.sender.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mb-3">{req.sender.major}</p>
                      <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-slate-200 text-xs font-bold text-tertiary-600 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        {req.sender.rating}
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
                            {req.skillWanted}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {activeTab === 'incoming' ? 'Offers Expertise' : 'You Offered'}
                          </p>
                          <p className="font-bold text-secondary-600 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                            {req.skillOffered}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 relative">
                        <span className="material-symbols-outlined absolute -top-3 -left-1 text-slate-200 text-4xl rotate-180">format_quote</span>
                        <p className="text-sm text-slate-600 italic relative z-10 leading-relaxed">
                          "{req.message}"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                            <span className="material-symbols-outlined text-[18px] text-primary-500">calendar_today</span>
                            {req.date}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                            <span className="material-symbols-outlined text-[18px] text-primary-500">schedule</span>
                            {req.timeSlot}
                          </div>
                        </div>

                        {activeTab === 'outgoing' && (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                            req.status === 'accepted' ? 'bg-green-50 border-green-100 text-green-600' :
                            req.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-600' :
                            'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {req.status === 'accepted' ? 'check_circle' : req.status === 'rejected' ? 'cancel' : 'pending'}
                            </span>
                            {req.status}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions (Only for Incoming) */}
                    {activeTab === 'incoming' && (
                      <div className="p-6 md:w-48 bg-white flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100">
                        <button 
                          onClick={() => handleAction(req.id, 'accepted')}
                          className="flex-1 md:flex-none py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          Accept
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'rejected')}
                          className="flex-1 md:flex-none py-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[20px]">cancel</span>
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Right: Info (Only for Outgoing) */}
                    {activeTab === 'outgoing' && (
                      <div className="p-6 md:w-48 bg-white flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100">
                        {req.status === 'accepted' ? (
                          <button className="flex-1 md:flex-none py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">videocam</span>
                            Join Session
                          </button>
                        ) : (
                          <button className="flex-1 md:flex-none py-3 border-2 border-slate-100 hover:border-primary-200 hover:text-primary-600 text-slate-500 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Edit
                          </button>
                        )}
                        <button className="flex-1 md:flex-none py-3 border-2 border-slate-100 hover:border-red-200 hover:text-red-600 text-slate-500 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[20px]">
                            {req.status === 'accepted' ? 'event_busy' : 'delete'}
                          </span>
                          {req.status === 'accepted' ? 'Reschedule' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

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
                      : 'You haven\'t sent any invitations yet. Start exploring to find partners!'}
                  </p>
                </div>
              )}
            </div>
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
                  <span className="text-xl font-black">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-400">arrow_upward</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">Sent</span>
                  </div>
                  <span className="text-xl font-black">8</span>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acceptance Rate</span>
                    <span className="text-sm font-bold text-green-400">85%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
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
                  {historyIncoming.length > 0 ? historyIncoming.slice(0, 3).map(req => (
                    <div key={req.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className={`w-10 h-10 rounded-xl ${req.sender.avatarColor} flex items-center justify-center text-xs font-black shrink-0`}>
                        {req.sender.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{req.sender.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{req.skillWanted}</p>
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
                
                <button className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all">
                  View All Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
