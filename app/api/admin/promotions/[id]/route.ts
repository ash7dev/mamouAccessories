import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/promotions/[id] - Récupérer une promotion par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: promotion, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching promotion:', error);
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
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

// PUT /api/admin/promotions/[id] - Mettre à jour une promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Validation des champs requis
    if (!body.name || !body.discount_type || !body.discount_value || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { error: 'Les champs name, discount_type, discount_value, start_date et end_date sont requis' },
        { status: 400 }
      );
    }

    // Validation des valeurs
    if (body.discount_value <= 0) {
      return NextResponse.json(
        { error: 'La valeur de réduction doit être positive' },
        { status: 400 }
      );
    }

    if (body.discount_type === 'percentage' && (body.discount_value < 1 || body.discount_value > 100)) {
      return NextResponse.json(
        { error: 'Le pourcentage doit être entre 1 et 100' },
        { status: 400 }
      );
    }

    if (new Date(body.end_date) <= new Date(body.start_date)) {
      return NextResponse.json(
        { error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    if (body.applies_to === 'specific_category' && !body.category_id) {
      return NextResponse.json(
        { error: 'category_id est requis lorsque applies_to est specific_category' },
        { status: 400 }
      );
    }

    // Mettre à jour la promotion
    const { data: promotion, error: promotionError } = await supabase
      .from('promotions')
      .update({
        name: body.name,
        description: body.description || null,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        start_date: body.start_date,
        end_date: body.end_date,
        applies_to: body.applies_to || 'all_products',
        category_id: body.category_id || null,
        min_purchase_amount: body.min_purchase_amount || 0,
        max_discount_amount: body.max_discount_amount || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (promotionError) {
      console.error('Error updating promotion:', promotionError);
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

// DELETE /api/admin/promotions/[id] - Supprimer une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Vérifier si la promotion existe
    const { data: existingPromotion, error: checkError } = await supabase
      .from('promotions')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingPromotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la promotion
    const { error: deleteError } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting promotion:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la promotion' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
