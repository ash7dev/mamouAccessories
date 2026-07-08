"use client";

/* ============================================================
   Variantes d'animation partagées — lib/motion.ts

   Centralise les animations Framer Motion pour une page d'accueil
   cohérente. Règle premium : discrétion. Des entrées douces au
   scroll, jamais de mouvement gratuit.

   Usage :
     import { motion } from "framer-motion";
     import { fadeUp, stagger } from "@/lib/motion";

     <motion.div variants={stagger} initial="hidden" whileInView="show"
                 viewport={{ once: true, margin: "-80px" }}>
       <motion.h2 variants={fadeUp}>Titre</motion.h2>
     </motion.div>
   ============================================================ */

import type { Variants } from "framer-motion";

/** Apparition depuis le bas, douce */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Simple fondu */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/** Léger zoom + fondu (visuels, cartes vedettes) */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Conteneur qui décale l'entrée de ses enfants */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Réglage viewport standard : joue une seule fois, un peu avant l'entrée */
export const viewportOnce = { once: true, margin: "-80px" } as const;