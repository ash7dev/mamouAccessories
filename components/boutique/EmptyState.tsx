"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Search, X, Filter, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface EmptyStateProps {
  onClearFilters: () => void;
}

function EmptyStateContent({ onClearFilters }: EmptyStateProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categorySlug = searchParams.get('categorie');

  let icon = Search;
  let title = "Aucun bijou trouve";
  let description = "Nous n'avons trouve aucun bijou correspondant a vos criteres. Essayez d'ajuster vos filtres pour decouvrir d'autres pieces.";

  if (searchQuery) {
    icon = Search;
    title = "Aucun resultat pour \"" + searchQuery + "\"";
    description = "Essayez avec d'autres mots-cles ou parcourez toute notre collection.";
  } else if (categorySlug) {
    icon = Package;
    title = "Categorie vide";
    description = "Cette categorie ne contient aucun bijou pour le moment. Decouvrez nos autres collections.";
  }

  const IconComponent = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-[var(--gold)]/15 bg-white px-8 py-20 text-center shadow-sm"
    >
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="absolute -inset-6 rounded-full border border-[var(--gold)]/10"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute -inset-3 rounded-full border border-[var(--gold)]/20"
        />
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ivory)] to-[var(--gold)]/10 ring-1 ring-inset ring-[var(--gold)]/25 shadow-lg"
        >
          <IconComponent className="h-9 w-9 text-[var(--gold-dark)]" strokeWidth={1.5} />
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-cinzel text-xl font-bold text-[var(--text-dark)] mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-md text-sm leading-relaxed text-[var(--text-dark)]/60 mb-8"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 rounded-xl border border-[var(--gold)]/30 bg-white px-6 py-3 text-sm font-semibold text-[var(--gold-dark)] transition-all hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/50 hover:shadow-md"
        >
          <X className="h-4 w-4" />
          Effacer les filtres
        </button>

        <a
          href="/boutique"
          className="flex items-center gap-2 rounded-xl bg-[var(--espresso)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--espresso)]/90 hover:shadow-md"
        >
          <Package className="h-4 w-4" />
          Voir toute la collection
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 pt-8 border-t border-[var(--gold)]/10 w-full"
      >
        <p className="text-xs text-[var(--text-dark)]/40 mb-3">Suggestions</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <motion.a
            href="/boutique"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Tous
          </motion.a>
          <motion.a
            href="/boutique?search=nouveautes"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.95 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Nouveautes
          </motion.a>
          <motion.a
            href="/boutique?search=promotions"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Promotions
          </motion.a>
          <motion.a
            href="/boutique?search=bagues"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Bagues
          </motion.a>
          <motion.a
            href="/boutique?search=colliers"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Colliers
          </motion.a>
          <motion.a
            href="/boutique?search=bracelets"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.15 }}
            className="px-3 py-1.5 rounded-full bg-[var(--ivory)]/60 text-xs font-medium text-[var(--text-dark)]/60 hover:bg-[var(--gold)]/10 hover:text-[var(--gold-dark)] transition-all"
          >
            Bracelets
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center rounded-3xl border border-[var(--gold)]/15 bg-white px-8 py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
      </div>
    }>
      <EmptyStateContent onClearFilters={onClearFilters} />
    </Suspense>
  );
}
