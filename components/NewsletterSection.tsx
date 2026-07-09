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
        toast.success("Inscription reussie !", {
          description: "Vous recevrez nos dernieres actualites par email.",
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
    <section className="px-6 py-20 lg:px-8 lg:py-24 bg-gradient-to-br from-[var(--ivory)]/50 via-white to-[var(--ivory)]/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8935E\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--gold)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[var(--gold)]/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Premium Card Container */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-[var(--gold)]/10 border border-[var(--gold)]/20 overflow-hidden">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
            
            {/* Inner Content */}
            <div className="p-8 md:p-12 lg:p-16">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left Side - Content */}
                <div className="text-center md:text-left">
                  {/* Icon with Glow */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-[var(--gold)]/30 blur-xl rounded-full" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 ring-1 ring-[var(--gold)]/30">
                        <Gift className="h-10 w-10 text-[var(--gold-dark)]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Eyebrow */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center md:justify-start gap-2 mb-4"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-dark)]">
                      Exclusivités
                    </p>
                    <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-dark)] mb-4 leading-tight"
                  >
                    Restez Inspiré
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-lg text-[var(--text-dark)]/60 leading-relaxed mb-6"
                  >
                    Rejoignez notre cercle privé et recevez en avant-première nos nouvelles collections,
                    offres exclusives et conseils de style personnalisés.
                  </motion.p>

                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-3 justify-center md:justify-start"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ivory)] px-4 py-2 text-xs font-medium text-[var(--text-dark)]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                      Promotions exclusives
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ivory)] px-4 py-2 text-xs font-medium text-[var(--text-dark)]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                      Nouveautés en avant-première
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ivory)] px-4 py-2 text-xs font-medium text-[var(--text-dark)]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                      Conseils de style
                    </span>
                  </motion.div>
                </div>

                {/* Right Side - Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-[var(--ivory)]/80 to-[var(--ivory)]/40 rounded-3xl p-6 md:p-8 border border-[var(--gold)]/10"
                >
                  {!isSubscribed ? (
                    <form onSubmit={handleSubscribe} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                          Votre adresse email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-dark)]/40" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full rounded-2xl bg-white border border-[var(--gold)]/20 pl-12 pr-4 py-4 text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-2xl bg-gradient-to-r from-[var(--espresso)] to-[#2B2118] px-6 py-4 font-semibold text-white hover:from-[var(--espresso)]/90 hover:to-[#2B2118]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[var(--espresso)]/20 hover:shadow-xl hover:shadow-[var(--espresso)]/30 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Inscription...</span>
                          </>
                        ) : (
                          <>
                            <span>Je m'inscris</span>
                            <Sparkles className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-[var(--text-dark)]/50 text-center leading-relaxed">
                        En vous inscrivant, vous acceptez notre politique de confidentialité. 
                        <br className="hidden md:block" />
                        Vous pouvez vous désinscrire à tout moment.
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
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                          <Check className="h-10 w-10 text-emerald-600" />
                        </div>
                      </motion.div>
                      <p className="text-xl font-bold text-[var(--text-dark)] mb-2">
                        Bienvenue !
                      </p>
                      <p className="text-[var(--text-dark)]/60 text-sm">
                        Vous recevrez bientôt nos actualités exclusives
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
