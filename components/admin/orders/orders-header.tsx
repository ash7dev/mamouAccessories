"use client";

import { Search, Sparkles, AlertTriangle, CheckCircle2, Clock, Truck, ShieldCheck, DollarSign } from "lucide-react";

export type OrderTab =
  | "all"
  | "pending"
  | "payment_verification"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

interface CommandeHeaderProps {
  counts?: Partial<Record<OrderTab, number>>;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  activeTab?: OrderTab;
  onTabChange?: (tab: OrderTab) => void;
}

const tabs: { key: OrderTab; label: string; badgeColor?: string }[] = [
  { key: "all", label: "Toutes les commandes" },
  { key: "pending", label: "À traiter" },
  { key: "payment_verification", label: "Wave à vérifier" },
  { key: "confirmed", label: "Confirmées" },
  { key: "shipped", label: "Expédiées" },
  { key: "delivered", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
];

export function CommandeHeader({
  counts = {},
  searchQuery = "",
  onSearchChange,
  activeTab = "pending",
  onTabChange,
}: CommandeHeaderProps) {
  const actionable = (counts.pending ?? 0) + (counts.payment_verification ?? 0);

  return (
    <div className="-mx-6 -mt-6 mb-8 lg:-mx-8 lg:-mt-8 space-y-6 font-sans">
      {/* ===== Hero Banner Haute Joaillerie (Obsidienne & Laiton) ===== */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-10 lg:px-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)]">
        {/* Halos lumineux dorés */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 via-[#D9AE78]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Ligne 1 : Branding & Titre */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[var(--laiton,#B9793E)]/20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/40 bg-[var(--laiton,#B9793E)]/10 px-4 py-1 text-[10px] font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 stroke-[2]" />
                Gestion Ventes & Expéditions
              </div>
              <h1 className="font-serif text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Suivi des Commandes
              </h1>
              <p className="mt-1.5 text-xs lg:text-sm tracking-wide text-[var(--porcelaine,#F1ECE3)]/65 max-w-xl">
                {actionable > 0 ? (
                  <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    {actionable} commande{actionable > 1 ? "s" : ""} requière{actionable > 1 ? "nt" : "t"} votre traitement immédiat.
                  </span>
                ) : (
                  "Toutes les ventes sont traitées et à jour."
                )}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-end px-5 py-2.5 rounded-2xl bg-white/5 border border-[var(--laiton,#B9793E)]/25 backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-widest text-[var(--laiton-clair,#D9AE78)] font-bold">
                  Activité Globale
                </span>
                <span className="font-mono text-base font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums mt-0.5">
                  {counts.all ?? 0} commande{(counts.all ?? 0) > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Ligne 2 : Cartes KPI de Synthèse (Executive Bar) - Masquées sur mobile */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {/* Urgent / À traiter */}
            <div
              onClick={() => onTabChange?.("pending")}
              className={`cursor-pointer rounded-2xl border p-3.5 flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === "pending"
                  ? "border-amber-500 bg-amber-950/40 shadow-md ring-1 ring-amber-500/50"
                  : "border-amber-500/20 bg-amber-950/15 hover:border-amber-500/40"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">À Traiter</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">
                  {counts.pending ?? 0}
                </p>
              </div>
            </div>

            {/* Wave à vérifier */}
            <div
              onClick={() => onTabChange?.("payment_verification")}
              className={`cursor-pointer rounded-2xl border p-3.5 flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === "payment_verification"
                  ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/30 shadow-md ring-1 ring-[var(--laiton,#B9793E)]/50"
                  : "border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/80 hover:border-[var(--laiton,#B9793E)]/40"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/20 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton,#B9793E)]/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">
                  Wave à Vérifier
                </p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">
                  {counts.payment_verification ?? 0}
                </p>
              </div>
            </div>

            {/* Confirmées */}
            <div
              onClick={() => onTabChange?.("confirmed")}
              className={`cursor-pointer rounded-2xl border p-3.5 flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === "confirmed"
                  ? "border-emerald-500 bg-emerald-950/40 shadow-md ring-1 ring-emerald-500/50"
                  : "border-emerald-500/20 bg-emerald-950/15 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">Confirmées</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">
                  {counts.confirmed ?? 0}
                </p>
              </div>
            </div>

            {/* Livrées */}
            <div
              onClick={() => onTabChange?.("delivered")}
              className={`cursor-pointer rounded-2xl border p-3.5 flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === "delivered"
                  ? "border-sky-500 bg-sky-950/40 shadow-md ring-1 ring-sky-500/50"
                  : "border-sky-500/20 bg-sky-950/15 hover:border-sky-500/40"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Truck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300">Livrées</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">
                  {counts.delivered ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Ligne 3 : Barre de Recherche Haute Joaillerie */}
          <div className="pt-6">
            <div className="relative w-full">
              <Search className="absolute left-4.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
              <input
                type="text"
                placeholder="Rechercher par N° de commande (#ORD-...), nom de cliente ou téléphone..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 py-4 pl-12 pr-10 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/35 transition-all focus:border-[var(--laiton,#B9793E)] focus:bg-[var(--obsidienne,#0E0B09)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/30 shadow-inner font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--laiton-clair,#D9AE78)] hover:underline font-medium"
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
          {tabs.map((tab) => {
            const count = counts[tab.key];
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={`shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selected
                    ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/40"
                    : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/75 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
                }`}
              >
                {tab.label} {count !== undefined && count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}