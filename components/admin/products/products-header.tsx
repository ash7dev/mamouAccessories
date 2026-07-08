"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ============================================================
   Header de la liste produits — /admin/products

   Contrôlable par le parent via les callbacks (recherche,
   catégorie, tri). Le parent filtre la liste en conséquence.
   ============================================================ */

export type ProductSort = "recent" | "price-asc" | "price-desc" | "stock-asc";

interface Category {
  id: string;
  name: string;
}

interface ProductsHeaderProps {
  totalCount?: number;
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (categoryId: string | null) => void;
  onSortChange?: (sort: ProductSort) => void;
}

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function SortIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  );
}

export function ProductsHeader({
  totalCount,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductsHeaderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<ProductSort>("recent");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleCategory = (id: string | null) => {
    setActiveCategory(id);
    onCategoryChange?.(id);
  };

  const handleSort = (value: ProductSort) => {
    setSort(value);
    onSortChange?.(value);
  };

  return (
    <div className="-mx-6 -mt-6 mb-6 lg:-mx-8 lg:-mt-8">
      {/* ===== Bandeau sombre unifié (mobile + desktop) ===== */}
      <div className="relative overflow-hidden rounded-b-3xl bg-[#241B14] px-6 pb-6 pt-6 lg:px-8">
        {/* Ornement signature */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 opacity-60">
          <div className="h-44 w-44 rounded-full border border-[var(--gold)]/15" />
          <div className="absolute inset-6 rounded-full border border-[var(--gold)]/20" />
          <div className="absolute inset-12 rounded-full border border-[var(--gold)]/25" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Titre + compteur + bouton d'ajout */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-[#F4EFE6]">Produits</h1>
                {typeof totalCount === "number" && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)] tabular-nums">
                    {totalCount}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-[#F4EFE6]/50">
                Gérez votre catalogue de bijoux
              </p>
            </div>

            {/* Icône seule en mobile, pilule avec texte en desktop */}
            <Link
              href="/admin/products/new"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95 lg:h-11 lg:w-auto lg:gap-2 lg:px-5"
            >
              <PlusIcon />
              <span className="hidden text-sm font-bold lg:inline">Ajouter un produit</span>
            </Link>
          </div>

          {/* Recherche intégrée au bandeau, style sombre */}
          <div className="relative lg:max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#F4EFE6]/40" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-[#F4EFE6] placeholder:text-[#F4EFE6]/35 transition-colors focus:border-[var(--gold)]/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25"
            />
          </div>
        </div>
      </div>

      {/* ===== Filtres par catégorie + tri ===== */}
      <div className="mx-auto mt-5 flex max-w-5xl items-center gap-3 px-6 lg:px-8">
        {/* Pilules de catégories — défilement horizontal en mobile */}
        <div className="scrollbar-none -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1">
          <button
            onClick={() => handleCategory(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-[var(--text-dark)] text-white shadow-md"
                : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/60 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
            }`}
          >
            Tous
          </button>
          {isLoadingCategories ? (
            <div className="shrink-0 px-4 py-2 text-sm text-[var(--text-dark)]/50">Chargement...</div>
          ) : (
            categories.map((cat: Category) => {
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategory(selected ? null : cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selected
                      ? "bg-[var(--text-dark)] text-white shadow-md"
                      : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/60 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })
          )}
        </div>

        {/* Tri — select natif habillé en pilule */}
        <div className="relative shrink-0">
          <SortIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dark)]/50" />
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value as ProductSort)}
            className="cursor-pointer appearance-none rounded-full border border-[var(--gold)]/25 bg-white py-2 pl-10 pr-8 text-sm font-medium text-[var(--text-dark)]/70 transition-colors hover:border-[var(--gold)]/50 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25"
            aria-label="Trier les produits"
          >
            <option value="recent">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="stock-asc">Stock faible d&apos;abord</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dark)]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}