import { NextResponse } from 'next/server';
import { getStoredSubscriptions, sendPushNotification } from '@/lib/server/push-server';

export async function POST() {
  try {
    const subs = await getStoredSubscriptions();
    if (subs.length === 0) {
      return NextResponse.json(
        { error: "Aucun appareil n'a encore activé les notifications Push. Cliquez d'abord sur 'Activer les Notifications Push'." },
        { status: 400 }
      );
    }

    const payload = {
      title: "🔔 Test Notification Push Web",
      body: "🎉 Bravo ! Vos notifications Push Web (Style WhatsApp) fonctionnent à merveille sur cet appareil !",
      url: "/admin/settings",
    };

    const sendPromises = subs.map((sub) => sendPushNotification(sub, payload));
    const results = await Promise.allSettled(sendPromises);

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value === true).length;

    if (successCount === 0) {
      return NextResponse.json(
        { error: "Impossible de distribuer la notification. Veuillez ré-synchroniser les notifications Push." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notification Push de test envoyée à ${successCount} appareil(s) !`,
    });
  } catch (error: any) {
    console.error('Error sending test push notification:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
