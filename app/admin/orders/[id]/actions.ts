'use server';

import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { OrderStatus, PaymentStatus } from '@/lib/types/order';

/**
 * Mettre à jour le statut d'une commande
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  extra?: {
    adminNote?: string;
    paymentStatus?: PaymentStatus;
    cancelReason?: string;
  }
) {
  const supabase = createServiceRoleClient();

  try {
    // Récupérer la commande actuelle
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return { success: false, error: 'Commande non trouvée' };
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      status: newStatus,
    };

    if (extra?.adminNote !== undefined) {
      updateData.admin_note = extra.adminNote;
    }

    if (extra?.paymentStatus !== undefined) {
      updateData.payment_status = extra.paymentStatus;
    }

    if (extra?.cancelReason !== undefined) {
      updateData.cancel_reason = extra.cancelReason;
    }

    // Si on annule une commande confirmée/expédiée, restaurer le stock
    if (
      newStatus === 'cancelled' &&
      (currentOrder.status === 'confirmed' || currentOrder.status === 'shipped')
    ) {
      for (const item of currentOrder.items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (product) {
            await supabase
              .from('products')
              .update({ stock: product.stock + item.quantity })
              .eq('id', item.product_id);
          }
        }
      }

      // Si la commande était payée, marquer comme remboursée
      if (currentOrder.payment_status === 'paid') {
        updateData.payment_status = 'refunded';
      }
    }

    // Mettre à jour la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }

    // Revalider la page
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

/**
 * Vérifier et marquer un paiement Wave comme reçu
 */
export async function markPaymentVerified(orderId: string) {
  const supabase = createServiceRoleClient();

  try {
    // Récupérer la commande
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return { success: false, error: 'Commande non trouvée' };
    }

    // Vérifier et décrémenter le stock si la commande était en pending
    if (order.status === 'pending') {
      for (const item of order.items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (product) {
            if (product.stock < item.quantity) {
              return {
                success: false,
                error: `Stock insuffisant pour ${item.product_name}`,
              };
            }

            await supabase
              .from('products')
              .update({ stock: product.stock - item.quantity })
              .eq('id', item.product_id);
          }
        }
      }
    }

    // Mettre à jour la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      return { success: false, error: 'Erreur lors de la mise à jour du paiement' };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

/**
 * Marquer un paiement Wave comme non reçu
 */
export async function markPaymentNotReceived(orderId: string) {
  const supabase = createServiceRoleClient();

  try {
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'unpaid',
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating payment status:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

/**
 * Sauvegarder la note admin
 */
export async function saveAdminNote(orderId: string, note: string) {
  const supabase = createServiceRoleClient();

  try {
    const { error } = await supabase
      .from('orders')
      .update({ admin_note: note })
      .eq('id', orderId);

    if (error) {
      console.error('Error saving admin note:', error);
      return { success: false, error: 'Erreur lors de la sauvegarde' };
    }

    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}
