export type PaymentMethod = 'wave' | 'cash_on_delivery';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_note: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_proof_url: string | null;
  status: OrderStatus;
  cancel_reason: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItemInput {
  product_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  // Informations client
  customer_name: string;
  customer_phone: string;
  customer_email?: string;

  // Livraison
  delivery_address: string;
  delivery_note?: string;
  delivery_fee: number;

  // Paiement
  payment_method: PaymentMethod;
  payment_proof_url?: string; // URL Cloudinary si Wave

  // Articles
  items: OrderItemInput[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  admin_note?: string;
}

export interface UpdatePaymentStatusInput {
  payment_status: PaymentStatus;
  admin_note?: string;
}

export interface CancelOrderInput {
  cancel_reason: string;
  refund?: boolean; // Si true, met payment_status à 'refunded'
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  customer_phone?: string;
  order_number?: string;
  date_from?: string; // Format: YYYY-MM-DD
  date_to?: string;   // Format: YYYY-MM-DD
}

export interface OrderSummary {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

// Pour l'affichage
export interface OrderWithDetails extends OrderWithItems {
  customer_orders_count?: number; // Nombre de commandes du client
  customer_total_spent?: number;  // Total dépensé par le client
}
