"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { email } = JSON.parse(storedUser);
      
      try {
        const res = await fetch(`/api/user/profile?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch sidebar profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const navItems = [
    { name: "Overview", icon: "dashboard", href: "/dashboard" },
    { name: "My Skills", icon: "psychology", href: "/skills" },
    { name: "Swap Requests", icon: "swap_horiz", href: "/requests", badge: 2 },
    { name: "Learning History", icon: "history", href: "/history" },
    { name: "Discovery", icon: "search", href: "/discovery" },
    { name: "Sessions", icon: "videocam", href: "/dashboard", badge: 3 },
  ];

  const bottomItems = [
    { name: "Settings", icon: "settings", href: "/settings" },
    { name: "Support", icon: "help_outline", href: "/support" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-sm">swap_horiz</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight font-[family-name:var(--font-jakarta)]">
            SkillSwap
          </span>
        </Link>

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary-100 border-2 border-white shadow-sm flex items-center justify-center text-secondary-700 font-bold">
            {getInitials(user?.fullName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName || "Student"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.expertise?.[0] || "Exploring"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.name}
              </div>
              {item.badge && (
                <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
        
        <button
          suppressHydrationWarning
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/auth";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
