import { Resend } from 'resend';

const ADMIN_EMAIL = 'mariamkoita095@gmail.com';

interface OrderItem {
  product_name: string;
  unit_price: number;
  quantity: number;
}

interface OrderEmailData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_address: string;
  delivery_note?: string | null;
  payment_method: string;
  payment_status?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: OrderItem[];
  created_at?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function getPaymentMethodLabel(method: string): string {
  switch (method.toLowerCase()) {
    case 'wave':
      return 'Wave (Paiement direct mobile)';
    case 'cash_on_delivery':
    case 'livraison':
    case 'cod':
      return 'Paiement à la livraison';
    case 'card':
      return 'Carte Bancaire';
    default:
      return method;
  }
}

/**
 * Envoie un email d'alerte de nouvelle commande à l'administrateur via Resend.
 */
export async function sendAdminOrderEmail(order: OrderEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ [Resend] RESEND_API_KEY non configurée. L\'email administrateur n\'a pas pu être envoyé.');
    return { success: false, error: 'RESEND_API_KEY non disponible dans les variables d\'environnement.' };
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mamou Accessoires <onboarding@resend.dev>';
    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || ADMIN_EMAIL;
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const siteUrl = envUrl && !envUrl.includes('localhost') ? envUrl : 'https://www.mamouaccessories.com';

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-family: sans-serif; font-size: 14px; color: #111;">
          <strong>${item.product_name}</strong>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-family: sans-serif; font-size: 14px; color: #666; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-family: sans-serif; font-size: 14px; color: #111; text-align: right; font-weight: 600;">
          ${formatCurrency(item.unit_price * item.quantity)}
        </td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle Commande #${order.order_number}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
              
              <!-- Header Luxe -->
              <tr>
                <td style="background: linear-gradient(135deg, #09090b 0%, #1c1917 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #d4af37;">
                  <div style="font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #d4af37; letter-spacing: 3px; text-transform: uppercase;">
                    MAMOU'S
                  </div>
                  <div style="font-size: 11px; letter-spacing: 4px; color: #e4e4e7; text-transform: uppercase; margin-top: 4px;">
                    ACCESSOIRES DE LUXE
                  </div>
                  <div style="margin-top: 20px; display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; padding: 6px 18px; border-radius: 20px; color: #d4af37; font-size: 13px; font-weight: 600;">
                    🎉 NOUVELLE COMMANDE REÇUE
                  </div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Numéro de commande -->
                  <div style="background-color: #fafaf9; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e7e5e4;">
                    <table width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 12px; color: #78716c; text-transform: uppercase; letter-spacing: 1px;">Commande N°</span>
                          <div style="font-size: 22px; font-weight: 800; color: #1c1917; margin-top: 2px;">#${order.order_number}</div>
                        </td>
                        <td align="right">
                          <span style="font-size: 12px; color: #78716c; text-transform: uppercase; letter-spacing: 1px;">Montant Total</span>
                          <div style="font-size: 22px; font-weight: 800; color: #d4af37; margin-top: 2px;">${formatCurrency(order.total)}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Client Info -->
                  <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1.5px; color: #444; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 0;">
                    👤 Informations Client
                  </h3>
                  <table width="100%" style="margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #333;">
                    <tr>
                      <td width="35%" style="color: #78716c;">Client :</td>
                      <td style="font-weight: 600; color: #1c1917;">${order.customer_name}</td>
                    </tr>
                    <tr>
                      <td style="color: #78716c;">Téléphone / WhatsApp :</td>
                      <td style="font-weight: 600; color: #1c1917;">
                        <a href="https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}" style="color: #059669; text-decoration: none;">
                          ${order.customer_phone} 💬 (Contacter)
                        </a>
                      </td>
                    </tr>
                    ${order.customer_email ? `
                    <tr>
                      <td style="color: #78716c;">Email :</td>
                      <td style="font-weight: 500;">${order.customer_email}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="color: #78716c;">Adresse de livraison :</td>
                      <td style="font-weight: 600; color: #1c1917;">${order.delivery_address}</td>
                    </tr>
                    ${order.delivery_note ? `
                    <tr>
                      <td style="color: #78716c;">Note de livraison :</td>
                      <td style="font-style: italic; color: #57534e;">"${order.delivery_note}"</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="color: #78716c;">Mode de paiement :</td>
                      <td style="font-weight: 600; color: #d4af37;">${getPaymentMethodLabel(order.payment_method)}</td>
                    </tr>
                  </table>

                  <!-- Produits -->
                  <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1.5px; color: #444; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">
                    🛍️ Articles Commandés
                  </h3>
                  <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                    <thead>
                      <tr style="background-color: #fafaf9;">
                        <th align="left" style="padding: 10px 16px; font-size: 12px; color: #78716c; text-transform: uppercase;">Produit</th>
                        <th align="center" style="padding: 10px 16px; font-size: 12px; color: #78716c; text-transform: uppercase;">Qté</th>
                        <th align="right" style="padding: 10px 16px; font-size: 12px; color: #78716c; text-transform: uppercase;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Totaux -->
                  <table width="100%" style="font-size: 14px; margin-bottom: 30px;">
                    <tr>
                      <td align="right" style="color: #78716c; padding: 4px 16px;">Sous-total :</td>
                      <td align="right" width="120" style="font-weight: 600; color: #1c1917; padding: 4px 16px;">${formatCurrency(order.subtotal)}</td>
                    </tr>
                    <tr>
                      <td align="right" style="color: #78716c; padding: 4px 16px;">Frais de livraison :</td>
                      <td align="right" style="font-weight: 600; color: #1c1917; padding: 4px 16px;">${formatCurrency(order.delivery_fee)}</td>
                    </tr>
                    <tr>
                      <td align="right" style="color: #1c1917; font-weight: 700; font-size: 16px; padding: 12px 16px 4px 16px; border-top: 2px solid #1c1917;">TOTAL FINAL :</td>
                      <td align="right" style="color: #d4af37; font-weight: 800; font-size: 18px; padding: 12px 16px 4px 16px; border-top: 2px solid #1c1917;">${formatCurrency(order.total)}</td>
                    </tr>
                  </table>

                  <!-- Bouton d'action Admin -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${siteUrl}/admin/orders" style="display: inline-block; background-color: #09090b; color: #d4af37; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; letter-spacing: 1px; border: 1px solid #d4af37;">
                      GÉRER DANS L'ESPACE ADMIN →
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafaf9; padding: 20px; text-align: center; border-top: 1px solid #e7e5e4; font-size: 12px; color: #a8a29e;">
                  Cet email a été envoyé automatiquement suite à une nouvelle commande sur Mamou's Accessoires.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const response = await resend.emails.send({
      from: fromEmail,
      to: adminRecipient,
      subject: `🛍️ Nouvelle Commande #${order.order_number} (${formatCurrency(order.total)}) - ${order.customer_name}`,
      html: htmlContent,
    });

    if (response.error) {
      console.error(`❌ [Resend] Erreur lors de l'envoi de l'email pour #${order.order_number}:`, response.error);
      return { success: false, error: response.error.message };
    }

    const emailId = response.data?.id;
    console.log(`✅ [Resend] Email de commande #${order.order_number} envoyé avec succès à ${adminRecipient} (ID: ${emailId})`);
    return { success: true, id: emailId };
  } catch (error: any) {
    console.error(`❌ [Resend] Erreur lors de l'envoi de l'email pour #${order.order_number}:`, error);
    return { success: false, error: error?.message || 'Erreur lors de l\'envoi de l\'email.' };
  }
}
