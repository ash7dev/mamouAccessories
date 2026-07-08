import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/orders/[id] - Récupérer les détails d'une commande
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Récupérer la commande avec ses items
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer les statistiques du client (optionnel)
    const { data: customerStats } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('customer_phone', order.customer_phone);

    if (customerStats) {
      const stats = {
        total_orders: customerStats.length,
        total_spent: customerStats
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0),
        completed_orders: customerStats.filter(o => o.status === 'delivered').length,
      };

      return NextResponse.json({
        order: {
          ...order,
          customer_orders_count: stats.total_orders,
          customer_total_spent: stats.total_spent,
        }
      }, { status: 200 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
