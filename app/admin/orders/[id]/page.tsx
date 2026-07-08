import { notFound } from 'next/navigation';
import { CommandeHeader } from '@/components/admin/orders/orders-header';
import { CommandeDetail } from '@/components/admin/orders/orders-details';
import { adaptOrderForDisplay } from '@/lib/adapters/order-adapter';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
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
    notFound();
  }

  // Récupérer les images des produits pour chaque item
  if (order.items && order.items.length > 0) {
    const productIds = order.items
      .map((item: any) => item.product_id)
      .filter((id: any) => id !== null);

    if (productIds.length > 0) {
      const { data: productImages } = await supabase
        .from('product_images')
        .select('product_id, cloudinary_public_id')
        .in('product_id', productIds)
        .eq('position', 0); // Première image seulement

      // Mapper les images aux items
      if (productImages) {
        order.items = order.items.map((item: any) => {
          const image = productImages.find((img: any) => img.product_id === item.product_id);
          return {
            ...item,
            product_image: image?.cloudinary_public_id || null,
          };
        });
      }
    }
  }

  // Récupérer les statistiques du client
  const { data: customerStats } = await supabase
    .from('orders')
    .select('id, total, status')
    .eq('customer_phone', order.customer_phone);

  let orderWithDetails = order;

  if (customerStats) {
    const stats = {
      total_orders: customerStats.length,
      total_spent: customerStats
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + o.total, 0),
      completed_orders: customerStats.filter((o: any) => o.status === 'delivered').length,
    };

    orderWithDetails = {
      ...order,
      customer_orders_count: stats.total_orders,
      customer_total_spent: stats.total_spent,
    };
  }

  // Adapter les données pour le composant
  const displayOrder = adaptOrderForDisplay(orderWithDetails);

  return (
    <div className="p-6 lg:p-8">
      {/* Orders Header */}
      <CommandeHeader />
      
      {/* Order Detail */}
      <CommandeDetail order={displayOrder} />
    </div>
  );
}
