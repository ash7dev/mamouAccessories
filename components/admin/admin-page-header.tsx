"use client";

import { ReactNode, useState } from "react";

/* ============================================================
   Bandeau de page admin partagé — le socle de tous les headers
   (Produits, Commandes, Promotions, Avis, Paramètres…)

   - Bandeau sombre #241B14, coins bas arrondis, ornement doré
   - Titre + compteur + sous-titre + action à droite
   - Recherche intégrée optionnelle (style sombre)
   - `below` : contenu affiché sous le bandeau (pilules de filtres…)
   ============================================================ */

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  /** Bouton/action à droite du titre (pilule dorée, icône…) */
  action?: ReactNode;
  /** Active la barre de recherche intégrée au bandeau */
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  /** Contenu sous le bandeau : pilules de filtres, onglets… */
  below?: ReactNode;
}

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function AdminPageHeader({
  title,
  subtitle,
  count,
  action,
  searchPlaceholder,
  onSearchChange,
  below,
}: AdminPageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <div className="-mx-6 -mt-6 mb-6 lg:-mx-8 lg:-mt-8">
      {/* ===== Bandeau sombre ===== */}
      <div className="relative overflow-hidden rounded-b-3xl bg-[#241B14] px-6 pb-6 pt-6 lg:px-8">
        {/* Ornement signature : cercles concentriques dorés */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 opacity-60">
          <div className="h-44 w-44 rounded-full border border-[var(--gold)]/15" />
          <div className="absolute inset-6 rounded-full border border-[var(--gold)]/20" />
          <div className="absolute inset-12 rounded-full border border-[var(--gold)]/25" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className={`flex items-center justify-between gap-4 ${searchPlaceholder ? "mb-5" : ""}`}>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-[#F4EFE6]">{title}</h1>
                {typeof count === "number" && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)] tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              {subtitle && <p className="mt-0.5 text-sm text-[#F4EFE6]/50">{subtitle}</p>}
            </div>

            {action}
          </div>

          {searchPlaceholder && (
            <div className="relative lg:max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#F4EFE6]/40" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-[#F4EFE6] placeholder:text-[#F4EFE6]/35 transition-colors focus:border-[var(--gold)]/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25"
              />
            </div>
          )}
        </div>
      </div>

      {/* ===== Contenu sous le bandeau (filtres, onglets…) ===== */}
      {below && (
        <div className="mx-auto mt-5 max-w-5xl px-6 lg:px-8">{below}</div>
      )}
    </div>
  );
}

/* ---------- Pilule de filtre réutilisable ---------- */

export function FilterPill({
  label,
  count,
  selected,
  onClick,
  tone = "default",
}: {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
  tone?: "default" | "warning" | "danger";
}) {
  const countColor = selected
    ? "text-[var(--gold)]"
    : tone === "warning"
      ? "text-amber-600"
      : tone === "danger"
        ? "text-red-500"
        : "text-[var(--text-dark)]/40";

  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        selected
          ? "bg-[var(--text-dark)] text-white shadow-md"
          : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/60 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span className={`text-xs font-bold tabular-nums ${countColor}`}>{count}</span>
      )}
    </button>
  );
}