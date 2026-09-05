"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Share,
  Plus,
  MoreVertical,
  Download,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  Check,
} from "lucide-react";

type DeviceType = "ios" | "android" | "desktop" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if user has already dismissed or installed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    if (dismissed || isInstalled) {
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    let device: DeviceType = "unknown";
    if (isIOS) device = "ios";
    else if (isAndroid) device = "android";
    else if (isDesktop) device = "desktop";

    setDeviceType(device);

    // Listen for the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowModal(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show modal after 2.5 seconds
    if (isIOS) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    // For Android/Desktop without prompt, show after 3.5 seconds
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowModal(true);
      }
    }, 3500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowModal(false);
        localStorage.setItem("pwa-install-dismissed", "true");
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(false);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const handleRemindLater = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-3 sm:p-5 pointer-events-auto">
        {/* Backdrop avec flou haute joaillerie */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleRemindLater}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Box Modal Luxury Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#19130F] via-[#0E0B09] to-[#0A0806] p-6 sm:p-7 text-white border border-[var(--laiton,#B9793E)]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
        >
          {/* Accent Doré Décoratif en Arrière-plan */}
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-[var(--laiton,#B9793E)]/15 blur-3xl pointer-events-none" />

          {/* Header Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Identity */}
          <div className="flex items-start gap-4 pb-5 border-b border-white/10">
            {/* Logo / Badge App d'Or */}
            <div className="relative shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#241B14] to-[#120E0B] border-2 border-[var(--laiton,#B9793E)]/60 shadow-[0_0_20px_rgba(185,121,62,0.35)]">
              <Sparkles className="h-7 w-7 text-[var(--laiton-clair,#D9AE78)]" />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)] text-[var(--obsidienne)] text-[10px] font-bold">
                ✦
              </div>
            </div>

            <div className="pr-6">
              <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] mb-0.5">
                ✦ APPLICATION PRIVILÈGE
              </span>
              <h2 className="font-serif text-xl font-bold text-[#F1ECE3] leading-tight">
                Maison Mamou's
              </h2>
              <p className="text-xs text-white/60 font-medium mt-0.5">
                Accès direct & expérience haute joaillerie
              </p>
            </div>
          </div>

          {/* Features Privilège */}
          <div className="py-5 space-y-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton)]/30 text-[var(--laiton-clair,#D9AE78)]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">Accès Rapide 1-Clic</p>
                <p className="text-[11px] text-white/55">Directement depuis votre écran d'accueil</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton)]/30 text-[var(--laiton-clair,#D9AE78)]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">Offres & Sorties Privées</p>
                <p className="text-[11px] text-white/55">Soyez avertie avant l'épuisement des stocks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton)]/30 text-[var(--laiton-clair,#D9AE78)]">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">Fluidité & Mode Hors-Ligne</p>
                <p className="text-[11px] text-white/55">Consultez vos favoris sans connexion</p>
              </div>
            </div>
          </div>

          {/* Instructions spécifiques par appareil */}
          <div className="py-4">
            {deviceType === "ios" && (
              <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 p-3.5 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] flex items-center gap-1.5">
                  <Share className="h-3.5 w-3.5" /> Instructions iPhone / Safari
                </p>
                <ol className="space-y-1.5 text-[11px] text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--laiton)]/30 text-[9px] font-mono font-bold text-white">1</span>
                    <span>Appuyez sur <Share className="inline h-3.5 w-3.5 text-[var(--laiton-clair)] mx-1" /> <strong>Partager</strong> en bas de l'écran</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--laiton)]/30 text-[9px] font-mono font-bold text-white">2</span>
                    <span>Sélectionnez <Plus className="inline h-3.5 w-3.5 text-[var(--laiton-clair)] mx-1" /> <strong>"Sur l'écran d'accueil"</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--laiton)]/30 text-[9px] font-mono font-bold text-white">3</span>
                    <span>Confirmez en cliquant sur <strong>"Ajouter"</strong></span>
                  </li>
                </ol>
              </div>
            )}

            {deviceType === "android" && !deferredPrompt && (
              <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 p-3.5 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] flex items-center gap-1.5">
                  <MoreVertical className="h-3.5 w-3.5" /> Instructions Android / Chrome
                </p>
                <ol className="space-y-1.5 text-[11px] text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--laiton)]/30 text-[9px] font-mono font-bold text-white">1</span>
                    <span>Ouvrez le menu <MoreVertical className="inline h-3.5 w-3.5 text-[var(--laiton-clair)] mx-1" /> (3 points en haut)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--laiton)]/30 text-[9px] font-mono font-bold text-white">2</span>
                    <span>Appuyez sur <strong>"Installer l'application"</strong></span>
                  </li>
                </ol>
              </div>
            )}

            {deviceType === "desktop" && !deferredPrompt && (
              <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 p-3.5 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Instructions Ordinateur
                </p>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Cliquez sur l'icône d'installation <Download className="inline h-3.5 w-3.5 text-[var(--laiton-clair)] mx-1" /> située dans la barre d'adresse de votre navigateur.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleInstallClick}
              className="flex w-full h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#E5C195] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] text-xs font-extrabold uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(185,121,62,0.4)] hover:brightness-110 transition-all cursor-pointer"
            >
              {deferredPrompt ? (
                <>
                  <Download className="h-4 w-4 stroke-[2.2]" />
                  <span>Installer l'application</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>J'ai compris</span>
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-between px-2 pt-1">
              <button
                onClick={handleRemindLater}
                className="text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Plus tard
              </button>

              <button
                onClick={handleDismiss}
                className="text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                Ne plus afficher
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

