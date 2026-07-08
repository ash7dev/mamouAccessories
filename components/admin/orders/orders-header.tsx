"use client";

import { useState } from "react";
import { AdminPageHeader, FilterPill } from "../admin-page-header";

/* ============================================================
   Header de la page Commandes — /admin/orders

   Onglets par statut avec compteurs (le flux de travail de
   l'admin : traiter → vérifier les paiements → suivre).
   ============================================================ */

export type OrderTab =
  | "all"
  | "pending"
  | "payment_verification"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

interface CommandeHeaderProps {
  /** Compteurs par statut, calculés côté serveur */
  counts?: Partial<Record<OrderTab, number>>;
  onSearchChange?: (query: string) => void;
  onTabChange?: (tab: OrderTab) => void;
}

const tabs: { key: OrderTab; label: string; tone?: "warning" | "danger" }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "À traiter", tone: "warning" },
  { key: "payment_verification", label: "Paiements à vérifier", tone: "warning" },
  { key: "confirmed", label: "Confirmées" },
  { key: "shipped", label: "Expédiées" },
  { key: "delivered", label: "Livrées" },
  { key: "cancelled", label: "Annulées", tone: "danger" },
];

export function CommandeHeader({ counts = {}, onSearchChange, onTabChange }: CommandeHeaderProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>("pending");

  const handleTab = (tab: OrderTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Total à traiter = badge du bandeau (ce qui demande une action)
  const actionable = (counts.pending ?? 0) + (counts.payment_verification ?? 0);

  return (
    <AdminPageHeader
      title="Commandes"
      subtitle={
        actionable > 0
          ? `${actionable} commande${actionable > 1 ? "s" : ""} en attente d'action`
          : "Tout est à jour"
      }
      count={counts.all}
      searchPlaceholder="N° de commande, nom ou téléphone..."
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