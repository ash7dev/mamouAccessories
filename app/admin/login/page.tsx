"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── Filigrane Or Décoratif ─── */
function FiligreePattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 500" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <circle cx="250" cy="250" r="190" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      <path d="M250 20 Q330 120, 330 250 Q330 380, 250 480 Q170 380, 170 250 Q170 120, 250 20Z" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      <path d="M20 250 Q120 170, 250 170 Q380 170, 480 250 Q380 330, 250 330 Q120 330, 20 250Z" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      <circle cx="250" cy="250" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TEMPORARY BYPASS - Mamou Admin Credentials
      if (email === "mamouadmin@gmail.com" && password === "Chicgirl2003") {
        document.cookie = "temp_admin_auth=true; path=/; max-age=31536000; SameSite=Lax"; // 1 year permanent login
        localStorage.setItem("temp_admin_auth", "true");
        router.push("/admin");
        router.refresh();
        return;
      }

      // Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        localStorage.removeItem("temp_admin_auth");
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects. Vérifiez votre email et mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--obsidienne,#0E0B09)] text-[var(--texte-nuit,#F1ECE3)] flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-[var(--laiton,#B9793E)] selection:text-[var(--obsidienne,#0E0B09)]">
      
      {/* Glows d'arrière-plan */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-96 h-96 bg-[var(--laiton,#B9793E)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Partie gauche — Formulaire de Connexion */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10 relative">
        
        {/* Top Header : Lien retour site */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--laiton,#B9793E)] hover:text-[var(--laiton-clair,#D9AE78)] transition-colors uppercase"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour au site
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--laiton,#B9793E)]/25 bg-[var(--laiton)]/[0.08] px-3.5 py-1 text-[10px] font-bold tracking-[0.15em] text-[var(--laiton-clair,#D9AE78)] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--laiton,#B9793E)] animate-pulse" />
            Espace Sécurisé
          </span>
        </div>

        {/* Zone centrale : Formulaire */}
        <div className="w-full max-w-md mx-auto my-auto py-10">
          
          {/* Logo & Titre */}
          <div className="text-center mb-10">
            <div className="inline-block mb-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Mamou&apos;s
              </h1>
              <span className="block text-[11px] font-semibold tracking-[0.35em] text-[var(--laiton,#B9793E)] uppercase -mt-1">
                ACCESSORIES
              </span>
            </div>
            
            <h2 className="mt-4 text-xl font-semibold text-[var(--porcelaine,#F1ECE3)]/90">
              Administration
            </h2>
            <p className="mt-1 text-xs text-[var(--porcelaine,#F1ECE3)]/50">
              Connectez-vous pour piloter votre boutique d&apos;exception.
            </p>
          </div>

          {/* Carte Formulaire Glassmorphic */}
          <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/90 backdrop-blur-xl p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Champ Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-[var(--porcelaine,#F1ECE3)]/80 uppercase">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--laiton,#B9793E)]/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="admin@mamoujewelry.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[var(--obsidienne,#0E0B09)]/90 border border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)] text-sm placeholder:text-[var(--porcelaine,#F1ECE3)]/25 focus:outline-none focus:border-[var(--laiton,#B9793E)] focus:ring-1 focus:ring-[var(--laiton,#B9793E)] transition-all"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-semibold tracking-wider text-[var(--porcelaine,#F1ECE3)]/80 uppercase">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--laiton,#B9793E)]/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[var(--obsidienne,#0E0B09)]/90 border border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)] text-sm placeholder:text-[var(--porcelaine,#F1ECE3)]/25 focus:outline-none focus:border-[var(--laiton,#B9793E)] focus:ring-1 focus:ring-[var(--laiton,#B9793E)] transition-all"
                  />
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[var(--grenat,#7A2E32)]/50 bg-[var(--grenat,#7A2E32)]/15 px-4 py-3 text-xs text-red-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Bouton de Connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] bg-[length:200%_auto] py-4 text-xs font-bold tracking-widest text-[var(--obsidienne,#0E0B09)] uppercase shadow-[0_10px_30px_-5px_rgba(185,121,62,0.35)] transition-all duration-500 hover:bg-right hover:shadow-[0_15px_40px_-5px_rgba(185,121,62,0.45)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-[var(--obsidienne)]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Connexion
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Footer bas de page */}
        <div className="text-center text-[11px] text-[var(--porcelaine,#F1ECE3)]/40 font-medium">
          Mamou&apos;s Accessories © {new Date().getFullYear()} · Tous droits réservés
        </div>
      </div>

      {/* Partie droite — Visual Vitrine Luxe (Desktop uniquement) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-[var(--obsidienne-soft,#17120D)] items-center justify-center p-12 overflow-hidden border-l border-[var(--laiton,#B9793E)]/15">
        
        {/* Filigrane SVG rotatif en fond */}
        <div className="absolute w-[600px] h-[600px] text-[var(--laiton,#B9793E)] pointer-events-none opacity-20 animate-[spin_120s_linear_infinite]">
          <FiligreePattern className="w-full h-full" />
        </div>

        {/* Glow central */}
        <div className="absolute w-80 h-80 bg-[var(--laiton,#B9793E)]/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
          
          {/* Cadre photo ovale signature Mamou */}
          <div className="relative mb-10 group">
            <div className="w-[240px] h-[320px] rounded-[50%] overflow-hidden border-2 border-[var(--laiton,#B9793E)]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:border-[var(--laiton)] group-hover:shadow-[0_30px_70px_-15px_rgba(185,121,62,0.3)]">
              <img
                src="/ensemble.jpg"
                alt="Mamou's Accessories Excellence"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Tag flottant sur la photo */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--laiton)]/30 bg-[var(--obsidienne)] px-5 py-2 text-[10px] font-bold tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)] uppercase shadow-lg">
                ✦ Maison Mamou
              </span>
            </div>
          </div>

          {/* Citation / Message éditorial */}
          <h3 className="font-heading text-2xl font-bold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
            L&apos;excellence administrative au service de l&apos;élégance.
          </h3>
          
          <p className="mt-3 text-xs leading-relaxed text-[var(--porcelaine,#F1ECE3)]/60 max-w-sm">
            Gérez vos stocks, analysez vos ventes et sublimez la relation client à partir d&apos;un espace dédié et sécurisé.
          </p>

          {/* Stat-badges luxe */}
          <div className="mt-10 grid grid-cols-3 gap-6 w-full max-w-sm border-t border-[var(--laiton,#B9793E)]/15 pt-8">
            <div className="text-center">
              <span className="block font-heading text-xl font-bold text-[var(--laiton-clair,#D9AE78)]">100%</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--porcelaine)]/40 uppercase">Sécurisé</span>
            </div>
            <div className="text-center">
              <span className="block font-heading text-xl font-bold text-[var(--laiton-clair,#D9AE78)]">En direct</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--porcelaine)]/40 uppercase">Stocks</span>
            </div>
            <div className="text-center">
              <span className="block font-heading text-xl font-bold text-[var(--laiton-clair,#D9AE78)]">Luxe</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--porcelaine)]/40 uppercase">Finition</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
