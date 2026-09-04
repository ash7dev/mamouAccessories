"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Volume2, VolumeX, ShoppingBag, Check, ArrowRight, Sparkles } from "lucide-react";
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

  // Play / Pause video based on active viewport state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      video.play().catch(() => {
        // Fallback for browsers that restrict video playback
      });
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
    setTimeout(() => setJustAdded(false), 2000);
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
          className="h-full w-full object-cover"
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
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne,#0E0B09)]/60 to-transparent pointer-events-none" />

      {/* ---------- Bouton Son (🔊 / 🔇) ---------- */}
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
        className="absolute top-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#0E0B09]/60 backdrop-blur-xl text-white border border-[var(--laiton,#B9793E)]/30 shadow-lg hover:bg-[#0E0B09]/80 active:scale-95 transition-all cursor-pointer"
      >
        {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5 text-[var(--laiton-clair,#D9AE78)]" />}
      </button>

      {/* ---------- Overlay Card Produit Incrusté (Style Haute Joaillerie Mobile-First) ---------- */}
      <div className="absolute inset-x-3 sm:inset-x-6 bottom-6 sm:bottom-8 z-20 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white space-y-3.5">
          
          {/* Header Info Produit */}
          <div className="flex items-center gap-3.5">
            {/* Vignette Produit avec ring doré */}
            <Link href={`/produit/${reel.productSlug}`} className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-[var(--laiton,#B9793E)]/50 bg-[#17120D] shadow-md group">
              <ProductImage src={reel.productImageUrl} alt={reel.productName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            </Link>

            {/* Détails Bijou & Titre */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">
                  ✦ BIJOU EN VIDÉO
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--laiton,#B9793E)]" />
                <span className="text-[9px] font-sans font-semibold text-emerald-400 uppercase tracking-wider">
                  En Stock
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[#F1ECE3] truncate leading-tight">
                {reel.productName}
              </h3>

              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="font-mono text-base font-black text-white tabular-nums">
                  {formatFCFA(reel.productPrice)} FCFA
                </span>
                {reel.productComparePrice && (
                  <span className="text-xs text-white/45 line-through tabular-nums">
                    {formatFCFA(reel.productComparePrice)} FCFA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Acheter Direct - Ultra visible et large pour mobile */}
          {reel.productStock > 0 ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              className={`flex w-full h-12 items-center justify-center gap-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_8px_30px_rgba(185,121,62,0.4)] cursor-pointer ${
                justAdded
                  ? "bg-emerald-600 text-white shadow-emerald-900/50"
                  : "bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#E5C195] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] hover:brightness-110"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-5 w-5 stroke-[2.5]" />
                  <span>Ajouté au Panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
                  <span>Ajouter au Panier • {formatFCFA(reel.productPrice)} FCFA</span>
                </>
              )}
            </motion.button>
          ) : (
            <div className="w-full py-3 text-center rounded-full bg-white/10 text-white/50 text-xs font-bold uppercase tracking-wider border border-white/10">
              Rupture de Stock
            </div>
          )}

          {/* Footer Card avec Titre du Reel & Lien Fiche */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/60 font-serif italic truncate max-w-[65%]">
              "{reel.title}"
            </span>
            <Link
              href={`/produit/${reel.productSlug}`}
              className="inline-flex items-center gap-1 font-bold text-[var(--laiton-clair,#D9AE78)] hover:text-white transition-colors uppercase tracking-wider shrink-0 text-[11px]"
            >
              <span>Voir la pièce</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

