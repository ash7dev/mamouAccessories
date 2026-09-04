/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ShoppingCart,
  Check,
  MessageCircle,
  Plus,
  Minus,
  Maximize2,
  X,
  Truck,
  ShieldCheck,
  Gift,
  Sparkles,
  ChevronDown,
  Heart,
  Share2,
  ShoppingBag
} from "lucide-react";
import { ProductCard, type PublicProductCard } from "@/components/home/ProductCard";

/* ============================================================
   Fiche produit publique ultra-premium — /produit/[slug]
   Design Haute Joaillerie (Obsidienne, Laiton, Playfair Display)
   Galerie tactile avec Lightbox zoom, barre d'action mobile fixe,
   accordéons d'informations & section "Vous aimerez aussi".
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

interface ProductDetailProps {
  product: PublicProduct;
  relatedProducts?: PublicProductCard[];
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const WHATSAPP_NUMBER = "221774907955";

export function ProductDetailPublic({ product, relatedProducts = [] }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez « ${product.name} » sur Mamou Jewelry`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien du produit copié !");
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour 🌸 Je souhaite commander « ${product.name} » (${formatFCFA(product.price)} FCFA). Est-il disponible ?`
  )}`;

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  const getImageSrc = (imageId: string, url: string) => (imageErrors[imageId] ? fallbackImage : url);

  const activeImgObj = product.images[activeImage];

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F7F4EF)] pb-36 pt-20 sm:pt-24 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Fil d'ariane moderne */}
        <nav className="mb-6 flex items-center justify-between">
          <Link
            href="/boutique"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--laiton)]/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[var(--laiton)]/50"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[var(--laiton)]" />
            <span>Boutique</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Ajouter aux favoris"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-[var(--laiton)]/20 text-[var(--obsidienne)] shadow-sm backdrop-blur-md transition-all hover:scale-110"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-[var(--laiton)] text-[var(--laiton)]" : "text-[var(--obsidienne)]/60"
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              aria-label="Partager ce produit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-[var(--laiton)]/20 text-[var(--obsidienne)] shadow-sm backdrop-blur-md transition-all hover:scale-110"
            >
              <Share2 className="h-4 w-4 text-[var(--obsidienne)]/70" />
            </button>
          </div>
        </nav>

        {/* Grille principale : Galerie + Détails */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* ===================== GALERIE MEDIA (lg:col-span-7) ===================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Image Principale avec cadre joaillerie */}
            <div className={`relative ${aspect} w-full overflow-hidden rounded-[2rem] border border-[var(--laiton)]/20 bg-white shadow-[0_12px_40px_-15px_rgba(14,11,9,0.12)] group`}>
              <AnimatePresence mode="wait">
                {activeImgObj ? (
                  <motion.img
                    key={activeImage}
                    src={getImageSrc(activeImgObj.id, activeImgObj.url)}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full object-cover cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    onError={() => handleImageError(activeImgObj.id)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--laiton)]/40">
                    <span className="text-6xl">◆</span>
                  </div>
                )}
              </AnimatePresence>

              {/* Badge Promo */}
              {discount && !isOut && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                  −{discount}%
                </span>
              )}

              {/* Badge Rupture */}
              {isOut && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--obsidienne)]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold tracking-wider text-white shadow-lg">
                  Épuisé
                </span>
              )}

              {/* Compteur "1 / N" mobile */}
              {product.images.length > 1 && (
                <span className="absolute left-4 bottom-4 z-10 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-white shadow-sm">
                  {activeImage + 1} / {product.images.length}
                </span>
              )}

              {/* Bouton Zoom Lightbox */}
              {activeImgObj && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Agrandir la photo"
                  className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[var(--obsidienne)] shadow-md transition-transform hover:scale-110 active:scale-95"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Miniatures carrousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, i) => (
                  <motion.button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      i === activeImage
                        ? "border-[var(--laiton)] shadow-[0_4px_16px_rgba(185,121,62,0.35)]"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-[var(--laiton)]/40"
                    }`}
                    style={{ width: "5.5rem", height: "5.5rem" }}
                  >
                    <img
                      src={getImageSrc(img.id, img.url)}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(img.id)}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* ===================== FICHE INFORMATIONS (lg:col-span-5) ===================== */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* En-tête : Catégorie & Titre en Playfair Display */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton)]/30 bg-[var(--laiton)]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton)] mb-3">
                <Sparkles className="h-3 w-3 text-[var(--laiton)]" />
                {product.categoryName}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--obsidienne)] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Bloc Prix Luxe */}
            <div className="rounded-3xl border border-[var(--laiton)]/25 bg-white p-6 shadow-[0_8px_30px_-10px_rgba(14,11,9,0.06)]">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--laiton)] mb-1">Prix TTC</p>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[var(--obsidienne)] tabular-nums tracking-tight">
                    {formatFCFA(product.price * quantity)}
                  </span>
                  <span className="ml-1.5 text-xs font-bold text-[var(--obsidienne)]/50 uppercase tracking-wider">FCFA</span>
                </div>

                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Prix conseillé</p>
                    <span className="text-lg text-neutral-400 line-through tabular-nums">
                      {formatFCFA(product.compareAtPrice * quantity)} FCFA
                    </span>
                  </div>
                )}
              </div>

              {/* Indicateur de stock */}
              <div className="mt-4 pt-4 border-t border-[var(--obsidienne)]/5 flex items-center justify-between text-xs">
                {isOut ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Rupture de stock
                  </span>
                ) : isLow ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Plus que {product.stock} pièces disponibles
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    En stock disponible
                  </span>
                )}

                <span className="text-neutral-400 font-mono text-[11px]">Réf. #{product.id.slice(0, 6)}</span>
              </div>
            </div>

            {/* Sélecteur de Quantité */}
            {!isOut && (
              <div className="flex items-center justify-between rounded-2xl border border-[var(--laiton)]/20 bg-white p-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)]">Quantité</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--laiton)]/30 text-[var(--obsidienne)] transition-all hover:bg-[var(--laiton)] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--obsidienne)]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[2ch] text-center font-mono text-base font-bold text-[var(--obsidienne)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={maxReached}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--laiton)]/30 text-[var(--obsidienne)] transition-all hover:bg-[var(--laiton)] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--obsidienne)]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ===== Actions DESKTOP dans le flux ===== */}
            <div className="hidden lg:flex flex-col gap-3 pt-2">
              {!isOut ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAdd}
                      className={`flex items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${
                        justAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/20"
                          : "bg-[var(--obsidienne)] hover:bg-[var(--laiton)] text-white shadow-[var(--obsidienne)]/10"
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Ajouté ✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Ajouter au Panier</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--laiton)]/20 transition-transform hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Acheter maintenant</span>
                    </button>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 rounded-full border border-emerald-600/30 bg-emerald-50 py-3.5 text-xs font-bold uppercase tracking-wider text-emerald-800 transition-colors hover:bg-emerald-600 hover:text-white"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                    <span>Commander via WhatsApp</span>
                  </a>
                </>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[var(--obsidienne)] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                >
                  <MessageCircle className="h-4.5 w-4.5 text-[var(--laiton)]" />
                  <span>Me prévenir du retour sur WhatsApp</span>
                </a>
              )}
            </div>

            {/* Badges de réassurance */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--obsidienne)]/10">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 border border-[var(--laiton)]/10">
                <Truck className="h-5 w-5 text-[var(--laiton)] mb-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--obsidienne)]">Livraison Rapide</span>
                <span className="text-[9px] text-neutral-500 mt-0.5">Dakar & Régions</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 border border-[var(--laiton)]/10">
                <Gift className="h-5 w-5 text-[var(--laiton)] mb-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--obsidienne)]">Écrin Offert</span>
                <span className="text-[9px] text-neutral-500 mt-0.5">Prêt à offrir</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/60 border border-[var(--laiton)]/10">
                <ShieldCheck className="h-5 w-5 text-[var(--laiton)] mb-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--obsidienne)]">Paiement Wave</span>
                <span className="text-[9px] text-neutral-500 mt-0.5">100% Sécurisé</span>
              </div>
            </div>

            {/* Accordéons d'Informations */}
            <div className="space-y-3 pt-2">
              {/* Accordéon 1: Description */}
              <div className="rounded-2xl border border-[var(--laiton)]/15 bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "description" ? null : "description")}
                  className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] text-left"
                >
                  <span>Description du bijou</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--laiton)] transition-transform duration-300 ${
                      activeAccordion === "description" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "description" && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-[var(--obsidienne)]/5 pt-3">
                    {product.description || "Ce bijou a été sélectionné avec le plus grand soin par la Maison Mamou pour son éclat d'exception et la finesse de son design."}
                  </div>
                )}
              </div>

              {/* Accordéon 2: Conseils d'entretien */}
              <div className="rounded-2xl border border-[var(--laiton)]/15 bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] text-left"
                >
                  <span>Conseils d'entretien</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--laiton)] transition-transform duration-300 ${
                      activeAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "care" && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-[var(--obsidienne)]/5 pt-3 space-y-1.5">
                    <p>✨ Éviter le contact direct avec les parfums et produits chimiques.</p>
                    <p>✨ Ranger individuellement dans votre écrin Mamou après utilisation.</p>
                    <p>✨ Nettoyer délicatement avec un chiffon doux et sec.</p>
                  </div>
                )}
              </div>

              {/* Accordéon 3: Livraison & Retours */}
              <div className="rounded-2xl border border-[var(--laiton)]/15 bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] text-left"
                >
                  <span>Livraison & Retours</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--laiton)] transition-transform duration-300 ${
                      activeAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "shipping" && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-[var(--obsidienne)]/5 pt-3 space-y-1.5">
                    <p>🚚 <strong>Dakar :</strong> Livraison en 24h à domicile.</p>
                    <p>📦 <strong>Régions du Sénégal :</strong> Expédition sous 48h via nos partenaires de confiance.</p>
                    <p>💳 <strong>Paiement :</strong> Wave, Orange Money ou Espèces à la livraison.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION PRODUITS RECOMMANDÉS (Vous aimerez aussi) ===================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 lg:mt-28 border-t border-[var(--laiton)]/20 pt-14">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton)] block mb-1">
                  Recommandations
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--obsidienne)]">
                  Vous aimerez aussi
                </h2>
              </div>
              <Link
                href="/boutique"
                className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--laiton)] hover:text-[var(--obsidienne)] transition-colors"
              >
                <span>Voir tout</span>
                <ChevronLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ===================== BARRE D'ACTION MOBILE FIXE EN BAS ===================== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--laiton)]/20 bg-white/95 px-4 py-3.5 backdrop-blur-xl shadow-[0_-10px_30px_rgba(14,11,9,0.1)] lg:hidden">
        {!isOut ? (
          <div className="flex items-center gap-2.5">
            {/* Prix & Quantité */}
            <div className="flex flex-col pr-1">
              <span className="text-[10px] font-bold text-[var(--laiton)] uppercase tracking-wider">Total</span>
              <span className="font-mono text-base font-extrabold text-[var(--obsidienne)] tabular-nums leading-none">
                {formatFCFA(product.price * quantity)}
              </span>
            </div>

            {/* Bouton WhatsApp direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 active:scale-95 transition-transform"
              aria-label="Contacter sur WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            {/* Bouton Ajouter au Panier */}
            <button
              onClick={handleAdd}
              className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-all ${
                justAdded ? "bg-emerald-600" : "bg-[var(--obsidienne)]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Ajouter</span>
                </>
              )}
            </button>

            {/* Bouton Acheter */}
            <button
              onClick={handleBuyNow}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-transform"
            >
              Acheter
            </button>
          </div>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--obsidienne)] text-xs font-bold uppercase tracking-wider text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4 text-[var(--laiton)]" />
            <span>Me prévenir du retour sur WhatsApp</span>
          </a>
        )}
      </div>

      {/* ===================== MODAL LIGHTBOX AGRANDISSEMENT PHOTO ===================== */}
      <AnimatePresence>
        {lightboxOpen && activeImgObj && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
              aria-label="Fermer le plein écran"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-3xl" onClick={(e) => e.stopPropagation()}>
              <img
                src={getImageSrc(activeImgObj.id, activeImgObj.url)}
                alt={product.name}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-3xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}