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
    <div className="lg:hidden -mx-4 -mt-4 mb-6 rounded-b-[2.5rem] bg-[#241B14] px-5 pb-8 pt-6 shadow-2xl">
      {/* Barre du haut : avatar + salutation + cloche */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/90 text-xl font-bold text-[#241B14]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight">
            <p className="text-sm text-[#F4EFE6]/60">Bonjour 👋</p>
            <h1 className="text-xl font-bold text-[#F4EFE6]">{userName}</h1>
          </div>
        </div>

        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/80 transition-colors hover:bg-white/10"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
      </div>

      {/* Carte revenus */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[#F4EFE6]/60">Encaissé · {month}</p>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-[#241B14]">
              FCFA
            </span>
            <button
              onClick={() => setHidden((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/70 transition-colors hover:bg-white/10"
              aria-label={hidden ? "Afficher les montants" : "Masquer les montants"}
            >
              {hidden ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Montant du mois */}
        <div className="mb-5 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-white">
            {hidden ? "••••" : formatFCFA(monthRevenue)}
          </span>
          <span className="text-xl font-medium text-[#F4EFE6]/50">FCFA</span>
        </div>

        <div className="mb-4 border-t border-white/10" />

        {/* Total cumulé */}
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-[#F4EFE6]/40">
            Total cumulé
          </p>
          <p className="text-base font-bold text-[var(--gold)]">
            {hidden ? "•••• FCFA" : `${formatFCFA(totalRevenue)} FCFA`}
          </p>
        </div>
      </div>

      {/* Actions rapides : 1 pilule dorée + 2 pilules sombres */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--gold)] py-3.5 text-sm font-bold text-[#241B14] shadow-lg transition-transform active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Produit</span>
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-colors hover:bg-white/10 active:scale-95"
        >
          <OrderIcon className="h-4 w-4" />
          <span>Commandes</span>
        </Link>

        <Link
          href="/admin/reviews"
          className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-colors hover:bg-white/10 active:scale-95"
        >
          <ReviewIcon className="h-4 w-4" />
          <span>Avis</span>
        </Link>
      </div>
    </div>
  );
}