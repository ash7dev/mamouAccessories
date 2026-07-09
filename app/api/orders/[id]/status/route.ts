import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { generateOrderConfirmationMessage, generateOrderCancellationMessage, generateWhatsAppLink } from '@/lib/whatsapp';
import type { UpdateOrderStatusInput } from '@/lib/types/order';

// PATCH /api/orders/[id]/status - Mettre à jour le statut d'une commande
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body: UpdateOrderStatusInput = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: 'Le champ status est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande existe
    const { data: existing } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Ne pas permettre de changer le statut d'une commande annulée
    if (existing.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Impossible de modifier une commande annulée' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut
    const updateData: any = {
      status: body.status,
    };

    if (body.admin_note) {
      updateData.admin_note = body.admin_note;
    }

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        items:order_items(*),
        customer:customers(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating order status:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut' },
        { status: 500 }
      );
    }

    // Générer le lien WhatsApp si le statut est confirmé ou annulé
    let whatsappLink = null;
    if (body.status === 'confirmed' || body.status === 'cancelled') {
      const customerPhone = order.customer?.phone || '';
      const customerName = order.customer?.name || 'Client';
      
      const notificationData = {
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        customerName,
        customerPhone,
        totalAmount: order.total,
        items: order.items.map((item: any) => ({
          productName: item.product_name || 'Produit',
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: order.delivery_address,
        deliveryDays: '3-5' // TODO: récupérer depuis settings
      };

      const message = body.status === 'confirmed'
        ? generateOrderConfirmationMessage(notificationData)
        : generateOrderCancellationMessage(notificationData, body.admin_note);

      whatsappLink = generateWhatsAppLink(customerPhone, message);
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return NextResponse.json(
      { 
        order, 
        message: 'Statut mis à jour avec succès',
        whatsappLink 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
