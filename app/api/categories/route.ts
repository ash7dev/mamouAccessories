import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/categories - Récupérer toutes les catégories actives avec compteur de produits
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des catégories' },
        { status: 500 }
      );
    }

    // Transformer les données pour inclure le compteur de produits
    const transformedCategories = (categories || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      position: category.position,
      is_active: category.is_active,
      productCount: category.products?.[0]?.count || 0,
    }));

    return NextResponse.json({ categories: transformedCategories }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
