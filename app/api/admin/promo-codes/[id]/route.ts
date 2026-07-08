import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/promo-codes/[id] - Récupérer un code promo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !promoCode) {
      return NextResponse.json(
        { error: 'Code promo introuvable' },
        { status: 404 }
      );
    }

    // Récupérer les produits liés si applies_to === 'specific_products'
    if (promoCode.applies_to === 'specific_products') {
      const { data: productLinks } = await supabase
        .from('promo_code_products')
        .select('product_id')
        .eq('promo_code_id', id);

      promoCode.product_ids = (productLinks || []).map((link: any) => link.product_id);
    }

    return NextResponse.json({ promoCode }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/promo-codes/[id] - Mettre à jour un code promo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Validation
    if (body.discount_value && body.discount_value <= 0) {
      return NextResponse.json(
        { error: 'La valeur de réduction doit être positive' },
        { status: 400 }
      );
    }

    if (body.discount_type === 'percentage' && body.discount_value && (body.discount_value < 1 || body.discount_value > 100)) {
      return NextResponse.json(
        { error: 'Le pourcentage doit être entre 1 et 100' },
        { status: 400 }
      );
    }

    if (body.start_date && body.end_date && new Date(body.end_date) <= new Date(body.start_date)) {
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

    // Mettre à jour le code promo
    const updateData: any = {
      description: body.description !== undefined ? body.description : undefined,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      start_date: body.start_date,
      end_date: body.end_date,
      applies_to: body.applies_to,
      category_id: body.category_id || null,
      min_purchase_amount: body.min_purchase_amount !== undefined ? body.min_purchase_amount : undefined,
      max_discount_amount: body.max_discount_amount !== undefined ? body.max_discount_amount : undefined,
      usage_limit: body.usage_limit !== undefined ? body.usage_limit : undefined,
      usage_limit_per_customer: body.usage_limit_per_customer !== undefined ? body.usage_limit_per_customer : undefined,
      is_active: body.is_active !== undefined ? body.is_active : undefined,
    };

    // Supprimer les undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const { data: promoCode, error: updateError } = await supabase
      .from('promo_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating promo code:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du code promo' },
        { status: 500 }
      );
    }

    // Gérer les produits spécifiques
    if (body.applies_to === 'specific_products' && body.product_ids) {
      // Supprimer les anciennes liaisons
      await supabase
        .from('promo_code_products')
        .delete()
        .eq('promo_code_id', id);

      // Créer les nouvelles liaisons
      if (body.product_ids.length > 0) {
        const productLinks = body.product_ids.map((productId: string) => ({
          promo_code_id: id,
          product_id: productId,
        }));

        await supabase
          .from('promo_code_products')
          .insert(productLinks);
      }
    } else if (body.applies_to !== 'specific_products') {
      // Si on change vers autre chose que specific_products, supprimer les liaisons
      await supabase
        .from('promo_code_products')
        .delete()
        .eq('promo_code_id', id);
    }

    return NextResponse.json({ promoCode }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promo-codes/[id] - Supprimer un code promo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promo code:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du code promo' },
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
