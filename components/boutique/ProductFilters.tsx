"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";

export interface FilterOptions {
  category: string | null;
  priceRange: [number, number] | null;
  inStock: boolean;
  featured: boolean;
}

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; productCount: number }>;
  onFilterChange: (filters: FilterOptions) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export function ProductFilters({
  categories,
  onFilterChange,
  isOpen = true,
  onToggle,
  isMobile = false
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    priceRange: null,
    inStock: false,
    featured: false,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      category: null,
      priceRange: null,
      inStock: false,
      featured: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.category || filters.priceRange || filters.inStock || filters.featured;
  const activeFiltersCount = [filters.category, filters.priceRange, filters.inStock, filters.featured].filter(Boolean).length;

  // Contenu des filtres (partagé entre desktop et mobile)
  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)] mb-3">
          Catégories
        </h3>
        <div className="space-y-1.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', filters.category === category.id ? null : category.id)}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                filters.category === category.id
                  ? 'bg-[var(--gold)]/15 text-[var(--text-dark)] font-semibold border border-[var(--gold)]/40'
                  : 'hover:bg-[var(--ivory)]/60 text-[var(--text-dark)]/70'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs text-[var(--text-dark)]/40 tabular-nums">
                {category.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)] mb-3">
          Prix
        </h3>
        <div className="space-y-1.5">
          {[
            { label: 'Tous les prix', range: null },
            { label: 'Moins de 10 000 F', range: [0, 10000] as [number, number] },
            { label: '10 000 - 25 000 F', range: [10000, 25000] as [number, number] },
            { label: '25 000 - 50 000 F', range: [25000, 50000] as [number, number] },
            { label: 'Plus de 50 000 F', range: [50000, 999999] as [number, number] },
          ].map((option) => (
            <button
              key={option.label}
              onClick={() => handleFilterChange('priceRange', option.range)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                JSON.stringify(filters.priceRange) === JSON.stringify(option.range)
                  ? 'bg-[var(--gold)]/15 text-[var(--text-dark)] font-semibold border border-[var(--gold)]/40'
                  : 'hover:bg-[var(--ivory)]/60 text-[var(--text-dark)]/70'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)] mb-3">
          Options
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="peer h-5 w-5 rounded border-2 border-[var(--gold)]/30 text-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 cursor-pointer"
              />
              <div className="absolute inset-0 rounded border-2 border-[var(--gold)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-sm text-[var(--text-dark)]/70 group-hover:text-[var(--text-dark)] transition-colors">
              En stock uniquement
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                className="peer h-5 w-5 rounded border-2 border-[var(--gold)]/30 text-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 cursor-pointer"
              />
              <div className="absolute inset-0 rounded border-2 border-[var(--gold)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-sm text-[var(--text-dark)]/70 group-hover:text-[var(--text-dark)] transition-colors">
              En promotion
            </span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--gold)]/30 px-4 py-2.5 text-sm font-semibold text-[var(--gold-dark)] hover:bg-[var(--gold)]/10 transition-colors"
        >
          <X className="h-4 w-4" />
          Effacer les filtres
        </button>
      )}
    </div>
  );

  // Version Desktop
  if (!isMobile) {
    return (
      <aside className="w-full bg-white rounded-2xl border border-[var(--gold)]/15 shadow-sm p-5">
        <h2 className="font-cinzel text-lg font-bold text-[var(--text-dark)] mb-5">
          Filtres
        </h2>
        <FiltersContent />
      </aside>
    );
  }

  // Version Mobile
  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="lg:hidden fixed bottom-24 right-6 z-[100] flex items-center gap-2.5 rounded-full bg-[var(--espresso)] pl-5 pr-5 py-3.5 text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="text-sm font-semibold">Filtres</span>
          {hasActiveFilters && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[var(--espresso)]">
              {activeFiltersCount}
            </span>
          )}
        </button>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="lg:hidden fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-[120] w-[85vw] max-w-sm bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--gold)]/10 px-6 py-5">
                  <div>
                    <h2 className="font-cinzel text-xl font-bold text-[var(--text-dark)]">
                      Filtres
                    </h2>
                    {hasActiveFilters && (
                      <p className="mt-0.5 text-xs text-[var(--text-dark)]/50">
                        {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onToggle}
                    className="rounded-full p-2 hover:bg-[var(--ivory)] transition-colors"
                  >
                    <X className="h-5 w-5 text-[var(--text-dark)]" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <FiltersContent />
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--gold)]/10 p-6">
                  <button
                    onClick={onToggle}
                    className="w-full rounded-xl bg-[var(--espresso)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--espresso)]/90 transition-colors"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
