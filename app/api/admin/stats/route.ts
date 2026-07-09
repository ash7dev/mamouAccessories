import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/stats - Récupérer toutes les statistiques du dashboard
// Force dynamic rendering - no caching for admin stats
export const dynamic = 'force-dynamic';

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
      { data: customersData },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'cancelled'),
      supabase.from('orders').select('customer_phone').neq('status', 'cancelled'),
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', startDate.toISOString())
        .neq('status', 'cancelled')
    ]);

    // Compter les clients uniques
    const uniqueCustomers = new Set(customersData?.map(o => o.customer_phone).filter(Boolean));
    const totalCustomers = uniqueCustomers.size;

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0;

    // 2. Revenue chart data (groupé par jour/semaine/mois selon la période)
    const { data: revenueChart } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', startDate.toISOString())
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true });

    // Formatter les données pour le graphique
    const chartData = formatRevenueChart(revenueChart || [], period);

    // 3. Top produits (par nombre de ventes) avec images
    const { data: topProductsData } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, unit_price')
      .limit(100);

    // Récupérer les images des produits top
    const productIds = (topProductsData || []).map(item => item.product_id).filter(Boolean);
    let productImages: Record<string, string> = {};
    
    if (productIds.length > 0) {
      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, cloudinary_public_id')
        .in('product_id', productIds)
        .eq('position', 0);
      
      if (images) {
        images.forEach(img => {
          if (img.cloudinary_public_id) {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
            productImages[img.product_id] = `https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}`;
          }
        });
      }
    }

    // Agréger les ventes par produit
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    (topProductsData || []).forEach(item => {
      if (!item.product_id) return;
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product_name || 'Produit',
          sales: 0,
          revenue: 0
        };
      }
      productSales[item.product_id].sales += item.quantity;
      productSales[item.product_id].revenue += item.quantity * (item.unit_price || 0);
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data], index) => ({
        id,
        name: data.name,
        sales: data.sales,
        revenue: data.revenue,
        image: productImages[id] || null,
        rank: index + 1
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5

    // 4. Commandes récentes
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // 4.5 Commandes en attente (actions requises)
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    const requiredActions = (pendingOrders || []).map(order => ({
      id: order.id,
      title: `Commande #${order.order_number}`,
      description: `Nouvelle commande de ${order.customer_name}`,
      priority: 'high' as const,
      href: `/admin/orders/${order.id}`
    }));

    // 5. Alertes stock faible avec images
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('*')
      .lte('stock', 5)
      .eq('is_active', true)
      .order('stock', { ascending: true })
      .limit(10);

    // Récupérer les images des produits en stock faible
    const lowStockIds = (lowStockProducts || []).map(p => p.id).filter(Boolean);
    let lowStockImages: Record<string, string> = {};
    
    if (lowStockIds.length > 0) {
      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, cloudinary_public_id')
        .in('product_id', lowStockIds)
        .eq('position', 0);
      
      if (images) {
        images.forEach(img => {
          if (img.cloudinary_public_id) {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
            lowStockImages[img.product_id] = `https://res.cloudinary.com/${cloudName}/image/upload/${img.cloudinary_public_id}`;
          }
        });
      }
    }

    const lowStockAlert = (lowStockProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      image: lowStockImages[p.id] || null
    }));

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
      requiredActions,
      lowStockAlert,
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
  if (orders.length === 0) return [];

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

  const result = Object.entries(grouped).map(([label, value]) => ({ label, value }));

  // Si on n'a qu'un point, ajouter un point zéro au début pour avoir une courbe
  if (result.length === 1) {
    const now = new Date();
    let beforeLabel = '';

    switch (period) {
      case 'day':
        const before = new Date(now.getTime() - 3600000); // 1h avant
        beforeLabel = before.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        break;
      case 'week':
        const weekBefore = new Date(now.getTime() - 86400000); // 1 jour avant
        beforeLabel = weekBefore.toLocaleDateString('fr-FR', { weekday: 'short' });
        break;
      case 'month':
        const monthBefore = new Date(now.getTime() - 86400000); // 1 jour avant
        beforeLabel = monthBefore.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        break;
      case 'year':
        const yearBefore = new Date(now.setMonth(now.getMonth() - 1));
        beforeLabel = yearBefore.toLocaleDateString('fr-FR', { month: 'short' });
        break;
    }

    return [{ label: beforeLabel, value: 0 }, ...result];
  }

  return result;
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
