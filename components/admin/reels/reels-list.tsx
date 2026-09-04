"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Trash2, Edit2, Eye, EyeOff, Sparkles, ExternalLink } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import type { Reel } from "@/lib/types/reel";

interface ReelsListProps {
  reels: Reel[];
  onEdit: (reel: Reel) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  isLoading?: boolean;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ReelsList({
  reels,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading = false,
}: ReelsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-3xl bg-[var(--porcelaine,#F1ECE3)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="rounded-[2.5rem] bg-white p-12 text-center border border-neutral-200/80 shadow-xs">
        <Video className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
        <h3 className="text-lg font-bold text-[var(--obsidienne)]">Aucune vidéo Reel créée</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
          Ajoutez votre première vidéo courte (max 45s) de bijou porté pour présenter vos pièces sous leur meilleur profil.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reels.map((reel) => (
        <motion.div
          key={reel.id}
          whileHover={{ y: -4 }}
          className={`group relative rounded-[2rem] border overflow-hidden transition-all duration-300 ${
            reel.isActive
              ? "bg-white border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(185,121,62,0.18)]"
              : "bg-neutral-50 border-neutral-200 opacity-60"
          }`}
        >
          {/* Aperçu Vidéo / Thumbnail */}
          <div className="relative aspect-[9/16] max-h-72 w-full overflow-hidden bg-[var(--obsidienne)]">
            <video
              src={reel.videoUrl}
              poster={reel.thumbnailUrl || reel.productImageUrl || undefined}
              muted
              loop
              playsInline
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Badge Durée */}
            <span className="absolute top-3 left-3 z-10 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono font-bold text-white shadow-xs">
              {reel.durationSeconds ? `${reel.durationSeconds}s` : "45s max"}
            </span>

            {/* Badge Actif / Masqué */}
            <span
              className={`absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-md ${
                reel.isActive
                  ? "bg-emerald-600/90 text-white"
                  : "bg-neutral-800/90 text-neutral-300"
              }`}
            >
              {reel.isActive ? "En ligne" : "Masqué"}
            </span>
          </div>

          {/* Informations Reel & Produit Lié */}
          <div className="p-5">
            <h3 className="font-serif text-base font-bold text-[var(--obsidienne)] truncate mb-1">
              {reel.title}
            </h3>

            {/* Bijou Lié */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--porcelaine)]/60 border border-[var(--laiton)]/15 mb-4">
              <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white border border-neutral-200">
                <ProductImage src={reel.productImageUrl} alt={reel.productName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)] block truncate">
                  Bijou rattaché
                </span>
                <span className="text-xs font-bold text-[var(--obsidienne)] truncate block">
                  {reel.productName}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[var(--obsidienne)] tabular-nums shrink-0">
                {formatFCFA(reel.productPrice)} FCFA
              </span>
            </div>

            {/* Actions Admin */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
              <button
                onClick={() => onToggleActive(reel.id, reel.isActive)}
                className="flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-[var(--obsidienne)] transition-colors cursor-pointer"
              >
                {reel.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4 text-amber-600" />
                    <span>Masquer</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-emerald-600" />
                    <span>Publier</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(reel)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-[var(--laiton)] hover:text-white transition-all cursor-pointer"
                  title="Modifier"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onDelete(reel.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
