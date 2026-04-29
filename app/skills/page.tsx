"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  sessions: number;
  rating: number;
  progress: number; // 0 to 100
}

interface MasteredSkill {
  id: string;
  name: string;
  icon: string;
  completedDate: string;
  totalSessions: number;
  rating: number;
  badge: string;
  badgeColor: string;
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-blue-100 text-blue-700 border-blue-200",
  Intermediate: "bg-secondary-100 text-secondary-700 border-secondary-200",
  Advanced: "bg-tertiary-100 text-tertiary-700 border-tertiary-200",
  Expert: "bg-primary-100 text-primary-700 border-primary-200",
};

const SKILL_ICONS = [
  "palette", "code", "music_note", "translate", "movie", "camera_alt",
  "psychology", "calculate", "science", "brush", "edit_note", "mic",
  "sports_esports", "fitness_center", "restaurant", "auto_stories",
];

export default function SkillsPage() {
  // Teaching skills
  const [teachSkills, setTeachSkills] = useState<Skill[]>([
    { id: "1", name: "UI Design with Figma", icon: "palette", level: "Expert", sessions: 12, rating: 4.9, progress: 95 },
    { id: "2", name: "Video Editing", icon: "movie", level: "Advanced", sessions: 8, rating: 5.0, progress: 75 },
    { id: "3", name: "Python Basics", icon: "code", level: "Intermediate", sessions: 5, rating: 4.7, progress: 40 },
  ]);

  // Learning skills
  const [learnSkills, setLearnSkills] = useState<string[]>([
    "Advanced React & Next.js",
    "Conversational French",
    "Machine Learning",
  ]);

  // Mastered skills
  const [masteredSkills, setMasteredSkills] = useState<MasteredSkill[]>([
    { id: "m1", name: "HTML & CSS", icon: "code", completedDate: "Jan 2026", totalSessions: 15, rating: 5.0, badge: "🏆", badgeColor: "from-amber-400 to-yellow-500" },
    { id: "m2", name: "Photography Basics", icon: "camera_alt", completedDate: "Dec 2025", totalSessions: 10, rating: 4.8, badge: "⭐", badgeColor: "from-primary-400 to-primary-600" },
    { id: "m3", name: "Public Speaking", icon: "mic", completedDate: "Nov 2025", totalSessions: 8, rating: 4.9, badge: "🎯", badgeColor: "from-secondary-400 to-secondary-600" },
  ]);

  // UI state
  const [showAddTeach, setShowAddTeach] = useState(false);
  const [showAddLearn, setShowAddLearn] = useState(false);
  const [newTeachName, setNewTeachName] = useState("");
  const [newTeachIcon, setNewTeachIcon] = useState("code");
  const [newTeachLevel, setNewTeachLevel] = useState<Skill["level"]>("Beginner");
  const [newLearnName, setNewLearnName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const addTeachSkill = () => {
    if (!newTeachName.trim()) return;
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newTeachName.trim(),
      icon: newTeachIcon,
      level: newTeachLevel,
      sessions: 0,
      rating: 0,
      progress: 0,
    };
    setTeachSkills([newSkill, ...teachSkills]);
    setNewTeachName("");
    setNewTeachIcon("code");
    setNewTeachLevel("Beginner");
    setShowAddTeach(false);
    setShowIconPicker(false);
  };

  const removeTeachSkill = (id: string) => {
    setTeachSkills(teachSkills.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const updateSkillLevel = (id: string, level: Skill["level"]) => {
    const progressMap = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
    setTeachSkills(teachSkills.map((s) => (s.id === id ? { ...s, level, progress: progressMap[level] } : s)));
    setEditingId(null);
  };

  const addLearnSkill = () => {
    if (!newLearnName.trim() || learnSkills.includes(newLearnName.trim())) return;
    setLearnSkills([newLearnName.trim(), ...learnSkills]);
    setNewLearnName("");
    setShowAddLearn(false);
  };

  const removeLearnSkill = (skill: string) => {
    setLearnSkills(learnSkills.filter((s) => s !== skill));
  };

  const masterSkill = (skillName: string) => {
    const newMastered: MasteredSkill = {
      id: `m${Date.now()}`,
      name: skillName,
      icon: "emoji_events",
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      totalSessions: Math.floor(Math.random() * 10) + 5,
      rating: 5.0,
      badge: "🎉",
      badgeColor: "from-green-400 to-teal-500"
    };
    setMasteredSkills([newMastered, ...masteredSkills]);
    setLearnSkills(learnSkills.filter(s => s !== skillName));
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pb-16">
        {/* Page Header */}
        <header className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">psychology</span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Skill Vault</h1>
                <p className="text-slate-500 font-medium">Manage your expertise and track your growth journey.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 glass rounded-xl border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-fade-in-up delay-100">
          {[
            { label: "Teaching", value: teachSkills.length, icon: "school", color: "primary", bg: "bg-primary-50" },
            { label: "Learning", value: learnSkills.length, icon: "auto_stories", color: "secondary", bg: "bg-secondary-50" },
            { label: "Mastered", value: masteredSkills.length, icon: "emoji_events", color: "tertiary", bg: "bg-tertiary-50" },
            { label: "XP Points", value: (teachSkills.length * 100) + (masteredSkills.length * 500), icon: "Bolt", color: "slate", bg: "bg-slate-100" },
          ].map((stat, i) => (
            <div key={stat.label} className="card-level-2 p-6 flex flex-col items-start gap-4 group">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <span className={`material-symbols-outlined text-${stat.color}-600 text-2xl`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ===== Teaching Skills Section ===== */}
          <div className="xl:col-span-2 space-y-6">
            <div className="card-level-1 p-8 relative overflow-hidden bg-white/50 backdrop-blur-sm animate-fade-in-up delay-200">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-500 text-3xl">local_library</span>
                    Teaching Expertise
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Skills you share with the community</p>
                </div>
                <button
                  onClick={() => { setShowAddTeach(!showAddTeach); setShowIconPicker(false); }}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-primary-600 text-white font-bold rounded-2xl text-sm transition-all shadow-xl hover:shadow-primary-500/20 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add New Skill
                </button>
              </div>

              {/* Add Form (Expandable) */}
              {showAddTeach && (
                <div className="mb-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-scale-in relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Skill Name</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowIconPicker(!showIconPicker)}
                          className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 hover:border-primary-500 flex items-center justify-center transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-primary-500 text-2xl">{newTeachIcon}</span>
                        </button>
                        <input
                          type="text"
                          value={newTeachName}
                          onChange={(e) => setNewTeachName(e.target.value)}
                          placeholder="What can you teach?"
                          className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                        />
                      </div>
                      
                      {showIconPicker && (
                        <div className="grid grid-cols-8 gap-2 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-xl animate-scale-in">
                          {SKILL_ICONS.map((icon) => (
                            <button
                              key={icon}
                              onClick={() => { setNewTeachIcon(icon); setShowIconPicker(false); }}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newTeachIcon === icon ? "bg-primary-500 text-white shadow-lg" : "hover:bg-slate-100 text-slate-400"}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">{icon}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Proficiency</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["Beginner", "Intermediate", "Advanced", "Expert"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setNewTeachLevel(lvl)}
                            className={`px-4 py-3 rounded-2xl text-xs font-bold border-2 transition-all ${newTeachLevel === lvl ? LEVEL_COLORS[lvl] + " border-current shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-200/60">
                    <button onClick={() => setShowAddTeach(false)} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                    <button onClick={addTeachSkill} disabled={!newTeachName.trim()} className="px-8 py-3 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-600 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none transition-all">Save Expertise</button>
                  </div>
                </div>
              )}

              {/* Skills List */}
              <div className="space-y-4 relative z-10">
                {teachSkills.map((skill) => (
                  <div key={skill.id} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-500 transition-all duration-500">
                          <span className="material-symbols-outlined text-3xl">{skill.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-800">{skill.name}</h4>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="flex items-center gap-1 text-sm font-bold text-tertiary-600">
                              <span className="material-symbols-outlined text-[18px]">star</span>
                              {skill.rating > 0 ? skill.rating : "New"}
                            </span>
                            <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[18px]">history</span>
                              {skill.sessions} sessions
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {editingId === skill.id ? (
                          <div className="flex gap-2 animate-scale-in p-1 bg-slate-50 rounded-2xl">
                            {(["Beginner", "Intermediate", "Advanced", "Expert"] as const).map((lvl) => (
                              <button 
                                key={lvl} 
                                onClick={() => updateSkillLevel(skill.id, lvl)} 
                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${skill.level === lvl ? LEVEL_COLORS[lvl] : "text-slate-400 hover:bg-white"}`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button 
                            onClick={() => setEditingId(skill.id)} 
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all hover:scale-105 active:scale-95 ${LEVEL_COLORS[skill.level]}`}
                          >
                            {skill.level}
                          </button>
                        )}
                        
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          {deleteConfirm === skill.id ? (
                            <div className="flex gap-2 animate-scale-in">
                              <button onClick={() => removeTeachSkill(skill.id)} className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                <span className="material-symbols-outlined text-[20px]">check</span>
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(skill.id)} className="w-10 h-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <span className="material-symbols-outlined text-[22px]">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Track */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        <span>Mastery Progress</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.progress}%` }}
                        >
                          <div className="w-full h-full animate-shimmer opacity-30"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Right Column: Learning & Growth ===== */}
          <div className="space-y-8 animate-fade-in-up delay-300">
            {/* Learning Interests */}
            <div className="card-level-1 p-6 relative overflow-hidden bg-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/5 rounded-bl-full"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <span className="material-symbols-outlined text-secondary-500">radar</span>
                  Learning Goals
                </h2>
                <button 
                  onClick={() => setShowAddLearn(!showAddLearn)} 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showAddLearn ? "bg-slate-100 text-slate-600" : "bg-secondary-500 text-white shadow-lg shadow-secondary-500/20 hover:scale-110"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{showAddLearn ? "close" : "add"}</span>
                </button>
              </div>

              {showAddLearn && (
                <div className="mb-6 animate-scale-in flex gap-2">
                  <input
                    type="text"
                    value={newLearnName}
                    onChange={(e) => setNewLearnName(e.target.value)}
                    placeholder="New skill goal..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-secondary-500 focus:ring-0 outline-none text-sm font-medium bg-slate-50"
                  />
                  <button onClick={addLearnSkill} className="px-4 bg-secondary-500 text-white font-bold rounded-xl shadow-lg shadow-secondary-500/20 active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </div>
              )}

              <div className="space-y-3 relative z-10">
                {learnSkills.map((skill) => (
                  <div key={skill} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center hover:bg-white hover:border-secondary-200 hover:shadow-lg transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{skill}</h4>
                      <p className="text-[10px] font-black text-secondary-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse"></span>
                        Match pending
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => masterSkill(skill)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as Mastered"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </button>
                      <button 
                        onClick={() => removeLearnSkill(skill)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Preview */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-[80px]"></div>
              
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 relative z-10">Global Ranking</h3>
              
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl">
                  <span className="text-2xl font-black">#42</span>
                </div>
                <div>
                  <p className="text-2xl font-black">Top 5%</p>
                  <p className="text-sm text-slate-400">Among Peer Mentors</p>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  <span>Level 14 Mentor</span>
                  <span>1,250 / 2,000 XP</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mastered Showcase Section ===== */}
        <section className="mt-16 animate-fade-in-up delay-400">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Showcase Hall</h2>
              <p className="text-slate-500 font-medium mt-1">Proof of your dedication and growth</p>
            </div>
            <div className="h-[1px] flex-1 mx-8 bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
              View Certificates
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {masteredSkills.map((skill, i) => (
              <div key={skill.id} className="card-level-2 p-0 overflow-hidden group hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`h-24 bg-gradient-to-br ${skill.badgeColor} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <span className="text-5xl drop-shadow-2xl z-10 group-hover:scale-125 transition-transform duration-700">{skill.badge}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-500">
                        <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{skill.name}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{skill.completedDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 mt-2">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sessions</p>
                      <p className="text-lg font-black text-slate-800">{skill.totalSessions}</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                      <p className="text-lg font-black text-slate-800">{skill.rating} ★</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all duration-300">
                    View Achievement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
