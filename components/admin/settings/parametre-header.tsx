"use client";

import { AdminPageHeader } from "../admin-page-header";

/* ============================================================
   Header de la page Paramètres — /admin/settings

   Le plus simple des headers : pas de recherche ni de filtres.
   Un indicateur d'état de sauvegarde optionnel à droite, utile
   quand les réglages s'enregistrent automatiquement.
   ============================================================ */

interface ParametreHeaderProps {
  /** "saved" = tout est enregistré, "saving" = en cours, "dirty" = modifications non enregistrées */
  saveState?: "saved" | "saving" | "dirty";
}

function SaveIndicator({ state }: { state: NonNullable<ParametreHeaderProps["saveState"]> }) {
  const config = {
    saved: { dot: "bg-emerald-400", text: "Enregistré", pulse: false },
    saving: { dot: "bg-[var(--gold)]", text: "Enregistrement...", pulse: true },
    dirty: { dot: "bg-amber-400", text: "Modifications non enregistrées", pulse: false },
  }[state];

  return (
    <span className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-[#F4EFE6]/70">
      <span className={`h-2 w-2 rounded-full ${config.dot} ${config.pulse ? "animate-pulse" : ""}`} />
      {config.text}
    </span>
  );
}

export function ParametreHeader({ saveState }: ParametreHeaderProps) {
  return (
    <AdminPageHeader
      title="Paramètres"
      subtitle="Lien Wave, livraison, WhatsApp et boutique"
      action={saveState ? <SaveIndicator state={saveState} /> : undefined}
    />
  );
}