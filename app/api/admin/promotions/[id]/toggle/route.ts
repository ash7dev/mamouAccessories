import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// PATCH /api/admin/promotions/[id]/toggle - Activer/désactiver une promotion
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Vérifier si la promotion existe
    const { data: existingPromotion, error: checkError } = await supabase
      .from('promotions')
      .select('is_active')
      .eq('id', id)
      .single();

    if (checkError || !existingPromotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    // Basculer l'état ou utiliser la valeur fournie
    const newStatus = body.is_active !== undefined ? body.is_active : !existingPromotion.is_active;

    const { data: promotion, error: updateError } = await supabase
      .from('promotions')
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error toggling promotion:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la promotion' },
        { status: 500 }
      );
    }

    return NextResponse.json({ promotion }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
