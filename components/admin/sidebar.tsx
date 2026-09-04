"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Icônes SVG pour l'administration
function DashboardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ProductIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

function OrderIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function PromotionIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

function ReviewIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.401.861-.83.637l-4.722-2.584a.563.563 0 00-.534 0l-4.722 2.584c-.428.224-.946-.151-.83-.637l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function SettingsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l.546.947a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-.546.948a1.125 1.125 0 01-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-1.094c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-.546-.947a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l.546-.948a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function LogoutIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

const navLinks = [
  { href: "/admin", label: "Tableau de bord", icon: DashboardIcon },
  { href: "/admin/products", label: "Produits", icon: ProductIcon },
  { href: "/admin/orders", label: "Commandes", icon: OrderIcon },
  { href: "/admin/promotions", label: "Promotions", icon: PromotionIcon },
  { href: "/admin/reviews", label: "Avis clients", icon: ReviewIcon },
  { href: "/admin/settings", label: "Paramètres", icon: SettingsIcon },
];

const mobileLinks = [
  { href: "/admin", label: "Tableau", icon: DashboardIcon },
  { href: "/admin/products", label: "Produits", icon: ProductIcon },
  { href: "/admin/orders", label: "Commandes", icon: OrderIcon },
  { href: "/admin/settings", label: "Paramètres", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  // Ne pas afficher la sidebar sur la page de connexion admin
  if (pathname === "/admin/login") {
    return null;
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      document.cookie = "temp_admin_auth=; path=/; max-age=0";
      localStorage.removeItem("temp_admin_auth");
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      setIsLoggingOut(false);
    }
  };

  const isEditOrNewPage =
    pathname.includes("/edit") ||
    pathname.endsWith("/new") ||
    pathname.includes("/new") ||
    (pathname.startsWith("/admin/orders/") && pathname !== "/admin/orders");

  return (
    <>
      {/* ===== Sidebar Desktop (Design System Obsidienne & Laiton) ===== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] border-r border-[var(--laiton,#B9793E)]/20 z-40 selection:bg-[var(--laiton)] selection:text-[var(--obsidienne)]">

        {/* Glow discret en haut à gauche */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex h-full flex-1 flex-col px-5 py-6 relative z-10">

          {/* Header Branding */}
          <div className="flex items-center gap-3 px-2 pb-6 border-b border-[var(--laiton,#B9793E)]/15">
            <Link href="/" className="group flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-[var(--porcelaine,#F1ECE3)] group-hover:text-[var(--laiton-clair,#D9AE78)] transition-colors">
                Mamou&apos;s
              </span>
              <span className="text-[9px] font-sans font-bold tracking-[0.35em] text-[var(--laiton,#B9793E)] uppercase mt-1">
                ACCESSORIES
              </span>
            </Link>
          </div>

          {/* Carte profil admin */}
          <div className="my-5 flex items-center gap-3 rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--laiton,#B9793E)] to-[#D9AE78] font-serif text-xs font-bold text-[var(--obsidienne,#0E0B09)] shadow-sm">
              MA
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-serif text-sm font-semibold truncate text-[var(--porcelaine,#F1ECE3)]">
                Mamou&apos;s Admin
              </span>
              <span className="text-[9px] font-sans font-bold text-[var(--laiton,#B9793E)] uppercase tracking-[0.18em]">
                Super Administrateur
              </span>
            </div>
          </div>

          {/* Navigation Principale */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-sans font-semibold tracking-wider transition-all ${active
                      ? "bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton,#B9793E)]/40 text-[var(--laiton-clair,#D9AE78)] shadow-[0_4px_20px_-4px_rgba(185,121,62,0.25)]"
                      : "text-[var(--porcelaine,#F1ECE3)]/60 hover:bg-[var(--obsidienne-soft,#17120D)] hover:text-[var(--porcelaine,#F1ECE3)] hover:border hover:border-[var(--laiton)]/10"
                    }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-[var(--laiton-clair,#D9AE78)]" : "text-[var(--porcelaine)]/40 group-hover:text-[var(--laiton,#B9793E)]"}`} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bouton Déconnexion */}
          <div className="pt-4 border-t border-[var(--laiton,#B9793E)]/15 mt-auto">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold text-[var(--porcelaine,#F1ECE3)]/50 transition-all hover:bg-[var(--grenat,#7A2E32)]/15 hover:text-red-300 hover:border hover:border-[var(--grenat)]/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogoutIcon className="h-5 w-5 shrink-0 text-current" />
              <span>{isLoggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ===== Bottom Bar Mobile (Masquée sur les pages d'édition & création) ===== */}
      {!isEditOrNewPage && (
        <nav className="fixed inset-x-4 bottom-4 z-50 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-full border border-[var(--laiton,#B9793E)]/30 bg-[var(--obsidienne-soft,#17120D)]/95 backdrop-blur-xl px-4 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">

          {/* 2 premiers liens */}
          {mobileLinks.slice(0, 2).map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${active
                    ? "text-[var(--laiton-clair,#D9AE78)]"
                    : "text-[var(--porcelaine,#F1ECE3)]/50 hover:text-[var(--porcelaine)]"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold tracking-tight">{link.label}</span>
              </Link>
            );
          })}

          {/* Bouton Central + surélevé pour Ajouter un produit */}
          <Link
            href="/admin/products/new"
            aria-label="Ajouter un produit"
            className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] shadow-[0_8px_25px_rgba(185,121,62,0.4)] border-2 border-[var(--obsidienne,#0E0B09)] transition-transform active:scale-95"
          >
            <PlusIcon className="h-7 w-7 stroke-[2.5]" />
          </Link>

          {/* 2 derniers liens */}
          {mobileLinks.slice(2).map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${active
                    ? "text-[var(--laiton-clair,#D9AE78)]"
                    : "text-[var(--porcelaine,#F1ECE3)]/50 hover:text-[var(--porcelaine)]"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold tracking-tight">{link.label}</span>
              </Link>
            );
          })}

        </div>
      </nav>
      )}
    </>
  );
}