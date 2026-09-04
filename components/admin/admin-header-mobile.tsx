"use client";

import Link from "next/link";
import { useState } from "react";

interface AdminHeaderMobileProps {
  userName?: string;
  monthRevenue?: number; // revenus du mois (commandes payées)
  totalRevenue?: number; // total cumulé
  month?: string;
}

function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function BellIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function OrderIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function ReviewIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function AdminHeaderMobile({
  userName = "Mamou",
  monthRevenue = 0,
  totalRevenue = 0,
  month = "Juillet",
}: AdminHeaderMobileProps) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="lg:hidden -mx-4 -mt-4 mb-6 relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-b from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-5 pb-8 pt-7 shadow-2xl border-b border-[var(--laiton,#B9793E)]/35 text-[var(--porcelaine,#F1ECE3)] font-sans">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[var(--laiton,#B9793E)]/25 via-[#D9AE78]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--laiton,#B9793E)]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Barre du haut : avatar + salutation + cloche */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] text-xl font-serif font-bold text-[var(--obsidienne,#0E0B09)] shadow-md border border-white/20">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[var(--obsidienne,#0E0B09)] text-[8px] text-white">✓</span>
          </div>
          <div className="leading-tight">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--laiton-clair,#D9AE78)] mb-1">
              ✦ Admin VIP
            </span>
            <h1 className="text-xl font-bold text-[var(--porcelaine,#F1ECE3)] flex items-center gap-1.5 font-serif">
              Bonjour, {userName} <span className="animate-pulse">👋</span>
            </h1>
          </div>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-white/10 text-[var(--porcelaine,#F1ECE3)] shadow-inner backdrop-blur-md transition-all active:scale-95"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5 text-[var(--laiton-clair,#D9AE78)]" />
        </button>
      </div>

      {/* Carte revenus Haute Joaillerie */}
      <div className="relative z-10 rounded-3xl border border-[var(--laiton,#B9793E)]/35 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">
              Chiffre d&apos;Affaires Encaissé
            </p>
            <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60 font-medium">Mois de {month}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-xs">
              FCFA
            </span>
            <button
              onClick={() => setHidden((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[var(--porcelaine,#F1ECE3)]/80 backdrop-blur-md transition-all active:scale-95"
              aria-label={hidden ? "Afficher les montants" : "Masquer les montants"}
            >
              {hidden ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Montant du mois */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold tracking-tight text-[var(--porcelaine,#F1ECE3)] tabular-nums">
            {hidden ? "••••••" : formatFCFA(monthRevenue)}
          </span>
          <span className="text-sm font-sans font-medium text-[var(--laiton-clair,#D9AE78)] opacity-90">FCFA</span>
        </div>

        <div className="mb-4 border-t border-[var(--laiton,#B9793E)]/25" />

        {/* Total cumulé */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--porcelaine,#F1ECE3)]/50">
            Total Encaissé Cumulé
          </span>
          <span className="font-mono font-bold text-[var(--laiton-clair,#D9AE78)] tabular-nums">
            {hidden ? "•••• FCFA" : `${formatFCFA(totalRevenue)} FCFA`}
          </span>
        </div>
      </div>

      {/* Actions rapides : 1 pilule dorée + 2 pilules sombres */}
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2.5">
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] py-3 px-2 text-xs font-extrabold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-lg transition-transform active:scale-95 border border-white/20"
        >
          <PlusIcon className="h-4 w-4 stroke-[2.5]" />
          <span>Produit</span>
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-white/10 py-3 px-2 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95 shadow-sm"
        >
          <OrderIcon className="h-4 w-4" />
          <span>Ventes</span>
        </Link>

        <Link
          href="/admin/reviews"
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-white/10 py-3 px-2 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95 shadow-sm"
        >
          <ReviewIcon className="h-4 w-4" />
          <span>Avis</span>
        </Link>
      </div>
    </div>
  );
}