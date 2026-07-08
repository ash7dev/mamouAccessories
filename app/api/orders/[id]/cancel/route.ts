import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { CancelOrderInput } from '@/lib/types/order';

// POST /api/orders/[id]/cancel - Annuler une commande
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body: CancelOrderInput = await request.json();

    if (!body.cancel_reason) {
      return NextResponse.json(
        { error: 'Le champ cancel_reason est requis' },
        { status: 400 }
      );
    }

    // Récupérer la commande avec ses items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la commande n'est pas déjà annulée
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cette commande est déjà annulée' },
        { status: 400 }
      );
    }

    // Ne pas permettre d'annuler une commande déjà livrée
    if (order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Impossible d\'annuler une commande déjà livrée' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      status: 'cancelled',
      cancel_reason: body.cancel_reason,
    };

    // Si remboursement demandé et la commande était payée
    if (body.refund && order.payment_status === 'paid') {
      updateData.payment_status = 'refunded';
    }

    // Mettre à jour la commande
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        items:order_items(*)
      `)
      .single();

    if (updateError) {
      console.error('Error cancelling order:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'annulation de la commande' },
        { status: 500 }
      );
    }

    // Remettre le stock des produits
    for (const item of order.items) {
      if (item.product_id) {
        // Récupérer le stock actuel
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product) {
          // Incrémenter le stock
          await supabase
            .from('products')
            .update({ stock: product.stock + item.quantity })
            .eq('id', item.product_id);
        }
      }
    }

    return NextResponse.json(
      {
        order: updatedOrder,
        message: 'Commande annulée avec succès',
        stock_restored: true
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
