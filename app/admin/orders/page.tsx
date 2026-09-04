"use client";

import { useState, useEffect, useMemo } from "react";
import { CommandeHeader, OrderTab } from "@/components/admin/orders/orders-header";
import { CommandesList } from "@/components/admin/orders/orders-list";
import type { OrderListItem } from "@/components/admin/orders/orders-list";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("pending");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  // Calcul des statistiques d'activité KPI
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      payment_verification: orders.filter(
        (o) => o.paymentStatus === "pending_verification"
      ).length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // Filtrage combiné par onglet & recherche
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filtre par onglet
    if (activeTab !== "all") {
      if (activeTab === "payment_verification") {
        result = result.filter((o) => o.paymentStatus === "pending_verification");
      } else {
        result = result.filter((o) => o.status === activeTab);
      }
    }

    // Filtre par mot-clé de recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }

    return result;
  }, [searchQuery, activeTab, orders]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 font-sans">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-44 w-full animate-pulse rounded-3xl bg-neutral-900/10 border border-[var(--laiton)]/20" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white border border-neutral-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 font-sans">
      <CommandeHeader
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <CommandesList orders={filteredOrders} />
    </div>
  );
}
