"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ParametreHeader } from "@/components/admin/settings/parametre-header";
import { SettingsSection } from "@/components/admin/settings/settings-section";
import { CreditCard, Truck, MessageSquare, Store, Bell, Shield, LogOut } from "lucide-react";
import { toast } from "sonner";

interface SettingsData {
  wave_link: string;
  delivery_fee: string;
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
  const [formData, setFormData] = useState<SettingsData>({
    wave_link: "",
    delivery_fee: "",
    delivery_days: "",
    whatsapp_number: "",
    store_name: "",
    store_description: "",
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
          wave_link: data.settings.wave_link || "",
          delivery_fee: data.settings.delivery_fee || "",
          delivery_days: data.settings.delivery_days || "",
          whatsapp_number: data.settings.whatsapp_number || "",
          store_name: data.settings.store_name || "",
          store_description: data.settings.store_description || "",
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
          icon={<CreditCard className="h-6 w-6 text-[var(--gold)]" />}
          title="Lien Wave"
          subtitle="Configurez votre lien de paiement Wave"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Lien Wave
              </label>
              <input
                type="url"
                value={formData.wave_link}
                onChange={(e) => handleChange("wave_link", e.target.value)}
                placeholder="https://pay.wave.com/m/..."
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </div>
            <button
              onClick={() => saveSettings(["wave_link"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[#241B14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#241B14]/90 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Delivery Section */}
        <SettingsSection
          icon={<Truck className="h-6 w-6 text-[var(--gold)]" />}
          title="Livraison"
          subtitle="Paramètres de livraison et zones desservies"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Frais de livraison (FCFA)
              </label>
              <input
                type="number"
                value={formData.delivery_fee}
                onChange={(e) => handleChange("delivery_fee", e.target.value)}
                placeholder="1000"
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Délai de livraison (jours)
              </label>
              <input
                type="number"
                value={formData.delivery_days}
                onChange={(e) => handleChange("delivery_days", e.target.value)}
                placeholder="3"
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </div>
            <button
              onClick={() => saveSettings(["delivery_fee", "delivery_days"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[#241B14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#241B14]/90 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* WhatsApp Section */}
        <SettingsSection
          icon={<MessageSquare className="h-6 w-6 text-[var(--gold)]" />}
          title="WhatsApp"
          subtitle="Numéro WhatsApp pour le support client"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Numéro WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </div>
            <button
              onClick={() => saveSettings(["whatsapp_number"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[#241B14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#241B14]/90 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Store Info Section */}
        <SettingsSection
          icon={<Store className="h-6 w-6 text-[var(--gold)]" />}
          title="Informations boutique"
          subtitle="Détails de votre boutique"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Nom de la boutique
              </label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => handleChange("store_name", e.target.value)}
                placeholder="Mamou Jewelry"
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                Description
              </label>
              <textarea
                value={formData.store_description}
                onChange={(e) => handleChange("store_description", e.target.value)}
                placeholder="Description de votre boutique..."
                rows={3}
                className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 resize-none"
              />
            </div>
            <button
              onClick={() => saveSettings(["store_name", "store_description"])}
              disabled={saveState === "saving"}
              className="rounded-full bg-[#241B14] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#241B14]/90 disabled:opacity-50"
            >
              {saveState === "saving" ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          icon={<Bell className="h-6 w-6 text-[var(--gold)]" />}
          title="Notifications"
          subtitle="Préférences de notification"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Nouvelles commandes</p>
                <p className="text-xs text-[var(--text-dark)]/60">Recevoir une notification pour chaque nouvelle commande</p>
              </div>
              <button
                onClick={() => handleChange("notifications_orders", !formData.notifications_orders)}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.notifications_orders ? "bg-[var(--gold)]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.notifications_orders ? "right-1" : "left-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Stock faible</p>
                <p className="text-xs text-[var(--text-dark)]/60">Alerte quand un produit est en stock faible</p>
              </div>
              <button
                onClick={() => handleChange("notifications_low_stock", !formData.notifications_low_stock)}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.notifications_low_stock ? "bg-[var(--gold)]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.notifications_low_stock ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          icon={<Shield className="h-6 w-6 text-[var(--gold)]" />}
          title="Sécurité"
          subtitle="Paramètres de sécurité du compte"
        >
          <div className="space-y-4">
            <button className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-left text-sm font-medium text-[var(--text-dark)] transition-colors hover:border-[var(--gold)]/40 hover:bg-[var(--ivory)]">
              Changer le mot de passe
            </button>
            <button className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-left text-sm font-medium text-[var(--text-dark)] transition-colors hover:border-[var(--gold)]/40 hover:bg-[var(--ivory)]">
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
