"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2, Sparkles, Gift } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Adresse email invalide");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        toast.success("Inscription réussie !", {
          description: "Vous recevrez nos dernières actualités par email.",
        });
      } else {
        toast.error(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      toast.error("Impossible de s'inscrire pour le moment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-20 lg:px-8 lg:py-24 bg-[var(--porcelaine)] relative overflow-hidden">
      {/* Halo décoratif d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--laiton)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Carte Vitrine Obsidienne */}
          <div className="relative bg-[var(--obsidienne)] text-[var(--texte-nuit)] rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-[var(--laiton)]/25 shadow-[0_24px_64px_-16px_rgba(14,11,9,0.5)] overflow-hidden">
            {/* Ligne filet laiton supérieure */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--laiton)] to-transparent opacity-80" />

            {/* Ornement cercles dorés concentriques d'ambiance */}
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 opacity-35 sm:opacity-45">
              <div className="h-80 w-80 rounded-full border border-[var(--laiton)]/20 animate-spin-slow" />
              <div className="absolute inset-10 rounded-full border border-[var(--laiton)]/30" />
              <div className="absolute inset-20 rounded-full border border-[var(--laiton)]/40" />
            </div>

            {/* Halo lumineux d'ambiance */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[var(--laiton)]/15 blur-3xl"
            />

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Côté Gauche - Contenu */}
              <div className="text-center md:text-left">
                {/* Icône avec lueur dorée */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--laiton)]/30 blur-xl rounded-full" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--obsidienne-soft)] ring-1 ring-[var(--laiton)]/40 text-[var(--laiton-clair)] shadow-inner">
                      <Gift className="h-8 w-8" />
                    </div>
                  </div>
                </motion.div>

                {/* Tag de surtitre */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center md:justify-start gap-2 mb-3"
                >
                  <Sparkles className="w-4 h-4 text-[var(--laiton-clair)]" />
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--laiton-clair)]">
                    Cercle Privé
                  </p>
                  <Sparkles className="w-4 h-4 text-[var(--laiton-clair)]" />
                </motion.div>

                {/* Titre avec typographie Outfit */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight"
                >
                  Restez Inspiré
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-base text-[var(--texte-nuit)]/75 leading-relaxed mb-6 font-sans"
                >
                  Rejoignez notre cercle privé pour recevoir en avant-première nos nouvelles créations,
                  invitations exclusives et conseils de style personnalisés.
                </motion.p>

                {/* Avantages */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2.5 justify-center md:justify-start"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne-soft)] border border-[var(--laiton)]/30 px-3.5 py-1.5 text-xs font-medium text-[var(--texte-nuit)]/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--laiton)]" />
                    Offres Exclusives
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne-soft)] border border-[var(--laiton)]/30 px-3.5 py-1.5 text-xs font-medium text-[var(--texte-nuit)]/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--laiton)]" />
                    Avant-premières
                  </span>
                </motion.div>
              </div>

              {/* Côté Droit - Formulaire */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-[var(--obsidienne-soft)] rounded-3xl p-6 md:p-8 border border-[var(--laiton)]/25 shadow-xl relative"
              >
                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--texte-nuit)] mb-2.5">
                        Votre adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--laiton-clair)]/60" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full rounded-2xl bg-[var(--obsidienne)] border border-[var(--laiton)]/30 pl-12 pr-4 py-3.5 text-sm text-[var(--texte-nuit)] placeholder:text-[var(--texte-nuit)]/40 focus:border-[var(--laiton-clair)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton)]/25 transition-all"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-2xl bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-6 py-4 font-bold text-white shadow-lg shadow-[var(--laiton)]/20 hover:shadow-xl hover:shadow-[var(--laiton)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Inscription en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Rejoindre le cercle</span>
                          <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-[var(--texte-nuit)]/50 text-center leading-relaxed">
                      En vous inscrivant, vous acceptez notre politique de confidentialité.
                      <br className="hidden md:block" />
                      Désinscription en un clic à tout moment.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="relative mb-4"
                    >
                      <div className="absolute inset-0 bg-[var(--laiton)]/20 blur-xl rounded-full" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--laiton)]/20 ring-1 ring-[var(--laiton)]/40 text-[var(--laiton-clair)]">
                        <Check className="h-8 w-8" />
                      </div>
                    </motion.div>
                    <p className="text-xl font-bold text-white mb-2 font-heading">
                      Bienvenue dans le cercle !
                    </p>
                    <p className="text-[var(--texte-nuit)]/70 text-sm">
                      Vous recevrez très prochainement nos actualités et offres privées.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
