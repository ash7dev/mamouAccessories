"use client";

import { Search, Plus, Sparkles, Film, CheckCircle2, EyeOff } from "lucide-react";

export type ReelStatusFilter = "all" | "active" | "inactive";

interface ReelsHeaderProps {
  totalCount: number;
  activeCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReelStatusFilter;
  onStatusFilterChange: (status: ReelStatusFilter) => void;
  onAddReel: () => void;
}

export function ReelsHeader({
  totalCount,
  activeCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddReel,
}: ReelsHeaderProps) {
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="-mx-6 -mt-6 mb-8 lg:-mx-8 lg:-mt-8 space-y-6 font-sans">
      {/* ===== Hero Banner Haute Joaillerie (Obsidienne & Laiton) ===== */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-10 lg:px-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)]">
        {/* Halos lumineux dorés */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 via-[#D9AE78]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Ligne 1 : Branding, Titre & Action */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[var(--laiton,#B9793E)]/20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/40 bg-[var(--laiton,#B9793E)]/10 px-4 py-1 text-[10px] font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 stroke-[2]" />
                Gestion des Reels & Lookbook
              </div>
              <h1 className="font-serif text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Reels & Vidéos Portées
              </h1>
              <p className="mt-1.5 text-xs lg:text-sm tracking-wide text-[var(--porcelaine,#F1ECE3)]/65 max-w-xl">
                Ajoutez de courtes vidéos (max 45s) de vos bijoux portés pour booster l'engagement et l'achat direct.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onAddReel}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] px-7 py-3.5 text-xs font-sans font-bold tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-[0_8px_25px_rgba(185,121,62,0.3)] transition-all hover:brightness-110 active:scale-95 uppercase cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Nouveau Reel (Max 45s)</span>
              </button>
            </div>
          </div>

          {/* Ligne 2 : Cartes KPI de Synthèse (Executive Bar) - Masquées sur mobile */}
          <div className="hidden sm:grid grid-cols-3 gap-3 pt-6">
            {/* Total */}
            <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/80 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton)]/25">
                <Film className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]/80">Total Vidéos</p>
                <p className="font-mono text-lg font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums leading-none mt-0.5">{totalCount}</p>
              </div>
            </div>

            {/* Actifs */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-emerald-400/80">Publiés en ligne</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">{activeCount}</p>
              </div>
            </div>

            {/* Masqués */}
            <div className="rounded-2xl border border-neutral-500/20 bg-neutral-900/40 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-500/15 text-neutral-400 border border-neutral-500/25">
                <EyeOff className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-neutral-400/80">Masqués / Inactifs</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">{inactiveCount}</p>
              </div>
            </div>
          </div>

          {/* Ligne 3 : Barre de Recherche Haute Joaillerie */}
          <div className="pt-6">
            <div className="relative w-full">
              <Search className="absolute left-4.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
              <input
                type="text"
                placeholder="Rechercher par titre de vidéo ou nom de produit..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 py-4 pl-12 pr-10 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/35 transition-all focus:border-[var(--laiton,#B9793E)] focus:bg-[var(--obsidienne,#0E0B09)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/30 shadow-inner font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-sans text-[var(--laiton-clair,#D9AE78)] hover:underline font-medium"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Barre d'Onglets de Statut (Filtres Rapides) ===== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="scrollbar-none -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/40"
                : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/75 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
            }`}
          >
            Toutes les vidéos ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange("active")}
            className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-emerald-800 text-white shadow-md ring-2 ring-emerald-500/40"
                : "border border-emerald-500/25 bg-white text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>En ligne ({activeCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange("inactive")}
            className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-neutral-800 text-white shadow-md ring-2 ring-neutral-500/40"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <EyeOff className="h-3.5 w-3.5 text-neutral-500" />
            <span>Masqués ({inactiveCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
