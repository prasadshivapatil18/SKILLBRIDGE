import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back, Rakesh</h1>
          <p className="text-slate-600">You have 3 upcoming sessions and 2 new swap requests this week.</p>
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
                {[
                  { title: "React Fundamentals", partner: "Jordan Smith", role: "Teaching", time: "Today, 4:00 PM", color: "primary" },
                  { title: "Italian Cooking 101", partner: "Maria Rossi", role: "Learning from", time: "Tomorrow, 2:30 PM", color: "secondary" }
                ].map((session, i) => (
                  <div key={i} className="card-level-1 p-5 flex items-center justify-between group hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-${session.color}-500`}>
                        {session.partner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">{session.title}</h3>
                        <p className="text-sm text-slate-500">
                          {session.role} <span className="font-medium text-slate-700">{session.partner}</span> • {session.time}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">
                      Join Call
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Swap Requests */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary-500">waving_hand</span>
                  Recent Swap Requests
                </h2>
                <a href="/requests" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    name: "Sarah Chen", 
                    wants: "UI Design", 
                    offers: "Advanced Python",
                    time: "Tomorrow, 4:00 PM",
                    avatar: "bg-purple-100 text-purple-600"
                  },
                  { 
                    name: "Marcus Thorne", 
                    wants: "Video Editing", 
                    offers: "Classical Guitar",
                    time: "Friday, 2:00 PM",
                    avatar: "bg-blue-100 text-blue-600"
                  }
                ].map((req, i) => (
                  <div key={i} className="card-level-2 p-5 border-t-4 border-t-secondary-400 flex flex-col h-full group hover:border-secondary-500 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform ${req.avatar}`}>
                        {req.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{req.name}</h4>
                        <p className="text-xs text-slate-500">wants to learn <span className="font-medium text-slate-700">{req.wants}</span></p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4 flex-1">
                      <p className="mb-2">"I can teach you {req.offers} in exchange!"</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {req.time}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-lg shadow-primary-500/10 active:scale-95">
                        Accept
                      </button>
                      <button className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">palette</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">UI Design with Figma</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="text-tertiary-500 font-bold">4.9 ★</span> (12 sessions)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">movie</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Video Editing</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="text-tertiary-500 font-bold">5.0 ★</span> (8 sessions)
                      </p>
                    </div>
                  </div>
                </div>
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
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center group">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Advanced React & Next.js</h4>
                    <p className="text-xs text-primary-600 mt-0.5">Searching for Mentor...</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary-500 transition-colors animate-pulse">search</span>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center group">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Conversational French</h4>
                    <p className="text-xs text-primary-600 mt-0.5">Searching for Partner...</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary-500 transition-colors animate-pulse">search</span>
                </div>
              </div>
            </div>
            
            {/* Credit Balance */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
              <h2 className="text-sm font-medium text-slate-300 mb-1">Available Credits</h2>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-white">24</span>
                <span className="text-sm font-medium text-secondary-400 mb-1">credits</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-xs text-slate-400">
                <span>Earned: 32</span>
                <span>Spent: 8</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
