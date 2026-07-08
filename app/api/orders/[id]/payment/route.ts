import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { UpdatePaymentStatusInput } from '@/lib/types/order';

// PATCH /api/orders/[id]/payment - Mettre à jour le statut de paiement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body: UpdatePaymentStatusInput = await request.json();

    if (!body.payment_status) {
      return NextResponse.json(
        { error: 'Le champ payment_status est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande existe
    const { data: existing } = await supabase
      .from('orders')
      .select('id, status, payment_status')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Ne pas permettre de modifier le paiement d'une commande annulée
    if (existing.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Impossible de modifier le paiement d\'une commande annulée' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      payment_status: body.payment_status,
    };

    if (body.admin_note) {
      updateData.admin_note = body.admin_note;
    }

    // Si le paiement est confirmé, mettre à jour le statut de la commande si nécessaire
    if (body.payment_status === 'paid' && existing.status === 'pending') {
      updateData.status = 'confirmed';
    }

    // Mettre à jour la commande
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        items:order_items(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut de paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { order, message: 'Statut de paiement mis à jour avec succès' },
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
