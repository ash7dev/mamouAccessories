import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email invalide' }, { status: 400 });
    }

    const serviceRole = createServiceRoleClient();

    const { data: existing } = await serviceRole
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ error: 'Email deja inscrit' }, { status: 409 });
      } else {
        const { error: updateError } = await serviceRole
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          return NextResponse.json({ error: 'Erreur reinscription' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Reinscription reussie !' }, { status: 200 });
      }
    }

    const { data, error } = await serviceRole
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase(), source: 'website', is_active: true })
      .select()
      .single();

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return NextResponse.json({ error: 'Erreur inscription' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Inscription reussie !', subscriber: { id: data.id, email: data.email } }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in newsletter subscription:', error);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const serviceRole = createServiceRoleClient();

    const { data: subscribers, error } = await serviceRole
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json({ error: 'Erreur recuperation abonnes' }, { status: 500 });
    }

    return NextResponse.json({ subscribers, total: subscribers?.length || 0 }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error fetching subscribers:', error);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
