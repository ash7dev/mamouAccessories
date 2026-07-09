/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingCart, Check, MessageCircle, Plus, Minus } from "lucide-react";

/* ============================================================
   Fiche produit publique — /produit/[slug]

   Boutons :
   - "Ajouter au panier" → ajoute via useCart(), reste sur la page
     (feedback "Ajouté ✓"), le badge navbar s'incrémente
   - "Acheter maintenant" → ajoute PUIS redirige vers /commande
   - "Commander sur WhatsApp" → canal parallèle, lien pré-rempli

   Responsivité :
   - Mobile  : galerie pleine largeur, barre d'action FIXE en bas
   - Desktop : galerie + infos en 2 colonnes, actions dans le flux
   ============================================================ */

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageOrientation: "portrait" | "landscape";
  images: { id: string; url: string }[];
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);


/* ---------- Composant ---------- */

// TODO: à remplacer par le numéro WhatsApp de la boutique (table settings)
const WHATSAPP_NUMBER = "221771234567";

export function ProductDetailPublic({ product }: { product: PublicProduct }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const fallbackImage = "/placeholder-product.svg";

  const isOut = product.stock === 0;
  const isLow = product.stock > 0 && product.stock <= 3;
  const maxReached = quantity >= product.stock;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const aspect = product.imageOrientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";

  const handleAdd = () => {
    if (isOut) return;
    addItem(product.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOut) return;
    addItem(product.id, quantity);
    router.push("/commande");
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour 🌸 Je suis intéressée par « ${product.name} » (${formatFCFA(product.price)} FCFA). Est-il disponible ?`
  )}`;

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  const getImageSrc = (imageId: string, url: string) => (imageErrors[imageId] ? fallbackImage : url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-6 pb-32 pt-24 lg:px-8 lg:pb-16 lg:pt-32"
    >
      {/* Fil d'ariane */}
      <Link
        href="/boutique"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-dark)]/50 transition-colors hover:text-[var(--gold-dark)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour à la boutique
      </Link>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* ===================== Galerie ===================== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className={`relative ${aspect} overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--ivory)]/50 to-[var(--gold)]/5 shadow-[0_-8px_24px_-12px_rgba(185,138,68,0.15)]`}>
            <AnimatePresence mode="wait">
              {product.images[activeImage] ? (
                <motion.img
                  key={activeImage}
                  src={getImageSrc(product.images[activeImage].id, product.images[activeImage].url)}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full object-cover"
                  onError={() => handleImageError(product.images[activeImage].id)}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full items-center justify-center text-[var(--gold)]/30"
                >
                  <span className="text-6xl">◆</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <motion.button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    i === activeImage
                      ? "border-[var(--gold)] shadow-[0_4px_12px_rgba(185,138,68,0.3)]"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-[var(--gold)]/40"
                  }`}
                  style={{ width: "5rem", height: "5rem" }}
                >
                  <img
                    src={getImageSrc(img.id, img.url)}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => handleImageError(img.id)}
                  />
                  {i === activeImage && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-[var(--gold)] ring-inset" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ===================== Infos ===================== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col space-y-8"
        >
          {/* Catégorie */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              {product.categoryName}
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-[var(--text-dark)] lg:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Prix */}
          <div className="rounded-2xl border border-[var(--gold)]/15 bg-gradient-to-br from-[var(--ivory)]/50 to-[var(--gold)]/5 p-6 shadow-[0_-4px_16px_-8px_rgba(185,138,68,0.1)]">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-5xl">
                {formatFCFA(product.price)}{" "}
                <span className="text-xl font-medium text-[var(--text-dark)]/40">FCFA</span>
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-[var(--text-dark)]/35 line-through tabular-nums">
                  {formatFCFA(product.compareAtPrice)}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-sm font-bold text-[#241B14] shadow-md">
                  −{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Disponibilité */}
          <div className="flex items-center gap-2">
            {isOut ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Rupture de stock
              </span>
            ) : isLow ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Plus que {product.stock} en stock — dépêchez-vous
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Disponible
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-[var(--gold)]/10 pt-6">
              <p className="whitespace-pre-line text-base leading-relaxed text-[var(--text-dark)]/70">
                {product.description}
              </p>
            </div>
          )}

          {/* Sélecteur de quantité */}
          {!isOut && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--text-dark)]/60">Quantité</span>
              <div className="flex items-center gap-4 rounded-full border border-[var(--gold)]/20 bg-white px-2 py-1 shadow-sm">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)] disabled:opacity-30"
                  aria-label="Diminuer"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="min-w-[2ch] text-center text-lg font-bold text-[var(--text-dark)] tabular-nums">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={maxReached}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)] disabled:opacity-30"
                  aria-label="Augmenter"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* ===== Actions DESKTOP (dans le flux) ===== */}
          <div className="hidden flex-col gap-4 lg:flex">
            {!isOut ? (
              <>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdd}
                    className={`flex flex-1 items-center justify-center gap-3 rounded-full border-2 py-4 text-base font-bold transition-all ${
                      justAdded
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/20"
                        : "border-[var(--text-dark)] text-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-white"
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-5 w-5" /> Ajouté au panier
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" /> Ajouter au panier
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="flex flex-1 items-center justify-center rounded-full bg-[var(--gold)] py-4 text-base font-bold text-[#241B14] shadow-lg shadow-[var(--gold)]/30 transition-transform hover:brightness-105"
                  >
                    Acheter maintenant
                  </motion.button>
                </div>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-full bg-emerald-600/10 py-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <MessageCircle className="h-5 w-5" /> Commander sur WhatsApp
                </motion.a>
              </>
            ) : (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-full bg-emerald-600/10 py-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <MessageCircle className="h-5 w-5" /> Me prévenir du retour sur WhatsApp
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== Barre d'action MOBILE fixe en bas ===== */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--gold)]/15 bg-white/95 px-4 py-4 backdrop-blur-md lg:hidden"
      >
        {!isOut ? (
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                justAdded
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "border-[var(--text-dark)] text-[var(--text-dark)]"
              }`}
              aria-label="Ajouter au panier"
            >
              {justAdded ? <Check className="h-6 w-6" /> : <ShoppingCart className="h-6 w-6" />}
            </motion.button>
            <motion.a
              whileTap={{ scale: 0.9 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700"
              aria-label="Commander sur WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.a>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="flex h-14 flex-1 items-center justify-center rounded-full bg-[var(--gold)] text-base font-bold text-[#241B14] shadow-lg shadow-[var(--gold)]/30 transition-transform"
            >
              Acheter · {formatFCFA(product.price * quantity)} F
            </motion.button>
          </div>
        ) : (
          <motion.a
            whileTap={{ scale: 0.98 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-emerald-600/10 text-base font-semibold text-emerald-700"
          >
            <MessageCircle className="h-5 w-5" /> Me prévenir du retour
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}