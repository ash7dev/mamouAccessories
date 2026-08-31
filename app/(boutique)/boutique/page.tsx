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
import { ProductSection } from "@/components/home/ProductSection";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

type SortOption = "recent" | "price-asc" | "price-desc";

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
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(searchParams?.get("categorie") || null);

  // Products in promotion
  const promoProducts = allProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);

  // Load products and categories
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
            categoryName: product.categoryName,
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

  // Filter and sort products when params, category, search or sort change
  const applyFiltersAndSort = useCallback(
    (products: PublicProductCard[]) => {
      let result = [...products];

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
        );
      }

      // 2. Category Pill / Query Param
      if (activeCategorySlug && categories.length > 0) {
        const selectedCat = categories.find((c) => c.slug === activeCategorySlug);
        if (selectedCat) {
          result = result.filter((p) => p.categoryName.toLowerCase() === selectedCat.name.toLowerCase());
        }
      }

      // 3. Sort
      if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      }
      // "recent" keeps API default order

      setFilteredProducts(result);
    },
    [searchQuery, activeCategorySlug, categories, sortBy]
  );

  // Re-apply whenever dependencies change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersAndSort(allProducts);
    }
  }, [allProducts, applyFiltersAndSort]);

  // Sync category slug from URL searchParams
  useEffect(() => {
    const urlCat = searchParams?.get("categorie");
    if (urlCat !== activeCategorySlug) {
      setActiveCategorySlug(urlCat || null);
    }
    const urlSearch = searchParams?.get("search");
    if (urlSearch !== undefined && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch || "");
    }
  }, [searchParams]);

  // Category pill selection handler
  const handleSelectCategory = (slug: string | null) => {
    setActiveCategorySlug(slug);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (slug) {
      params.set("categorie", slug);
    } else {
      params.delete("categorie");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filter sidebar change handler
  const handleFilterChange = (filters: FilterOptions) => {
    let result = [...allProducts];

    if (filters.category) {
      const selectedCat = categories.find((c) => c.id === filters.category);
      if (selectedCat) {
        result = result.filter((p) => p.categoryName === selectedCat.name);
      }
    } else if (activeCategorySlug) {
      const selectedCat = categories.find((c) => c.slug === activeCategorySlug);
      if (selectedCat) {
        result = result.filter((p) => p.categoryName.toLowerCase() === selectedCat.name.toLowerCase());
      }
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (filters.featured) {
      result = result.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    setFilteredProducts(result);
  };

  const clearFilters = () => {
    setActiveCategorySlug(null);
    setSearchQuery("");
    setSortBy("recent");
    router.push(pathname, { scroll: false });
    setFilteredProducts(allProducts);
  };

  const selectedCategoryName = activeCategorySlug
    ? categories.find((c) => c.slug === activeCategorySlug)?.name
    : null;

  return (
    <div className="min-h-screen bg-[var(--ivory)] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 lg:pt-28 pb-16">
        {/* ================= BARRE EN-TÊTE ÉLÉGANTE ================= */}
        <section className="px-5 pb-6 lg:px-8 lg:pb-8 border-b border-[var(--text-dark)]/[0.06]">
          <div className="mx-auto max-w-7xl">

            {/* Titre & Compteur */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[var(--gold-dark)] uppercase">
                  Catalogue Privé
                </span>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-dark)] lg:text-4xl mt-1">
                  {selectedCategoryName || "Tous nos bijoux"}
                </h1>
              </div>

              <p className="text-xs text-[var(--text-dark)]/50 tabular-nums">
                {filteredProducts.length} pièce{filteredProducts.length > 1 ? "s" : ""} disponible{filteredProducts.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* BARRE DE CATÉGORIES EN PILULES (1-Click Filter) */}
            <div className="scrollbar-none -mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
              <button
                onClick={() => handleSelectCategory(null)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                  activeCategorySlug === null
                    ? "bg-[var(--text-dark)] text-[#F4EFE6] shadow-sm"
                    : "bg-white/80 text-[var(--text-dark)]/70 hover:bg-white hover:text-[var(--text-dark)] border border-[var(--text-dark)]/[0.08]"
                }`}
              >
                Tous ({allProducts.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                    activeCategorySlug === cat.slug
                      ? "bg-[var(--text-dark)] text-[#F4EFE6] shadow-sm"
                      : "bg-white/80 text-[var(--text-dark)]/70 hover:bg-white hover:text-[var(--text-dark)] border border-[var(--text-dark)]/[0.08]"
                  }`}
                >
                  {cat.name} ({cat.productCount})
                </button>
              ))}
            </div>

            {/* BARRE D'ACTIONS : RECHERCHE + TRI + MODE D'AFFICHAGE */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--text-dark)]/[0.06]">
              
              {/* Barre de Recherche rapide */}
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold-dark)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un bijou..."
                  className="w-full rounded-full border border-[var(--text-dark)]/10 bg-white/80 pl-10 pr-9 py-2 text-xs text-[var(--text-dark)] placeholder-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:bg-white focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dark)]/40 hover:text-[var(--text-dark)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Tri & Affichage */}
              <div className="flex items-center gap-3">
                {/* Sélecteur de Tri */}
                <div className="relative inline-flex items-center rounded-full border border-[var(--text-dark)]/10 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[var(--text-dark)]">
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-[var(--gold-dark)]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent pr-2 focus:outline-none cursor-pointer"
                  >
                    <option value="recent">Nouveautés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>

                {/* Toggle Grille / Liste */}
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
              </div>
            </div>

          </div>
        </section>

        {/* ================= SECTION OFFRES EN PROMOTION (Inline) ================= */}
        {!activeCategorySlug && !searchQuery && promoProducts.length > 0 && (
          <div className="pt-6">
            <ProductSection
              eyebrow="Offres exclusives"
              title="En Promotion"
              products={promoProducts}
              mobileLayout="carousel"
            />
          </div>
        )}

        {/* ================= SECTION PRODUITS + FILTRES ================= */}
        <section className="px-5 pt-8 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-8">

            {/* Sidebar Filtres — Desktop */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28">
                <ProductFilters
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  isMobile={false}
                />
              </div>
            </div>

            {/* Grille des produits */}
            <div className="flex-1">
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
        <div className="flex h-screen items-center justify-center bg-[var(--ivory)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--gold)] border-t-transparent mx-auto mb-4"></div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--gold-dark)]">
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
