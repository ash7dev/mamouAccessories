"use client";

import Link from "next/link";

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

/* ---------- Icônes ---------- */

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z" />
    </svg>
  );
}

function PercentIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M12 10h.01M12 14h.01" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

/* ---------- Badges ---------- */

function StatusBadge({ promotion }: { promotion: PromotionListItem }) {
  const now = new Date();
  const start = new Date(promotion.start_date);
  const end = new Date(promotion.end_date);

  if (now > end) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-2.5 py-1 text-[11px] font-semibold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Expirée
      </span>
    );
  }
  if (now < start) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        À venir
      </span>
    );
  }
  if (promotion.is_active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Inactive
    </span>
  );
}

/* ---------- État vide ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--gold)]/15 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
      <div className="relative mb-5">
        <div aria-hidden className="absolute -inset-3 rounded-full border border-[var(--gold)]/15" />
        <div aria-hidden className="absolute -inset-1.5 rounded-full border border-[var(--gold)]/25" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/25">
          <PercentIcon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="mb-1 text-base font-bold text-[var(--text-dark)]">
        Aucune promotion
      </h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--text-dark)]/50">
        Créez votre première promotion pour offrir des réductions à vos clientes.
      </p>
      <Link
        href="/admin/promotions/new"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95"
      >
        <PlusIcon />
        Créer une promotion
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
    <div className="mx-auto max-w-5xl">
      {/* ===================== MOBILE : grille de cartes ===================== */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {promotions.map((p) => (
          <Link
            key={p.id}
            href={`/admin/promotions/${p.id}`}
            className="group overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] transition-transform active:scale-[0.98]"
          >
            <div className="p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-dark)]">
                    {p.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-dark)]/50">
                    {p.applies_to === "all_products"
                      ? "Tous les produits"
                      : p.applies_to === "specific_category"
                      ? p.category_name || "Catégorie spécifique"
                      : "Produits spécifiques"}
                  </p>
                </div>
                <StatusBadge promotion={p} />
              </div>

              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-[var(--text-dark)] tabular-nums">
                  {p.discount_type === "percentage" ? `${p.discount_value}%` : `${formatFCFA(p.discount_value)} F`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-dark)]/50">
                <span>{formatDate(p.start_date)} - {formatDate(p.end_date)}</span>
                <span className="tabular-nums">{p.usage_count} utilisations</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ===================== DESKTOP : rangées détaillées ===================== */}
      <div className="hidden overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] lg:block">
        {/* En-tête de colonnes */}
        <div className="grid grid-cols-[1fr_120px_180px_100px_80px_56px] items-center gap-4 border-b border-[var(--gold)]/10 bg-[var(--ivory)]/40 px-6 py-3">
          {["Promotion", "Réduction", "Période", "Statut", "Utilisations", ""].map((h, i) => (
            <span
              key={i}
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-dark)]/40 ${
                i >= 4 ? "text-right" : ""
              }`}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-[var(--gold)]/8">
          {promotions.map((p) => (
            <Link
              key={p.id}
              href={`/admin/promotions/${p.id}`}
              className="group grid grid-cols-[1fr_120px_180px_100px_80px_56px] items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--ivory)]/30"
            >
              {/* Promotion : nom + application */}
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--ivory)] text-[var(--gold-dark)]">
                  <PercentIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-dark)]">
                    {p.name}
                  </p>
                  <p className="text-xs text-[var(--text-dark)]/45">
                    {p.applies_to === "all_products"
                      ? "Tous les produits"
                      : p.applies_to === "specific_category"
                      ? p.category_name || "Catégorie spécifique"
                      : "Produits spécifiques"}
                  </p>
                </div>
              </div>

              {/* Réduction */}
              <div>
                <span className="text-sm font-bold text-[var(--text-dark)] tabular-nums">
                  {p.discount_type === "percentage" ? `${p.discount_value}%` : `${formatFCFA(p.discount_value)} F`}
                </span>
              </div>

              {/* Période */}
              <div className="text-xs text-[var(--text-dark)]/70">
                {formatDate(p.start_date)} - {formatDate(p.end_date)}
              </div>

              {/* Statut */}
              <div>
                <StatusBadge promotion={p} />
              </div>

              {/* Utilisations */}
              <span className="text-right text-sm font-semibold text-[var(--text-dark)]/70 tabular-nums">
                {p.usage_count}
              </span>

              {/* Éditer — visible au survol */}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/admin/promotions/${p.id}/edit`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/admin/promotions/${p.id}/edit`;
                  }
                }}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/25 text-[var(--text-dark)]/50 opacity-0 transition-all hover:bg-[var(--gold)] hover:text-[#241B14] group-hover:opacity-100"
                title="Modifier"
              >
                <PencilIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
