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

  // Polling Retry & Timer state
  const [attemptCount, setAttemptCount] = useState(1);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const maxAttempts = 5;

  // Elapsed seconds timer tick
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // Order Fetch with Auto-Retry / Polling loop
  useEffect(() => {
    if (!orderNumber) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchOrderWithRetry(currentAttempt: number) {
      if (!isMounted) return;

      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders?order_number=${orderNumber}`),
          fetch("/api/admin/settings").catch(() => null),
        ]);

        if (orderRes.ok) {
          const data = await orderRes.json();
          if (data.orders && data.orders.length > 0) {
            if (isMounted) {
              setOrder(data.orders[0]);

              if (settingsRes && settingsRes.ok) {
                const settingsData = await settingsRes.json();
                if (settingsData.settings) {
                  if (settingsData.settings.wave_link) setWaveLink(settingsData.settings.wave_link);
                  if (settingsData.settings.whatsapp_number) setWhatsappNumber(settingsData.settings.whatsapp_number);
                }
              }

              setLoading(false);
              return;
            }
          }
        }

        // If order not found yet and we haven't reached maxAttempts, retry after 1.8 seconds
        if (currentAttempt < maxAttempts) {
          if (isMounted) {
            setAttemptCount(currentAttempt + 1);
            timeoutId = setTimeout(() => {
              fetchOrderWithRetry(currentAttempt + 1);
            }, 1800);
          }
        } else {
          if (isMounted) {
            setError("La commande met plus de temps que prévu à s'afficher. Veuillez vérifier votre réseau ou réessayer.");
            setLoading(false);
          }
        }
      } catch (err) {
        if (currentAttempt < maxAttempts) {
          if (isMounted) {
            setAttemptCount(currentAttempt + 1);
            timeoutId = setTimeout(() => {
              fetchOrderWithRetry(currentAttempt + 1);
            }, 1800);
          }
        } else {
          if (isMounted) {
            setError("Impossible d'accéder au serveur. Veuillez réessayer.");
            setLoading(false);
          }
        }
      }
    }

    setLoading(true);
    setError(null);
    setAttemptCount(1);
    setSecondsElapsed(0);
    fetchOrderWithRetry(1);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderNumber]);

  // Re-trigger manual retry
  const handleManualRetry = () => {
    setLoading(true);
    setError(null);
    setAttemptCount(1);
    setSecondsElapsed(0);
  };

  if (loading) {
    const progressPercent = Math.min(100, Math.round((attemptCount / maxAttempts) * 100));

    return (
      <div className="min-h-screen bg-[var(--porcelaine,#F1ECE3)]/40 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg rounded-[2.5rem] border border-[var(--laiton,#B9793E)]/30 bg-[var(--obsidienne,#0E0B09)] p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] text-white text-center space-y-6">
            {/* Spinning Golden Crest Loader */}
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-[var(--laiton,#B9793E)]/20 border-t-[var(--laiton-clair,#D9AE78)] animate-spin" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)]/15 border border-[var(--laiton)]/40 text-[var(--laiton-clair,#D9AE78)]">
                <span className="text-xl animate-pulse">✦</span>
              </div>
            </div>

            {/* Title & Eyebrow */}
            <div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] mb-1">
                ✦ CONFIRMATION EN COURS
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1ECE3]">
                Finalisation de votre commande...
              </h1>
              <p className="text-xs text-white/60 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
                Le serveur valide et enregistre votre commande. Veuillez patienter quelques instants sans fermer la page.
              </p>
            </div>

            {/* Timer & Attempt Progress Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[var(--laiton-clair,#D9AE78)] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Vérification (Tentative {attemptCount}/{maxAttempts})
                </span>
                <span className="text-white/70">
                  {secondsElapsed}s écoulées
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#E5C195] to-[var(--laiton,#B9793E)] transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(185,121,62,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-white/40 italic">
              Numéro de suivi transmis : <span className="font-mono font-semibold text-white/70">{orderNumber}</span>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--porcelaine,#F1ECE3)]/40 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-[2.5rem] border border-neutral-200 bg-white p-8 text-center shadow-xl space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-2xl font-bold">
              ⏳
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[var(--obsidienne,#0E0B09)]">
                Vérification prolongée
              </h1>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Le serveur enregistre toujours votre commande <span className="font-mono font-bold text-neutral-900">#{orderNumber}</span>.
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleManualRetry}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] text-xs font-extrabold uppercase tracking-wider shadow-lg hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] transition-all cursor-pointer"
              >
                <span>Réessayer la vérification</span>
              </button>

              <Link
                href="/boutique"
                className="block text-xs font-bold text-neutral-500 hover:text-neutral-900 py-2 transition-colors"
              >
                Retour à la boutique
              </Link>
            </div>
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
                    <p className="text-sm font-bold text-[var(--text-dark)]">Paiement Wave de {formatFCFA(order.total)} FCFA</p>
                    <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Redirection vers Wave effectuée
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-2 text-xs text-emerald-950 leading-relaxed font-sans">
                  <p className="font-semibold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <span>💡</span>
                    <span>Prochaine étape pour valider votre commande :</span>
                  </p>
                  <p>
                    Une fois votre transfert de <span className="font-bold text-emerald-800">{formatFCFA(order.total)} FCFA</span> effectué sur l&apos;application Wave, merci de cliquer sur le bouton ci-dessous pour nous envoyer votre reçu ou capture d&apos;écran sur WhatsApp.
                  </p>
                </div>

                {(() => {
                  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, '') || "221774907955";
                  let baseWaveUrl = (waveLink.trim() || "https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/").trim();
                  if (!baseWaveUrl.includes("M_") || baseWaveUrl === "https://pay.wave.com/m/") {
                    baseWaveUrl = "https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/";
                  }
                  const cleanWaveLink = baseWaveUrl.includes('?')
                    ? `${baseWaveUrl}&amount=${order.total}`
                    : `${baseWaveUrl.replace(/\/$/, '')}/?amount=${order.total}`;

                  return (
                    <div className="space-y-3 pt-1">
                      {/* Bouton Principal: Envoyer la preuve sur WhatsApp */}
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                          `Bonjour Mamou Jewelry, je viens d'effectuer le paiement de ${formatFCFA(order.total)} FCFA par Wave pour ma commande N° ${order.order_number}. Voici ma preuve de paiement.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <span className="text-lg">💬</span>
                        <span>Envoyer la preuve de paiement sur WhatsApp</span>
                      </a>

                      <div className="flex justify-between items-center text-xs text-neutral-500 pt-1 px-1">
                        <span>Besoin de ré-ouvrir l&apos;application Wave ?</span>
                        <a
                          href={cleanWaveLink}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = cleanWaveLink;
                          }}
                          className="font-semibold text-sky-600 hover:underline flex items-center gap-1"
                        >
                          <span>Ouvrir Wave</span>
                        </a>
                      </div>
                    </div>
                  );
                })()}
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
