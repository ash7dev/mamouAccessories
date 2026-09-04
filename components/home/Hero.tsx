/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import type { PublicProductCard } from "@/components/home/ProductCard";

interface HeroProps {
  heroImage?: string;
  products?: PublicProductCard[];
}

const fallbackProducts: PublicProductCard[] = [
  {
    id: "fallback-1",
    name: "Ensemble Doré Royal Privilège",
    slug: "boutique",
    categoryName: "Ensembles",
    price: 18500,
    compareAtPrice: null,
    stock: 5,
    imageUrl: "/ensemble.jpg",
    imageOrientation: "portrait",
  },
  {
    id: "fallback-2",
    name: "Bracelet Laiton Poli Signature",
    slug: "boutique",
    categoryName: "Bracelets",
    price: 12000,
    compareAtPrice: null,
    stock: 8,
    imageUrl: "/bracelets.jpg",
    imageOrientation: "portrait",
  },
  {
    id: "fallback-3",
    name: "Chaîne Fine & Pendentif Or",
    slug: "boutique",
    categoryName: "Chaînes",
    price: 15500,
    compareAtPrice: null,
    stock: 4,
    imageUrl: "/chaines.jpg",
    imageOrientation: "portrait",
  },
];

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

function Filigree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
      <path d="M200 30 Q260 100, 260 200 Q260 300, 200 370 Q140 300, 140 200 Q140 100, 200 30Z" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
      <path d="M30 200 Q100 140, 200 140 Q300 140, 370 200 Q300 260, 200 260 Q100 260, 30 200Z" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}

function GemIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l4 6-10 13L2 9l4-6z" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function ChatIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

const trustBadges = [
  { icon: GemIcon, label: "Finition Or" },
  { icon: TruckIcon, label: "Livraison" },
  { icon: ChatIcon, label: "Support 24/7" },
];

