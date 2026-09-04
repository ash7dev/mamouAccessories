import webpush from 'web-push';

// In-memory / file fallback push subscriptions store for active admin devices
let subscriptionsStore: webpush.PushSubscription[] = [];

export function getPushSubscriptions(): webpush.PushSubscription[] {
  return subscriptionsStore;
}

export function addPushSubscription(subscription: webpush.PushSubscription) {
  const exists = subscriptionsStore.some(s => s.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptionsStore.push(subscription);
  }
}

export function removePushSubscription(endpoint: string) {
  subscriptionsStore = subscriptionsStore.filter(s => s.endpoint !== endpoint);
}

// Initialize web-push VAPID keys on server side
export function initVapidKeys() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@mamouaccessories.com';

  if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
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
      removePushSubscription(subscription.endpoint);
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

  const title = `🛍️ Nouvelle commande N° ${payload.orderNumber}`;
  const body = `Cliente: ${payload.customerName} • Montant: ${formatFCFA(payload.total)} FCFA`;
  const url = payload.orderId ? `/admin/orders/${payload.orderId}` : '/admin/orders';

  const subs = getPushSubscriptions();
  const sendPromises = subs.map(sub => sendPushNotification(sub, { title, body, url }));
  await Promise.allSettled(sendPromises);
}
