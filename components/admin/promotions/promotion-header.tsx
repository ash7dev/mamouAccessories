"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminPageHeader, FilterPill } from "../admin-page-header";

/* ============================================================
   Header de la page Promotions — /admin/promotions
   ============================================================ */

export type PromotionFilter = "all" | "active" | "upcoming" | "expired";

interface PromotionHeaderProps {
  counts?: Partial<Record<PromotionFilter, number>>;
  onFilterChange?: (filter: PromotionFilter) => void;
}

const filters: { key: PromotionFilter; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "Actives" },
  { key: "upcoming", label: "À venir" },
  { key: "expired", label: "Expirées" },
];

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export function PromotionHeader({ counts = {}, onFilterChange }: PromotionHeaderProps) {
  const [activeFilter, setActiveFilter] = useState<PromotionFilter>("all");

  const handleFilter = (filter: PromotionFilter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <AdminPageHeader
      title="Promotions"
      subtitle="Mettez vos bijoux en avant avec des offres"
      count={counts.active}
      action={
        <Link
          href="/admin/promotions/new"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95 lg:h-11 lg:w-auto lg:gap-2 lg:px-5"
        >
          <PlusIcon />
          <span className="hidden text-sm font-bold lg:inline">Nouvelle promotion</span>
        </Link>
      }
      below={
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          {filters.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              count={counts[f.key]}
              selected={activeFilter === f.key}
              onClick={() => handleFilter(f.key)}
            />
          ))}
        </div>
      }
    />
  );
}