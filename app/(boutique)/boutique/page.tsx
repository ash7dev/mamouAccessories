"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { ProductFilters, type FilterOptions } from "@/components/boutique/ProductFilters";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { ViewToggle, type ViewMode } from "@/components/boutique/ViewToggle";
import { EmptyState } from "@/components/boutique/EmptyState";
import { NewsletterSection } from "@/components/NewsletterSection";
import type { PublicProductCard } from "@/components/home/ProductCard";
import { ProductImage } from "@/components/ui/product-image";
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, ChevronDown, Check, ShieldCheck, Truck, Headphones } from "lucide-react";

type SortOption = "recent" | "price-asc" | "price-desc";

function normalizeCategoryStr(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function BoutiquePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [allProducts, setAllProducts] = useState<PublicProductCard[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PublicProductCard[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
    searchParams?.get("categorie") || searchParams?.get("category") || null
  );
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Charger les données (catégories & produits)
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        if (categoriesData.categories) {
          setCategories(
            categoriesData.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              productCount: cat.productCount || 0,
            }))
          );
        }

        if (productsData.products) {
          const transformed: PublicProductCard[] = productsData.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            categorySlug: product.categorySlug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            imageOrientation: product.imageOrientation,
            imageUrl: product.imageUrl,
          }));

          setAllProducts(transformed);
        }
      } catch (error) {
        console.error("Error loading boutique data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtrer et trier les produits
  const applyFiltersAndSort = useCallback(
    (products: PublicProductCard[]) => {
      let result = [...products];

      // 1. Recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const normQ = normalizeCategoryStr(q);
        result = result.filter((p) => {
          const normName = normalizeCategoryStr(p.name);
          const normCat = normalizeCategoryStr(p.categoryName || "");
          const isEarringSearch = normQ.includes("boucle") || normQ.includes("oreille");
          const isEarringProduct = normCat.includes("boucle") || normCat.includes("oreille") || normName.includes("boucle");

          return (
            p.name.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            (normQ.length >= 2 && (normName.includes(normQ) || normCat.includes(normQ))) ||
            (isEarringSearch && isEarringProduct)
          );
        });
      }

      // 2. Filtre par Catégorie
      if (activeCategorySlug) {
        const normActive = normalizeCategoryStr(activeCategorySlug);

        // Trouver la catégorie correspondante dans la liste des catégories
        const catObj = categories.find(
          (c) =>
            c.slug === activeCategorySlug ||
            c.id === activeCategorySlug ||
            normalizeCategoryStr(c.slug) === normActive ||
            normalizeCategoryStr(c.name) === normActive
        );

        result = result.filter((p) => {
          // A. Par UUID de catégorie (si catObj est trouvé)
          if (catObj && p.categoryId && p.categoryId === catObj.id) {
            return true;
          }
          // B. Par slug de catégorie
          if (
            p.categorySlug &&
            (p.categorySlug.toLowerCase() === activeCategorySlug.toLowerCase() ||
              normalizeCategoryStr(p.categorySlug) === normActive)
          ) {
            return true;
          }
          // C. Par nom de catégorie
          if (
            catObj &&
            p.categoryName &&
            normalizeCategoryStr(p.categoryName) === normalizeCategoryStr(catObj.name)
          ) {
            return true;
          }
          // D. Par chaîne de caractères normalisée (ex: bouclesdoreilles vs boucles-d-oreilles)
          if (p.categoryName) {
            const normP = normalizeCategoryStr(p.categoryName);
            if (normP === normActive) return true;
            if (
              (normActive.includes("boucle") || normActive.includes("oreille")) &&
              (normP.includes("boucle") || normP.includes("oreille"))
            ) {
              return true;
            }
          }
          return false;
        });
      }

      // 3. Filtre par tranche de prix
      if (priceRange) {
        const [min, max] = priceRange;
        result = result.filter((p) => p.price >= min && p.price <= max);
      }

      // 4. En stock uniquement
      if (inStockOnly) {
        result = result.filter((p) => p.stock > 0);
      }

      // 5. En promotion / vedette
      if (featuredOnly) {
        result = result.filter(
          (p) => p.compareAtPrice && p.compareAtPrice > p.price
        );
      }

      // 6. Tri
      if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      } else {
        // recent (defaut)
        result.sort((a, b) => (b.id > a.id ? 1 : -1));
      }

      setFilteredProducts(result);
    },
    [searchQuery, activeCategorySlug, categories, priceRange, inStockOnly, featuredOnly, sortBy]
  );

  useEffect(() => {
    applyFiltersAndSort(allProducts);
  }, [allProducts, applyFiltersAndSort]);

  // Synchronisation des paramètres d'URL
  useEffect(() => {
    const urlCat = searchParams?.get("categorie") || searchParams?.get("category") || null;
    if (urlCat !== activeCategorySlug) {
      setActiveCategorySlug(urlCat);
    }
    const urlSearch = searchParams?.get("search");
    if (urlSearch !== undefined && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch || "");
    }
  }, [searchParams]);

  // Sélection d'une catégorie en 1 clic
  const handleSelectCategory = (slug: string | null) => {
    setActiveCategorySlug(slug);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (slug) {
      params.set("categorie", slug);
      params.delete("category");
    } else {
      params.delete("categorie");
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filters: FilterOptions) => {
    if (filters.category) {
      const catObj = categories.find((c) => c.id === filters.category);
      if (catObj) {
        handleSelectCategory(catObj.slug);
      }
    } else {
      handleSelectCategory(null);
    }

    setPriceRange(filters.priceRange);
    setInStockOnly(filters.inStock);
    setFeaturedOnly(filters.featured);
  };

  const clearFilters = () => {
    setActiveCategorySlug(null);
    setSearchQuery("");
    setSortBy("recent");
    setPriceRange(null);
    setInStockOnly(false);
    setFeaturedOnly(false);
    router.push(pathname, { scroll: false });
  };

  const selectedCategoryName = activeCategorySlug
    ? categories.find(
        (c) =>
          c.slug === activeCategorySlug ||
          c.id === activeCategorySlug ||
          normalizeCategoryStr(c.slug) === normalizeCategoryStr(activeCategorySlug) ||
          normalizeCategoryStr(c.name) === normalizeCategoryStr(activeCategorySlug)
      )?.name ||
      (normalizeCategoryStr(activeCategorySlug).includes("boucle")
        ? "Boucles d'oreilles"
        : activeCategorySlug)
    : null;

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F7F4EF)] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        {/* ================= BARRE EN-TÊTE INSPIRE JAGUAR ================= */}
        <section className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="mx-auto max-w-7xl">

            {/* Titre, Eyebrow & Badge "XX articles" */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--laiton,#B9793E)] block mb-1">
                  BOUTIQUE MAMOU&apos;S
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)]">
                  {selectedCategoryName ? selectedCategoryName : "Toutes les pièces"}
                </h1>
              </div>

              {/* Badge Pilule "XX articles" (Style Jaguar) */}
              <div className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-neutral-700 shadow-sm border border-[var(--laiton)]/15">
                <span className="tabular-nums font-mono text-[var(--laiton)] font-extrabold">{filteredProducts.length}</span>
                <span>article{filteredProducts.length > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* ================= BARRE / CARTE DES FILTRES UNIFIÉE — MOBILE ================= */}
            <div className="lg:hidden mt-5 rounded-[2rem] bg-white p-3.5 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] border border-[var(--laiton)]/15 space-y-3">
              {/* Ligne 1 : Recherche + Bouton filtre rond noir */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--laiton)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une pièce..."
                    className="w-full rounded-full border border-neutral-200 bg-white pl-10 pr-8 py-2.5 text-xs text-[var(--obsidienne)] placeholder-neutral-400 focus:border-[var(--laiton)] focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Dropdown de recherche instantanée mobile */}
                  {isSearchFocused && searchQuery.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(14,11,9,0.18)] border border-[var(--laiton)]/20 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 flex items-center justify-between border-b border-neutral-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--laiton)]">Résultats instantanés</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{filteredProducts.length} trouvé{filteredProducts.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
                        {filteredProducts.slice(0, 5).map((p) => (
                          <a
                            key={p.id}
                            href={`/produit/${p.slug}`}
                            className="flex items-center gap-3 p-2.5 hover:bg-neutral-50 rounded-xl transition-colors group"
                          >
                            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-[var(--porcelaine)]">
                              <ProductImage src={p.imageUrl} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-xs font-bold text-[var(--obsidienne)] group-hover:text-[var(--laiton)] truncate">
                                {p.name}
                              </h4>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{p.categoryName}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-extrabold text-[var(--obsidienne)] tabular-nums">{new Intl.NumberFormat("fr-FR").format(p.price)} FCFA</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton Filtre Rond Noir Mat */}
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  aria-label="Ouvrir les filtres"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--obsidienne,#0E0B09)] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Ligne 2 : Pilules de catégories défilantes */}
              <div className="scrollbar-none -mx-3.5 flex items-center gap-2 overflow-x-auto px-3.5 pb-1 border-t border-neutral-100 pt-2">
                <button
                  onClick={() => handleSelectCategory(null)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeCategorySlug === null
                      ? "bg-[var(--obsidienne,#0E0B09)] text-white shadow-sm"
                      : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  TOUTES
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeCategorySlug === cat.slug
                        ? "bg-[var(--obsidienne,#0E0B09)] text-white shadow-sm"
                        : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                    }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* ================= BARRE / CAPSULE UNIFIÉE — DESKTOP ================= */}
            <div className="hidden lg:flex items-center justify-between gap-4 mt-6 rounded-full bg-white p-2.5 px-5 shadow-[0_4px_24px_-6px_rgba(14,11,9,0.06)] border border-[var(--laiton)]/20">
              {/* Champ de Recherche */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--laiton)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce..."
                  className="w-full rounded-full border-0 bg-transparent pl-11 pr-8 py-2 text-xs font-medium text-[var(--obsidienne)] placeholder-neutral-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Dropdown de recherche instantanée desktop */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_16px_50px_rgba(14,11,9,0.18)] border border-[var(--laiton)]/20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-neutral-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--laiton)]">Résultats instantanés</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{filteredProducts.length} trouvé{filteredProducts.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                      {filteredProducts.slice(0, 5).map((p) => (
                        <a
                          key={p.id}
                          href={`/produit/${p.slug}`}
                          className="flex items-center gap-3 p-2.5 hover:bg-neutral-50 rounded-xl transition-colors group"
                        >
                          <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-[var(--porcelaine)]">
                            <ProductImage src={p.imageUrl} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-xs font-bold text-[var(--obsidienne)] group-hover:text-[var(--laiton)] truncate">
                              {p.name}
                            </h4>
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{p.categoryName}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[var(--obsidienne)] tabular-nums">{new Intl.NumberFormat("fr-FR").format(p.price)} FCFA</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-neutral-200" />

              {/* Sélecteur de Catégorie Dropdown Sur-Mesure */}
              <div className="relative inline-flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                    setIsSortMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full bg-white hover:bg-neutral-50 px-4 py-2 border border-neutral-200/80 transition-all shadow-xs text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--laiton)]/30"
                >
                  <span className="truncate max-w-[150px]">
                    {activeCategorySlug
                      ? categories.find((c) => c.slug === activeCategorySlug)?.name || "Catégorie"
                      : "Toutes les catégories"}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-[var(--laiton)] shrink-0 transition-transform duration-200 ${isCategoryMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu Flottant Fond Blanc Raffiné */}
                {isCategoryMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsCategoryMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 z-30 min-w-[220px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_10px_38px_-10px_rgba(14,11,9,0.15)] border border-[var(--laiton)]/20 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCategory(null);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          activeCategorySlug === null
                            ? "bg-white text-[var(--laiton,#B9793E)] font-extrabold"
                            : "bg-white text-[var(--obsidienne)] hover:bg-neutral-50"
                        }`}
                      >
                        <span>Toutes les catégories</span>
                        {activeCategorySlug === null && <Check className="h-3.5 w-3.5 text-[var(--laiton)]" />}
                      </button>

                      {categories.length > 0 && <div className="my-1 h-px bg-neutral-100" />}

                      {categories.map((cat) => {
                        const isSelected = activeCategorySlug === cat.slug;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              handleSelectCategory(cat.slug);
                              setIsCategoryMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                              isSelected
                                ? "bg-white text-[var(--laiton,#B9793E)] font-extrabold"
                                : "bg-white text-[var(--obsidienne)] hover:bg-neutral-50"
                            }`}
                          >
                            <span>{cat.name}</span>
                            <span className="flex items-center gap-1.5">
                              <span className="text-[10px] opacity-60 font-mono">({cat.productCount})</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[var(--laiton)]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="h-6 w-px bg-neutral-200" />

              {/* Sélecteur de Tri & Toggle Grille */}
              <div className="flex items-center gap-3 pr-1">
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSortMenuOpen(!isSortMenuOpen);
                      setIsCategoryMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-full bg-white hover:bg-neutral-50 px-4 py-2 border border-neutral-200/80 transition-all shadow-xs text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--laiton)]/30"
                  >
                    <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-[var(--laiton)] shrink-0" />
                    <span>
                      {sortBy === "recent"
                        ? "Nouveautés"
                        : sortBy === "price-asc"
                        ? "Prix croissant"
                        : "Prix décroissant"}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-[var(--laiton)] shrink-0 transition-transform duration-200 ${isSortMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu Flottant Fond Blanc Raffiné */}
                  {isSortMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsSortMenuOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 z-30 min-w-[190px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_10px_38px_-10px_rgba(14,11,9,0.15)] border border-[var(--laiton)]/20 animate-in fade-in zoom-in-95 duration-150">
                        {[
                          { id: "recent", label: "Nouveautés" },
                          { id: "price-asc", label: "Prix croissant" },
                          { id: "price-desc", label: "Prix décroissant" },
                        ].map((opt) => {
                          const isSelected = sortBy === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.id as SortOption);
                                setIsSortMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                                isSelected
                                  ? "bg-white text-[var(--laiton,#B9793E)] font-extrabold"
                                  : "bg-white text-[var(--obsidienne)] hover:bg-neutral-50"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[var(--laiton)]" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <ViewToggle view={viewMode} onViewChange={setViewMode} />
              </div>
            </div>

          </div>
        </section>

        {/* ================= SECTION PRODUITS ================= */}
        <section className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto">
            {/* Grille des produits full width */}
            {filteredProducts.length === 0 && !isLoading ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : (
              <ProductGrid
                products={filteredProducts}
                isLoading={isLoading}
                viewMode={viewMode}
              />
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <div className="mt-16">
          <NewsletterSection />
        </div>
      </main>

      {/* Filtres Mobile Drawer */}
      <ProductFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        isOpen={isFiltersOpen}
        onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
        isMobile={true}
      />

      <Footer />
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[var(--porcelaine)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--laiton)] border-t-transparent mx-auto mb-4"></div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--laiton)]">
              Chargement de la boutique...
            </p>
          </div>
        </div>
      }
    >
      <BoutiquePageContent />
    </Suspense>
  );
}
