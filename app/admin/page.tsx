"use client";

import { ReactNode, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminHeaderMobile } from "@/components/admin/admin-header-mobile";
import { ActivityStats } from "@/components/admin/activity-stats";
import { KpiCard } from "@/components/admin/kpi-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { QuickActions } from "@/components/admin/quick-actions";
import { RequiredActions } from "@/components/admin/required-actions";
import { TopProducts } from "@/components/admin/top-products";
import { RecentOrders } from "@/components/admin/recent-orders";
import { RecentReviews } from "@/components/admin/recent-reviews";
import { LowStockAlert } from "@/components/admin/low-stock-alert";
import { SalesByCategory } from "@/components/admin/sales-by-category";
import { ActivePromotions } from "@/components/admin/active-promotions";

function StackCard({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <div
      className="sticky"
      style={{
        top: `calc(1rem + ${index * 14}px)`,
        zIndex: index + 1,
      }}
    >
      <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-[0_-8px_24px_-12px_rgba(14,11,9,0.15)]">
        {children}
      </div>
    </div>
  );
}

interface DashboardStats {
  kpi: {
    revenue: number;
    products: number;
    orders: number;
    customers: number;
  };
  revenueChart: {
    data: Array<{ label: string; value: number }>;
    currentTotal: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string | null;
    rank: number;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    created_at: string;
  }>;
  requiredActions: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    href: string;
  }>;
  lowStockAlert: Array<{
    id: string;
    name: string;
    stock: number;
    image: string | null;
  }>;
  salesByCategory: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  activePromotions: Array<{
    id: string;
    name: string;
    description: string | null;
    discount_type: "percentage" | "fixed_amount";
    discount_value: number;
    start_date: string;
    end_date: string;
    applies_to: "all_products" | "specific_category" | "specific_products";
    min_purchase_amount: number;
    max_discount_amount: number | null;
    is_active: boolean;
    usage_count: number;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/admin/stats?period=${period}`, {
          cache: 'no-store',
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [period]);

  const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

  const currentMonth = new Date().toLocaleDateString("fr-FR", { month: "long" });
  const monthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--laiton,#B9793E)] mx-auto mb-4"></div>
          <p className="font-serif text-[var(--obsidienne,#0E0B09)] font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Desktop Header */}
      <AdminHeader />

      {/* Mobile Header */}
      <AdminHeaderMobile
        monthRevenue={stats.revenueChart.currentTotal}
        totalRevenue={stats.kpi.revenue}
        month={monthCapitalized}
      />

      {/* Mobile Activity Stats */}
      <ActivityStats
        totalProducts={stats.kpi.products}
        totalOrders={stats.kpi.orders}
        totalClients={stats.kpi.customers}
      />

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="lg:hidden space-y-6">
        {/* Raccourcis rapides directement accessibles sur mobile */}
        <QuickActions />

        {/* Évolution des encaissements */}
        <RevenueChart 
          data={stats.revenueChart.data} 
          currentTotal={stats.revenueChart.currentTotal}
          onPeriodChange={(p) => setPeriod(p)}
        />

        {/* Deck de cartes empilables pour le reste des métriques */}
        <div className="space-y-6 pb-12">
          <StackCard index={0}>
            <RequiredActions actions={stats.requiredActions || []} isEmpty={!stats.requiredActions || stats.requiredActions.length === 0} />
          </StackCard>

          <StackCard index={1}>
            <RecentOrders orders={stats.recentOrders || []} isEmpty={!stats.recentOrders || stats.recentOrders.length === 0} />
          </StackCard>

          <StackCard index={2}>
            <TopProducts products={stats.topProducts || []} isEmpty={!stats.topProducts || stats.topProducts.length === 0} />
          </StackCard>

          <StackCard index={3}>
            <LowStockAlert products={stats.lowStockAlert || []} isEmpty={!stats.lowStockAlert || stats.lowStockAlert.length === 0} />
          </StackCard>

          <StackCard index={4}>
            <SalesByCategory isEmpty={!stats.salesByCategory || stats.salesByCategory.length === 0} />
          </StackCard>

          <StackCard index={5}>
            <ActivePromotions promotions={stats.activePromotions || []} isEmpty={!stats.activePromotions || stats.activePromotions.length === 0} />
          </StackCard>
        </div>
      </div>

      {/* ================= DESKTOP LAYOUT (Harmonieux & Structuré) ================= */}
      <div className="hidden lg:block space-y-8">
        
        {/* RANGÉE 1 : 4 Cartes KPI principales */}
        <div className="grid grid-cols-4 gap-6">
          <KpiCard
            title="Revenus"
            value={formatFCFA(stats.kpi.revenue)}
            subtitle="Chiffre d'affaires total"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KpiCard
            title="Produits"
            value={stats.kpi.products}
            subtitle="Dans le catalogue"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <KpiCard
            title="Commandes"
            value={stats.kpi.orders}
            subtitle="Nombre total"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
          <KpiCard
            title="Clientes"
            value={stats.kpi.customers}
            subtitle="Clientes actives"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* RANGÉE 2 : Courbe de Performance (2/3) + Actions Rapides (1/3) */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          <div className="col-span-8">
            <RevenueChart 
              data={stats.revenueChart.data} 
              currentTotal={stats.revenueChart.currentTotal}
              onPeriodChange={(p) => setPeriod(p)}
            />
          </div>
          <div className="col-span-4">
            <QuickActions />
          </div>
        </div>

        {/* RANGÉE 3 : Actions Requises & Dernières Commandes */}
        <div className="grid grid-cols-2 gap-6">
          <RequiredActions actions={stats.requiredActions || []} isEmpty={!stats.requiredActions || stats.requiredActions.length === 0} />
          <RecentOrders orders={stats.recentOrders || []} isEmpty={!stats.recentOrders || stats.recentOrders.length === 0} />
        </div>

        {/* RANGÉE 4 : Meilleures Ventes & Alerte Stock */}
        <div className="grid grid-cols-2 gap-6">
          <TopProducts products={stats.topProducts || []} isEmpty={!stats.topProducts || stats.topProducts.length === 0} />
          <LowStockAlert products={stats.lowStockAlert || []} isEmpty={!stats.lowStockAlert || stats.lowStockAlert.length === 0} />
        </div>

        {/* RANGÉE 5 : Répartition par Catégorie, Promotions & Avis */}
        <div className="grid grid-cols-3 gap-6">
          <SalesByCategory isEmpty={!stats.salesByCategory || stats.salesByCategory.length === 0} />
          <ActivePromotions promotions={stats.activePromotions || []} isEmpty={!stats.activePromotions || stats.activePromotions.length === 0} />
          <RecentReviews isEmpty={true} />
        </div>

      </div>
    </div>
  );
}