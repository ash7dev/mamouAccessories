"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

interface CollectionCardsProps {
  collections: Collection[];
}

/* ============================================================
   Jewelry SVG Icons — Elegant line-art, single color
   ============================================================ */

function BraceletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="60" rx="42" ry="42" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="60" cy="60" rx="34" ry="34" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="26" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="94" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="26" cy="60" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="94" cy="60" r="3" fill="currentColor" opacity="0.4" />
      <path d="M42 32 C48 28, 72 28, 78 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M42 88 C48 92, 72 92, 78 88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function NecklaceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M30 20 Q30 70, 60 90 Q90 70, 90 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 20 Q35 65, 60 82 Q85 65, 85 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="60" cy="92" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3" />
      <circle cx="60" cy="92" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="38" cy="35" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="82" cy="35" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function WatchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="38" y="10" width="44" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="38" y="100" width="44" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="60" r="32" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="60" y1="60" x2="60" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="60" x2="76" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="32" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="88" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="88" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function EarringIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="22" r="4" stroke="currentColor" strokeWidth="2" />
      <line x1="60" y1="26" x2="60" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <path d="M45 55 Q45 85, 60 95 Q75 85, 75 55" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M50 60 Q50 80, 60 87 Q70 80, 70 60" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.15" />
      <circle cx="60" cy="70" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function RingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="65" rx="30" ry="35" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="60" cy="65" rx="24" ry="29" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M48 34 L60 20 L72 34" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 36 L60 26 L68 36" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="60" cy="20" r="4" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function SetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M35 25 Q35 55, 60 68 Q85 55, 85 25" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="60" cy="68" r="4" fill="currentColor" opacity="0.4" />
      <ellipse cx="60" cy="95" rx="22" ry="12" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="28" cy="30" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="28" y1="33" x2="28" y2="45" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="92" cy="30" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="92" y1="33" x2="92" y2="45" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ============================================================
   Icon resolver — maps category name to SVG component
   ============================================================ */

function getIconForCollection(name: string): React.ComponentType<{ className?: string }> {
  const n = name.toLowerCase();
  if (n.includes("bracelet")) return BraceletIcon;
  if (n.includes("collier") || n.includes("chaine") || n.includes("chaîne")) return NecklaceIcon;
  if (n.includes("montre")) return WatchIcon;
  if (n.includes("boucle") || n.includes("oreille")) return EarringIcon;
  if (n.includes("bague")) return RingIcon;
  return SetIcon;
}

/* ============================================================
   CollectionCards — Black & White editorial grid
   Only obsidienne, white, porcelaine, laiton
   ============================================================ */

