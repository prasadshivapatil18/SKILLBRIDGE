"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SessionSummaryPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId || "";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const durationParam = searchParams.get("duration") || "0";
  const creditsParam = searchParams.get("credits") || "0";

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [sessionData, setSessionData] = useState({
    duration: formatDuration(parseInt(durationParam)),
    creditsChange: parseInt(creditsParam),
    role: "Swapper",
    skill: "Active Exchange",
    partner: "Peer"
  });

  const [currentCredits, setCurrentCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setCurrentCredits(data.credits);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-lexend)] flex flex-col items-center justify-center p-6">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-gray-900/50 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden relative group">
          {/* Animated Gradient Border Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-500/5">
              <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
            </div>

            <h1 className="text-2xl font-black text-center mb-2">Session Completed!</h1>
            <p className="text-gray-400 text-sm text-center mb-8">You've successfully finished your skill swap session in Room {roomId.slice(0, 8)}.</p>

            {/* Stats Card */}
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Duration</p>
                <p className="text-xl font-black text-white">{sessionData.duration}</p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Session</p>
                <p className={`text-xl font-black ${sessionData.creditsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {sessionData.creditsChange >= 0 ? '+' : ''}{sessionData.creditsChange}
                </p>
              </div>
            </div>

            {/* Current Total */}
            {currentCredits !== null && (
              <div className="w-full bg-primary-500/5 border border-primary-500/10 rounded-2xl p-3 mb-8 flex items-center justify-between px-6">
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Your Current Total</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-500 text-sm">payments</span>
                  <span className="text-lg font-black text-white">{currentCredits} Credits</span>
                </div>
              </div>
            )}

            {/* Details List */}
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">Role</span>
                <span className="font-bold text-sm text-white">{sessionData.role}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">Skill Swapped</span>
                <span className="font-bold text-sm text-white">{sessionData.skill}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">Partner</span>
                <span className="font-bold text-sm text-white">{sessionData.partner}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full h-14 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Back to Dashboard
              </button>
              
              <Link 
                href="/history"
                className="w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">history</span>
                View Session History
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold">
          SkillSwap Economy • Verified Session
        </p>
      </div>
    </div>
  );
}
