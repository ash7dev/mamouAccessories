"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
      // TEMPORARY BYPASS - Remove when Supabase issue is resolved
      if (email === "mamouadmin@gmail.com" && password === "Chicgirl2003") {
        // Set a temporary flag in cookie (for middleware) and localStorage (for client)
        document.cookie = "temp_admin_auth=true; path=/; max-age=86400"; // 24 hours
        localStorage.setItem("temp_admin_auth", "true");
        router.push("/admin");
        router.refresh();
        return;
      }

      // Original Supabase auth (will work once their issue is fixed)
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
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Partie gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col">
              <span className="text-3xl font-bold text-foreground tracking-tight">
                Mamou
              </span>
              <span className="text-sm text-primary font-medium tracking-widest -mt-1">
                JEWELRY
              </span>
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Espace Administrateur
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous pour gérer votre boutique
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg
                           text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           transition-all"
                  placeholder="admin@mamoujewelry.com"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg
                           text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg
                         hover:bg-gold-dark transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>
          </div>

          {/* Note de sécurité */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Connexion sécurisée · Vos données sont protégées
          </p>
        </div>
      </div>

      {/* Partie droite - Image/Design (desktop uniquement) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-secondary to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          {/* Icône décorative */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Texte */}
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Gérez votre boutique
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Accédez à votre tableau de bord pour gérer vos produits, commandes et clientes en toute simplicité.
          </p>

          {/* Stats décoratives */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">1K+</div>
              <div className="text-sm text-muted-foreground">Commandes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
