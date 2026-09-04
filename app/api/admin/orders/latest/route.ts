import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);

    const sinceParam = searchParams.get('since');
    const limitParam = parseInt(searchParams.get('limit') || '5', 10);

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        total,
        payment_method,
        payment_status,
        status,
        created_at,
        order_items (id)
      `)
      .order('created_at', { ascending: false })
      .limit(limitParam);

    if (sinceParam) {
      query = query.gt('created_at', sinceParam);
    }

    const { data: rawOrders, error } = await query;

    if (error) {
      console.error('Error fetching latest orders for notification:', error);
      return NextResponse.json({ error: 'Erreur lors de la vérification des nouvelles commandes' }, { status: 500 });
    }

    const orders = (rawOrders || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      status: order.status,
      createdAt: order.created_at,
      itemsCount: order.order_items?.length || 0,
    }));

    return NextResponse.json({
      orders,
      latestTimestamp: orders.length > 0 ? orders[0].createdAt : sinceParam || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unexpected error in latest orders API:', error);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
