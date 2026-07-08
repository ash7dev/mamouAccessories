import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  CancelOrderInput,
  OrderFilters,
  OrderWithItems,
  OrderWithDetails,
} from '@/lib/types/order';

/**
 * Créer une nouvelle commande
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderWithItems> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la création de la commande');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Récupérer toutes les commandes avec filtres optionnels
 */
export async function getOrders(filters?: OrderFilters): Promise<OrderWithItems[]> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.payment_status) params.append('payment_status', filters.payment_status);
  if (filters?.payment_method) params.append('payment_method', filters.payment_method);
  if (filters?.customer_phone) params.append('customer_phone', filters.customer_phone);
  if (filters?.order_number) params.append('order_number', filters.order_number);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const url = `/api/orders${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des commandes');
  }

  const data = await response.json();
  return data.orders;
}

/**
 * Récupérer une commande par son ID
 */
export async function getOrderById(id: string): Promise<OrderWithDetails> {
  const response = await fetch(`/api/orders/${id}`);

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la commande');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Mettre à jour le statut d'une commande
 */
export async function updateOrderStatus(
  id: string,
  input: UpdateOrderStatusInput
): Promise<OrderWithItems> {
  const response = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la mise à jour du statut');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Mettre à jour le statut de paiement d'une commande
 */
export async function updateOrderPaymentStatus(
  id: string,
  input: UpdatePaymentStatusInput
): Promise<OrderWithItems> {
  const response = await fetch(`/api/orders/${id}/payment`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la mise à jour du paiement');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Annuler une commande
 */
export async function cancelOrder(
  id: string,
  input: CancelOrderInput
): Promise<OrderWithItems> {
  const response = await fetch(`/api/orders/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'annulation de la commande');
  }

  const data = await response.json();
  return data.order;
}

/**
 * Helper pour créer une commande avec upload de preuve de paiement
 */
export async function createOrderWithPaymentProof(
  input: Omit<CreateOrderInput, 'payment_proof_url'>,
  paymentProofFile?: File
): Promise<OrderWithItems> {
  let paymentProofUrl: string | undefined;

  // Si un fichier de preuve est fourni, l'uploader vers Cloudinary
  if (paymentProofFile) {
    const { uploadImageToCloudinary } = await import('./products');
    paymentProofUrl = await uploadImageToCloudinary(paymentProofFile);
  }

  // Créer la commande avec l'URL de la preuve
  return createOrder({
    ...input,
    payment_proof_url: paymentProofUrl,
  });
}

/**
 * Helper pour confirmer une commande (passer de pending à confirmed)
 */
export async function confirmOrder(id: string, adminNote?: string): Promise<OrderWithItems> {
  return updateOrderStatus(id, {
    status: 'confirmed',
    admin_note: adminNote,
  });
}

/**
 * Helper pour marquer une commande comme expédiée
 */
export async function shipOrder(id: string, adminNote?: string): Promise<OrderWithItems> {
  return updateOrderStatus(id, {
    status: 'shipped',
    admin_note: adminNote,
  });
}

/**
 * Helper pour marquer une commande comme livrée
 */
export async function deliverOrder(id: string, adminNote?: string): Promise<OrderWithItems> {
  return updateOrderStatus(id, {
    status: 'delivered',
    admin_note: adminNote,
  });
}

/**
 * Helper pour approuver un paiement Wave
 */
export async function approvePayment(id: string, adminNote?: string): Promise<OrderWithItems> {
  return updateOrderPaymentStatus(id, {
    payment_status: 'paid',
    admin_note: adminNote,
  });
}

/**
 * Helper pour rejeter un paiement Wave
 */
export async function rejectPayment(id: string, adminNote?: string): Promise<OrderWithItems> {
  return updateOrderPaymentStatus(id, {
    payment_status: 'unpaid',
    admin_note: adminNote,
  });
}

/**
 * Récupérer les commandes d'un client spécifique
 */
export async function getCustomerOrders(customerPhone: string): Promise<OrderWithItems[]> {
  return getOrders({ customer_phone: customerPhone });
}

/**
 * Récupérer les commandes en attente
 */
export async function getPendingOrders(): Promise<OrderWithItems[]> {
  return getOrders({ status: 'pending' });
}

/**
 * Récupérer les commandes nécessitant une vérification de paiement
 */
export async function getOrdersAwaitingPaymentVerification(): Promise<OrderWithItems[]> {
  return getOrders({ payment_status: 'pending_verification' });
}

/**
 * Calculer le total d'une commande avant création
 */
export async function calculateOrderTotal(
  items: Array<{ product_id: string; quantity: number }>,
  deliveryFee: number
): Promise<{ subtotal: number; total: number; items: Array<any> }> {
  // Récupérer les prix des produits
  const productIds = items.map(item => item.product_id).join(',');
  const response = await fetch(`/api/products?id=${productIds}`);

  if (!response.ok) {
    throw new Error('Erreur lors du calcul du total');
  }

  const { products } = await response.json();

  let subtotal = 0;
  const orderItems = items.map(item => {
    const product = products.find((p: any) => p.id === item.product_id);
    if (!product) {
      throw new Error(`Produit ${item.product_id} non trouvé`);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      total: itemTotal,
    };
  });

  return {
    subtotal,
    total: subtotal + deliveryFee,
    items: orderItems,
  };
}
