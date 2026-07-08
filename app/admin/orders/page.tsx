import { CommandeHeader } from "@/components/admin/orders/orders-header";
import { CommandesList } from "@/components/admin/orders/orders-list";
import type { OrderListItem } from "@/components/admin/orders/orders-list";

async function getOrders(): Promise<OrderListItem[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const data = await response.json();
  return data.orders || [];
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
