"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    const isValidEmail = email && (
      email.endsWith(".edu") || 
      email.endsWith(".com") || 
      email.includes("@gmail.com")
    );

    if (!isValidEmail) {
      setError("Please enter a valid email (.edu, .com, gmail).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ email: email, id: data.userId }));
        
        if (authMode === "signup" || data.needsOnboarding) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="max-w-5xl w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] border border-slate-100">
        
        {/* Left Side - Auth Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          {/* Logo */}
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">swap_horiz</span>
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-jakarta)] text-slate-800">SkillSwap</span>
          </Link>

          <div className="max-w-sm mx-auto w-full animate-fade-in-up">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <span className="material-symbols-outlined text-3xl text-primary-600">
                {authMode === "login" ? "login" : "person_add"}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">
              {authMode === "login" ? "Welcome Back" : "Join the Community"}
            </h1>
            
            <p className="text-slate-500 text-center mb-8 text-sm">
              {authMode === "login" 
                ? "Enter your credentials to access your dashboard." 
                : "Create an account to start swapping skills today."}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) {
                      handleAuth();
                    }
                  }}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <button 
              onClick={handleAuth}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                email && password && !loading ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-primary-400 cursor-not-allowed shadow-none'
              }`}
              disabled={!email || !password || loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                authMode === "login" ? "Login" : "Register Account"
              )}
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                {authMode === "login" ? "New here?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "signup" : "login");
                    setError("");
                  }}
                  className="text-primary-600 font-bold hover:underline"
                >
                  {authMode === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 dot-pattern opacity-10"></div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-secondary-400 animate-pulse"></span>
              Active Now
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">42 mentors online right now.</h2>
            <p className="text-slate-300 font-[family-name:var(--font-lexend)]">
              Join the community of students trading skills in design, coding, languages, and more.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="glass-dark p-6 rounded-2xl">
              <span className="material-symbols-outlined text-secondary-400 mb-3 text-3xl">rate_review</span>
              <h3 className="font-bold text-lg mb-1">Peer Reviews</h3>
              <p className="text-slate-400 text-xs">Build your reputation with verified feedback after every swap.</p>
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <span className="material-symbols-outlined text-tertiary-400 mb-3 text-3xl">school</span>
              <h3 className="font-bold text-lg mb-1">Mentorship</h3>
              <p className="text-slate-400 text-xs">Find guidance from seniors and grads who have been there.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="fixed bottom-6 flex gap-6 text-xs font-medium text-slate-500 justify-center w-full">
        <Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-primary-600 transition-colors">Help Center</Link>
        <Link href="#" className="hover:text-primary-600 transition-colors">Security</Link>
      </div>
    </div>
  );
}
