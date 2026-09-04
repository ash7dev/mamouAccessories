"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { playOrderPingSound, unlockAudioContext } from "@/lib/audio-notifier";
import { urlBase64ToUint8Array } from "@/lib/push-notifications";

interface OrderNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  itemsCount: number;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function AdminOrderNotifier() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const lastCheckTimestamp = useRef<string | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Auto-register VAPID Push Subscription for Admin Notifications
  useEffect(() => {
    async function registerPush() {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
      try {
        const registration = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
        });

        await fetch("/api/admin/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });
      } catch (err) {
        console.error("Error registering VAPID push:", err);
      }
    }

    registerPush();
  }, []);

  // Auto-unlock audio context on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudioContext();
    };

    window.addEventListener("click", handleInteraction, { once: false });
    window.addEventListener("keydown", handleInteraction, { once: false });
    window.addEventListener("touchstart", handleInteraction, { once: false });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Poll for new orders
  useEffect(() => {
    let isSubscribed = true;

    async function checkForNewOrders() {
      try {
        const url = lastCheckTimestamp.current
          ? `/api/admin/orders/latest?since=${encodeURIComponent(lastCheckTimestamp.current)}`
          : `/api/admin/orders/latest?limit=1`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!isSubscribed || !data.orders) return;

        if (isInitialMount.current) {
          // On initial mount, store current timestamp to only notify on NEW orders afterwards
          isInitialMount.current = false;
          if (data.latestTimestamp) {
            lastCheckTimestamp.current = data.latestTimestamp;
          } else if (data.orders.length > 0) {
            lastCheckTimestamp.current = data.orders[0].createdAt;
          } else {
            lastCheckTimestamp.current = new Date().toISOString();
          }
          return;
        }

        if (data.orders.length > 0) {
          const newOrders: OrderNotification[] = data.orders;

          // Update latest timestamp to avoid duplicate notifications
          if (data.latestTimestamp) {
            lastCheckTimestamp.current = data.latestTimestamp;
          }

          // Trigger audio ping
          playOrderPingSound();

          // Add to toast list
          setNotifications((prev) => [...newOrders, ...prev].slice(0, 5));
        }
      } catch (err) {
        console.error("Error polling for order notifications:", err);
      }
    }

    // Run initial timestamp setup
    checkForNewOrders();

    // Poll every 8 seconds
    const interval = setInterval(checkForNewOrders, 8000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {notifications.map((n) => {
        const isWavePending = n.paymentMethod === "wave" && n.paymentStatus === "pending_verification";
        const isPaid = n.paymentStatus === "paid";

        return (
          <div
            key={n.id}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/40 bg-[var(--obsidienne,#0E0B09)]/95 text-[var(--porcelaine,#F1ECE3)] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4"
          >
            {/* Ambient Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--laiton,#B9793E)] via-amber-200 to-[var(--laiton,#B9793E)] animate-pulse" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* Pulse Icon */}
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/20 border border-[var(--laiton,#B9793E)]/40 text-[var(--laiton,#B9793E)]">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--laiton,#B9793E)] tracking-wider">
                      {n.orderNumber}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-200/80">
                      Nouveau !
                    </span>
                  </div>
                  <p className="font-serif text-sm font-semibold text-white">
                    {n.customerName}
                  </p>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => dismissNotification(n.id)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Fermer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
              <div>
                <span className="font-mono text-base font-bold text-white tracking-tight">
                  {formatFCFA(n.total)}{" "}
                  <span className="text-xs font-normal text-white/60">FCFA</span>
                </span>
                <div className="mt-0.5">
                  {isPaid ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                      Payé
                    </span>
                  ) : isWavePending ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/50">
                      Wave à vérifier
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-700/50">
                      Non Payé
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/admin/orders/${n.id}`}
                onClick={() => dismissNotification(n.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--laiton,#B9793E)] px-3.5 py-1.5 text-xs font-sans font-bold text-[var(--obsidienne,#0E0B09)] hover:bg-amber-300 transition-colors shadow-xs"
              >
                Voir →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
