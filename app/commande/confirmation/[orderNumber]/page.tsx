/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_note: string | null;
  payment_method: "wave" | "cash_on_delivery";
  payment_status: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  items: Array<{
    id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }>;
}

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [waveLink, setWaveLink] = useState<string>("https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("+221770000000");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders?order_number=${orderNumber}`),
          fetch('/api/admin/settings').catch(() => null)
        ]);

        if (!orderRes.ok) {
          throw new Error("Commande introuvable");
        }

        const { orders } = await orderRes.json();
        if (!orders || orders.length === 0) {
          throw new Error("Commande introuvable");
        }

        setOrder(orders[0]);

        if (settingsRes && settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            if (settingsData.settings.wave_link) setWaveLink(settingsData.settings.wave_link);
            if (settingsData.settings.whatsapp_number) setWhatsappNumber(settingsData.settings.whatsapp_number);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchData();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-10 md:py-16">
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 md:p-10 shadow-xs space-y-6 text-center">
            <div className="h-16 w-16 bg-neutral-100 rounded-full mx-auto animate-pulse" />
            <div className="h-7 w-64 bg-neutral-200 rounded-lg mx-auto animate-pulse" />
            <div className="h-4 w-48 bg-neutral-100 rounded-md mx-auto animate-pulse" />

            <div className="border-t border-neutral-100 pt-6 space-y-4 text-left">
              <div className="h-5 w-40 bg-neutral-200 rounded-md animate-pulse" />
              <div className="h-12 bg-neutral-100 rounded-2xl animate-pulse" />
              <div className="h-24 bg-neutral-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
              Commande introuvable
            </h1>
            <p className="text-[var(--text-dark)]/60 mb-6">
              {error || "Cette commande n'existe pas."}
            </p>
            <Link
              href="/boutique"
              className="inline-flex rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg"
            >
              Retour à la boutique
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl mb-4">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">
              Commande confirmée !
            </h1>
            <p className="text-[var(--text-dark)]/60">
              Merci {order.customer_name}, votre commande a été enregistrée avec succès.
            </p>
          </div>

          {/* Order details */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--gold)]/15">
              <div>
                <p className="text-xs text-[var(--text-dark)]/50 uppercase tracking-wider mb-1">
                  Numéro de commande
                </p>
                <p className="text-xl font-bold text-[var(--text-dark)]">{order.order_number}</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
                En attente
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-dark)] mb-3">
                Articles commandés
              </p>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[var(--text-dark)]">{item.product_name}</p>
                      <p className="text-sm text-[var(--text-dark)]/50">
                        {item.quantity} × {formatFCFA(item.unit_price)} FCFA
                      </p>
                    </div>
                    <p className="font-semibold text-[var(--text-dark)]">
                      {formatFCFA(item.quantity * item.unit_price)} FCFA
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-[var(--gold)]/15 pt-4">
              <div className="flex justify-between text-sm text-[var(--text-dark)]/60">
                <span>Sous-total</span>
                <span>{formatFCFA(order.subtotal)} FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-dark)]/60">
                <span>Livraison</span>
                <span>{formatFCFA(order.delivery_fee)} FCFA</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[var(--text-dark)] pt-2">
                <span>Total</span>
                <span>{formatFCFA(order.total)} FCFA</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-lg mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-dark)] mb-3">
              Mode de paiement
            </p>
            {order.payment_method === "wave" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-sky-200 bg-white p-0.5 shadow-xs flex items-center justify-center shrink-0">
                    <img src="/wavelogo.jpeg" alt="Wave" className="h-full w-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-dark)]">Paiement Instantané via Wave</p>
                    <p className="text-xs text-[var(--text-dark)]/60">Cliquez ci-dessous pour ouvrir votre application Wave et effectuer le règlement.</p>
                  </div>
                </div>

                {(() => {
                  const cleanWaveLink = waveLink.trim() || "https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/";
                  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, '') || "221774907955";
                  const formattedPhone = "+221 77 490 79 55";

                  return (
                    <div className="space-y-4 pt-2">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Bouton 1: Ouvrir Wave */}
                        <a
                          href={cleanWaveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#1DC3EF] px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#19b2db] active:scale-95 transition-all"
                        >
                          <img src="/wavelogo.jpeg" alt="Wave" className="h-5 w-5 rounded-full object-cover border border-white/40" />
                          <span>Payer {formatFCFA(order.total)} FCFA sur Wave</span>
                        </a>

                        {/* Bouton 2: WhatsApp Preuve */}
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                            `Bonjour Mamou Jewelry, je viens d'effectuer le paiement de ${formatFCFA(order.total)} FCFA par Wave pour ma commande N° ${order.order_number}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                          <span>Envoyer la preuve sur WhatsApp</span>
                        </a>
                      </div>

                      {/* Option Alternative: Transfert direct au numéro Wave */}
                      <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900">
                            Ou transfert Wave manuel :
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("774907955");
                              alert("Numéro Wave copié (774907955) !");
                            }}
                            className="text-[11px] font-bold text-[#1DC3EF] hover:underline flex items-center gap-1"
                          >
                            📋 Copier le numéro
                          </button>
                        </div>
                        <p className="text-xs text-sky-950 font-medium">
                          Faites un transfert de <span className="font-bold text-emerald-700">{formatFCFA(order.total)} FCFA</span> au <span className="font-bold font-mono bg-white px-2 py-0.5 rounded-md border border-sky-200">{formattedPhone}</span>
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <p className="text-[11px] text-[var(--text-dark)]/50 italic text-center pt-1">
                  Une fois le transfert effectué, cliquez sur le bouton vert pour envoyer votre reçu sur WhatsApp.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[var(--text-dark)] font-medium mb-2">
                  Paiement à la livraison
                </p>
                <p className="text-sm text-[var(--text-dark)]/60 leading-relaxed">
                  Vous paierez en espèces lors de la réception de votre commande. Nous vous
                  contacterons au <span className="font-medium">{order.customer_phone}</span> pour
                  confirmer la livraison.
                </p>
              </div>
            )}
          </div>

          {/* Delivery info */}
          <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-lg mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-dark)] mb-3">
              Adresse de livraison
            </p>
            <p className="text-[var(--text-dark)] leading-relaxed">{order.delivery_address}</p>
            {order.delivery_note && (
              <p className="text-sm text-[var(--text-dark)]/60 mt-2 italic">
                Note : {order.delivery_note}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Link
              href="/boutique"
              className="inline-flex rounded-full bg-[var(--gold)] px-8 py-4 text-sm font-bold text-[#241B14] shadow-lg hover:brightness-105 transition-all"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
