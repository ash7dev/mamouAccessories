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
    <div className="-mx-6 -mt-6 mb-8 lg:-mx-8 lg:-mt-8 space-y-6 font-sans">
      {/* ===== Hero Banner Haute Joaillerie (Executive Header) ===== */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-10 lg:px-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/25 text-[var(--porcelaine,#F1ECE3)]">
        {/* Cercles ornementaux dorés d'ambiance */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 via-[#D9AE78]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--laiton,#B9793E)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Ligne 1 : Titre + Bouton d'action principal */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[var(--laiton,#B9793E)]/20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/40 bg-[var(--laiton,#B9793E)]/10 px-4 py-1 text-[10px] font-extrabold tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] uppercase mb-3 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 stroke-[2]" />
                Marketing &amp; Fidélisation Client
              </div>
              <h1 className="font-serif text-2xl lg:text-4xl font-semibold tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                Studio Marketing &amp; Newsletter
              </h1>
              <p className="mt-1.5 text-xs lg:text-sm tracking-wide text-[var(--porcelaine,#F1ECE3)]/65 max-w-xl">
                Concevez, prévisualisez en direct et diffusez des emails d&apos;exception à vos abonnées.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] px-7 py-3.5 text-xs font-sans font-bold tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-[0_8px_25px_rgba(185,121,62,0.3)] transition-all hover:brightness-110 active:scale-95 uppercase cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 stroke-[2.5]" />
                <span>Créer une Campagne Email</span>
              </button>
            </div>
          </div>

          {/* Ligne 2 : Executive KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
            {/* Abonnées */}
            <div className="rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]/80 p-3.5 flex items-center gap-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton)]/25">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)]">
                  Cercle Privé
                </p>
                <p className="font-mono text-lg font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums leading-none mt-0.5">
                  {subscribers.length} Abonnée(s)
                </p>
              </div>
            </div>

            {/* Campagnes */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-3.5 flex items-center gap-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25">
                <Send className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-300">
                  Campagnes Diffusées
                </p>
                <p className="font-mono text-lg font-bold text-white tabular-nums leading-none mt-0.5">
                  {campaigns.length} Créée(s)
                </p>
              </div>
            </div>

            {/* Service Resend */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex items-center gap-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Service Email API
                </p>
                <p className="font-sans text-xs font-bold text-emerald-300 leading-none mt-0.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Resend Connecté
                </p>
              </div>
            </div>
          </div>

          {/* Ligne 3 : Barre de Recherche Haute Joaillerie */}
          {activeTab === "subscribers" && (
            <div className="pt-6">
              <div className="relative w-full">
                <Search className="absolute left-4.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--laiton,#B9793E)]" />
                <input
                  type="text"
                  placeholder="Rechercher une abonnée par adresse email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/90 py-4 pl-12 pr-10 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)] placeholder:text-[var(--porcelaine,#F1ECE3)]/35 transition-all focus:border-[var(--laiton,#B9793E)] focus:bg-[var(--obsidienne,#0E0B09)] focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/30 shadow-inner font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--laiton-clair,#D9AE78)] hover:underline font-medium"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Barre d'Onglets & Actions d'Export (Filtres Rapides) ===== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            <button
              key="subscribers"
              type="button"
              onClick={() => setActiveTab("subscribers")}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "subscribers"
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/40"
                  : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/75 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Abonnées ({subscribers.length})
            </button>

            <button
              key="history"
              type="button"
              onClick={() => setActiveTab("history")}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/40"
                  : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/75 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Historique Campagnes ({campaigns.length})
            </button>
          </div>

          {activeTab === "subscribers" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyAllEmails}
                disabled={subscribers.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/30 text-xs font-semibold text-[var(--laiton-clair,#D9AE78)] hover:bg-[var(--laiton,#B9793E)]/20 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copié !" : "Copier emails"}</span>
              </button>

              <button
                type="button"
                onClick={exportCSV}
                disabled={subscribers.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[var(--laiton,#B9793E)]/25 text-xs font-semibold text-[var(--obsidienne,#0E0B09)] hover:border-[var(--laiton,#B9793E)] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[var(--laiton,#B9793E)]" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={fetchSubscribers}
                disabled={isLoading}
                className="p-2.5 rounded-full border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)] hover:border-[var(--laiton,#B9793E)] transition-all cursor-pointer shadow-sm"
                title="Actualiser la liste"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenu Onglets */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Contenu Onglet 1 : Abonnées */}
        {activeTab === "subscribers" && (
          <div className="space-y-4">

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
      </div>

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
