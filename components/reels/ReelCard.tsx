"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ShoppingBag, Check, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { ProductImage } from "@/components/ui/product-image";
import type { Reel } from "@/lib/types/reel";

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onCloseModal?: () => void;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ReelCard({
  reel,
  isActive,
  isMuted,
  onToggleMute,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Play / Pause video based on active viewport state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      video.play().catch(() => {
        // Fallback for browsers that restrict video playback
      });

      // Auto-collapse product card after 2.5s to let the user enjoy full video
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      video.pause();
    }
  }, [isActive, isMuted]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (reel.productStock === 0 || justAdded) return;

    addItem(reel.productId, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="relative h-full w-full bg-[var(--obsidienne,#0E0B09)] overflow-hidden flex items-center justify-center snap-start select-none">
      {/* ---------- Lecteur Vidéo Fullscreen ---------- */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl || reel.productImageUrl || undefined}
          loop
          muted={isMuted}
          playsInline
          onError={() => setVideoError(true)}
          className="h-full w-full object-cover cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      ) : (
        /* Fallback si la vidéo ne charge pas */
        <div className="relative h-full w-full flex items-center justify-center bg-[var(--obsidienne)]">
          {reel.thumbnailUrl || reel.productImageUrl ? (
            <ProductImage src={reel.thumbnailUrl || reel.productImageUrl} alt={reel.title} fill className="object-cover opacity-60" />
          ) : (
            <div className="text-center p-6 text-white/60">
              <Sparkles className="h-10 w-10 mx-auto mb-2 text-[var(--laiton)]" />
              <p className="text-xs uppercase tracking-wider">{reel.title}</p>
            </div>
          )}
        </div>
      )}

      {/* Overlay dégradé sombre en bas pour lisibilité optimale */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne,#0E0B09)]/40 to-transparent pointer-events-none" />

      {/* ---------- Bouton Son (🔊 / 🔇) ---------- */}
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
        className="absolute top-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#0E0B09]/60 backdrop-blur-xl text-white border border-[var(--laiton,#B9793E)]/30 shadow-lg hover:bg-[#0E0B09]/80 active:scale-95 transition-all cursor-pointer"
      >
        {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5 text-[var(--laiton-clair,#D9AE78)]" />}
      </button>

      {/* ---------- Overlay Card Produit Incrusté (Réduction automatique du temps d'affichage) ---------- */}
      <div className="absolute inset-x-3 sm:inset-x-6 bottom-5 sm:bottom-7 z-20 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* Carte Complète Développée (Pendant 2.5s initiales ou au clic) */
            <motion.div
              key="expanded-card"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative rounded-3xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white space-y-3"
            >
              {/* Bouton de réduction manuelle */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Masquer les détails pour voir la vidéo"
              >
                <ChevronDown className="h-5 w-5" />
              </button>

              {/* Header Info Produit */}
              <div className="flex items-center gap-3.5 pr-6">
                <Link href={`/produit/${reel.productSlug}`} className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 border-[var(--laiton,#B9793E)]/50 bg-[#17120D] shadow-md group">
                  <ProductImage src={reel.productImageUrl} alt={reel.productName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </Link>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">
                      ✦ BIJOU EN VIDÉO
                    </span>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-[#F1ECE3] truncate leading-tight">
                    {reel.productName}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono text-sm font-black text-white tabular-nums">
                      {formatFCFA(reel.productPrice)} FCFA
                    </span>
                    {reel.productComparePrice && (
                      <span className="text-[11px] text-white/45 line-through tabular-nums">
                        {formatFCFA(reel.productComparePrice)} FCFA
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton Panier */}
              {reel.productStock > 0 ? (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className={`flex w-full h-11 items-center justify-center gap-2 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_8px_30px_rgba(185,121,62,0.4)] cursor-pointer ${
                    justAdded
                      ? "bg-emerald-600 text-white shadow-emerald-900/50"
                      : "bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#E5C195] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] hover:brightness-110"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Ajouté !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
                      <span>Ajouter au Panier • {formatFCFA(reel.productPrice)} FCFA</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="w-full py-2.5 text-center rounded-full bg-white/10 text-white/50 text-[11px] font-bold uppercase tracking-wider border border-white/10">
                  Rupture de Stock
                </div>
              )}

              {/* Footer */}
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60 font-serif italic truncate max-w-[65%]">
                  "{reel.title}"
                </span>
                <Link
                  href={`/produit/${reel.productSlug}`}
                  className="inline-flex items-center gap-1 font-bold text-[var(--laiton-clair,#D9AE78)] hover:text-white transition-colors uppercase tracking-wider shrink-0 text-[10px]"
                >
                  <span>Voir la pièce</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Pillule Compacte Discrète (Permet de profiter à 100% de la vidéo) */
            <motion.div
              key="compact-pill"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-between rounded-full border border-[var(--laiton,#B9793E)]/40 bg-[var(--obsidienne,#0E0B09)]/85 backdrop-blur-xl p-1.5 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white cursor-pointer hover:bg-[var(--obsidienne)] transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-[var(--laiton)]/60 bg-[#17120D]">
                  <ProductImage src={reel.productImageUrl} alt={reel.productName} fill className="object-cover" />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-serif text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
                    {reel.productName}
                  </h4>
                  <span className="font-mono text-[11px] font-extrabold text-[var(--laiton-clair,#D9AE78)]">
                    {formatFCFA(reel.productPrice)} FCFA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reel.productStock > 0 && (
                  <button
                    onClick={handleAddToCart}
                    className={`flex h-8 px-3 items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      justAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[var(--laiton,#B9793E)] text-white hover:bg-[#A36630]"
                    }`}
                  >
                    {justAdded ? <Check className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                    <span>{justAdded ? "Ajouté" : "Acheter"}</span>
                  </button>
                )}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                  <ChevronUp className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