export function Hero({ products }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -45]);

  const displayProducts = (products && products.length >= 3)
    ? products.slice(0, 3)
    : (products && products.length > 0)
      ? [...products, ...fallbackProducts].slice(0, 3)
      : fallbackProducts;

  const p1 = displayProducts[0];
  const p2 = displayProducts[1];
  const p3 = displayProducts[2];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--porcelaine,#F1ECE3)]"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(185,121,62,0.08),transparent)] pointer-events-none" />
      <div className="hidden lg:block absolute right-[-5%] top-[-10%] w-[650px] h-[650px] text-[var(--laiton,#B9793E)] pointer-events-none opacity-30">
        <Filigree className="w-full h-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-4 sm:pb-6 lg:pb-8">

        {/* ================= DESKTOP LAYOUT (lg:grid) ================= */}
        <div className="hidden lg:grid items-center gap-12 lg:grid-cols-12">

          {/* LEFT EDITORIAL */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-5"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-white/80 px-4 py-2 text-[11px] font-bold tracking-[0.14em] text-[var(--laiton,#B9793E)] uppercase shadow-xs">
                <span className="text-[var(--laiton)] font-serif">✦</span>
                Sélection Exclusive 3 Produits Vedettes
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-[clamp(2.5rem,6.5vw,4.2rem)] font-bold leading-[1.06] tracking-tight text-[var(--obsidienne,#0E0B09)]"
            >
              L&apos;élégance
              <br />
              commence
              <br />
              <span className="relative inline-block text-[var(--laiton,#B9793E)]">
                ici.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-[var(--laiton,#B9793E)]/40"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-base leading-relaxed text-[var(--obsidienne)]/60"
            >
              Découvrez nos 3 pièces maîtresses du moment. Des produits d'exception conçus avec raffinement pour sublimer votre style.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/boutique"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--obsidienne,#0E0B09)] px-8 py-4 text-sm font-bold tracking-wide text-[var(--porcelaine,#F1ECE3)] shadow-md transition-all hover:bg-[var(--laiton,#B9793E)] hover:shadow-lg"
                >
                  <svg className="h-4 w-4 text-[var(--laiton,#B9793E)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  Découvrir toute la boutique
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex gap-2">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex flex-1 items-center gap-2 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-white/70 backdrop-blur-xs px-3.5 py-2.5 shadow-xs"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--laiton,#B9793E)]/10 text-[var(--laiton,#B9793E)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-[var(--obsidienne)]/70 uppercase">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* RIGHT 3-PRODUCT SHOWCASE (DESKTOP) */}
          <div className="lg:col-span-7 relative h-[520px] xl:h-[560px]">
            {/* PRODUIT 1 */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="absolute left-0 top-6 z-20"
            >
              <Link
                href={p1.slug === 'boutique' ? '/boutique' : `/produit/${p1.slug}`}
                className="group block relative overflow-hidden rounded-[2.5rem] bg-white p-3.5 shadow-[0_20px_50px_-10px_rgba(14,11,9,0.18)] transition-all duration-500 hover:shadow-[0_25px_60px_-10px_rgba(185,121,62,0.3)] hover:-translate-y-1"
              >
                <div className="relative w-[210px] h-[270px] xl:w-[230px] xl:h-[290px] rounded-[2rem] overflow-hidden bg-[var(--porcelaine,#F1ECE3)]">
                  <img
                    src={p1.imageUrl || "/placeholder-product.svg"}
                    alt={p1.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[var(--obsidienne,#0E0B09)]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur-xs">
                    #1 Nouveauté
                  </span>
                </div>
                <div className="mt-3 p-1">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
                    {p1.categoryName}
                  </span>
                  <h3 className="font-sans text-xl font-black text-[var(--obsidienne,#0E0B09)] truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors tracking-tight">
                    {p1.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-sans text-sm font-extrabold text-[var(--obsidienne,#0E0B09)]">
                      {formatFCFA(p1.price)}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--laiton,#B9793E)] group-hover:underline">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* PRODUIT 2 */}
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute right-2 top-0 z-30"
            >
              <Link
                href={p2.slug === 'boutique' ? '/boutique' : `/produit/${p2.slug}`}
                className="group block relative overflow-hidden rounded-[2.2rem] bg-white p-3 shadow-[0_20px_50px_-10px_rgba(14,11,9,0.18)] transition-all duration-500 hover:shadow-[0_25px_60px_-10px_rgba(185,121,62,0.3)] hover:-translate-y-1"
              >
                <div className="relative w-[185px] h-[230px] xl:w-[200px] xl:h-[250px] rounded-[1.8rem] overflow-hidden bg-[var(--porcelaine,#F1ECE3)]">
                  <img
                    src={p2.imageUrl || "/placeholder-product.svg"}
                    alt={p2.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[var(--laiton,#B9793E)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                    #2 Coup de cœur
                  </span>
                </div>
                <div className="mt-2.5 p-1">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
                    {p2.categoryName}
                  </span>
                  <h3 className="font-sans text-lg font-black text-[var(--obsidienne,#0E0B09)] truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors tracking-tight">
                    {p2.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-sans text-sm font-extrabold text-[var(--obsidienne,#0E0B09)]">
                      {formatFCFA(p2.price)}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--laiton,#B9793E)] group-hover:underline">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* PRODUIT 3 */}
            <motion.div
              style={{ y: y3 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="absolute left-[30%] bottom-2 z-10"
            >
              <Link
                href={p3.slug === 'boutique' ? '/boutique' : `/produit/${p3.slug}`}
                className="group block relative overflow-hidden rounded-[2.2rem] bg-white p-3 shadow-[0_20px_50px_-10px_rgba(14,11,9,0.15)] transition-all duration-500 hover:shadow-[0_25px_60px_-10px_rgba(185,121,62,0.3)] hover:-translate-y-1"
              >
                <div className="relative w-[180px] h-[220px] xl:w-[195px] xl:h-[240px] rounded-[1.8rem] overflow-hidden bg-[var(--porcelaine,#F1ECE3)]">
                  <img
                    src={p3.imageUrl || "/placeholder-product.svg"}
                    alt={p3.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[var(--obsidienne,#0E0B09)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200">
                    #3 Incontournable
                  </span>
                </div>
                <div className="mt-2.5 p-1">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
                    {p3.categoryName}
                  </span>
                  <h3 className="font-sans text-lg font-black text-[var(--obsidienne,#0E0B09)] truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors tracking-tight">
                    {p3.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-sans text-sm font-extrabold text-[var(--obsidienne,#0E0B09)]">
                      {formatFCFA(p3.price)}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--laiton,#B9793E)] group-hover:underline">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

        </div>

        {/* ================= MOBILE LAYOUT (lg:hidden) — Haute Joaillerie Luxury & Épuré ================= */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="lg:hidden relative overflow-hidden rounded-[2.5rem] border border-[var(--laiton,#B9793E)]/25 bg-gradient-to-b from-white/95 via-white/80 to-[var(--porcelaine,#F1ECE3)] p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_-15px_rgba(185,121,62,0.18)] text-center my-2"
        >
          {/* Subtle background glow & filigree accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle,rgba(185,121,62,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-48 h-48 text-[var(--laiton,#B9793E)] pointer-events-none opacity-20">
            <Filigree className="w-full h-full" />
          </div>

          <div className="relative z-10 space-y-5">
            {/* LUXURY BADGE */}
            <motion.div variants={fadeUp} className="inline-block">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/35 bg-white/90 px-4 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[var(--laiton,#B9793E)] uppercase shadow-[0_2px_10px_rgba(185,121,62,0.12)]">
                <span className="text-[var(--laiton,#B9793E)] animate-pulse">✦</span>
                <span className="bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#8c5727] to-[var(--laiton,#B9793E)] bg-clip-text text-transparent">
                  Mamou Accessories
                </span>
              </div>
            </motion.div>

            {/* HEADLINE */}
            <motion.h1
              variants={fadeUp}
              className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] leading-[1.12]"
            >
              <span className="font-serif italic font-normal text-[var(--laiton,#B9793E)]">L&apos;élégance</span>
              <br />
              commence ici<span className="text-[var(--laiton,#B9793E)] font-serif">.</span>
            </motion.h1>

            {/* GOLD DIVIDER LINE */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 my-2">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[var(--laiton,#B9793E)]/40" />
              <span className="text-[10px] text-[var(--laiton,#B9793E)]">❖</span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[var(--laiton,#B9793E)]/40" />
            </motion.div>

            {/* SUBTITLE */}
            <motion.p
              variants={fadeUp}
              className="text-xs sm:text-sm text-[var(--obsidienne)]/75 max-w-xs mx-auto leading-relaxed font-sans"
            >
              Des pièces d'exception choisies avec soin pour une allure raffinée et affirmée au quotidien.
            </motion.p>

            {/* HIGH-END CTA BUTTON */}
            <motion.div variants={fadeUp} className="pt-2">
              <Link
                href="/boutique"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[var(--obsidienne,#0E0B09)] py-4 px-7 text-xs font-bold tracking-[0.14em] text-[var(--porcelaine,#F1ECE3)] uppercase shadow-[0_12px_35px_-8px_rgba(14,11,9,0.4)] transition-all duration-300 active:scale-[0.96] border border-[var(--laiton,#B9793E)]/40 overflow-hidden"
              >
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)] text-white shadow-xs">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </span>

                <span className="relative z-10">Découvrir la boutique</span>

                <svg className="w-4 h-4 text-[var(--laiton,#B9793E)] transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>

          </div>

        </motion.div>

        {/* ================= CARTE SÉPARÉE PROCESSUS 3 ÉTAPES (Choisis. Ajoute. Valide.) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 mx-auto max-w-xl px-2"
        >
          <Link
            href="/boutique"
            className="group block relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#FAF6EE] via-[#FFFDF9] to-[#FAF6EE] border border-[#EBE3D5] p-4 pl-6 pr-4 sm:p-5 sm:pl-8 sm:pr-5 shadow-[0_8px_30px_rgba(14,11,9,0.06)] hover:shadow-[0_16px_40px_rgba(185,121,62,0.14)] transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Contenu Texte à gauche */}
              <div className="flex flex-col justify-center">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--laiton,#B9793E)] mb-1">
                  EXPÉRIENCE BOUTIQUE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] font-medium tracking-tight text-[var(--obsidienne,#0E0B09)] leading-none">
                  Choisis. Ajoute. Valide.
                </h3>
              </div>

              {/* Bouton Rond Noir avec Flèche à droite */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[var(--obsidienne,#0E0B09)] text-white shadow-md group-hover:bg-[var(--laiton,#B9793E)] transition-colors duration-300"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.div>
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}