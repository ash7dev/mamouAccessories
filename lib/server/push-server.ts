import webpush from 'web-push';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const DEFAULT_VAPID_PUBLIC_KEY = 'BBqd6GqjHdmN2XlrVEwvpMIXTSkP2BGzGspc6Rv01O2I1zjgVVzzMQZDwnUDmShGxpp0DJz7OSGwDjIo36tOpN4';
const DEFAULT_VAPID_PRIVATE_KEY = 'AIqELhgUQrvwyFu4uwe-AFoa2b3t3ScA7Krkr8sN4ZM';

export function initVapidKeys() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@mamouaccessories.com';

  if (publicKey && privateKey) {
    try {
      webpush.setVapidDetails(subject, publicKey, privateKey);
    } catch (err) {
      console.error('Error setting VAPID details:', err);
    }
  }
}

export async function getStoredSubscriptions(): Promise<webpush.PushSubscription[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_push_subscriptions')
      .single();

    if (data?.value) {
      return JSON.parse(data.value);
    }
  } catch (err) {
    console.error('Error fetching push subscriptions from Supabase:', err);
  }
  return [];
}

export async function saveSubscriptionToSupabase(subscription: webpush.PushSubscription) {
  try {
    const supabase = createServiceRoleClient();
    const currentSubs = await getStoredSubscriptions();

    const exists = currentSubs.some((s) => s.endpoint === subscription.endpoint);
    if (!exists) {
      const updated = [...currentSubs, subscription];
      await supabase.from('settings').upsert(
        { key: 'admin_push_subscriptions', value: JSON.stringify(updated) },
        { onConflict: 'key' }
      );
    }
  } catch (err) {
    console.error('Error saving push subscription to Supabase:', err);
  }
}

export async function removeSubscriptionFromSupabase(endpoint: string) {
  try {
    const supabase = createServiceRoleClient();
    const currentSubs = await getStoredSubscriptions();
    const updated = currentSubs.filter((s) => s.endpoint !== endpoint);

    await supabase.from('settings').upsert(
      { key: 'admin_push_subscriptions', value: JSON.stringify(updated) },
      { onConflict: 'key' }
    );
  } catch (err) {
    console.error('Error removing push subscription from Supabase:', err);
  }
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; url?: string; icon?: string }
) {
  initVapidKeys();
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/logo.jpg',
        badge: '/icon-192.png',
        url: payload.url || '/admin/orders',
      })
    );
    return true;
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    if (error.statusCode === 410 || error.statusCode === 404) {
      await removeSubscriptionFromSupabase(subscription.endpoint);
    }
    return false;
  }
}

export async function broadcastOrderPushNotification(payload: {
  orderNumber: string;
  customerName: string;
  total: number;
  orderId?: string;
}) {
  initVapidKeys();
  const formatFCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const title = `📲 NOUVELLE COMMANDE • N° ${payload.orderNumber}`;
  const body = `💬 Cliente: ${payload.customerName}\n💰 Montant: ${formatFCFA(payload.total)} FCFA\n👉 Touchez pour ouvrir la commande`;
  const url = payload.orderId ? `/admin/orders/${payload.orderId}` : '/admin/orders';

  const subs = await getStoredSubscriptions();
  if (subs.length === 0) return;

  const sendPromises = subs.map(sub => sendPushNotification(sub, { title, body, url }));
  await Promise.allSettled(sendPromises);
}

export async function broadcastLowStockPushNotification(payload: {
  productName: string;
  remainingStock: number;
  productId?: string;
}) {
  initVapidKeys();

  const title = payload.remainingStock === 0 
    ? `🚨 RUPTURE DE STOCK • ${payload.productName}`
    : `⚠️ STOCK FAIBLE • ${payload.productName}`;
    
  const body = payload.remainingStock === 0
    ? `Il ne reste plus aucune pièce disponible pour "${payload.productName}".`
    : `Plus que ${payload.remainingStock} pièce(s) disponible(s) pour "${payload.productName}".`;

  const url = payload.productId ? `/admin/products/${payload.productId}/edit` : '/admin/products';

  const subs = await getStoredSubscriptions();
  if (subs.length === 0) return;

  const sendPromises = subs.map(sub => sendPushNotification(sub, { title, body, url }));
  await Promise.allSettled(sendPromises);
}

