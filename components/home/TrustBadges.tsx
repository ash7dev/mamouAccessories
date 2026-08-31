"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   TrustBadges — réassurance avant achat

   Traitement éditorial : trois repères posés comme des entrées
   de catalogue (icône fine + titre + description), séparés par
   un simple filet plutôt que des cartes. Un seul accent doré,
   pas d'ombre, pas de verre — cohérent avec le Hero et les
   Collections.
   ============================================================ */

function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 5.25-3.75 9.75-9 11-5.25-1.25-9-5.75-9-11V6.75L12 3l9 3.75V12z" />
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

/* Marque graphique unique du site (déjà utilisée en placeholder du Hero) :
   un losange fin en guise de repère, plutôt qu'une icône décorative. */
function DiamondMark({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center">
      <span className="absolute inset-0 rotate-45 rounded-[14px] border border-[var(--gold)]/35" />
      <span className="relative text-[var(--gold-dark)]">{children}</span>
    </span>
  );
}

const badges = [
  { icon: TruckIcon, title: "Livraison rapide", desc: "Dakar & toutes les régions" },
  { icon: ShieldIcon, title: "Paiement Wave", desc: "Simple et sécurisé" },
  { icon: ChatIcon, title: "À votre écoute", desc: "Réponse rapide sur WhatsApp" },
];

export function TrustBadges() {
  return (
    <section className="bg-[var(--ivory)]/40 px-5 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-10 text-center lg:mb-14"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] text-[var(--gold-dark)]"
            style={{ fontVariant: "small-caps", letterSpacing: "0.03em" }}
          >
            Nos engagements
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-cinzel mt-3 text-3xl font-bold text-[var(--text-dark)] lg:text-4xl"
          >
            Pourquoi nous choisir
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-14 bg-[var(--gold)]"
            aria-hidden
          />
        </motion.div>

        {/* Mobile : liste en lignes séparées par un filet, icône + texte côte à côte.
            Desktop : trois colonnes séparées par un filet vertical, façon fiche catalogue. */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="divide-y divide-[var(--text-dark)]/10 lg:grid lg:grid-cols-3 lg:divide-y-0 lg:divide-x"
        >
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={fadeUp}
                className="flex items-center gap-4 py-5 lg:flex-col lg:items-center lg:px-8 lg:py-2 lg:text-center"
              >
                <DiamondMark>
                  <Icon />
                </DiamondMark>

                <div className="lg:mt-4">
                  <h3 className="font-cinzel text-base font-bold text-[var(--text-dark)] lg:text-lg">
                    {b.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--text-dark)]/60 lg:mt-1.5">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}