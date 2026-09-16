"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Search,
  Download,
  Copy,
  Check,
  Users,
  RefreshCw,
  PlusCircle,
  History,
  Send,
  Sparkles,
  Gift,
  ShoppingBag,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { NewsletterCampaignModal } from "@/components/admin/newsletter-campaign-modal";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  subscribed_at: string;
  is_active: boolean;
}

interface CampaignHistory {
  id: string;
  subject: string;
  template_type: string;
  recipients_count: number;
  status: string;
  sent_at: string;
}

export default function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = useState<"subscribers" | "history">("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      } else {
        toast.error("Erreur lors du chargement de la liste d'abonnés.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de récupérer la liste des abonnés.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/admin/newsletter/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const copyAllEmails = () => {
    if (subscribers.length === 0) return;
    const emailsString = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emailsString);
    setCopied(true);
    toast.success(`${subscribers.length} adresse(s) email copiée(s) dans le presse-papier !`);
    setTimeout(() => setCopied(false), 2500);
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = "Email,Date Inscription,Source\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${new Date(s.subscribed_at).toLocaleDateString("fr-FR")}","${s.source}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `abonnes_newsletter_mamou_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV téléchargé avec succès !");
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "promo":
        return <Gift className="w-4 h-4 text-amber-400" />;
      case "product_launch":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case "vip_invitation":
        return <Crown className="w-4 h-4 text-purple-400" />;
      default:
        return <Mail className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* En-tête Luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--laiton,#B9793E)]/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--laiton,#B9793E)] text-xs font-bold uppercase tracking-widest mb-1">
            <Mail className="w-4 h-4" /> Marketing & Fidélisation
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--porcelaine,#F1ECE3)]">
            Studio Marketing & Newsletter
          </h1>
          <p className="text-sm text-[var(--porcelaine,#F1ECE3)]/60 mt-1">
            Envoyez des emails de luxe à vos clientes et gérez votre liste d&apos;abonnés.
          </p>
        </div>

        {/* Bouton d'action principal */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#9A622E] text-[var(--obsidienne,#0E0B09)] text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--laiton,#B9793E)]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une Campagne Email</span>
          </button>
        </div>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton,#B9793E)]/30 flex items-center justify-center text-[var(--laiton-clair,#D9AE78)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--porcelaine,#F1ECE3)]">
              {subscribers.length}
            </span>
            <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60 font-medium">
              Abonnées au Cercle Privé
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--porcelaine,#F1ECE3)]">
              {campaigns.length}
            </span>
            <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60 font-medium">
              Campagnes créées
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--porcelaine,#F1ECE3)]">
              Resend API
            </span>
            <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60 font-medium">
              Statut Délivrabilité Connecté
            </p>
          </div>
        </div>
      </div>

      {/* Navigation par Onglets */}
      <div className="flex items-center justify-between border-b border-[var(--laiton,#B9793E)]/20 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "subscribers"
                ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] shadow-md"
                : "text-[var(--porcelaine,#F1ECE3)]/60 hover:text-[var(--porcelaine,#F1ECE3)] hover:bg-[var(--obsidienne-soft,#17120D)]"
            }`}
          >
            <Users className="w-4 h-4" />
            Abonnées ({subscribers.length})
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] shadow-md"
                : "text-[var(--porcelaine,#F1ECE3)]/60 hover:text-[var(--porcelaine,#F1ECE3)] hover:bg-[var(--obsidienne-soft,#17120D)]"
            }`}
          >
            <History className="w-4 h-4" />
            Historique Campagnes ({campaigns.length})
          </button>
        </div>

        {activeTab === "subscribers" && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyAllEmails}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-xs font-semibold text-[var(--laiton-clair,#D9AE78)] hover:bg-[var(--laiton,#B9793E)]/20 transition-all disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié !" : "Copier emails"}
            </button>

            <button
              onClick={exportCSV}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-xs font-semibold text-[var(--porcelaine,#F1ECE3)] hover:border-[var(--laiton,#B9793E)] transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

            <button
              onClick={fetchSubscribers}
              disabled={isLoading}
              className="p-2 rounded-xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--obsidienne-soft,#17120D)] text-[var(--porcelaine,#F1ECE3)] hover:border-[var(--laiton,#B9793E)] transition-all"
              title="Actualiser la liste"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Contenu Onglet 1 : Abonnées */}
      {activeTab === "subscribers" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--porcelaine,#F1ECE3)]/40" />
            <input
              type="text"
              placeholder="Rechercher une adresse email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/20 text-sm text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/40 focus:outline-none focus:border-[var(--laiton,#B9793E)] transition-all"
            />
          </div>

          <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] overflow-hidden shadow-xl">
            {isLoading ? (
              <div className="p-12 text-center text-[var(--porcelaine,#F1ECE3)]/50 text-sm flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-[var(--laiton,#B9793E)]" />
                Chargement des abonnées...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-12 text-center text-[var(--porcelaine,#F1ECE3)]/50 text-sm">
                {searchQuery
                  ? "Aucun abonné ne correspond à votre recherche."
                  : "Aucun abonné à la newsletter pour le moment."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--porcelaine,#F1ECE3)]">
                  <thead className="bg-[var(--obsidienne,#0E0B09)] text-xs uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] border-b border-[var(--laiton,#B9793E)]/15">
                    <tr>
                      <th className="py-4 px-6">Email du client</th>
                      <th className="py-4 px-6">Source</th>
                      <th className="py-4 px-6">Date d&apos;inscription</th>
                      <th className="py-4 px-6 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--laiton,#B9793E)]/10">
                    {filteredSubscribers.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-[var(--laiton,#B9793E)]/5 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-[var(--porcelaine,#F1ECE3)]">
                          {sub.email}
                        </td>
                        <td className="py-4 px-6 text-xs text-[var(--porcelaine,#F1ECE3)]/70 capitalize">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--laiton,#B9793E)]/10 border border-[var(--laiton,#B9793E)]/20 text-[var(--laiton-clair,#D9AE78)] font-semibold">
                            {sub.source || "Site web"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-[var(--porcelaine,#F1ECE3)]/70">
                          {new Date(sub.subscribed_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Actif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenu Onglet 2 : Historique des Campagnes */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center text-[var(--porcelaine,#F1ECE3)]/50 text-sm bg-[var(--obsidienne-soft,#17120D)] rounded-2xl border border-[var(--laiton,#B9793E)]/20">
              <Mail className="w-8 h-8 text-[var(--laiton,#B9793E)] mx-auto mb-3 opacity-60" />
              Aucune campagne email diffusée pour le moment. Cliquez sur &quot;Créer une Campagne Email&quot; pour lancer votre première newsletter !
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[var(--laiton,#B9793E)]/10 border border-[var(--laiton,#B9793E)]/30">
                        {getTemplateIcon(camp.template_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--porcelaine,#F1ECE3)]">
                          {camp.subject}
                        </h3>
                        <span className="text-[10px] text-[var(--porcelaine,#F1ECE3)]/50 capitalize">
                          Style : {camp.template_type || "Standard"}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      ✓ Envoyé
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--laiton,#B9793E)]/10 text-xs text-[var(--porcelaine,#F1ECE3)]/60">
                    <span>
                      👥 Destinataires : <strong>{camp.recipients_count} client(s)</strong>
                    </span>
                    <span>
                      📅 {new Date(camp.sent_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modale Studio de création de campagne */}
      <NewsletterCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscribersCount={subscribers.length}
        onCampaignSent={() => {
          fetchCampaigns();
        }}
      />
    </div>
  );
}
