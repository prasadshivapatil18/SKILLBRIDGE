"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [newInterest, setNewInterest] = useState("");
  
  // Theme state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme from localStorage or system
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/auth");
        return;
      }

      const { email } = JSON.parse(storedUser);
      
      try {
        const res = await fetch(`/api/user/profile?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
          setFullName(data.data.fullName || "");
          setBio(data.data.bio || "");
          setExpertise(data.data.expertise || []);
          setInterests(data.data.interests || []);
        }
      } catch (err) {
        console.error("Failed to fetch settings profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mounted, router]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName,
          bio,
          expertise,
          interests
        }),
      });

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (skill: string) => {
    setExpertise(expertise.filter(s => s !== skill));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (skill: string) => {
    setInterests(interests.filter(s => s !== skill));
  };
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 pb-16 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile, skills, and account preferences.</p>
        </header>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 font-bold rounded-2xl animate-fade-in flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500">person</span>
              <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email (Read-only)</label>
                  <input 
                    type="text" 
                    value={user?.email || ""} 
                    disabled
                    className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-500">psychology</span>
              <h2 className="text-lg font-bold text-slate-800">Skills & Expertise</h2>
            </div>
            <div className="p-8 space-y-8">
              {/* Expertise */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">My Expertise (What I can teach)</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addExpertise()}
                    placeholder="Add a skill..."
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500 transition-all"
                  />
                  <button 
                    onClick={addExpertise}
                    className="px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expertise.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold border border-primary-100">
                      {skill}
                      <button onClick={() => removeExpertise(skill)} className="hover:text-primary-900">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">My Interests (What I want to learn)</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addInterest()}
                    placeholder="Add an interest..."
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-secondary-500 transition-all"
                  />
                  <button 
                    onClick={addInterest}
                    className="px-6 py-3 bg-secondary-500 text-white font-bold rounded-xl hover:bg-secondary-600 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-50 text-secondary-700 rounded-lg text-sm font-bold border border-secondary-100">
                      {skill}
                      <button onClick={() => removeInterest(skill)} className="hover:text-secondary-900">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Account & Security Section */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">lock</span>
              <h2 className="text-lg font-bold text-slate-800">Security & Account</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Email Notifications</h4>
                  <p className="text-xs text-slate-500">Receive updates about your swap requests.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500 cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                  <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">palette</span>
              <h2 className="text-lg font-bold text-slate-800">Preferences & Privacy</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Public Profile</h4>
                  <p className="text-xs text-slate-500">Allow others to find you in discovery.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500 cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Dark Mode</h4>
                  <p className="text-xs text-slate-500">Switch between light and dark themes.</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-block w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-primary-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDark ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Save All Changes
                    </>
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-4 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out of Account
                </button>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button className="text-red-500 text-sm font-bold hover:underline">
                  Permanently Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
