"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Monitor, Share, Plus, MoreVertical, Download } from "lucide-react";

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

    // For iOS, show modal after 2 seconds (iOS doesn't support beforeinstallprompt)
    if (isIOS) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    // For Android/Desktop without prompt, show after 3 seconds
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowModal(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowModal(false);
        localStorage.setItem("pwa-install-dismissed", "true");
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const handleRemindLater = () => {
    setShowModal(false);
    // Don't set localStorage so it shows again on next visit
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleRemindLater}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-in slide-in-from-bottom-8 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-neutral-100">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#B8935E] to-[#D4AF76] rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Installer l'application
                </h2>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Mamou's Accessories
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-neutral-700 mb-6">
              Installez notre application pour une expérience optimale avec :
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-lg mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Accès rapide</p>
                  <p className="text-sm text-neutral-600">Directement depuis votre écran d'accueil</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Mode hors ligne</p>
                  <p className="text-sm text-neutral-600">Consultez vos favoris sans connexion</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-100 rounded-lg mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Expérience native</p>
                  <p className="text-sm text-neutral-600">Interface fluide comme une app</p>
                </div>
              </div>
            </div>

            {/* Device-specific instructions */}
            {deviceType === "ios" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Instructions pour iOS
                </p>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span>Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline" /> (en bas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span>Sélectionnez <strong>"Sur l'écran d'accueil"</strong> <Plus className="w-3.5 h-3.5 inline" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    <span>Appuyez sur <strong>"Ajouter"</strong></span>
                  </li>
                </ol>
              </div>
            )}

            {deviceType === "android" && !deferredPrompt && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <MoreVertical className="w-4 h-4" />
                  Instructions pour Android
                </p>
                <ol className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span>Ouvrez le menu <MoreVertical className="w-3.5 h-3.5 inline" /> (en haut à droite)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span>Appuyez sur <strong>"Installer l'application"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    <span>Confirmez l'installation</span>
                  </li>
                </ol>
              </div>
            )}

            {deviceType === "desktop" && !deferredPrompt && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Instructions pour ordinateur
                </p>
                <ol className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span>Cliquez sur l'icône <Download className="w-3.5 h-3.5 inline" /> dans la barre d'adresse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span>Sélectionnez <strong>"Installer"</strong></span>
                  </li>
                </ol>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-[#B8935E] to-[#D4AF76] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  Installer maintenant
                </button>
              ) : (
                <button
                  onClick={handleRemindLater}
                  className="flex-1 bg-gradient-to-r from-[#B8935E] to-[#D4AF76] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  J'ai compris
                </button>
              )}

              <button
                onClick={handleRemindLater}
                className="px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
              >
                Plus tard
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full mt-2 text-sm text-neutral-500 hover:text-neutral-700 py-2 transition-colors"
            >
              Ne plus afficher
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
