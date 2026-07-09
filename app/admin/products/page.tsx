"use client";

import { useState, useEffect } from "react";
import { ProductsHeader, ProductSort } from "@/components/admin/products/products-header";
import { ProductsList } from "@/components/admin/products/products-list";
import type { ProductListItem } from "@/components/admin/products/products-list";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ProductSort>("recent");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.products) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.categoryId === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case "recent":
      default:
        // Already sorted by created_at desc from API
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, sortBy, products]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)] border-t-transparent" />
            <p className="text-sm text-[var(--text-dark)]/60">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <ProductsHeader
        totalCount={filteredProducts.length}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortBy}
      />
      <ProductsList products={filteredProducts} />
    </div>
  );
}
