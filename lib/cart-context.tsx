/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   Contexte panier — lib/cart-context.tsx

   Le panier vit côté client (localStorage) : on ne stocke QUE
   des ids + quantités. Les prix sont TOUJOURS relus depuis la
   base à l'affichage et au checkout — jamais stockés ici.

   Installation : envelopper le layout public :
     <CartProvider>{children}</CartProvider>

   Usage :
     const { items, count, addItem, removeItem, setQuantity, clear } = useCart();
   ============================================================ */

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  /** Nombre total d'articles (somme des quantités) — pour le badge navbar */
  count: number;
  /** true une fois le localStorage lu (évite un badge à 0 qui "saute") */
  isReady: boolean;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "mamou-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Lecture initiale — uniquement côté client, après l'hydratation
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (i): i is CartItem =>
                typeof i?.productId === "string" && Number.isInteger(i?.quantity) && i.quantity > 0
            )
          );
        }
      }
    } catch {
      /* localStorage corrompu ou indisponible : panier vide */
    }
    setIsReady(true);
  }, []);

  // Persistance à chaque changement (après la lecture initiale)
  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota plein : le panier reste en mémoire pour la session */
    }
  }, [items, isReady]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, count, isReady, addItem, removeItem, setQuantity, clear }),
    [items, count, isReady, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  }
  return ctx;
}