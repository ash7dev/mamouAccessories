import { NextResponse } from 'next/server';
import { addPushSubscription } from '@/lib/server/push-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Subscription invalide' }, { status: 400 });
    }

    addPushSubscription(subscription);

    return NextResponse.json({ success: true, message: 'Push notification activée avec succès !' });
  } catch (error: any) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
