"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { BoutiqueHero } from "@/components/boutique/BoutiqueHero";
import { CollectionCards } from "@/components/boutique/CollectionCards";
import { ProductFilters, type FilterOptions } from "@/components/boutique/ProductFilters";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { ViewToggle, type ViewMode } from "@/components/boutique/ViewToggle";
import { EmptyState } from "@/components/boutique/EmptyState";
import { NewsletterSection } from "@/components/NewsletterSection";
import type { PublicProductCard } from "@/components/home/ProductCard";
import { ProductSection } from "@/components/home/ProductSection";

function BoutiquePageContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<PublicProductCard[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PublicProductCard[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Sections pour l'affichage premium
  const promoProducts = allProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);
  const newProducts = allProducts.slice(0, 8); // Les 8 premiers (plus récents)
  const featuredProducts = allProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 8);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();

        if (categoriesData.categories) {
          setCollections(categoriesData.categories);
          setCategories(categoriesData.categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            productCount: cat.productCount,
          })));
        }

        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();

        if (productsData.products) {
          // L'API retourne déjà les produits au bon format avec imageUrl construit
          const transformedProducts = productsData.products.map((product: any) => ({
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

          setAllProducts(transformedProducts);

          // Appliquer les filtres depuis les query params
          applyUrlFilters(transformedProducts, categoriesData.categories);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Appliquer les filtres depuis l'URL (search et categorie)
  const applyUrlFilters = useCallback((products: PublicProductCard[], cats: any[]) => {
    let filtered = [...products];

    // Filtre par recherche
    const searchQuery = searchParams?.get('search');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie (slug)
    const categorySlug = searchParams?.get('categorie');
    if (categorySlug && cats) {
      const category = cats.find((c: any) => c.slug === categorySlug);
      if (category) {
        filtered = filtered.filter(p => p.categoryName === category.name);
      }
    }

    setFilteredProducts(filtered);
  }, [searchParams]);

  // Réappliquer les filtres URL quand les params changent
  useEffect(() => {
    if (allProducts.length > 0) {
      const fetchedCategories = categories.length > 0 ? categories : collections;
      applyUrlFilters(allProducts, fetchedCategories);
    }
  }, [searchParams, allProducts, categories, collections]);

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...allProducts];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryName === categories.find(c => c.id === filters.category)?.name);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilteredProducts(allProducts);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 lg:pt-0">
        {/* Hero Banner - Desktop only */}
        <BoutiqueHero />

        {/* Collection Cards - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <CollectionCards collections={collections} />
        </div>

        {/* Section 1 : En Promotion (si disponibles) */}
        {promoProducts.length > 0 && (
          <ProductSection
            eyebrow="Offres spéciales"
            title="En Promotion"
            products={promoProducts}
            mobileLayout="carousel"
          />
        )}

        {/* Section 2 : Nouveautés */}
        {newProducts.length > 0 && (
          <ProductSection
            eyebrow="Fraîchement arrivés"
            title="Nouveautés"
            products={newProducts}
            mobileLayout="carousel"
          />
        )}

        {/* Section 3 : Tous les Bijoux avec Filtres */}
        <section className="py-12 px-6 lg:px-8 bg-[var(--ivory)]/20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header avec View Toggle */}
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
                  Notre Collection
                </p>
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-dark)] lg:text-2xl mb-2">
                  Tous nos Bijoux
                </h2>
                <p className="text-sm text-[var(--text-dark)]/60">
                  {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {/* View Toggle */}
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>

            {/* Filters + Grid/List */}
            <div className="flex gap-8">
              {/* Filters Sidebar - Desktop only */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <ProductFilters
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  isMobile={false}
                />
              </div>

              {/* Product Grid/List or Empty State */}
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
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Mobile Filters - Mobile only */}
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
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
          <p className="text-[var(--text-dark)]">Chargement...</p>
        </div>
      </div>
    }>
      <BoutiquePageContent />
    </Suspense>
  );
}
