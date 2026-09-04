/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

export function AdminHeader({
  title,
  subtitle,
  showActions = false,
}: AdminHeaderProps) {
  const [greeting, setGreeting] = useState("Bonjour");
  const [adminName] = useState("Mamou");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Bonjour");
    } else if (hour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }
  }, []);

  return (
    <div className="hidden md:block relative overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/25 bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 py-8 md:px-8 md:py-9 shadow-xl mb-8 text-[var(--porcelaine,#F1ECE3)]">
      
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side - Greeting */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton)]/10 px-3.5 py-1 text-[10px] font-sans font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3">
            ✦ Espace Administration
          </div>

          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)] flex items-center gap-2.5">
            {title || `${greeting}, ${adminName}`}
            <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>

          <p className="mt-2 text-xs md:text-sm font-sans tracking-wide text-[var(--porcelaine,#F1ECE3)]/60 max-w-2xl">
            {subtitle ||
              "Pilotez votre boutique de bijoux, vos stocks et vos commandes avec élégance et précision."}
          </p>
        </div>

        {/* Right side - Actions */}
        {showActions && (
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[var(--porcelaine)] rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all border border-white/15">
              + Exporter rapport
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95">
              + Nouveau produit
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
