"use client";

import { useState, useEffect, useMemo } from "react";
import { CommandeHeader, OrderTab } from "@/components/admin/orders/orders-header";
import { CommandesList } from "@/components/admin/orders/orders-list";
import type { OrderListItem } from "@/components/admin/orders/orders-list";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("pending");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  // Calculate counts for each tab
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      payment_verification: orders.filter(o => o.paymentStatus === 'pending_verification').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders]);

  useEffect(() => {
    let filtered = [...orders];

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "payment_verification") {
        filtered = filtered.filter(o => o.paymentStatus === 'pending_verification');
      } else {
        filtered = filtered.filter(o => o.status === activeTab);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerPhone.includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, activeTab, orders]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)] border-t-transparent" />
            <p className="text-sm text-[var(--text-dark)]/60">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <CommandeHeader
        counts={counts}
        onSearchChange={setSearchQuery}
        onTabChange={setActiveTab}
      />
      <CommandesList orders={filteredOrders} />
    </div>
  );
}
