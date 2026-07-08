"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
  
  if (!publicId) {
    console.error('No publicId provided to buildCloudinaryImageUrl');
    return null;
  }
  
  // Nettoyer le public_id s'il contient déjà le chemin complet
  let cleanId = publicId;
  if (publicId.startsWith('products/')) {
    cleanId = publicId; // Garder le chemin complet
  }
  
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${cleanId}`;
  console.log('Building image URL:', url, 'from publicId:', publicId);
  return url;
}

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
        console.log('Fetching cart products for items:', items);
        const res = await fetch('/api/cart/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: items.map(i => i.productId) }),
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Cart products fetched:', data.products);
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

  if (!mounted) {
    return (
      <button
        className="relative rounded-full p-2 text-foreground transition-colors hover:bg-secondary hover:text-primary"
        aria-label="Panier"
      >
        <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative rounded-full p-2 text-foreground transition-colors hover:bg-secondary hover:text-primary"
        aria-label="Panier"
      >
        <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[#241B14]">
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[51] flex w-full max-w-md flex-col bg-[var(--ivory)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-white border-b border-[var(--gold)]/20 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/10">
                    <ShoppingBag className="h-5 w-5 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-dark)]">Votre Panier</h2>
                    <p className="text-xs text-[var(--text-dark)]/60">
                      {count} article{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-dark)]/60 transition-colors hover:bg-[var(--ivory)] hover:text-[var(--text-dark)]"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-hidden">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                      <ShoppingBag className="h-10 w-10 text-[var(--gold)]/30" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-[var(--text-dark)]">Votre panier est vide</h3>
                    <p className="mb-6 text-sm text-[var(--text-dark)]/60">
                      Découvrez nos bijoux d'exception
                    </p>
                    <Link
                      href="/boutique"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] transition-all hover:brightness-110"
                    >
                      Découvrir la boutique
                    </Link>
                  </div>
                ) : (
                  <div
                    className="h-full overflow-y-auto px-6 py-4"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    } as React.CSSProperties}
                  >
                    <div className="space-y-3">
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
    <div className="border-t border-[var(--gold)]/20 bg-white px-6 py-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-dark)]/70">Total</span>
        <span className="text-2xl font-bold text-[var(--text-dark)]">
          {formatFCFA(total)} <span className="text-base font-normal text-[var(--text-dark)]/60">FCFA</span>
        </span>
      </div>

      <Link
        href="/commande"
        onClick={onClose}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] py-4 text-base font-bold text-[#241B14] shadow-lg shadow-[var(--gold)]/20 transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Passer la commande
      </Link>

      <button
        onClick={() => {
          onClear();
          onClose();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--gold)]/30 bg-white py-3 text-sm font-medium text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)]"
      >
        <Trash2 className="h-4 w-4" />
        Vider le panier
      </button>
    </div>
  );
}

// Cart Item Component
function CartItem({ item, product, onUpdate, onRemove }: { item: any; product: any | null; onUpdate: (id: string, qty: number) => void; onRemove: (id: string) => void }) {
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (product) {
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        console.log('Fetching product:', item.productId);
        const res = await fetch(`/api/products/${item.productId}`);
        console.log('Response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Product data:', data);
          // This shouldn't happen with the new architecture, but kept as fallback
        } else {
          console.error('Failed to fetch product:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [item.productId, product]);

  if (loading) {
    return (
      <div className="flex gap-3 rounded-2xl bg-white p-3 animate-pulse">
        <div className="h-24 w-24 shrink-0 rounded-xl bg-[var(--ivory)]" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-3/4 rounded bg-[var(--ivory)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--ivory)]" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.images?.[0]?.cloudinary_public_id
    ? buildCloudinaryImageUrl(product.images[0].cloudinary_public_id)
    : null;

  const subtotal = product.price * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
    >
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--ivory)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-[var(--gold)]/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        {/* Product Info */}
        <div>
          <h3 className="mb-0.5 text-sm font-semibold text-[var(--text-dark)] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[var(--text-dark)]/50">
            {formatFCFA(product.price)} FCFA × {item.quantity}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-1 rounded-full bg-[var(--ivory)] px-1 py-1">
            <button
              onClick={() => onUpdate(item.productId, Math.max(1, item.quantity - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-dark)]/60 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
              aria-label="Diminuer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[2ch] text-center text-xs font-bold text-[var(--text-dark)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.productId, item.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-dark)]/60 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
              aria-label="Augmenter"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price & Delete */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--gold-dark)]">
              {formatFCFA(subtotal)}
            </span>
            <button
              onClick={() => onRemove(item.productId)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-dark)]/40 transition-colors hover:bg-red-50 hover:text-red-600"
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
