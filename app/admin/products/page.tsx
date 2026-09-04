"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductsHeader } from "@/components/admin/products/products-header";
import type { ProductSort, StatusFilter, ViewMode } from "@/components/admin/products/products-header";
import { ProductsList } from "@/components/admin/products/products-list";
import type { ProductListItem } from "@/components/admin/products/products-list";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<ProductSort>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Calcul des compteurs KPI pour l'Executive Bar
  const stats = useMemo(() => {
    const totalCount = products.length;
    const activeCount = products.filter((p) => p.isActive).length;
    const lowStockCount = products.filter((p) => p.stock <= 3).length;
    const featuredCount = products.filter((p) => p.isFeatured).length;

    return { totalCount, activeCount, lowStockCount, featuredCount };
  }, [products]);

  // Filtres combinés & Tri
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Recherche par mot-clé
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Filtre par catégorie
    if (categoryFilter) {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Filtre par statut rapide
    switch (statusFilter) {
      case "active":
        result = result.filter((p) => p.isActive);
        break;
      case "inactive":
        result = result.filter((p) => !p.isActive);
        break;
      case "low-stock":
        result = result.filter((p) => p.stock <= 3);
        break;
      case "featured":
        result = result.filter((p) => p.isFeatured);
        break;
      case "all":
      default:
        break;
    }

    // Tri
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "sales-desc":
        result.sort((a, b) => b.unitsSold - a.unitsSold);
        break;
      case "recent":
      default:
        break;
    }

    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Callback de mise à jour d'un produit dans la liste
  const handleProductUpdate = (updatedProduct: ProductListItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  // Callback de suppression d'un produit
  const handleProductDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-44 w-full animate-pulse rounded-3xl bg-neutral-900/10 border border-[var(--laiton)]/20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-3xl bg-white border border-neutral-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <ProductsHeader
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        lowStockCount={stats.lowStockCount}
        featuredCount={stats.featuredCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sort={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ProductsList
        products={filteredProducts}
        viewMode={viewMode}
        onProductUpdate={handleProductUpdate}
        onProductDelete={handleProductDelete}
      />
    </div>
  );
}
