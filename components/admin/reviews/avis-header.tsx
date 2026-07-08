"use client";

import { useState } from "react";
import { AdminPageHeader, FilterPill } from "../admin-page-header";

/* ============================================================
   Header de la page Avis — /admin/reviews

   Orienté modération : l'onglet "En attente" est actif par
   défaut, c'est la file de travail de l'admin.
   ============================================================ */

export type ReviewTab = "pending" | "approved" | "all";

interface AvisHeaderProps {
  counts?: Partial<Record<ReviewTab, number>>;
  /** Note moyenne globale des avis approuvés (affichée dans le sous-titre) */
  avgRating?: number | null;
  onSearchChange?: (query: string) => void;
  onTabChange?: (tab: ReviewTab) => void;
}

const tabs: { key: ReviewTab; label: string; tone?: "warning" }[] = [
  { key: "pending", label: "En attente", tone: "warning" },
  { key: "approved", label: "Approuvés" },
  { key: "all", label: "Tous" },
];

export function AvisHeader({ counts = {}, avgRating, onSearchChange, onTabChange }: AvisHeaderProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("pending");

  const handleTab = (tab: ReviewTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const pending = counts.pending ?? 0;
  const subtitle =
    pending > 0
      ? `${pending} avis à modérer`
      : avgRating != null
        ? `Note moyenne de la boutique : ${avgRating.toFixed(1)} ★`
        : "Les avis de vos clientes";

  return (
    <AdminPageHeader
      title="Avis"
      subtitle={subtitle}
      count={counts.all}
      searchPlaceholder="Rechercher par produit ou autrice..."
      onSearchChange={onSearchChange}
      below={
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          {tabs.map((tab) => (
            <FilterPill
              key={tab.key}
              label={tab.label}
              count={counts[tab.key]}
              selected={activeTab === tab.key}
              onClick={() => handleTab(tab.key)}
              tone={tab.tone}
            />
          ))}
        </div>
      }
    />
  );
}