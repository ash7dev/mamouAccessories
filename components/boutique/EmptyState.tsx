"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-[var(--gold)]/15 bg-white px-8 py-20 text-center shadow-sm"
    >
      <div className="relative mb-6">
        <div className="absolute -inset-6 rounded-full border border-[var(--gold)]/10" />
        <div className="absolute -inset-3 rounded-full border border-[var(--gold)]/20" />
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ivory)] ring-1 ring-inset ring-[var(--gold)]/25"
        >
          <Search className="h-9 w-9 text-[var(--gold-dark)]" strokeWidth={1.5} />
        </motion.div>
      </div>
      <h3 className="font-cinzel text-xl font-bold text-[var(--text-dark)] mb-2">
        Aucun bijou trouve
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-[var(--text-dark)]/60 mb-6">
        Nous avons trouve aucun bijou correspondant a vos criteres.
        Essayez d'ajuster vos filtres pour decouvrir d'autres pieces.
      </p>
      <button
        onClick={onClearFilters}
        className="flex items-center gap-2 rounded-xl border border-[var(--gold)]/30 bg-white px-6 py-3 text-sm font-semibold text-[var(--gold-dark)] transition-all hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/50"
      >
        <X className="h-4 w-4" />
        Effacer les filtres
      </button>
    </motion.div>
  );
}
