import { CommandeHeader } from "@/components/admin/orders/orders-header";
import { CommandesList } from "@/components/admin/orders/orders-list";
import type { OrderListItem } from "@/components/admin/orders/orders-list";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getOrders(): Promise<OrderListItem[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const data = await response.json();
  const rawOrders = data.orders || [];

  // Transform snake_case API response to camelCase for component
  return rawOrders.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    itemsCount: order.items?.length || 0,
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