export function CollectionCards({ collections }: CollectionCardsProps) {
  return (
    <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--laiton,#B9793E)]"
            >
              ✦ Collections
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-heading text-3xl font-bold text-[var(--obsidienne,#0E0B09)] md:text-4xl lg:text-[2.75rem] leading-tight"
            >
              Nos Collections
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-[15px] text-[var(--obsidienne)]/50 lg:text-base max-w-md"
            >
              Explorez nos catégories exclusives
            </motion.p>
          </div>
          <Link
            href="/boutique"
            className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[var(--laiton,#B9793E)] transition-colors hover:text-[var(--laiton-clair)]"
          >
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Collections Container — Scroll horizontal en mobile, Grid en desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 sm:pb-0 auto-rows-[minmax(180px,auto)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {collections.map((collection, index) => {
            const IconComponent = getIconForCollection(collection.name);

            // Alternating dark/light: even index = dark, odd = light
            const isDark = index % 2 === 0;
            // First and 4th cards span 2 rows on desktop for asymmetric look
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`
                  w-[75vw] max-w-[280px] shrink-0 snap-start
                  sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none
                  ${isLarge ? "lg:row-span-2" : ""}
                `}
              >
                <Link
                  href={collection.slug ? `/boutique?category=${collection.slug}` : "/boutique"}
                  className="group relative block h-full rounded-[1.75rem] lg:rounded-[2rem] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--laiton)] focus-visible:ring-offset-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`
                      relative h-full
                      min-h-[250px] sm:min-h-[260px]
                      ${isLarge ? "lg:min-h-[480px]" : "lg:min-h-[230px]"}
                      rounded-[1.75rem] lg:rounded-[2rem]
                      overflow-hidden
                      transition-all duration-500
                      ${isDark
                        ? "bg-[var(--obsidienne,#0E0B09)] shadow-[0_6px_30px_-8px_rgba(14,11,9,0.4)] group-hover:shadow-[0_20px_50px_-12px_rgba(185,121,62,0.25)]"
                        : "bg-white border border-[var(--obsidienne)]/[0.06] shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]"
                      }
                    `}
                  >
                    {/* Corner decorative lines */}
                    <div className={`absolute top-0 right-0 w-20 h-20 ${isDark ? "opacity-[0.08]" : "opacity-[0.05]"}`}>
                      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                        <path d="M100 0 L100 100 L0 100" stroke={isDark ? "#D9AE78" : "#0E0B09"} strokeWidth="1" />
                        <path d="M100 20 L100 100 L20 100" stroke={isDark ? "#D9AE78" : "#0E0B09"} strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Collection Number */}
                    <div className="absolute top-5 left-6 lg:top-6 lg:left-7">
                      <span className={`text-[11px] font-mono font-medium tracking-wider select-none ${isDark ? "text-white/25" : "text-[var(--obsidienne)]/20"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* SVG Icon — filigrane */}
                    <div className={`
                      absolute
                      ${isLarge
                        ? "right-4 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        : "right-3 top-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
                      }
                      ${isDark ? "text-[var(--laiton-clair,#D9AE78)]" : "text-[var(--obsidienne,#0E0B09)]"}
                      opacity-[0.08] group-hover:opacity-[0.15]
                      transition-all duration-700 ease-out
                      group-hover:scale-110 group-hover:rotate-3
                    `}>
                      <IconComponent className="w-full h-full" />
                    </div>

                    {/* Content */}
                    <div className={`
                      relative z-10 flex flex-col justify-end h-full
                      ${isLarge ? "p-6 lg:p-8" : "p-5 lg:p-6"}
                    `}>
                      {/* Article count pill */}
                      <span className={`
                        inline-flex self-start items-center gap-1
                        mb-2.5 px-3 py-1 rounded-full
                        text-[10px] sm:text-[11px] font-bold uppercase tracking-wider
                        ${isDark
                          ? "bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton)]/20"
                          : "bg-[var(--obsidienne)]/[0.04] text-[var(--obsidienne)]/60 border border-[var(--obsidienne)]/[0.06]"
                        }
                      `}>
                        <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
                        {collection.productCount} {collection.productCount > 1 ? "articles" : "article"}
                      </span>

                      {/* Collection Name */}
                      <h3 className={`
                        font-heading font-bold leading-tight
                        ${isLarge
                          ? "text-xl sm:text-3xl lg:text-[2rem]"
                          : "text-lg sm:text-xl lg:text-[1.35rem]"
                        }
                        ${isDark ? "text-white" : "text-[var(--obsidienne,#0E0B09)]"}
                      `}>
                        {collection.name}
                      </h3>

                      {/* Description */}
                      <p className={`
                        mt-1.5 text-xs sm:text-sm leading-relaxed line-clamp-2
                        ${isDark ? "text-white/50" : "text-[var(--obsidienne)]/40"}
                      `}>
                        {collection.description}
                      </p>

                      {/* CTA */}
                      <div className={`
                        mt-3 lg:mt-4 flex items-center gap-2
                        text-xs sm:text-sm font-semibold
                        ${isDark ? "text-[var(--laiton-clair,#D9AE78)]" : "text-[var(--laiton,#B9793E)]"}
                      `}>
                        <span className="tracking-wide">Découvrir</span>
                        <div className={`
                          flex items-center justify-center w-7 h-7 rounded-full
                          transition-all duration-300
                          group-hover:translate-x-1
                          ${isDark
                            ? "bg-white/10 border border-white/10 group-hover:bg-[var(--laiton)]/20 group-hover:border-[var(--laiton)]/30"
                            : "bg-[var(--obsidienne)]/[0.04] border border-[var(--obsidienne)]/[0.06] group-hover:bg-[var(--laiton)]/10 group-hover:border-[var(--laiton)]/20"
                          }
                        `}>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom decorative line */}
                    <div className={`absolute bottom-0 left-6 right-6 h-px ${isDark ? "bg-gradient-to-r from-transparent via-[var(--laiton)]/10 to-transparent" : "bg-gradient-to-r from-transparent via-[var(--obsidienne)]/[0.04] to-transparent"}`} />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/boutique"
            className="flex items-center gap-2 rounded-full border border-[var(--obsidienne)]/10 bg-white px-6 py-3 text-sm font-semibold text-[var(--obsidienne,#0E0B09)] shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            Voir toutes les collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}