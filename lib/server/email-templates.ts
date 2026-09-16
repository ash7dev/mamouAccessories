export type CampaignTemplateType = 'promo' | 'product_launch' | 'vip_invitation' | 'custom';

export interface EmailTemplateData {
  headline: string;
  message: string;
  templateType: CampaignTemplateType;
  promoCode?: string;
  discountPercentage?: string;
  productName?: string;
  productPrice?: string;
  productImageUrl?: string;
  productUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

function formatCurrency(amount: string | number): string {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  }
  return amount;
}

export function generateCampaignEmailHtml(data: EmailTemplateData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mamouaccessories.com';
  const ctaText = data.ctaText || 'DÉCOUVRIR SUR LA BOUTIQUE →';
  const ctaUrl = data.ctaUrl || `${siteUrl}/boutique`;

  const formattedMessageHtml = data.message
    .split('\n')
    .map(paragraph => paragraph.trim() ? `<p style="margin: 0 0 16px 0; color: #333333; font-size: 15px; line-height: 1.7;">${paragraph}</p>` : '')
    .join('');

  let specialBlockHtml = '';

  if (data.templateType === 'promo' && data.promoCode) {
    specialBlockHtml = `
      <!-- Bloc Code Promo Doré -->
      <div style="background: linear-gradient(135deg, #09090b 0%, #1c1917 100%); border: 2px dashed #d4af37; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #e4e4e7; margin-bottom: 6px;">
          🎟️ Votre Code Privilège Exclusif
        </div>
        <div style="font-size: 28px; font-weight: 900; letter-spacing: 5px; color: #d4af37; text-transform: uppercase; font-family: monospace; background: rgba(212, 175, 55, 0.1); padding: 10px 20px; border-radius: 10px; display: inline-block; margin: 10px 0;">
          ${data.promoCode}
        </div>
        ${data.discountPercentage ? `
          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 6px;">
            🎉 Valable pour une réduction immédiate de <span style="color: #d4af37;">${data.discountPercentage}</span> !
          </div>
        ` : ''}
        <div style="font-size: 12px; color: #a1a1aa; margin-top: 10px;">
          Copiez ce code et utilisez-le directement lors de votre validation de commande.
        </div>
      </div>
    `;
  } else if (data.templateType === 'product_launch' && data.productName) {
    specialBlockHtml = `
      <!-- Bloc Produit Phare -->
      <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 20px; overflow: hidden; margin: 28px 0;">
        ${data.productImageUrl ? `
          <div style="width: 100%; height: 260px; background-color: #17120d; text-align: center; overflow: hidden;">
            <img src="${data.productImageUrl}" alt="${data.productName}" style="width: 100%; height: 100%; object-fit: cover; max-height: 260px;" />
          </div>
        ` : ''}
        <div style="padding: 24px; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #d4af37; margin-bottom: 4px;">
            💎 BIJOU DU MOMENT
          </div>
          <h3 style="font-size: 20px; font-weight: 800; color: #1c1917; margin: 0 0 8px 0;">
            ${data.productName}
          </h3>
          ${data.productPrice ? `
            <div style="font-size: 22px; font-weight: 800; color: #d4af37; margin-bottom: 16px;">
              ${formatCurrency(data.productPrice)}
            </div>
          ` : ''}
          <a href="${data.productUrl || `${siteUrl}/boutique`}" style="display: inline-block; background-color: #09090b; color: #d4af37; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; border: 1px solid #d4af37;">
            COMMANDER CE BIJOU →
          </a>
        </div>
      </div>
    `;
  } else if (data.templateType === 'vip_invitation') {
    specialBlockHtml = `
      <!-- Bloc Vente Privée VIP -->
      <div style="background: linear-gradient(135deg, #1c1917 0%, #09090b 100%); border-left: 4px solid #d4af37; border-radius: 12px; padding: 20px; margin: 28px 0; color: #ffffff;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #d4af37; font-weight: 700;">
          👑 ACCÈS RÉSERVÉ AU CERCLE PRIVÉ MAMOU'S
        </div>
        <div style="font-size: 14px; color: #e4e4e7; margin-top: 6px; line-height: 1.6;">
          En tant qu'abonnée privilégiée, vous bénéficiez du traitement VIP prioritaire sur le stock et le service de livraison rapide.
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.headline}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f6; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.08);">
              
              <!-- Header Prestige -->
              <tr>
                <td style="background: linear-gradient(135deg, #09090b 0%, #1c1917 100%); padding: 40px 30px; text-align: center; border-bottom: 3px solid #d4af37;">
                  <div style="font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #d4af37; letter-spacing: 4px; text-transform: uppercase;">
                    MAMOU'S
                  </div>
                  <div style="font-size: 10px; letter-spacing: 5px; color: #e4e4e7; text-transform: uppercase; margin-top: 4px;">
                    ACCESSOIRES DE LUXE
                  </div>
                </td>
              </tr>

              <!-- Corps -->
              <tr>
                <td style="padding: 36px 30px;">
                  
                  <!-- Headline -->
                  <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1c1917; margin: 0 0 20px 0; leading-height: 1.3; text-align: center;">
                    ${data.headline}
                  </h1>

                  <!-- Divider doré sous le titre -->
                  <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 24px auto;"></div>

                  <!-- Texte principal -->
                  <div>
                    ${formattedMessageHtml}
                  </div>

                  <!-- Bloc Spécial selon Modèle -->
                  ${specialBlockHtml}

                  <!-- Bouton d'Action CTA -->
                  <div style="text-align: center; margin-top: 36px;">
                    <a href="${ctaUrl}" style="display: inline-block; background-color: #09090b; color: #d4af37; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; letter-spacing: 1px; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                      ${ctaText}
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer Luxe -->
              <tr>
                <td style="background-color: #fafaf9; padding: 24px 30px; text-align: center; border-top: 1px solid #e7e5e4;">
                  <div style="font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: #1c1917; margin-bottom: 4px;">
                    Mamou's Accessoires
                  </div>
                  <div style="font-size: 12px; color: #78716c; margin-bottom: 12px;">
                    Sénégal & International • Bijoux & Sacs de Luxe
                  </div>
                  <div style="font-size: 11px; color: #a8a29e; line-height: 1.5;">
                    Vous recevez cet email car vous êtes inscrite au Cercle Privé Mamou's Accessoires.<br/>
                    Pour gérer vos préférences ou vous désinscrire, merci de répondre simplement à cet email.
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
