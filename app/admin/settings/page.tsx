"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ParametreHeader } from "@/components/admin/settings/parametre-header";
import { SettingsSection } from "@/components/admin/settings/settings-section";
import { CreditCard, Truck, MessageSquare, Store, Bell, Shield, LogOut, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { isSoundEnabled, setSoundEnabled, playOrderPingSound, getSoundType, setSoundType, SOUND_OPTIONS, SoundType } from "@/lib/audio-notifier";

interface SettingsData {
  wave_link: string;
  delivery_fee_zone1: string;
  delivery_fee_zone2: string;
  delivery_fee_zone3: string;
  delivery_fee_zone4: string;
  delivery_fee_zone5: string;
  delivery_days: string;
  whatsapp_number: string;
  store_name: string;
  store_description: string;
  notifications_orders: boolean;
  notifications_low_stock: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saveState, setSaveState] = useState<"saved" | "saving" | "dirty">("saved");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [selectedSoundType, setSelectedSoundTypeState] = useState<SoundType>("luxe_crystal");
  const [pushStatus, setPushStatus] = useState<"granted" | "default" | "denied" | "unsupported">("default");
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);

  useEffect(() => {
    setSoundEnabledState(isSoundEnabled());
    setSelectedSoundTypeState(getSoundType());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission as any);
    } else {
      setPushStatus("unsupported");
    }
  }, []);

  const handleActivatePush = async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Votre navigateur ne supporte pas les notifications Push Web.");
      return;
    }

    setIsSubscribingPush(true);
    try {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register("/sw.js");
      }

      const permission = await Notification.requestPermission();
      setPushStatus(permission as any);

      if (permission !== "granted") {
        toast.error("Permission refusée pour les notifications Push.");
        setIsSubscribingPush(false);
        return;
      }

      const keyRes = await fetch("/api/admin/push/vapid-key");
      const keyData = await keyRes.json();
      const publicKey = keyData?.publicKey;

      if (!publicKey) {
        toast.error("Impossible de récupérer la clé VAPID Push.");
        setIsSubscribingPush(false);
        return;
      }

      const { urlBase64ToUint8Array } = await import("@/lib/push-notifications");
      const convertedKey = urlBase64ToUint8Array(publicKey) as unknown as BufferSource;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      const subRes = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (subRes.ok) {
        toast.success("📲 Notifications Push Web (Style WhatsApp) activées avec succès sur cet appareil !");
      } else {
        toast.error("Erreur lors de l'enregistrement de l'abonnement Push.");
      }
    } catch (err: any) {
      console.error("Error activating Web Push:", err);
      toast.error(err.message || "Erreur lors de l'activation des notifications Push.");
    } finally {
      setIsSubscribingPush(false);
    }
  };
  const [formData, setFormData] = useState<SettingsData>({
    wave_link: "https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/",
    delivery_fee_zone1: "2000",
    delivery_fee_zone2: "2500",
    delivery_fee_zone3: "3500",
    delivery_fee_zone4: "3500",
    delivery_fee_zone5: "3500",
    delivery_days: "1",
    whatsapp_number: "+221774907955",
    store_name: "Mamou's Accessories",
    store_description: "Bijouterie fine & pièces d'exception au Sénégal",
    notifications_orders: true,
    notifications_low_stock: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.settings) {
        setFormData({
          wave_link: data.settings.wave_link || "https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/",
          delivery_fee_zone1: data.settings.delivery_fee_zone1 || "2000",
          delivery_fee_zone2: data.settings.delivery_fee_zone2 || "2500",
          delivery_fee_zone3: data.settings.delivery_fee_zone3 || "3500",
          delivery_fee_zone4: data.settings.delivery_fee_zone4 || "3500",
          delivery_fee_zone5: data.settings.delivery_fee_zone5 || "3500",
          delivery_days: data.settings.delivery_days || "1",
          whatsapp_number: data.settings.whatsapp_number || "+221770000000",
          store_name: data.settings.store_name || "Mamou Jewelry",
          store_description: data.settings.store_description || "Bijouterie fine & pièces d'exception au Sénégal",
          notifications_orders: data.settings.notifications_orders ?? true,
          notifications_low_stock: data.settings.notifications_low_stock ?? true,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (section?: Array<keyof SettingsData>) => {
    setSaveState("saving");
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success("Paramètres enregistrés avec succès");
      setSaveState("saved");
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
      setSaveState("dirty");
    }
  };

  const handleChange = (field: keyof SettingsData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    setSaveState("dirty");
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Settings Header */}
      <ParametreHeader saveState={saveState} />

      {/* Settings Content */}
      <div className="mt-6 space-y-6">
        {/* Wave Link Section */}
        <SettingsSection
          icon={<CreditCard className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="Lien Wave"
          subtitle="Configurez votre lien de paiement Wave"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-2">
                Lien Wave
              </label>
              <input
                type="url"
                value={formData.wave_link}
                onChange={(e) => handleChange("wave_link", e.target.value)}
                placeholder="https://pay.wave.com/m/..."
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 transition-colors"
              />
            </div>
            <button
              onClick={() => saveSettings(["wave_link"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-2.5 text-sm font-medium text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)] active:scale-95 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Delivery Section */}
        <SettingsSection
          icon={<Truck className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="Frais de Livraison par Zone"
          subtitle="Modifiez les tarifs appliqués pour chaque zone de livraison au Sénégal"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Zone 1 - Dakar (FCFA)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Plateau, Fann, Point E, Mermoz, Sacré-Cœur, Liberté, Ouakam, Ngor, Almadies, Yoff, Mamelles</p>
                <input
                  type="number"
                  value={formData.delivery_fee_zone1}
                  onChange={(e) => handleChange("delivery_fee_zone1", e.target.value)}
                  placeholder="2000"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Zone 2 - Pikine / Guédiawaye (FCFA)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Pikine, Guédiawaye, Parcelles Assainies, Grand Yoff, Cambérène</p>
                <input
                  type="number"
                  value={formData.delivery_fee_zone2}
                  onChange={(e) => handleChange("delivery_fee_zone2", e.target.value)}
                  placeholder="2500"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Zone 3 - Thiaroye / Keur Massar (FCFA)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Thiaroye, Yeumbeul, Mbao, Keur Massar, Keur Mbaye Fall, Fas Mbao</p>
                <input
                  type="number"
                  value={formData.delivery_fee_zone3}
                  onChange={(e) => handleChange("delivery_fee_zone3", e.target.value)}
                  placeholder="3500"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Zone 4 - Rufisque / Malika (FCFA)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Rufisque, Malika, Tivaouane Peulh, Bargny, Diamniadio, Sangalkam</p>
                <input
                  type="number"
                  value={formData.delivery_fee_zone4}
                  onChange={(e) => handleChange("delivery_fee_zone4", e.target.value)}
                  placeholder="3500"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Zone 5 - Régions du Sénégal (FCFA)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Thiès, Mbour, Saly, Saint-Louis, Kaolack, Touba, Ziguinchor, Diourbel...</p>
                <input
                  type="number"
                  value={formData.delivery_fee_zone5}
                  onChange={(e) => handleChange("delivery_fee_zone5", e.target.value)}
                  placeholder="3500"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)] mb-1">
                  Délai moyen de livraison (Jours)
                </label>
                <p className="text-[11px] text-gray-500 mb-2">Délai estimé indiqué aux clients lors de la commande</p>
                <input
                  type="number"
                  value={formData.delivery_days}
                  onChange={(e) => handleChange("delivery_days", e.target.value)}
                  placeholder="1"
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
                />
              </div>
            </div>

            <button
              onClick={() => saveSettings(["delivery_fee_zone1", "delivery_fee_zone2", "delivery_fee_zone3", "delivery_fee_zone4", "delivery_fee_zone5", "delivery_days"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-2.5 text-sm font-medium text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)] active:scale-95 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer les tarifs de livraison"}
            </button>
          </div>
        </SettingsSection>

        {/* WhatsApp Section */}
        <SettingsSection
          icon={<MessageSquare className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="WhatsApp"
          subtitle="Numéro WhatsApp pour le support client"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-2">
                Numéro WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 transition-colors"
              />
            </div>
            <button
              onClick={() => saveSettings(["whatsapp_number"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-2.5 text-sm font-medium text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)] active:scale-95 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Store Info Section */}
        <SettingsSection
          icon={<Store className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="Informations boutique"
          subtitle="Détails de votre boutique"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-2">
                Nom de la boutique
              </label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => handleChange("store_name", e.target.value)}
                placeholder="Mamou Jewelry"
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-2">
                Description
              </label>
              <textarea
                value={formData.store_description}
                onChange={(e) => handleChange("store_description", e.target.value)}
                placeholder="Description de votre boutique..."
                rows={3}
                className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 resize-none transition-colors"
              />
            </div>
            <button
              onClick={() => saveSettings(["store_name", "store_description"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-2.5 text-sm font-medium text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)] active:scale-95 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          icon={<Bell className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="Notifications"
          subtitle="Préférences de notification"
        >
          <div className="space-y-4">
            {/* Son notification Ping (Shopify Style) */}
            <div className="rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 border border-[var(--laiton,#B9793E)]/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--laiton,#B9793E)] shadow-xs">
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--obsidienne,#0E0B09)]">
                      Son Ping de nouvelle commande
                    </p>
                    <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">
                      Alerte sonore instantanée à chaque commande reçue
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabledState(next);
                    setSoundEnabled(next);
                    if (next) {
                      playOrderPingSound(selectedSoundType);
                      toast.success("Son des notifications activé");
                    } else {
                      toast.info("Son des notifications désactivé");
                    }
                  }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${soundEnabled ? "bg-[var(--laiton,#B9793E)]" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${soundEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>

              {soundEnabled && (
                <div className="mt-3 border-t border-[var(--laiton,#B9793E)]/15 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)] mb-2">
                    Choix de la tonalité :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SOUND_OPTIONS.map((option) => {
                      const isSelected = selectedSoundType === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelectedSoundTypeState(option.id);
                            setSoundType(option.id);
                            playOrderPingSound(option.id);
                            toast.success(`Tonalité "${option.label}" activée`);
                          }}
                          className={`flex flex-col items-start p-2.5 rounded-xl text-left border transition-all ${
                            isSelected
                              ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] border-[var(--obsidienne,#0E0B09)] shadow-xs"
                              : "bg-white text-[var(--obsidienne,#0E0B09)] border-[var(--laiton,#B9793E)]/20 hover:border-[var(--laiton)]"
                          }`}
                        >
                          <span className="text-xs font-bold">{option.label}</span>
                          <span className={`text-[10px] mt-0.5 ${isSelected ? "text-amber-200/80" : "text-gray-500"}`}>
                            {option.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Carte Push Web Notification (Style WhatsApp / Arrière-plan) */}
            <div className="rounded-2xl bg-gradient-to-br from-[#19130F] to-[#0E0B09] border border-[var(--laiton,#B9793E)]/40 p-4 sm:p-5 text-white shadow-md space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--laiton,#B9793E)]/20 border border-[var(--laiton,#B9793E)]/40 px-2.5 py-0.5 text-[10px] font-bold text-[var(--laiton-clair,#D9AE78)] uppercase tracking-wider mb-1">
                    📲 Alertes Web Push Mobile & PC
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#F1ECE3]">
                    Notifications Push (Style WhatsApp)
                  </h4>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    Recevez une alerte sonore et visuelle instantanée directement sur l&apos;écran de votre téléphone (même si l&apos;application est fermée).
                  </p>
                </div>

                <div className="shrink-0 pt-1">
                  {pushStatus === "granted" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Actif sur cet appareil
                    </span>
                  ) : pushStatus === "denied" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/80 border border-red-700/60 px-2.5 py-1 rounded-full">
                      Bloqué par le navigateur
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-full">
                      Non activé
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleActivatePush}
                  disabled={isSubscribingPush}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] py-3 px-4 text-xs font-extrabold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubscribingPush ? (
                    "Activation en cours..."
                  ) : pushStatus === "granted" ? (
                    "Re-synchroniser Push cet appareil"
                  ) : (
                    "Activer les Notifications Push"
                  )}
                </button>
              </div>

              <p className="text-[10px] text-white/40 italic pt-1">
                💡 Sur iPhone (Safari) : Ajoutez d&apos;abord le site à l&apos;écran d&apos;accueil via Partager ➔ &quot;Sur l&apos;écran d&apos;accueil&quot; pour autoriser les Push Web.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--obsidienne,#0E0B09)]">Nouvelles commandes</p>
                <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">Recevoir une notification pour chaque nouvelle commande</p>
              </div>
              <button
                onClick={() => handleChange("notifications_orders", !formData.notifications_orders)}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.notifications_orders ? "bg-[var(--laiton,#B9793E)]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.notifications_orders ? "right-1" : "left-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--obsidienne,#0E0B09)]">Stock faible</p>
                <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">Alerte quand un produit est en stock faible</p>
              </div>
              <button
                onClick={() => handleChange("notifications_low_stock", !formData.notifications_low_stock)}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.notifications_low_stock ? "bg-[var(--laiton,#B9793E)]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.notifications_low_stock ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          icon={<Shield className="h-6 w-6 text-[var(--laiton,#B9793E)]" />}
          title="Sécurité"
          subtitle="Paramètres de sécurité du compte"
        >
          <div className="space-y-4">
            <button className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-left text-sm font-medium text-[var(--obsidienne,#0E0B09)] transition-colors hover:border-[var(--laiton,#B9793E)]/50 hover:bg-black/5">
              Changer le mot de passe
            </button>
            <button className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3 text-left text-sm font-medium text-[var(--obsidienne,#0E0B09)] transition-colors hover:border-[var(--laiton,#B9793E)]/50 hover:bg-black/5">
              Activer l'authentification à deux facteurs
            </button>

            {/* Logout Button */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                setIsLoggingOut(true);
                try {
                  // Clear temporary auth
                  document.cookie = "temp_admin_auth=; path=/; max-age=0";
                  localStorage.removeItem("temp_admin_auth");

                  // Sign out from Supabase
                  await supabase.auth.signOut();

                  toast.success("Déconnexion réussie");

                  // Redirect to home page using window.location for mobile compatibility
                  window.location.href = "/";
                } catch (error) {
                  console.error("Erreur de déconnexion:", error);
                  toast.error("Erreur lors de la déconnexion");
                  setIsLoggingOut(false);
                }
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
