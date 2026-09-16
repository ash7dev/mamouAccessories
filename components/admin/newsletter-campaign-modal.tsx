"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Send,
  Eye,
  Edit3,
  Gift,
  Tag,
  Crown,
  ShoppingBag,
  Mail,
  Loader2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CampaignTemplateType } from "@/lib/server/email-templates";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  images?: string[];
}

interface NewsletterCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribersCount: number;
  onCampaignSent?: () => void;
}

const QUICK_HEADLINES = [
  "✨ Une surprise dorée réservée aux abonnées...",
  "👑 Invitation exclusive : Ventes Privées Cercle VIP",
  "🎁 Votre cadeau & code promo Mamou's Accessoires",
  "💎 Découverte en avant-première : Nouvelle Collection",
];

export function NewsletterCampaignModal({
  isOpen,
  onClose,
  subscribersCount,
  onCampaignSent,
}: NewsletterCampaignModalProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [templateType, setTemplateType] = useState<CampaignTemplateType>("promo");

  // Form State
  const [subject, setSubject] = useState("✨ Offre Privilège : -15% sur vos bijoux préférés !");
  const [headline, setHeadline] = useState("Offre Exclusive Cercle Privé");
  const [message, setMessage] = useState(
    "Chère cliente passionnée d'élégance,\n\nPour vous remercier de votre fidélité au Cercle Privé Mamou's Accessoires, nous avons le plaisir de vous offrir une réduction exclusive valable sur toute notre collection de bijoux et sacs d'exception.\n\nProfitez-en dès aujourd'hui avant l'épuisement des stocks !"
  );

  // Specific Fields
  const [promoCode, setPromoCode] = useState("MAMOUVIP15");
  const [discountPercentage, setDiscountPercentage] = useState("15% de réduction");

  // Product Selection
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Custom CTA
  const [ctaText, setCtaText] = useState("UTILISER MON CODE PROMO →");

  // Sending Status
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  useEffect(() => {
    // Charger la liste des produits pour l'option Produit Phare
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Erreur chargement produits pour newsletter:", err);
      }
    };
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      if (templateType === "product_launch") {
        setHeadline(`Découvrez le bijou : ${prod.name}`);
        setCtaText(`COMMANDER CE BIJOU →`);
      }
    }
  };

  const handleSendTest = async () => {
    if (!subject || !headline || !message) {
      toast.error("Veuillez remplir au moins le sujet, le titre et le message.");
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "test",
          templateType,
          subject,
          headline,
          message,
          promoCode,
          discountPercentage,
          productName: selectedProduct?.name,
          productPrice: selectedProduct?.price?.toString(),
          productImageUrl: selectedProduct?.image_url || selectedProduct?.images?.[0],
          ctaText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("📧 Email de test envoyé avec succès !", {
          description: "Vérifiez la boîte mariamkoita095@gmail.com dans quelques secondes.",
        });
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du test.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'envoyer l'email de test.");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenConfirmModal = () => {
    if (!subject || !headline || !message) {
      toast.error("Veuillez remplir au moins le sujet, le titre et le message.");
      return;
    }

    if (subscribersCount === 0) {
      toast.error("Aucun abonné actif dans la liste.");
      return;
    }

    setShowConfirmModal(true);
  };

  const executeSendBroadcast = async () => {
    setShowConfirmModal(false);
    setIsSendingBroadcast(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "broadcast",
          templateType,
          subject,
          headline,
          message,
          promoCode,
          discountPercentage,
          productName: selectedProduct?.name,
          productPrice: selectedProduct?.price?.toString(),
          productImageUrl: selectedProduct?.image_url || selectedProduct?.images?.[0],
          ctaText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Campagne envoyée avec succès !", {
          description: data.message,
        });
        if (onCampaignSent) onCampaignSent();
        onClose();
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de la campagne.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Impossible de diffuser la campagne.");
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div key="newsletter-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Modale */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton,#B9793E)]/40 flex items-center justify-center text-[var(--laiton-clair,#D9AE78)]">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[var(--porcelaine,#F1ECE3)]">
                  Studio de Campagnes Email Marketing
                </h2>
                <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60">
                  Créez et prévisualisez des emails d&apos;exception pour vos abonnées.
                </p>
              </div>
            </div>

            {/* Switch Édition / Aperçu Mobile */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[var(--obsidienne)] p-1 rounded-xl border border-[var(--laiton,#B9793E)]/20">
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "edit"
                      ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] shadow"
                      : "text-[var(--porcelaine,#F1ECE3)]/60 hover:text-[var(--porcelaine,#F1ECE3)]"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Édition
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "preview"
                      ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] shadow"
                      : "text-[var(--porcelaine,#F1ECE3)]/60 hover:text-[var(--porcelaine,#F1ECE3)]"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Aperçu Smartphone
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[var(--porcelaine,#F1ECE3)]/60 hover:text-white hover:bg-[var(--laiton,#B9793E)]/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corps de la Modale */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "edit" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Colonne Gauche : Modèles & Paramètres */}
                <div className="lg:col-span-7 space-y-5">
                  {/* 1. Sélection du Modèle */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--laiton-clair,#D9AE78)] uppercase tracking-wider mb-2.5">
                      1. Choisir le style de campagne
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateType("promo");
                          setCtaText("UTILISER MON CODE PROMO →");
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          templateType === "promo"
                            ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] shadow-md"
                            : "border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] text-[var(--porcelaine,#F1ECE3)]/70 hover:border-[var(--laiton)]/40"
                        }`}
                      >
                        <Gift className="w-5 h-5 shrink-0 mt-0.5 text-[var(--laiton-clair)]" />
                        <div>
                          <div className="font-bold text-xs">Offre & Code Promo</div>
                          <div className="text-[10px] opacity-70 mt-0.5">
                            Bannière réduction et code cliquable.
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTemplateType("product_launch");
                          setCtaText("DECOUVRIR SUR LA BOUTIQUE →");
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          templateType === "product_launch"
                            ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] shadow-md"
                            : "border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] text-[var(--porcelaine,#F1ECE3)]/70 hover:border-[var(--laiton)]/40"
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5 shrink-0 mt-0.5 text-[var(--laiton-clair)]" />
                        <div>
                          <div className="font-bold text-xs">Produit Phare / Nouveauté</div>
                          <div className="text-[10px] opacity-70 mt-0.5">
                            Présenter un bijou du catalogue.
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTemplateType("vip_invitation");
                          setCtaText("ACCÉDER AUX VENTES PRIVÉES →");
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          templateType === "vip_invitation"
                            ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] shadow-md"
                            : "border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] text-[var(--porcelaine,#F1ECE3)]/70 hover:border-[var(--laiton)]/40"
                        }`}
                      >
                        <Crown className="w-5 h-5 shrink-0 mt-0.5 text-[var(--laiton-clair)]" />
                        <div>
                          <div className="font-bold text-xs">Vente Privée VIP</div>
                          <div className="text-[10px] opacity-70 mt-0.5">
                            Invitation restreinte Cercle Privé.
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTemplateType("custom");
                          setCtaText("VOIR LA BOUTIQUE →");
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          templateType === "custom"
                            ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton-clair,#D9AE78)] shadow-md"
                            : "border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] text-[var(--porcelaine,#F1ECE3)]/70 hover:border-[var(--laiton)]/40"
                        }`}
                      >
                        <Mail className="w-5 h-5 shrink-0 mt-0.5 text-[var(--laiton-clair)]" />
                        <div>
                          <div className="font-bold text-xs">Message Libre</div>
                          <div className="text-[10px] opacity-70 mt-0.5">
                            Annonce ou message sur mesure.
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 2. Sujet de l'Email & Suggestions IA */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[var(--porcelaine,#F1ECE3)]">
                        Objet de l&apos;email (Titre reçu dans la boîte mail)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="ex: ✨ Offre Spéciale Cercle Privé..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-sm text-[var(--porcelaine,#F1ECE3)] focus:border-[var(--laiton,#B9793E)] focus:outline-none"
                    />

                    {/* Quick suggestions */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-[var(--porcelaine,#F1ECE3)]/50 self-center font-medium">
                        Idées rapides :
                      </span>
                      {QUICK_HEADLINES.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSubject(item)}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-[var(--laiton,#B9793E)]/10 text-[var(--laiton-clair,#D9AE78)] hover:bg-[var(--laiton,#B9793E)]/20 transition-colors border border-[var(--laiton)]/20"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Titre d'Accroche & Message */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--porcelaine,#F1ECE3)] mb-1.5">
                      Titre principal de l&apos;email (Headline)
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="ex: Offre Exclusive Cercle Privé"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-sm text-[var(--porcelaine,#F1ECE3)] focus:border-[var(--laiton,#B9793E)] focus:outline-none mb-3"
                    />

                    <label className="block text-xs font-bold text-[var(--porcelaine,#F1ECE3)] mb-1.5">
                      Message principal
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Rédigez votre message à l'attention de vos clientes..."
                      className="w-full p-4 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-sm text-[var(--porcelaine,#F1ECE3)] focus:border-[var(--laiton,#B9793E)] focus:outline-none"
                    />
                  </div>

                  {/* 4. Champs Spécifiques selon le Modèle */}
                  {templateType === "promo" && (
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--laiton-clair,#D9AE78)] mb-1">
                          Code Promo
                        </label>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="MAMOUVIP15"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/40 text-xs font-mono font-bold text-[var(--laiton-clair)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--laiton-clair,#D9AE78)] mb-1">
                          Réduction
                        </label>
                        <input
                          type="text"
                          value={discountPercentage}
                          onChange={(e) => setDiscountPercentage(e.target.value)}
                          placeholder="15% de réduction"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/40 text-xs text-[var(--porcelaine)]"
                        />
                      </div>
                    </div>
                  )}

                  {templateType === "product_launch" && (
                    <div className="p-4 rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 space-y-3">
                      <label className="block text-[11px] font-bold text-[var(--laiton-clair,#D9AE78)]">
                        Sélectionner un produit du catalogue
                      </label>
                      <select
                        value={selectedProductId}
                        onChange={(e) => handleProductSelect(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/40 text-xs text-[var(--porcelaine)]"
                      >
                        <option value="">-- Choisir un bijou --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.price} FCFA)
                          </option>
                        ))}
                      </select>

                      {selectedProduct && (
                        <div className="text-xs text-[var(--laiton-clair)] flex items-center gap-2 font-medium pt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Produit sélectionné :{" "}
                          <strong>{selectedProduct.name}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Texte du Bouton d'Action */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--porcelaine,#F1ECE3)] mb-1.5">
                      Texte du bouton d&apos;action (CTA)
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/30 text-sm text-[var(--porcelaine,#F1ECE3)]"
                    />
                  </div>
                </div>

                {/* Colonne Droite : Mini Aperçu Dynamique */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="w-full border border-[var(--laiton,#B9793E)]/20 rounded-2xl bg-[#f4f4f6] text-black p-4 shadow-2xl max-h-[550px] overflow-y-auto">
                    {/* Header Email Mockup */}
                    <div className="bg-[#09090b] text-center p-4 rounded-t-xl border-b-2 border-[#d4af37]">
                      <div className="font-serif text-lg font-bold text-[#d4af37] tracking-widest">
                        MAMOU&apos;S
                      </div>
                      <div className="text-[9px] tracking-widest text-[#e4e4e7] uppercase">
                        ACCESSOIRES DE LUXE
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-b-xl text-left">
                      <h3 className="font-serif text-base font-bold text-center text-[#1c1917] mb-3">
                        {headline || "Titre de l'email"}
                      </h3>

                      <p className="text-xs text-[#333] whitespace-pre-line leading-relaxed mb-4">
                        {message}
                      </p>

                      {templateType === "promo" && promoCode && (
                        <div className="bg-[#09090b] border border-dashed border-[#d4af37] p-3 rounded-lg text-center my-3">
                          <span className="text-[10px] text-[#e4e4e7] uppercase tracking-wider block">
                            Code Privilège
                          </span>
                          <span className="font-mono text-sm font-bold text-[#d4af37]">
                            {promoCode}
                          </span>
                        </div>
                      )}

                      {templateType === "product_launch" && selectedProduct && (
                        <div className="border border-stone-200 rounded-lg p-3 text-center bg-stone-50 my-3">
                          {selectedProduct.image_url && (
                            <img
                              src={selectedProduct.image_url}
                              alt={selectedProduct.name}
                              className="w-full h-32 object-cover rounded-md mb-2"
                            />
                          )}
                          <div className="font-bold text-xs text-stone-900">
                            {selectedProduct.name}
                          </div>
                          <div className="text-xs text-[#d4af37] font-bold">
                            {selectedProduct.price} FCFA
                          </div>
                        </div>
                      )}

                      <div className="text-center mt-4">
                        <span className="inline-block bg-[#09090b] text-[#d4af37] text-[10px] font-bold px-4 py-2 rounded-lg border border-[#d4af37]">
                          {ctaText}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--porcelaine,#F1ECE3)]/50 mt-2 font-medium">
                    Aperçu réactif de l&apos;email reçu par le client
                  </span>
                </div>
              </div>
            ) : (
              /* Onglet Full Screen Smartphone Preview */
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-[360px] h-[640px] border-8 border-stone-800 rounded-[40px] bg-[#f4f4f6] text-black shadow-2xl overflow-y-auto p-4 relative">
                  <div className="bg-[#09090b] text-center p-5 rounded-t-2xl border-b-2 border-[#d4af37]">
                    <div className="font-serif text-xl font-bold text-[#d4af37] tracking-widest">
                      MAMOU&apos;S
                    </div>
                    <div className="text-[9px] tracking-widest text-[#e4e4e7] uppercase">
                      ACCESSOIRES DE LUXE
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-b-2xl shadow-sm text-left">
                    <h3 className="font-serif text-lg font-bold text-center text-[#1c1917] mb-3">
                      {headline}
                    </h3>
                    <p className="text-xs text-[#333] whitespace-pre-line leading-relaxed mb-4">
                      {message}
                    </p>

                    {templateType === "promo" && promoCode && (
                      <div className="bg-[#09090b] border border-dashed border-[#d4af37] p-3 rounded-lg text-center my-3">
                        <span className="text-[10px] text-[#e4e4e7] uppercase tracking-wider block">
                          Code Privilège
                        </span>
                        <span className="font-mono text-base font-bold text-[#d4af37]">
                          {promoCode}
                        </span>
                      </div>
                    )}

                    {templateType === "product_launch" && selectedProduct && (
                      <div className="border border-stone-200 rounded-lg p-3 text-center bg-stone-50 my-3">
                        {selectedProduct.image_url && (
                          <img
                            src={selectedProduct.image_url}
                            alt={selectedProduct.name}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                        )}
                        <div className="font-bold text-sm text-stone-900">
                          {selectedProduct.name}
                        </div>
                        <div className="text-sm text-[#d4af37] font-bold">
                          {selectedProduct.price} FCFA
                        </div>
                      </div>
                    )}

                    <div className="text-center mt-5">
                      <span className="inline-block bg-[#09090b] text-[#d4af37] text-xs font-bold px-5 py-2.5 rounded-lg border border-[#d4af37]">
                        {ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer d'Action / Envoi */}
          <div className="p-6 border-t border-[var(--laiton,#B9793E)]/20 bg-[var(--obsidienne-soft,#17120D)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--porcelaine,#F1ECE3)]/70 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--laiton,#B9793E)]" />
              <span>
                Diffusion à <strong>{subscribersCount} abonné(s) actif(s)</strong> dans la base de
                données.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSendTest}
                disabled={isSendingTest || isSendingBroadcast}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[var(--laiton,#B9793E)]/40 bg-[var(--obsidienne,#0E0B09)] text-xs font-semibold text-[var(--laiton-clair,#D9AE78)] hover:bg-[var(--laiton,#B9793E)]/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSendingTest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>S&apos;envoyer un test</span>
              </button>

              <button
                type="button"
                onClick={handleOpenConfirmModal}
                disabled={isSendingTest || isSendingBroadcast || subscribersCount === 0}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#9A622E] text-[var(--obsidienne,#0E0B09)] text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingBroadcast ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Diffuser à tous les abonnés</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modale de Confirmation d'Envoi Haute Joaillerie */}
      {showConfirmModal && (
        <div key="confirm-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/40 rounded-3xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[var(--porcelaine,#F1ECE3)] space-y-6 relative overflow-hidden"
          >
            {/* Ornement lumineux */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--laiton,#B9793E)] to-transparent" />

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton,#B9793E)]/40 flex items-center justify-center text-[var(--laiton-clair,#D9AE78)] mx-auto mb-3 shadow-inner">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--porcelaine,#F1ECE3)]">
                Confirmation d&apos;Envoi de Campagne
              </h3>
              <p className="text-xs text-[var(--porcelaine,#F1ECE3)]/60">
                Vous êtes sur le point de diffuser cette newsletter à votre Cercle Privé.
              </p>
            </div>

            {/* Récapitulatif de la Campagne */}
            <div className="p-4 rounded-2xl bg-[var(--obsidienne-soft,#17120D)] border border-[var(--laiton,#B9793E)]/20 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[var(--laiton,#B9793E)]/10 pb-2">
                <span className="text-[var(--porcelaine,#F1ECE3)]/60">Objet :</span>
                <span className="font-bold text-[var(--laiton-clair,#D9AE78)] text-right truncate max-w-[200px]">
                  {subject}
                </span>
              </div>
              <div className="flex justify-between border-b border-[var(--laiton,#B9793E)]/10 pb-2">
                <span className="text-[var(--porcelaine,#F1ECE3)]/60">Style de Campagne :</span>
                <span className="font-semibold text-[var(--porcelaine,#F1ECE3)] capitalize">
                  {templateType}
                </span>
              </div>
              <div className="flex justify-between border-b border-[var(--laiton,#B9793E)]/10 pb-2">
                <span className="text-[var(--porcelaine,#F1ECE3)]/60">Destinataires ciblés :</span>
                <span className="font-bold text-emerald-400">
                  {subscribersCount} abonnée(s) active(s)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--porcelaine,#F1ECE3)]/60">Service d&apos;envoi :</span>
                <span className="font-medium text-[var(--porcelaine,#F1ECE3)]">
                  Resend API (Sécurisé)
                </span>
              </div>
            </div>

            {/* Boutons d'Action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--obsidienne-soft,#17120D)] text-xs font-semibold text-[var(--porcelaine,#F1ECE3)]/70 hover:text-white hover:border-[var(--laiton)] transition-all"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={executeSendBroadcast}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#9A622E] text-[var(--obsidienne,#0E0B09)] text-xs font-bold hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirmer & Lancer</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
