"use client";

import Link from "next/link";
import { Edit3, Sparkles, Percent, Eye } from "lucide-react";

export interface PromotionListItem {
  id: string;
  name: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string;
  end_date: string;
  applies_to: "all_products" | "specific_category" | "specific_products";
  category_name: string | null;
  is_active: boolean;
  usage_count: number;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* ---------- Badges Haute Joaillerie ---------- */

function StatusBadge({ promotion }: { promotion: PromotionListItem }) {
  const now = new Date();
  const start = new Date(promotion.start_date);
  const end = new Date(promotion.end_date);

  if (now > end) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-sans font-medium text-rose-700 border border-rose-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Expirée
      </span>
    );
  }
  if (now < start) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-sans font-medium text-amber-800 border border-amber-500/25">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        À venir
      </span>
    );
  }
  if (promotion.is_active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-sans font-medium text-emerald-800 border border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--porcelaine,#F1ECE3)] px-2.5 py-0.5 text-[11px] font-sans font-medium text-[var(--obsidienne,#0E0B09)]/50 border border-[var(--laiton,#B9793E)]/15">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
      Inactive
    </span>
  );
}

/* ---------- État vide Haute Joaillerie ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-12 lg:p-16 text-center shadow-xs">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/25">
        <Sparkles className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif mb-2 text-xl font-normal text-[var(--obsidienne,#0E0B09)]">
        Aucune promotion trouvée
      </h3>
      <p className="mb-6 max-w-sm text-xs font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/60">
        Créez votre première promotion pour offrir des réductions exclusives à vos clientes.
      </p>
      <Link
        href="/admin/promotions/new"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-3 text-xs font-sans font-medium tracking-widest text-[var(--porcelaine,#F1ECE3)] transition-all uppercase hover:bg-[var(--laiton,#B9793E)] active:scale-95 shadow-sm"
      >
        <span>+ Créer une promotion</span>
      </Link>
    </div>
  );
}

/* ---------- Composant principal ---------- */

export function PromotionList({ promotions }: { promotions: PromotionListItem[] }) {
  if (promotions.length === 0) return <EmptyState />;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-3">
      {/* ===================== MOBILE : Cartes en Grille ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
        {promotions.map((p) => (
          <Link
            key={p.id}
            href={`/admin/promotions/${p.id}`}
            className="group relative overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-white p-4 shadow-2xs transition-all duration-300 hover:border-[var(--laiton,#B9793E)]/40"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[var(--laiton,#B9793E)] block leading-none mb-1">
                  {p.applies_to === "all_products"
                    ? "Tous les produits"
                    : p.applies_to === "specific_category"
                    ? p.category_name || "Catégorie spécifique"
                    : "Produits spécifiques"}
                </span>
                <h3 className="font-serif text-base font-medium text-[var(--obsidienne,#0E0B09)] truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                  {p.name}
                </h3>
              </div>
              <StatusBadge promotion={p} />
            </div>

            <div className="mb-3 flex items-baseline gap-2">
              <span className="font-serif text-lg font-semibold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                {p.discount_type === "percentage" ? `${p.discount_value}%` : `${formatFCFA(p.discount_value)} FCFA`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 pt-2.5 border-t border-[var(--laiton,#B9793E)]/15">
              <span>{formatDate(p.start_date)} - {formatDate(p.end_date)}</span>
              <span className="tabular-nums font-serif text-[var(--obsidienne,#0E0B09)] font-medium bg-[var(--porcelaine,#F1ECE3)]/60 px-2.5 py-0.5 rounded-full border border-[var(--laiton,#B9793E)]/15">
                {p.usage_count}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ===================== DESKTOP : Cartes Flottantes ===================== */}
      <div className="hidden lg:block space-y-2.5">
        {/* En-tête des colonnes */}
        <div className="grid grid-cols-[1fr_140px_180px_120px_100px_80px] items-center gap-4 px-6 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
          <span>Promotion</span>
          <span>Réduction</span>
          <span>Période</span>
          <span>Statut</span>
          <span className="text-center">Utilisations</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Lignes promotions */}
        {promotions.map((p) => (
          <div
            key={p.id}
            onClick={() => window.location.href = `/admin/promotions/${p.id}`}
            className="group relative grid grid-cols-[1fr_140px_180px_120px_100px_80px] items-center gap-4 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-white px-5 py-3.5 shadow-2xs transition-all duration-200 hover:border-[var(--laiton,#B9793E)]/35 hover:shadow-md cursor-pointer"
          >
            {/* Promotion : nom + application */}
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--porcelaine,#F1ECE3)]/60 border border-[var(--laiton,#B9793E)]/20 text-[var(--laiton,#B9793E)]">
                <Percent className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[var(--laiton,#B9793E)] block leading-none mb-1">
                  {p.applies_to === "all_products"
                    ? "Tous les produits"
                    : p.applies_to === "specific_category"
                    ? p.category_name || "Catégorie"
                    : "Produits spécifiques"}
                </span>
                <h3 className="font-serif text-lg font-medium text-[var(--obsidienne,#0E0B09)] tracking-tight truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                  {p.name}
                </h3>
              </div>
            </div>

            {/* Réduction */}
            <div>
              <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                {p.discount_type === "percentage" ? `${p.discount_value}%` : `${formatFCFA(p.discount_value)} `}
                {p.discount_type === "fixed_amount" && <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>}
              </span>
            </div>

            {/* Période */}
            <div className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/65">
              {formatDate(p.start_date)} — {formatDate(p.end_date)}
            </div>

            {/* Statut */}
            <div>
              <StatusBadge promotion={p} />
            </div>

            {/* Utilisations */}
            <div className="text-center">
              <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums bg-[var(--porcelaine,#F1ECE3)]/60 px-3 py-0.5 rounded-full border border-[var(--laiton,#B9793E)]/15">
                {p.usage_count}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/admin/promotions/${p.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[var(--obsidienne,#0E0B09)] transition-all hover:border-[var(--laiton,#B9793E)]/30 hover:bg-[var(--porcelaine,#F1ECE3)] hover:text-[var(--laiton,#B9793E)]"
                title="Voir la fiche"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
              </Link>
              <Link
                href={`/admin/promotions/${p.id}/edit`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--laiton,#B9793E)]/25 bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)]"
                title="Modifier"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit3 className="h-3.5 w-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
