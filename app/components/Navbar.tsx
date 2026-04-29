"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-primary-500/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
            <span className="material-symbols-outlined text-white text-lg">swap_horiz</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-[family-name:var(--font-jakarta)]">
            <span className="text-primary-500">Skill</span>
            <span className="text-slate-800">Swap</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Dashboard", "Discovery", "Sessions", "Community"].map((item) => (
            <Link
              key={item}
              href={item === "Dashboard" ? "/dashboard" : item === "Discovery" ? "/discovery" : item === "Sessions" ? "/session" : "#"}
              className="text-sm font-medium text-slate-600 hover:text-primary-500 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-primary-500 after:transition-all after:duration-300"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm font-semibold text-slate-600 hover:text-primary-500 px-4 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-slate-700">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 animate-scale-in shadow-xl">
          {["Dashboard", "Discovery", "Sessions", "Community"].map((item) => (
            <Link
              key={item}
              href={item === "Dashboard" ? "/dashboard" : item === "Discovery" ? "/discovery" : item === "Sessions" ? "/session" : "#"}
              className="block py-3 px-4 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Link href="/auth" className="text-center text-sm font-semibold text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Log In
            </Link>
            <Link href="/auth" className="text-center text-sm font-semibold text-white bg-primary-500 py-2.5 rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
