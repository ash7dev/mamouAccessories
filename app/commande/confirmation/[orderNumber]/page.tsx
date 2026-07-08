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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders?order_number=${orderNumber}`);
        if (!response.ok) {
          throw new Error("Commande introuvable");
        }

        const { orders } = await response.json();
        if (!orders || orders.length === 0) {
          throw new Error("Commande introuvable");
        }

        setOrder(orders[0]);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
            <p className="text-foreground">Chargement...</p>
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
              <div>
                <p className="text-[var(--text-dark)] font-medium mb-2">Paiement Wave</p>
                <p className="text-sm text-[var(--text-dark)]/60 leading-relaxed">
                  Nous vous enverrons un lien de paiement Wave sur WhatsApp au{" "}
                  <span className="font-medium">{order.customer_phone}</span>. Veuillez effectuer
                  le paiement et envoyer la preuve de paiement.
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
