"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Icons SVG
function DashboardIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}


function ProductIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function OrderIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function PromotionIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}

function ReviewIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function SettingsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PlusIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function LogoutIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

// Couleurs du thème sombre de la sidebar (palette ivoire & or)
// --sidebar: #241B14 (brun profond) — à définir dans globals.css si tu préfères une variable

const navLinks = [
  { href: "/admin", label: "Tableau de bord", icon: DashboardIcon },
  { href: "/admin/products", label: "Produits", icon: ProductIcon },
  { href: "/admin/orders", label: "Commandes", icon: OrderIcon },
  { href: "/admin/promotions", label: "Promotions", icon: PromotionIcon },
  { href: "/admin/reviews", label: "Avis", icon: ReviewIcon },
  { href: "/admin/settings", label: "Paramètres", icon: SettingsIcon },
];

// Items de la bottom bar mobile (le "+" central est inséré entre les 2 premiers et les 2 derniers)
const mobileLinks = [
  { href: "/admin", label: "Tableau", icon: DashboardIcon },
  { href: "/admin/products", label: "Produits", icon: ProductIcon },
  { href: "/admin/orders", label: "Commandes", icon: OrderIcon },
  { href: "/admin/settings", label: "Compte", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear temporary auth
      document.cookie = "temp_admin_auth=; path=/; max-age=0";
      localStorage.removeItem("temp_admin_auth");

      // Sign out from Supabase (if authenticated)
      await supabase.auth.signOut();

      // Redirect to home page using window.location for mobile compatibility
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* ===== Sidebar desktop (palette Ivoire & Or) ===== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-gradient-to-br from-[#2B2118] via-[var(--espresso)] to-[#1a1410] text-white">
        <div className="flex h-full flex-1 flex-col px-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 pb-4 pt-6">
            <div className="flex flex-col leading-none">
              <span className="font-cinzel italic text-xl font-semibold tracking-wide" style={{ letterSpacing: '0.05em' }}>Mamou&#39;s</span>
              <span className="font-cinzel text-[9px] font-medium tracking-[0.3em] text-[var(--gold)] uppercase" style={{ letterSpacing: '0.35em' }}>
                ACCESSORIES
              </span>
            </div>
          </div>

          {/* Carte profil */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--gold-dark)]">
              MA
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">Mamou&lsquo;s </span>
              <span className="text-xs text-white/70">Administration</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Déconnexion */}
          <div className="border-t border-white/20 py-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>{isLoggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Bottom bar mobile (palette Ivoire & Or) ===== */}
      <nav className="fixed inset-x-3 bottom-3 z-50 lg:hidden">
        <div className="mx-auto flex max-w-md items-end justify-between rounded-[2rem] border border-[var(--gold)]/30 bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] px-4 pb-2 pt-2 shadow-2xl">
          {/* 2 premiers items */}
          {mobileLinks.slice(0, 2).map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex w-16 flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}

          {/* Bouton + central surélevé : nouveau produit */}
          <Link
            href="/admin/products/new"
            aria-label="Ajouter un produit"
            className="-mt-12 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--gold-dark)] bg-white text-[var(--gold-dark)] shadow-2xl transition-transform active:scale-95"
          >
            <PlusIcon className="h-8 w-8" />
          </Link>

          {/* 2 derniers items */}
          {mobileLinks.slice(2).map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex w-16 flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}