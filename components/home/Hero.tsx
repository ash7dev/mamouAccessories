/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";

/* ============================================================
   Hero — section d'accroche premium

   Layout inspiré des e-commerce haut de gamme :
   - Gauche : typographie éditoriale forte + CTA + badges
   - Droite : grille asymétrique de visuels produits (3 images)
     dont une grande avec légende flottante + 2 plus petites
   - Mobile : les images passent au-dessus du texte
   ============================================================ */

interface HeroProps {
  heroImage?: string;
  featuredProducts?: {
    name: string;
    category: string;
    price: number;
    image: string;
    slug: string;
  }[];
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* Icônes pour les badges de réassurance */
function GemIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l4 6-10 13L2 9l4-6z" />
    </svg>
  );
}

function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function ChatIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

const trustBadges = [
  { icon: GemIcon, label: "Premium" },
  { icon: TruckIcon, label: "Livraison" },
  { icon: ChatIcon, label: "WhatsApp" },
];

/* Grille de visuels : images locales de la marque */
const gridImages = [
  {
    src: "/props.jpeg",
    label: "Pièce Signature",
    name: "Collection Or",
    alt: "Bijoux en or sur les mains",
    size: "large" as const,
  },
  {
    src: "/ensemble.jpg",
    label: "Ensembles",
    name: "Ensembles",
    alt: "Ensemble de colliers dorés",
    size: "small" as const,
  },
  {
    src: "/bracelets.jpg",
    label: "Bracelets",
    name: "Bracelets",
    alt: "Bracelets dorés",
    size: "small" as const,
  },
];

export function Hero({ heroImage }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pt-8 pb-6 md:pt-20 lg:px-8 lg:pt-24 lg:pb-10">
      <div className="mx-auto grid max-w-[76rem] items-start gap-8 lg:grid-cols-12 lg:gap-10">

        {/* =============== GAUCHE — Texte éditorial =============== */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="order-2 pt-2 lg:order-1 lg:col-span-5 lg:pt-8"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-5 lg:mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/[0.06] px-4 py-2 text-[12px] font-semibold tracking-[0.06em] text-[var(--gold-dark)] uppercase">
              <span className="text-[var(--gold)]">✦</span>
              Nouvelle Sélection
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-[clamp(2.5rem,7.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-[var(--text-dark)]"
          >
            L'élégance
            <br />
            commence
            <br />
            <span className="relative">
              ici
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[var(--gold)]/50" />
            </span>
            <span className="text-[var(--gold)]">.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-dark)]/55 lg:mt-6 lg:text-base lg:leading-relaxed"
          >
            Des pièces choisies avec soin pour une allure raffinée, féminine et assumée.
          </motion.p>

          {/* CTA Bouton */}
          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center gap-3 lg:mt-8"
          >
            <Link
              href="/boutique"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--text-dark)] px-8 py-4 text-[13px] font-bold tracking-wide text-[#F4EFE6] transition-all hover:bg-[var(--text-dark)]/90 active:scale-[0.98]"
            >
              <svg className="h-4 w-4 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Boutique
              <ArrowRightIcon className="h-4 w-4 text-[var(--gold)] transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Trust Badges — intégrés dans le hero */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex gap-1 lg:mt-10"
          >
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[var(--text-dark)]/[0.06] bg-white/60 px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/[0.08]">
                    <Icon className="h-4 w-4 text-[var(--gold-dark)]" />
                  </span>
                  <span className="text-[12px] font-semibold tracking-wide text-[var(--text-dark)]/70 uppercase">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* =============== DROITE — Grille d'images produits =============== */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="order-1 lg:order-2 lg:col-span-7"
        >
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {/* Image principale — occupe toute la hauteur gauche */}
            <motion.div
              variants={scaleIn}
              className="relative col-span-1 row-span-2 overflow-hidden rounded-[1.25rem] lg:rounded-[1.5rem]"
            >
              <div className="relative aspect-[3/4] h-full">
                <img
                  src={gridImages[0].src}
                  alt={gridImages[0].alt}
                  className="h-full w-full object-cover"
                />
                {/* Gradient overlay en bas pour la légende */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241B14]/70 via-[#241B14]/25 to-transparent p-4 pt-16 lg:p-5 lg:pt-20">
                  <p
                    className="text-[11px] font-medium tracking-[0.08em] text-white/60 uppercase"
                  >
                    {gridImages[0].label}
                  </p>
                  <h3 className="mt-0.5 font-heading text-lg font-bold text-white lg:text-xl">
                    {gridImages[0].name}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Image haut-droite */}
            <motion.div
              variants={scaleIn}
              className="relative col-span-1 overflow-hidden rounded-[1.25rem] lg:rounded-[1.5rem]"
            >
              <Link href="/boutique" className="group block">
                <div className="relative aspect-[4/3]">
                  <img
                    src={gridImages[1].src}
                    alt={gridImages[1].alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241B14]/60 to-transparent p-3 pt-10 lg:p-4 lg:pt-12">
                    <h3 className="font-heading text-sm font-bold text-white lg:text-base">
                      {gridImages[1].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Image bas-droite */}
            <motion.div
              variants={scaleIn}
              className="relative col-span-1 overflow-hidden rounded-[1.25rem] lg:rounded-[1.5rem]"
            >
              <Link href="/boutique" className="group block">
                <div className="relative aspect-[4/3]">
                  <img
                    src={gridImages[2].src}
                    alt={gridImages[2].alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241B14]/60 to-transparent p-3 pt-10 lg:p-4 lg:pt-12">
                    <h3 className="font-heading text-sm font-bold text-white lg:text-base">
                      {gridImages[2].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}