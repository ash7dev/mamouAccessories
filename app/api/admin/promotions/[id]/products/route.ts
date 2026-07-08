import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/promotions/[id]/products - Récupérer les produits d'une promotion
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data: products, error } = await supabase
      .from('promotion_products')
      .select('product_id, products(*)')
      .eq('promotion_id', id);

    if (error) {
      console.error('Error fetching promotion products:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// POST /api/admin/promotions/[id]/products - Ajouter un produit à une promotion
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.product_id) {
      return NextResponse.json(
        { error: 'product_id est requis' },
        { status: 400 }
      );
    }

    // Vérifier si la promotion existe
    const { data: promotion, error: checkError } = await supabase
      .from('promotions')
      .select('id, applies_to')
      .eq('id', id)
      .single();

    if (checkError || !promotion) {
      return NextResponse.json(
        { error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le produit existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', body.product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Ajouter le produit à la promotion
    const { data: promotionProduct, error: insertError } = await supabase
      .from('promotion_products')
      .insert({
        promotion_id: id,
        product_id: body.product_id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding product to promotion:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du produit' },
        { status: 500 }
      );
    }

    // Mettre à jour la promotion pour utiliser specific_products si ce n'est pas déjà le cas
    if (promotion.applies_to !== 'specific_products') {
      await supabase
        .from('promotions')
        .update({ applies_to: 'specific_products' })
        .eq('id', id);
    }

    return NextResponse.json({ promotionProduct }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promotions/[id]/products - Supprimer un produit d'une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id est requis dans les query params' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('promotion_products')
      .delete()
      .eq('promotion_id', id)
      .eq('product_id', product_id);

    if (deleteError) {
      console.error('Error removing product from promotion:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du produit' },
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
