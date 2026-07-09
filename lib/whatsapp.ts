/**
 * Utilitaires pour les notifications WhatsApp
 */

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress?: string;
  deliveryDays?: string;
}

/**
 * Génère un message WhatsApp professionnel pour la confirmation de commande
 */
export function generateOrderConfirmationMessage(data: OrderNotificationData): string {
  const itemsList = data.items
    .map((item) => `• ${item.productName} x${item.quantity} = ${formatFCFA(item.price * item.quantity)} FCFA`)
    .join('\n');

  const message = `
✅ *COMMANDE CONFIRMÉE*

Bonjour ${data.customerName} 👋

Votre commande *#${data.orderNumber}* a été confirmée avec succès !

📦 *Détails de votre commande :*
${itemsList}

💰 *Total :* ${formatFCFA(data.totalAmount)} FCFA

🚚 *Livraison :*
Votre commande sera livrée dans les plus brefs délais${data.deliveryDays ? ` (${data.deliveryDays} jours)` : ''}.

📍 *Adresse :* ${data.deliveryAddress || 'À confirmer'}

Merci pour votre confiance ! 💎

Mamou's Accessories
`.trim();

  return message;
}

/**
 * Génère un message WhatsApp professionnel pour l'annulation de commande
 */
export function generateOrderCancellationMessage(data: OrderNotificationData, reason?: string): string {
  const itemsList = data.items
    .map((item) => `• ${item.productName} x${item.quantity}`)
    .join('\n');

  const message = `
❌ *COMMANDE ANNULÉE*

Bonjour ${data.customerName} 👋

Nous vous informons que votre commande *#${data.orderNumber}* a été annulée.

📦 *Articles concernés :*
${itemsList}

💰 *Montant :* ${formatFCFA(data.totalAmount)} FCFA

${reason ? `📝 *Raison :* ${reason}\n` : ''}

Si vous avez des questions ou souhaitez plus d'informations, n'hésitez pas à nous contacter.

Nous espérons vous revoir bientôt ! 💎

Mamou's Accessories
`.trim();

  return message;
}

/**
 * Génère un lien WhatsApp avec un message pré-rempli
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedPhone = phoneNumber.replace(/^0/, '+221').replace(/\s/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Formate un montant en FCFA
 */
function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}
