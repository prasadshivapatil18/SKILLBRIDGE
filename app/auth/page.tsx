"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if full
    if (value && index === 4 && newOtp.every((v) => v !== "")) {
      // Simulate verification then redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
              <span className="material-symbols-outlined text-3xl text-primary-600">lock</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-center mb-10 text-sm">
              Sign in to your SkillSwap account to continue learning. Enter the 5-digit code sent to your .edu email.
            </p>

            <div className="flex gap-3 justify-center mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input w-12 h-14 sm:w-14 sm:h-16 text-xl"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={() => router.push("/dashboard")}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                otp.every(v => v) ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-primary-400 cursor-not-allowed shadow-none'
              }`}
            >
              Verify & Continue
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Didn't receive code?{" "}
                <button className="text-primary-600 font-semibold hover:underline">Resend OTP</button>
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
