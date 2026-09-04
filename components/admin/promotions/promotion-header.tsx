"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Plus, Search } from "lucide-react";

export type PromotionFilter = "all" | "active" | "upcoming" | "expired";

interface PromotionHeaderProps {
  counts?: Partial<Record<PromotionFilter, number>>;
  onFilterChange?: (filter: PromotionFilter) => void;
  onSearchChange?: (query: string) => void;
}

const filters: { key: PromotionFilter; label: string }[] = [
  { key: "all", label: "Toutes les offres" },
  { key: "active", label: "Actives" },
  { key: "upcoming", label: "À venir" },
  { key: "expired", label: "Expirées" },
];

export function PromotionHeader({ counts = {}, onFilterChange, onSearchChange }: PromotionHeaderProps) {
  const [activeFilter, setActiveFilter] = useState<PromotionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (filter: PromotionFilter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <div className="-mx-6 -mt-6 mb-8 lg:-mx-8 lg:-mt-8">
      {/* Hero Banner Haute Joaillerie */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-10 lg:px-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)]">

        {/* Glow ambient d'artisanat */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 via-[#D9AE78]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-[var(--laiton,#B9793E)]/20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/40 bg-[var(--laiton,#B9793E)]/10 px-4 py-1 text-[10px] font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3" />
                Maison de Création & Joaillerie
              </div>
              <h1 className="font-heading text-2xl lg:text-3xl font-medium tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Offres & Promotions
              </h1>
              <p className="mt-1.5 text-xs text-[var(--porcelaine,#F1ECE3)]/65 font-sans">
                Mettez vos créations d&apos;exception en valeur avec des réductions ciblées.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {typeof counts.active === "number" && (
                <div className="hidden sm:flex flex-col items-end px-3.5 py-1.5 rounded-xl bg-white/5 border border-[var(--laiton,#B9793E)]/20">
                  <span className="text-[9px] uppercase tracking-widest text-[var(--laiton-clair,#D9AE78)] font-medium">Offres actives</span>
                  <span className="font-heading font-medium text-sm text-[var(--porcelaine,#F1ECE3)] tabular-nums">{counts.active} en cours</span>
                </div>
              )}

              <Link
                href="/admin/promotions/new"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] px-6 py-3 text-xs font-medium tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-md transition-all hover:brightness-105 active:scale-95 uppercase"
              >
                <Plus className="h-4 w-4 stroke-[2]" />
                <span>Nouvelle promotion</span>
              </Link>
            </div>
          </div>

          {/* Recherche & Filtres */}
          <div className="pt-5 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
              <input
                type="text"
                placeholder="Rechercher une promotion par nom ou catégorie..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--obsidienne,#0E0B09)]/90 py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/35 transition-all focus:border-[var(--laiton,#B9793E)] focus:bg-[var(--obsidienne,#0E0B09)] focus:outline-none focus:ring-1 focus:ring-[var(--laiton,#B9793E)] shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="mx-auto mt-6 flex max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
        <div className="scrollbar-none -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1">
          {filters.map((f) => {
            const selected = activeFilter === f.key;
            const count = counts[f.key];
            return (
              <button
                key={f.key}
                onClick={() => handleFilter(f.key)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                  selected
                    ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-1 ring-[var(--laiton,#B9793E)]/40"
                    : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/70 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
                }`}
              >
                {f.label} {count !== undefined && count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}