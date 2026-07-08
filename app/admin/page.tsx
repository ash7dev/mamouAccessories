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

/**
 * Carte du deck mobile (effet d'empilement au scroll).
 *
 * Principe : CHAQUE carte est sticky avec un `top` légèrement plus grand que
 * la précédente et un `z-index` plus élevé. En scrollant, une carte vient se
 * figer sous le bord de la précédente et la recouvre progressivement — c'est
 * le navigateur qui fait tout, aucun JS.
 *
 * ⚠️ Le piège classique : `position: sticky` est cassé par TOUT ancêtre ayant
 * `overflow: hidden|auto|scroll` (layout, <main>, wrapper…). Si l'effet ne
 * marche pas, c'est presque toujours ça.
 */
function StackCard({
  index,
  children,
}: {
  index: number; // 0, 1, 2, … ordre dans le deck
  children: ReactNode;
}) {
  return (
    <div
      className="sticky"
      style={{
        top: `calc(1rem + ${index * 14}px)`, // chaque carte se fige 14px plus bas → on voit la "tranche" des précédentes
        zIndex: index + 1,
      }}
    >
      <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-5 shadow-[0_-8px_24px_-12px_rgba(43,33,24,0.25)]">
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats?period=month');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
          <p className="text-[var(--text-dark)]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Desktop Header */}
      <AdminHeader />

      {/* Mobile Header */}
      <AdminHeaderMobile />

      {/* Mobile Activity Stats */}
      <ActivityStats />

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden">
        {/* Le chart hors du deck : il scrolle normalement et n'est jamais recouvert */}
        <div className="mb-6">
          <RevenueChart 
            data={stats.revenueChart.data} 
            currentTotal={stats.revenueChart.currentTotal} 
          />
        </div>

        {/* Le deck commence ici : TopProducts est la carte 0 */}
        <div className="space-y-6 pb-10">
          <StackCard index={0}>
            <TopProducts isEmpty={stats.topProducts.length === 0} />
          </StackCard>

          <StackCard index={1}>
            <RecentOrders isEmpty={stats.recentOrders.length === 0} />
          </StackCard>

          <StackCard index={2}>
            <RecentReviews isEmpty={true} />
          </StackCard>

          <StackCard index={3}>
            <LowStockAlert isEmpty={stats.lowStockAlert.length === 0} />
          </StackCard>

          <StackCard index={4}>
            <SalesByCategory isEmpty={stats.salesByCategory.length === 0} />
          </StackCard>

          <StackCard index={5}>
            <ActivePromotions isEmpty={stats.activePromotions.length === 0} />
          </StackCard>
        </div>
      </div>

      {/* ================= DESKTOP : grille classique, aucun empilement ================= */}

      {/* KPI Cards */}
      <div className="mb-6 hidden gap-6 lg:grid lg:grid-cols-4">
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

      {/* Revenue Chart & Quick Actions */}
      <div className="mb-6 hidden gap-6 lg:grid lg:grid-cols-4">
        <div className="lg:col-span-3">
          <RevenueChart 
            data={stats.revenueChart.data} 
            currentTotal={stats.revenueChart.currentTotal} 
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Required Actions & Top Products */}
      <div className="mb-6 hidden gap-6 lg:grid lg:grid-cols-2">
        <RequiredActions isEmpty={true} />
        <TopProducts isEmpty={stats.topProducts.length === 0} />
      </div>

      {/* Recent Orders & Reviews + dernière rangée */}
      <div className="hidden lg:block">
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentOrders isEmpty={stats.recentOrders.length === 0} />
          <RecentReviews isEmpty={true} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LowStockAlert isEmpty={stats.lowStockAlert.length === 0} />
          <SalesByCategory isEmpty={stats.salesByCategory.length === 0} />
          <ActivePromotions isEmpty={stats.activePromotions.length === 0} />
        </div>
      </div>
    </div>
  );
}