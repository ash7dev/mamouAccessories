"use client";

import { useState } from "react";
import Link from "next/link";

export interface PromotionDetailData {
  id: string;
  name: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string;
  end_date: string;
  applies_to: "all_products" | "specific_category" | "specific_products";
  category_id: string | null;
  category_name: string | null;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* ---------- Icônes ---------- */

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function PercentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M12 10h.01M12 14h.01" />
    </svg>
  );
}

function TagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.582l5.732-2.485a2.25 2.25 0 001.383-2.08V5.25A2.25 2.25 0 0020.25 3h-4.682zM7.5 8.25h.008v.008H7.5V8.25z" />
    </svg>
  );
}

/* ---------- Composant ---------- */

export function PromotionDetail({ promotion }: { promotion: PromotionDetailData }) {
  const [isActive, setIsActive] = useState(promotion.is_active);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = new Date() > new Date(promotion.end_date);
  const isUpcoming = new Date() < new Date(promotion.start_date);
  const isRunning = !isExpired && !isUpcoming;

  const statusColor = isExpired
    ? "bg-red-400/15 text-red-300"
    : isUpcoming
    ? "bg-amber-400/15 text-amber-300"
    : isActive
    ? "bg-emerald-400/15 text-emerald-300"
    : "bg-white/10 text-[#F4EFE6]/50";

  const statusLabel = isExpired
    ? "○ Expirée"
    : isUpcoming
    ? "● À venir"
    : isActive
    ? "● Active"
    : "○ Inactive";

  const appliesToLabel = promotion.applies_to === "all_products"
    ? "Tous les produits"
    : promotion.applies_to === "specific_category"
    ? promotion.category_name || "Catégorie spécifique"
    : "Produits spécifiques";

  const handleToggle = async () => {
    try {
      const response = await fetch(`/api/admin/promotions/${promotion.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (response.ok) {
        setIsActive(!isActive);
      }
    } catch (error) {
      console.error('Error toggling promotion:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")) return;
    try {
      const response = await fetch(`/api/admin/promotions/${promotion.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        window.location.href = '/admin/promotions';
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  return (
    <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
      {/* ===== Bandeau sombre : fil d'ariane + titre + badges + actions ===== */}
      <div className="relative overflow-hidden rounded-b-3xl bg-[#241B14] px-6 pb-8 pt-6 lg:px-8">
        {/* Ornement : cercles concentriques dorés */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 opacity-60">
          <div className="h-44 w-44 rounded-full border border-[var(--gold)]/15" />
          <div className="absolute inset-6 rounded-full border border-[var(--gold)]/20" />
          <div className="absolute inset-12 rounded-full border border-[var(--gold)]/25" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/admin/promotions"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#F4EFE6]/60 transition-colors hover:text-[#F4EFE6]"
          >
            <ChevronLeftIcon />
            Promotions
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}
                >
                  {statusLabel}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F4EFE6]/80">
                  {promotion.discount_type === "percentage" ? "Pourcentage" : "Montant fixe"}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#F4EFE6] lg:text-2xl">{promotion.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggle}
                disabled={isExpired}
                className={`flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition-transform active:scale-95 ${
                  isActive && !isExpired
                    ? "bg-white/10 text-[#F4EFE6]/80 hover:bg-white/20"
                    : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                } disabled:opacity-50`}
              >
                {isActive ? "Désactiver" : "Activer"}
              </button>
              <Link
                href={`/admin/promotions/${promotion.id}/edit`}
                className="flex h-11 items-center gap-2 rounded-full bg-[var(--gold)] px-5 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95"
              >
                <PencilIcon />
                Modifier
              </Link>
              <button
                onClick={handleDelete}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
                title="Supprimer"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 pb-28 pt-6 lg:px-8 lg:pb-10">
        {/* ===== Rangée de stats : utilisations ===== */}
        <div className="grid grid-cols-1 divide-x divide-[var(--gold)]/12 rounded-3xl border border-[var(--gold)]/15 bg-white px-2 py-5 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] lg:grid-cols-3">
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {promotion.usage_count}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              Utilisations
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {promotion.discount_type === "percentage" ? `${promotion.discount_value}%` : formatFCFA(promotion.discount_value)}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              Réduction
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {promotion.min_purchase_amount > 0 ? formatFCFA(promotion.min_purchase_amount) : "—"}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              Min. achat
            </span>
          </div>
        </div>

        {/* ===== Infos de la promotion ===== */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Réduction */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)]">
                <PercentIcon />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                Réduction
              </p>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                {promotion.discount_type === "percentage" ? (
                  <>{promotion.discount_value}%</>
                ) : (
                  <>{formatFCFA(promotion.discount_value)} FCFA</>
                )}
              </p>
              <p className="mt-1 text-sm text-[var(--text-dark)]/50">
                {promotion.discount_type === "percentage" ? "Pourcentage de réduction" : "Montant fixe de réduction"}
              </p>
            </div>
            {promotion.max_discount_amount && (
              <div className="rounded-2xl bg-[var(--ivory)] px-4 py-3">
                <p className="text-xs text-[var(--text-dark)]/50">Plafond de réduction</p>
                <p className="text-lg font-bold text-[var(--text-dark)] tabular-nums">
                  {formatFCFA(promotion.max_discount_amount)} FCFA
                </p>
              </div>
            )}
          </div>

          {/* Période de validité */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)]">
                <CalendarIcon />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                Période de validité
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--text-dark)]/50">Date de début</p>
                <p className="text-base font-semibold text-[var(--text-dark)]">{formatDate(promotion.start_date)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-dark)]/50">Date de fin</p>
                <p className="text-base font-semibold text-[var(--text-dark)]">{formatDate(promotion.end_date)}</p>
              </div>
              {isExpired && (
                <p className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  Cette promotion a expiré
                </p>
              )}
              {isUpcoming && (
                <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600">
                  Cette promotion commence bientôt
                </p>
              )}
              {isRunning && (
                <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
                  Cette promotion est actuellement active
                </p>
              )}
            </div>
          </div>

          {/* Application */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)]">
                <TagIcon />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                Application
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--text-dark)]">{appliesToLabel}</p>
              {promotion.category_name && (
                <p className="mt-1 text-sm text-[var(--text-dark)]/50">
                  Catégorie : {promotion.category_name}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Description
            </p>
            {promotion.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-dark)]/70">
                {promotion.description}
              </p>
            ) : (
              <p className="text-sm italic text-[var(--text-dark)]/35">
                Aucune description
              </p>
            )}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
          <p className="text-xs text-[var(--text-dark)]/35">
            Créée le{" "}
            {new Date(promotion.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {promotion.updated_at !== promotion.created_at && (
              <> · Modifiée le {new Date(promotion.updated_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
