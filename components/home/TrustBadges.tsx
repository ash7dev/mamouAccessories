"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   TrustBadges — arguments de réassurance

   Rassure la cliente avant l'achat : livraison locale, paiement
   Wave sécurisé, réponse rapide WhatsApp. Rangée horizontale
   discrète mais efficace.
   ============================================================ */

function TruckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12.75L11.25 15 15 9.75M21 12c0 5.25-3.75 9.75-9 11-5.25-1.25-9-5.75-9-11V6.75L12 3l9 3.75V12z" />
    </svg>
  );
}

function ChatIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

const badges = [
  { icon: TruckIcon, title: "Livraison rapide", desc: "Dakar & toutes les régions" },
  { icon: ShieldIcon, title: "Paiement Wave", desc: "Simple et sécurisé" },
  { icon: ChatIcon, title: "À votre écoute", desc: "Réponse rapide sur WhatsApp" },
];

export function TrustBadges() {
  return (
    <section className="px-5 py-6 lg:px-8">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl border border-[var(--gold)]/15 bg-white p-4 shadow-[0_1px_2px_rgba(43,33,24,0.04)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/20">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-dark)]">{b.title}</p>
                <p className="text-xs text-[var(--text-dark)]/50">{b.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}