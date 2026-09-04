"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, count, setQuantity, removeItem, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all cart products at once
  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setProducts([]);
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
      }
    }
    fetchCartProducts();
  }, [items]);

  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggleCart}
        className="relative flex items-center justify-center rounded-full p-2.5 text-[var(--obsidienne,#0E0B09)] transition-all hover:bg-[var(--laiton,#B9793E)]/15 active:scale-95"
        aria-label="Panier"
      >
        <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 stroke-[1.75]" />
        {mounted && count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)] text-[10px] font-bold text-white shadow-md ring-2 ring-white font-mono">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne,#0E0B09)] px-6 py-5 text-[var(--porcelaine,#F1ECE3)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--laiton,#B9793E)]/20 border border-[var(--laiton,#B9793E)]/40 text-[var(--laiton-clair,#D9AE78)]">
                    <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                      Votre Panier
                    </h2>
                    <p className="text-xs font-sans text-[var(--laiton-clair,#D9AE78)]">
                      {count} article{count !== 1 ? 's' : ''} sélectionné{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-hidden bg-[var(--porcelaine,#F1ECE3)]/30">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm border border-[var(--laiton,#B9793E)]/20 text-[var(--laiton,#B9793E)]">
                      <ShoppingBag className="h-10 w-10 stroke-[1.25]" />
                    </div>
                    <h3 className="font-serif mb-2 text-xl font-normal text-[var(--obsidienne,#0E0B09)]">
                      Votre panier est vide
                    </h3>
                    <p className="mb-6 max-w-xs text-xs font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/60">
                      Explorez notre collection Haute Joaillerie et découvrez des créations uniques.
                    </p>
                    <Link
                      href="/boutique"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-md transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)]"
                    >
                      Découvrir la boutique
                    </Link>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto px-6 py-5 space-y-3.5 scrollbar-none">
                    {items.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <CartItem
                          key={item.productId}
                          item={item}
                          product={product}
                          onUpdate={setQuantity}
                          onRemove={removeItem}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <CartFooter onClose={() => setIsOpen(false)} onClear={clear} items={items} products={products} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Cart Footer Component
function CartFooter({ onClose, onClear, items, products }: { onClose: () => void; onClear: () => void; items: any[]; products: any[] }) {
  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="border-t border-[var(--laiton,#B9793E)]/20 bg-white px-6 py-5 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">Total de votre commande</span>
        <span className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
          {formatFCFA(total)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
        </span>
      </div>

      <Link
        href="/commande"
        onClick={onClose}
        className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--obsidienne,#0E0B09)] py-4 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-lg transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-[0.98]"
      >
        <span>Passer la commande</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      <button
        type="button"
        onClick={() => {
          onClear();
          onClose();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Vider le panier
      </button>
    </div>
  );
}

// Cart Item Component
function CartItem({ item, product, onUpdate, onRemove }: { item: any; product: any | null; onUpdate: (id: string, qty: number) => void; onRemove: (id: string) => void }) {
  if (!product) {
    return (
      <div className="flex gap-3 rounded-2xl bg-white p-3.5 border border-[var(--laiton,#B9793E)]/15 animate-pulse">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-neutral-200" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-3/4 rounded bg-neutral-200" />
          <div className="h-3 w-1/2 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  const firstImgObj = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
  const rawImage =
    typeof firstImgObj === 'string'
      ? firstImgObj
      : firstImgObj?.cloudinary_public_id ||
        firstImgObj?.url ||
        firstImgObj?.image_url ||
        product.image_url ||
        product.imageUrl ||
        product.cloudinary_public_id ||
        null;

  const imageUrl = resolveProductImageUrl(rawImage);
  const subtotal = product.price * item.quantity;

  const maxStock = typeof product.stock === 'number' ? product.stock : 99;
  const isMinQuantityReached = item.quantity <= 1;
  const isMaxStockReached = item.quantity >= maxStock;
  const isStockOnlyOne = maxStock <= 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex gap-3.5 rounded-2xl bg-white p-3.5 shadow-2xs border border-[var(--laiton,#B9793E)]/20"
    >
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/20">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xl text-[var(--laiton,#B9793E)]">
            💎
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-xs font-bold text-[var(--obsidienne,#0E0B09)] truncate">
              {product.name}
            </h3>
            {isStockOnlyOne && (
              <span className="text-[9px] font-sans font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
                1 dispo
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-[var(--obsidienne,#0E0B09)]/60 tabular-nums mt-0.5">
            {formatFCFA(product.price)} FCFA
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--laiton,#B9793E)]/25 bg-[var(--porcelaine,#F1ECE3)]/60 px-1 py-0.5">
            <button
              type="button"
              onClick={() => onUpdate(item.productId, Math.max(1, item.quantity - 1))}
              disabled={isMinQuantityReached}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                isMinQuantityReached
                  ? "opacity-30 cursor-not-allowed text-neutral-400"
                  : "text-[var(--obsidienne,#0E0B09)] hover:bg-white"
              }`}
              aria-label="Diminuer"
            >
              <Minus className="h-3 w-3" />
            </button>

            <span className="min-w-[2ch] text-center font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)]">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdate(item.productId, item.quantity + 1)}
              disabled={isMaxStockReached || isStockOnlyOne}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                isMaxStockReached || isStockOnlyOne
                  ? "opacity-30 cursor-not-allowed text-neutral-400"
                  : "text-[var(--obsidienne,#0E0B09)] hover:bg-white"
              }`}
              aria-label="Augmenter"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Subtotal & Delete */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
              {formatFCFA(subtotal)} <span className="text-[9px] font-sans font-normal opacity-60">FCFA</span>
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              aria-label="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
