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
  const [adminName] = useState("Admin");

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
    <div className="hidden lg:block bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-dark)] rounded-2xl px-6 py-8 md:px-8 md:py-10 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side - Greeting */}
        <div className="text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            {title || `${greeting}, ${adminName}`}
            <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            {subtitle ||
              "Gagnez du temps et pilotez votre boutique de bijoux en toute simplicité depuis votre espace."}
          </p>
        </div>

        {/* Right side - Actions (optional) */}
        {showActions && (
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/20">
              + Nouveau devis
            </button>
            <button className="px-4 py-2.5 bg-white hover:bg-[var(--ivory)] text-[var(--gold-dark)] rounded-lg text-sm font-medium transition-colors shadow-lg">
              + Nouveau projet
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
