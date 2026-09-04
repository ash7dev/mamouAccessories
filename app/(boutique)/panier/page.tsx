/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export default function PanierPage() {
  const { items, count, setQuantity, removeItem, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all cart products details
  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/cart/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: items.map(i => i.productId) }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          console.error('Failed to fetch cart products:', res.status);
        }
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartProducts();
  }, [items]);

  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F1ECE3)] text-[var(--obsidienne,#0E0B09)] flex flex-col font-sans selection:bg-[var(--laiton,#B9793E)] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header section */}
        <div className="mb-8 border-b border-[var(--laiton,#B9793E)]/25 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-white/60 px-3.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] mb-2 shadow-2xs backdrop-blur-md">
                <Sparkles className="h-3 w-3 stroke-[2]" />
                Mamou's Accessories
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[var(--obsidienne,#0E0B09)]">
                Votre Panier de Bijoux
              </h1>
            </div>

            {count > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Vider le panier</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty state */}
        {count === 0 ? (
          <div className="my-12 flex flex-col items-center rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-10 sm:p-16 text-center shadow-xs">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton,#B9793E)]/25 shadow-inner">
              <ShoppingBag className="h-10 w-10 stroke-[1.25]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--obsidienne,#0E0B09)] mb-2">
              Votre panier est vide
            </h2>
            <p className="max-w-md text-xs sm:text-sm text-[var(--obsidienne,#0E0B09)]/65 leading-relaxed mb-8">
              Explorez notre catalogue exclusif de bijoux et trouvez la pièce qui sublimera votre tenue.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-lg transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-95"
            >
              <span>Découvrir la Boutique</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Col 1 & 2 : Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[var(--laiton,#B9793E)]/15 pb-4 mb-4 text-xs font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
                  <span>Articles ({count})</span>
                  <span>Prix Total</span>
                </div>

                <div className="divide-y divide-[var(--laiton,#B9793E)]/15">
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    const firstImgObj = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : null;
                    const rawImage =
                      typeof firstImgObj === 'string'
                        ? firstImgObj
                        : firstImgObj?.cloudinary_public_id ||
                          firstImgObj?.url ||
                          firstImgObj?.image_url ||
                          product?.image_url ||
                          product?.imageUrl ||
                          product?.cloudinary_public_id ||
                          null;

                    const imageUrl = resolveProductImageUrl(rawImage);
                    const itemPrice = product?.price || 0;
                    const itemTotal = itemPrice * item.quantity;
                    const maxStock = typeof product?.stock === 'number' ? product.stock : 99;
                    const isMinQuantityReached = item.quantity <= 1;
                    const isMaxStockReached = item.quantity >= maxStock;
                    const isStockOnlyOne = maxStock <= 1;

                    return (
                      <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 first:pt-0">
                        {/* Image + Description */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/20 shadow-2xs">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product?.name || "Bijou"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-2xl text-[var(--laiton,#B9793E)]">
                                💎
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/produit/${product?.slug || item.productId}`}
                              className="font-serif text-base font-semibold text-[var(--obsidienne,#0E0B09)] hover:text-[var(--laiton,#B9793E)] transition-colors truncate block"
                            >
                              {product?.name || "Bijou Mamou's"}
                            </Link>
                            <p className="font-mono text-xs text-[var(--obsidienne,#0E0B09)]/60 tabular-nums mt-0.5">
                              {formatFCFA(itemPrice)} FCFA l&apos;unité
                            </p>
                            {isStockOnlyOne && (
                              <span className="inline-block text-[9px] font-sans font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1">
                                Dernier exemplaire disponible (1 en stock)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantité & Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[var(--laiton,#B9793E)]/10 pt-3 sm:pt-0">
                          {/* Quantité +/- */}
                          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--laiton,#B9793E)]/25 bg-[var(--porcelaine,#F1ECE3)]/60 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              disabled={isMinQuantityReached}
                              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                                isMinQuantityReached
                                  ? "opacity-30 cursor-not-allowed text-neutral-400"
                                  : "text-[var(--obsidienne,#0E0B09)] bg-white hover:bg-[var(--laiton,#B9793E)]/20"
                              }`}
                              aria-label="Moins"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="min-w-[2.5ch] text-center font-mono text-sm font-bold text-[var(--obsidienne,#0E0B09)]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              disabled={isMaxStockReached || isStockOnlyOne}
                              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                                isMaxStockReached || isStockOnlyOne
                                  ? "opacity-30 cursor-not-allowed text-neutral-400"
                                  : "text-[var(--obsidienne,#0E0B09)] bg-white hover:bg-[var(--laiton,#B9793E)]/20"
                              }`}
                              aria-label="Plus"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Total item & delete */}
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                              {formatFCFA(itemTotal)} <span className="text-[10px] font-sans font-normal opacity-60">FCFA</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Supprimer du panier"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-xs text-[var(--obsidienne,#0E0B09)]/60">
                <Link href="/boutique" className="inline-flex items-center gap-1.5 font-semibold text-[var(--laiton,#B9793E)] hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" /> Continuer mes achats
                </Link>
              </div>
            </div>

            {/* Col 3 : Résumé de la commande */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/30 bg-white p-6 shadow-md space-y-5">
                <h3 className="font-serif text-xl font-semibold text-[var(--obsidienne,#0E0B09)] border-b border-[var(--laiton,#B9793E)]/20 pb-3">
                  Résumé de la Commande
                </h3>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between text-[var(--obsidienne,#0E0B09)]/70">
                    <span>Sous-total articles</span>
                    <span className="font-mono font-medium tabular-nums text-[var(--obsidienne,#0E0B09)]">{formatFCFA(subtotal)} FCFA</span>
                  </div>

                  <div className="flex justify-between text-[var(--obsidienne,#0E0B09)]/70">
                    <span>Livraison (Dakar & Régions)</span>
                    <span className="font-mono font-medium text-emerald-700">Calculée à la commande</span>
                  </div>

                  <div className="pt-3 border-t border-[var(--laiton,#B9793E)]/20 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">Total à régler</span>
                    <span className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                      {formatFCFA(subtotal)} <span className="text-xs font-sans font-normal opacity-60">FCFA</span>
                    </span>
                  </div>
                </div>

                <Link
                  href="/commande"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--obsidienne,#0E0B09)] py-4 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-lg transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-[0.98]"
                >
                  <span>Passer la Commande</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Badges de réassurance */}
                <div className="pt-4 border-t border-[var(--laiton,#B9793E)]/15 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-[var(--obsidienne,#0E0B09)]/75">
                    <ShieldCheck className="h-4 w-4 text-[var(--laiton,#B9793E)] shrink-0" />
                    <span>Paiement sécurisé via Wave & Espèces à la livraison</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[var(--obsidienne,#0E0B09)]/75">
                    <Truck className="h-4 w-4 text-[var(--laiton,#B9793E)] shrink-0" />
                    <span>Livraison rapide à Dakar et partout au Sénégal</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[var(--obsidienne,#0E0B09)]/75">
                    <Lock className="h-4 w-4 text-[var(--laiton,#B9793E)] shrink-0" />
                    <span>Bijoux garantis et service client réactif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
