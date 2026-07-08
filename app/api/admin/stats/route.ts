import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/stats - Récupérer toutes les statistiques du dashboard
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year

    // Calculer les dates pour la période
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 1. KPIs
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalCustomers },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('customer_phone', { count: 'exact', head: true }).not('customer_phone', 'is', null),
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', startDate.toISOString())
        .in('status', ['confirmed', 'delivered'])
    ]);

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0;

    // 2. Revenue chart data (groupé par jour/semaine/mois selon la période)
    const { data: revenueChart } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', startDate.toISOString())
      .in('status', ['confirmed', 'delivered'])
      .order('created_at', { ascending: true });

    // Formatter les données pour le graphique
    const chartData = formatRevenueChart(revenueChart || [], period);

    // 3. Top produits (par nombre de ventes)
    const { data: topProductsData } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, unit_price')
      .limit(100); // Simplifier pour l'instant, on pourra optimiser avec des vues SQL plus tard

    const topProducts = (topProductsData || []).map((item, index) => ({
      id: item.product_id,
      name: item.product_name,
      sales: item.quantity,
      revenue: item.quantity * (item.unit_price || 0),
      rank: index + 1
    }));

    // 4. Commandes récentes
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Alertes stock faible
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('*')
      .lte('stock', 5)
      .eq('is_active', true)
      .order('stock', { ascending: true })
      .limit(10);

    // 6. Ventes par catégorie - Simplifié
    const categorySales: Array<{ id: string; name: string; sales: number; revenue: number }> = [];

    // 7. Promotions actives
    const { data: activePromotions } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .or('end_date.is.null,end_date.gte.' + new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      kpi: {
        revenue: totalRevenue,
        products: totalProducts || 0,
        orders: totalOrders || 0,
        customers: totalCustomers || 0,
      },
      revenueChart: {
        data: chartData,
        currentTotal: totalRevenue,
      },
      topProducts,
      recentOrders: recentOrders || [],
      lowStockAlert: lowStockProducts || [],
      salesByCategory: categorySales,
      activePromotions: activePromotions || [],
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}

// Helper functions
function formatRevenueChart(orders: any[], period: string): Array<{ label: string; value: number }> {
  const grouped: Record<string, number> = {};

  orders.forEach(order => {
    const date = new Date(order.created_at);
    let key: string;

    switch (period) {
      case 'day':
        key = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        break;
      case 'week':
        key = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        break;
      case 'month':
        key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        break;
      case 'year':
        key = date.toLocaleDateString('fr-FR', { month: 'short' });
        break;
      default:
        key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }

    grouped[key] = (grouped[key] || 0) + order.total;
  });

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

function aggregateSalesByCategory(items: any[]): Array<{ id: string; name: string; sales: number; revenue: number }> {
  const grouped: Record<string, { name: string; sales: number; revenue: number }> = {};

  items.forEach(item => {
    const categoryId = item.products?.category_id;
    const categoryName = item.products?.categories?.name || 'Non catégorisé';
    const price = item.unit_price || 0;

    if (categoryId) {
      if (!grouped[categoryId]) {
        grouped[categoryId] = { name: categoryName, sales: 0, revenue: 0 };
      }
      grouped[categoryId].sales += item.quantity;
      grouped[categoryId].revenue += item.quantity * price;
    }
  });

  return Object.entries(grouped).map(([id, data]) => ({
    id,
    name: data.name,
    sales: data.sales,
    revenue: data.revenue,
  }));
}
