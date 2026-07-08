import { CommandeHeader } from "@/components/admin/orders/orders-header";
import { CommandesList } from "@/components/admin/orders/orders-list";
import type { OrderListItem } from "@/components/admin/orders/orders-list";
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getOrders(): Promise<OrderListItem[]> {
  const supabase = createServiceRoleClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      total,
      status,
      payment_method,
      payment_status,
      created_at,
      order_items (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  // Transform snake_case to camelCase for component
  return (orders || []).map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    itemsCount: order.order_items?.length || 0,
    total: order.total,
    status: order.status,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    createdAt: order.created_at,
  }));
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-6 lg:p-8">
      {/* Orders Header */}
      <CommandeHeader />

      {/* Orders List */}
      <CommandesList orders={orders} />
    </div>
  );
}
