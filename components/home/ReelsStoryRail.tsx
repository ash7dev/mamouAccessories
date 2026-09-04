"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Film } from "lucide-react";
import { ShoppableReelsModal } from "@/components/reels/ShoppableReelsModal";
import { ProductImage } from "@/components/ui/product-image";
import { fadeUp, viewportOnce } from "@/lib/motion";
import type { Reel } from "@/lib/types/reel";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ReelsStoryRail() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch("/api/reels");
        if (res.ok) {
          const data = await res.json();
          if (data.reels && data.reels.length > 0) {
            setReels(data.reels);
          }
        }
      } catch (err) {
        console.error("Failed to load reels:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReels();
  }, []);

  const handleOpenReel = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  if (!isLoading && reels.length === 0) return null;

  return (
    <>
      <section className="px-4 py-8 lg:px-8 lg:py-10 bg-gradient-to-b from-[#F1ECE3]/40 via-white to-transparent overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Header Section avec Titrage Haute Joaillerie */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#B9793E]/15 pb-4"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="h-px w-6 bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[var(--laiton-clair,#D9AE78)]" />
                <span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.3em] text-[var(--laiton,#B9793E)]">
                  HAUTE JOAILLERIE EN MOUVEMENT
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)]">
                Lookbook & Vidéos Portées
              </h2>
            </div>

            <button
              onClick={() => handleOpenReel(0)}
              className="group flex items-center gap-1.5 text-xs font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne)] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Défiler l'expérience</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton,#B9793E)] group-hover:bg-[var(--obsidienne)] group-hover:text-white transition-colors">
                <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
              </span>
            </button>
          </motion.div>

          {/* Story Circles Rail Haute Finition */}
          <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-3 pt-1 sm:mx-0 sm:px-0 scroll-smooth">
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2.5 shrink-0">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-neutral-200 animate-pulse border-2 border-neutral-300" />
                    <div className="h-3 w-16 rounded bg-neutral-200 animate-pulse" />
                  </div>
                ))
              : reels.map((reel, idx) => (
                  <motion.button
                    key={reel.id}
                    onClick={() => handleOpenReel(idx)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="group flex flex-col items-center gap-2.5 shrink-0 w-[88px] sm:w-[104px] cursor-pointer focus:outline-none min-w-0"
                  >
                    {/* Ring animé doré avec double bordure luxury */}
                    <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-[var(--laiton,#B9793E)] via-[#F1ECE3] to-[var(--laiton-clair,#D9AE78)] shadow-[0_6px_20px_rgba(185,121,62,0.3)] group-hover:shadow-[0_10px_30px_rgba(185,121,62,0.5)] transition-all duration-300">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-white bg-[var(--obsidienne,#0E0B09)]">
                        <ProductImage
                          src={reel.thumbnailUrl || reel.productImageUrl}
                          alt={reel.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-115"
                        />
                        
                        {/* Overlay sombre avec icône Play dorée */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-center group-hover:from-black/40 transition-colors">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--obsidienne)] shadow-lg backdrop-blur-md border border-white/40 group-hover:scale-110 group-hover:bg-[var(--laiton,#B9793E)] group-hover:text-white transition-all">
                            <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Badge Prix Flottant miniature */}
                        {reel.productPrice && (
                          <div className="absolute bottom-1.5 inset-x-0 text-center">
                            <span className="inline-block bg-[var(--obsidienne,#0E0B09)]/90 backdrop-blur-md text-[#F1ECE3] font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--laiton)]/30 truncate max-w-[80%]">
                              {formatFCFA(reel.productPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Titrage Soigné & Elégant */}
                    <div className="text-center w-full px-0.5 overflow-hidden min-w-0">
                      <span className="block font-sans text-xs font-bold leading-tight text-[var(--obsidienne)] truncate w-full group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                        {reel.productName || reel.title}
                      </span>
                      <span className="block font-serif text-[10px] italic text-[#0E0B09]/60 truncate w-full mt-0.5">
                        {reel.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
          </div>
        </div>
      </section>

      {/* Shoppable Reels Modal Fullscreen */}
      <ShoppableReelsModal
        reels={reels}
        initialIndex={selectedIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

