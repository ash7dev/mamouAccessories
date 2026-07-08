"use client";

import { useState, useEffect, useRef } from "react";

// Helper pour construire les URLs Cloudinary (client-safe)
function buildImageUrl(publicId: string): string | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return null;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/* ============================================================
   ProductSelector - Sélecteur de produits avec recherche
   ============================================================ */

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryName: string;
  imageUrl: string | null;
}

interface ProductSelectorProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
}

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function ProductSelector({ selectedProducts, onProductsChange }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Fermer le dropdown quand on clique dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Recherche avec debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Annuler la recherche précédente
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Lancer une nouvelle recherche après 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
        const data = await response.json();

        if (data.products) {
          // Filtrer les produits déjà sélectionnés
          const filtered = data.products.filter(
            (p: Product) => !selectedProducts.some((sp) => sp.id === p.id)
          );
          setSearchResults(filtered);
          setShowDropdown(filtered.length > 0);
        }
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedProducts]);

  const handleAddProduct = (product: Product) => {
    onProductsChange([...selectedProducts, product]);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div>
      {/* Barre de recherche */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            placeholder="Rechercher un produit..."
            className="w-full rounded-full border border-[var(--gold)]/25 bg-white px-5 py-3.5 pl-12 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-colors"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold-dark)]" />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            </div>
          )}
        </div>

        {/* Dropdown des résultats */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-[var(--gold)]/20 bg-white shadow-[0_16px_40px_-12px_rgba(43,33,24,0.28)] max-h-80 overflow-y-auto">
            {searchResults.map((product) => {
              const imageUrl = product.imageUrl ? buildImageUrl(product.imageUrl) : null;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--ivory)]/50 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  {/* Miniature */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--ivory)]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gold)]/40 text-xl">
                        ◆
                      </div>
                    )}
                  </div>

                  {/* Info produit */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-dark)]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--text-dark)]/50">
                      {product.categoryName} • {new Intl.NumberFormat("fr-FR").format(product.price)} FCFA
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="shrink-0 text-xs text-[var(--text-dark)]/50">
                    Stock: {product.stock}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Produits sélectionnés */}
      {selectedProducts.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-[var(--text-dark)]">
            Produits sélectionnés ({selectedProducts.length})
          </p>
          <div className="space-y-2">
            {selectedProducts.map((product) => {
              const imageUrl = product.imageUrl ? buildImageUrl(product.imageUrl) : null;

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--gold)]/15 bg-[var(--ivory)]/30 px-4 py-3"
                >
                  {/* Miniature */}
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gold)]/40">
                        ◆
                      </div>
                    )}
                  </div>

                  {/* Info produit */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-dark)]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--text-dark)]/50">
                      {product.categoryName}
                    </p>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-dark)]/50 transition-colors hover:bg-red-500/10 hover:text-red-600"
                    title="Retirer ce produit"
                  >
                    <XIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
