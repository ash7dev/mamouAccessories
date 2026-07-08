import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/categories - Récupérer toutes les catégories actives
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des catégories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
