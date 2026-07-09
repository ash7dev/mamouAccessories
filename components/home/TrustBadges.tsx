"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Sparkles } from "lucide-react";

/* ============================================================
   TrustBadges — arguments de réassurance

   Rassure la cliente avant l'achat : livraison locale, paiement
   Wave sécurisé, réponse rapide WhatsApp.

   Signature visuelle : chaque badge est logé dans une icône en
   forme de "dossier" façon macOS Big Sur (corps + languette),
   dégradé doré et léger reflet glossy — un clin d'œil moderne
   et reconnaissable, sans surcharger le reste de la carte.
   ============================================================ */

function TruckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12.75L11.25 15 15 9.75M21 12c0 5.25-3.75 9.75-9 11-5.25-1.25-9-5.75-9-11V6.75L12 3l9 3.75V12z" />
    </svg>
  );
}

function ChatIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

/* Icône "dossier" façon macOS : languette + corps, même dégradé,
   léger contour clair et reflet en haut pour l'effet glossy. */
function FolderBadge({
  gradId,
  angle,
  children,
}: {
  gradId: string;
  angle: number;
  children: React.ReactNode;
}) {
  return (
    <span className="relative h-16 w-[68px] shrink-0 transition-transform duration-300 ease-out group-hover:-rotate-2 group-hover:scale-[1.04]">
      <svg
        viewBox="0 0 100 88"
        className="absolute inset-0 h-full w-full drop-shadow-[0_10px_16px_rgba(154,110,40,0.22)]"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`rotate(${angle} 0.5 0.5)`}>
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-dark)" />
          </linearGradient>
          <linearGradient id={`${gradId}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* languette */}
        <rect x="8" y="6" width="40" height="20" rx="8" fill={`url(#${gradId})`} />
        {/* corps */}
        <rect
          x="6"
          y="22"
          width="88"
          height="60"
          rx="17"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        {/* reflet glossy */}
        <rect x="6" y="22" width="88" height="26" rx="17" fill={`url(#${gradId}-sheen)`} />
      </svg>

      <span className="absolute inset-x-0 top-[58%] flex -translate-y-1/2 items-center justify-center text-white">
        {children}
      </span>
    </span>
  );
}

const badges = [
  { icon: TruckIcon, title: "Livraison rapide", desc: "Dakar & toutes les régions", angle: 125 },
  { icon: ShieldIcon, title: "Paiement Wave", desc: "Simple et sécurisé", angle: 145 },
  { icon: ChatIcon, title: "À votre écoute", desc: "Réponse rapide sur WhatsApp", angle: 115 },
];

export function TrustBadges() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20 bg-gradient-to-br from-[var(--ivory)]/30 via-white to-[var(--ivory)]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8935E\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[var(--gold)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--gold)]/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-dark)]">
              Nos engagements
            </p>
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-dark)] mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-dark)]/60 max-w-2xl mx-auto">
            Une expérience d'achat pensée pour vous, avec des services adaptés à vos besoins
          </p>
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={fadeUp}
                className="group relative"
              >
                <div className="relative h-full rounded-[2rem] bg-white border border-[var(--gold)]/10 p-5 md:p-8 shadow-lg shadow-[var(--gold)]/5 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/10 hover:border-[var(--gold)]/20 hover:-translate-y-1">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative mb-4 md:mb-6 inline-flex"
                  >
                    <FolderBadge gradId={`badge-grad-${i}`} angle={b.angle}>
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </FolderBadge>
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-cinzel text-lg md:text-xl font-bold text-[var(--text-dark)] mb-2 md:mb-3">
                    {b.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--text-dark)]/60 leading-relaxed">
                    {b.desc}
                  </p>

                  {/* Decorative Line */}
                  <div className="mt-4 md:mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/20" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-full bg-white px-8 py-4 border border-[var(--gold)]/10 shadow-lg shadow-[var(--gold)]/5">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Sparkles
                  key={i}
                  className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]"
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[var(--text-dark)]">
              +50 clientes satisfaites
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}