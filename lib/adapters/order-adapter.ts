import type { OrderWithDetails } from '@/lib/types/order';
import type { OrderDetailData } from '@/components/admin/orders/orders-details';
import { buildImageUrl } from '@/lib/cloudinary';

/**
 * Adapte les données de l'API vers le format attendu par le composant OrderDetail
 */
export function adaptOrderForDisplay(apiOrder: OrderWithDetails): OrderDetailData {
  return {
    id: apiOrder.id,
    orderNumber: apiOrder.order_number,
    status: apiOrder.status,
    paymentMethod: apiOrder.payment_method,
    paymentStatus: apiOrder.payment_status,
    paymentProofUrl: apiOrder.payment_proof_url
      ? buildImageUrl(apiOrder.payment_proof_url, { width: 800, quality: 'auto' })
      : null,
    createdAt: apiOrder.created_at,
    customerName: apiOrder.customer_name,
    customerPhone: apiOrder.customer_phone,
    customerEmail: apiOrder.customer_email,
    deliveryAddress: apiOrder.delivery_address,
    deliveryNote: apiOrder.delivery_note,
    subtotal: apiOrder.subtotal,
    deliveryFee: apiOrder.delivery_fee,
    total: apiOrder.total,
    adminNote: apiOrder.admin_note,
    cancelReason: apiOrder.cancel_reason,
    items: apiOrder.items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      imageUrl: item.product_image
        ? buildImageUrl(item.product_image, {})
        : null,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
  };
}
