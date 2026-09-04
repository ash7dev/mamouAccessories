"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  Star,
  EyeOff,
  Package,
} from "lucide-react";

export type ProductSort = "recent" | "price-asc" | "price-desc" | "stock-asc" | "sales-desc";
export type StatusFilter = "all" | "active" | "inactive" | "low-stock" | "featured";
export type ViewMode = "table" | "grid";

interface Category {
  id: string;
  name: string;
}

interface ProductsHeaderProps {
  totalCount: number;
  activeCount: number;
  lowStockCount: number;
  featuredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProductsHeader({
  totalCount,
  activeCount,
  lowStockCount,
  featuredCount,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ProductsHeaderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="-mx-6 -mt-6 mb-8 lg:-mx-8 lg:-mt-8 space-y-6">
      {/* ===== Hero Banner Haute Joaillerie & Vue d'Ensemble ===== */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-10 lg:px-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)]">
        {/* Cercles ornementaux dorés */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 via-[#D9AE78]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Ligne 1 : Titre + CTA principal */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[var(--laiton,#B9793E)]/20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 px-4 py-1 text-[10px] font-sans font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3 shadow-inner">
                <Sparkles className="h-3 w-3 stroke-[2]" />
                Gestion du Catalogue & Joaillerie
              </div>
              <h1 className="font-serif text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Catalogue des Produits
              </h1>
              <p className="mt-1.5 text-xs lg:text-sm font-sans tracking-wide text-[var(--porcelaine,#F1ECE3)]/65 max-w-xl">
                Pilotez vos collections, ajustez la visibilité et réassortissez vos stocks en temps réel.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/admin/products/new"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] px-7 py-3.5 text-xs font-sans font-bold tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-[0_8px_25px_rgba(185,121,62,0.3)] transition-all hover:brightness-110 active:scale-95 uppercase"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Nouveau Produit</span>
              </Link>
            </div>
          </div>

          {/* Ligne 2 : Cartes de synthèse KPI Catalogue (Executive Bar - Masquées sur mobile) */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {/* Total */}
            <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/80 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton)]/25">
                <Package className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]/80">Catalogue</p>
                <p className="font-mono text-lg font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums leading-none mt-0.5">{totalCount}</p>
              </div>
            </div>

            {/* Active */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-emerald-400/80">En Ligne</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">{activeCount}</p>
              </div>
            </div>

            {/* Low Stock */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-amber-400/80">Stock Alert</p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">{lowStockCount}</p>
              </div>
            </div>

            {/* Featured */}
            <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/80 p-3.5 flex items-center gap-3 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)]">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">En Vedette</p>
                <p className="font-mono text-lg font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums leading-none mt-0.5">{featuredCount}</p>
              </div>
            </div>
          </div>

          {/* Ligne 3 : Barre de Recherche Haute Joaillerie */}
          <div className="pt-6">
            <div className="relative w-full">
              <Search className="absolute left-4.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
              <input
                type="text"
                placeholder="Rechercher par nom de bijou, collection ou référence..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 py-4 pl-12 pr-10 text-xs sm:text-sm font-sans text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/35 transition-all focus:border-[var(--laiton,#B9793E)] focus:bg-[var(--obsidienne,#0E0B09)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/30 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-sans text-[var(--laiton-clair,#D9AE78)] hover:underline"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Barre des Filtres de Statut & Tri & Mode de Vue ===== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-4">
        {/* Onglets de Statuts (Filtres Rapides - Masqués sur mobile) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[var(--laiton,#B9793E)]/15">
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            <button
              onClick={() => onStatusFilterChange("all")}
              className={`rounded-full px-4 py-2 text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                statusFilter === "all"
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-sm"
                  : "border border-[var(--laiton,#B9793E)]/20 bg-white text-[var(--obsidienne,#0E0B09)]/70 hover:border-[var(--laiton)]/40"
              }`}
            >
              Tous ({totalCount})
            </button>
            <button
              onClick={() => onStatusFilterChange("active")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "border border-emerald-500/20 bg-white text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              En Ligne ({activeCount})
            </button>
            <button
              onClick={() => onStatusFilterChange("inactive")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                statusFilter === "inactive"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <EyeOff className="h-3.5 w-3.5" />
              Masqués ({totalCount - activeCount})
            </button>
            <button
              onClick={() => onStatusFilterChange("low-stock")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                statusFilter === "low-stock"
                  ? "bg-amber-800 text-white shadow-sm"
                  : "border border-amber-500/25 bg-white text-amber-800 hover:bg-amber-50"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Stock Alert ({lowStockCount})
            </button>
            <button
              onClick={() => onStatusFilterChange("featured")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-sans font-semibold tracking-wider uppercase transition-all ${
                statusFilter === "featured"
                  ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] font-bold shadow-sm"
                  : "border border-[var(--laiton,#B9793E)]/30 bg-white text-[var(--laiton,#B9793E)] hover:bg-[var(--porcelaine)]"
              }`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              Vedettes ({featuredCount})
            </button>
          </div>

          {/* Selector Mode de Vue (Table vs Grille) */}
          <div className="flex items-center gap-1 bg-[var(--porcelaine,#F1ECE3)]/80 p-1 rounded-2xl border border-[var(--laiton,#B9793E)]/20 shrink-0 ml-auto sm:ml-0">
            <button
              onClick={() => onViewModeChange("table")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-sans font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-xs"
                  : "text-[var(--obsidienne,#0E0B09)]/60 hover:text-[var(--obsidienne)]"
              }`}
              title="Affichage en Liste Éditoriale"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-sans font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-xs"
                  : "text-[var(--obsidienne,#0E0B09)]/60 hover:text-[var(--obsidienne)]"
              }`}
              title="Affichage en Cartes Grille Luxe"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grille</span>
            </button>
          </div>
        </div>

        {/* Ligne : Pilules de collections (Catégories) + Tri (Tri masqué sur mobile) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="scrollbar-none -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1">
            <button
              onClick={() => onCategoryChange(null)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-sans font-semibold transition-all ${
                activeCategory === null
                  ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] font-bold shadow-xs"
                  : "border border-[var(--laiton,#B9793E)]/20 bg-white text-[var(--obsidienne,#0E0B09)]/70 hover:border-[var(--laiton)]/50"
              }`}
            >
              Toutes les collections
            </button>
            {isLoadingCategories ? (
              <div className="shrink-0 px-4 py-2 text-xs font-sans text-[var(--obsidienne,#0E0B09)]/40">
                Chargement...
              </div>
            ) : (
              categories.map((cat: Category) => {
                const selected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(selected ? null : cat.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-sans font-semibold transition-all ${
                      selected
                        ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] font-bold shadow-xs"
                        : "border border-[var(--laiton,#B9793E)]/20 bg-white text-[var(--obsidienne,#0E0B09)]/70 hover:border-[var(--laiton)]/50"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>

          {/* Selector de Tri (Masqué sur mobile) */}
          <div className="hidden sm:block relative shrink-0 self-end sm:self-auto">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ProductSort)}
              className="cursor-pointer appearance-none rounded-full border border-[var(--laiton,#B9793E)]/30 bg-white py-2 pl-10 pr-10 text-xs font-sans font-bold text-[var(--obsidienne,#0E0B09)] transition-colors hover:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-1 focus:ring-[var(--laiton,#B9793E)] shadow-2xs"
              aria-label="Trier les produits"
            >
              <option value="recent">Nouveautés d&apos;abord</option>
              <option value="price-asc">Prix : du − au + cher</option>
              <option value="price-desc">Prix : du + au − cher</option>
              <option value="stock-asc">Stock : alertes d&apos;abord</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}