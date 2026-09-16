import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { generateCampaignEmailHtml, CampaignTemplateType } from '@/lib/server/email-templates';

interface SendCampaignInput {
  subject: string;
  headline: string;
  message: string;
  templateType: CampaignTemplateType;
  mode: 'test' | 'broadcast';
  testEmail?: string;
  promoCode?: string;
  discountPercentage?: string;
  productName?: string;
  productPrice?: string;
  productImageUrl?: string;
  productUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Resend non configurée sur le serveur.' },
        { status: 500 }
      );
    }

    const body: SendCampaignInput = await request.json();

    if (!body.subject || !body.headline || !body.message) {
      return NextResponse.json(
        { error: 'Le sujet, le titre et le contenu du message sont requis.' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mamou Accessoires <contact@mamouaccessories.com>';
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'mariamkoita095@gmail.com';

    // Générer le code HTML élégant
    const html = generateCampaignEmailHtml({
      headline: body.headline,
      message: body.message,
      templateType: body.templateType || 'custom',
      promoCode: body.promoCode,
      discountPercentage: body.discountPercentage,
      productName: body.productName,
      productPrice: body.productPrice,
      productImageUrl: body.productImageUrl,
      productUrl: body.productUrl,
      ctaText: body.ctaText,
      ctaUrl: body.ctaUrl,
    });

    const supabase = createServiceRoleClient();

    // Mode TEST : envoi uniquement à l'administrateur
    if (body.mode === 'test') {
      const recipient = body.testEmail || adminEmail;

      const response = await resend.emails.send({
        from: fromEmail,
        to: recipient,
        subject: `[TEST] ${body.subject}`,
        html,
      });

      if (response.error) {
        console.error('❌ [Resend Test Campaign Error]:', response.error);
        return NextResponse.json(
          { error: `Erreur d'envoi du test: ${response.error.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Email de test envoyé avec succès à ${recipient} !`,
        id: response.data?.id,
      });
    }

    // Mode BROADCAST : envoi à tous les abonnés de la base
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError || !subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Aucun abonné actif trouvé pour recevoir la campagne.' },
        { status: 404 }
      );
    }

    const emails = subscribers.map(s => s.email);
    let successCount = 0;
    let failCount = 0;

    // Envoi via Resend (envoi groupé ou itératif)
    for (const targetEmail of emails) {
      try {
        const response = await resend.emails.send({
          from: fromEmail,
          to: targetEmail,
          subject: body.subject,
          html,
        });

        if (response.error) {
          console.error(`Erreur pour ${targetEmail}:`, response.error);
          failCount++;
        } else {
          successCount++;
        }
      } catch (e) {
        console.error(`Erreur inattendue pour ${targetEmail}:`, e);
        failCount++;
      }
    }

    // Enregistrer la campagne dans l'historique (si la table existe)
    try {
      const { error: insertError } = await supabase.from('newsletter_campaigns').insert({
        subject: body.subject,
        template_type: body.templateType,
        recipients_count: successCount,
        body_content: body.message,
        status: failCount === 0 ? 'sent' : 'partial',
        sent_at: new Date().toISOString(),
      });

      if (insertError) {
        console.warn('⚠️ [Newsletter Campaigns Table Warning]:', insertError.message);
      }
    } catch (e: any) {
      console.warn('⚠️ [Newsletter Campaigns Table Exception]:', e?.message || e);
    }

    if (successCount === 0 && failCount > 0) {
      return NextResponse.json(
        {
          error:
            "Échec de l'envoi via Resend. Si votre domaine n'est pas encore vérifié sur Resend, utilisez 'onboarding@resend.dev' comme expéditeur et vérifiez votre dossier Spams/Courriers indésirables.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: `Campagne envoyée avec succès à ${successCount} abonné(s) ! (${failCount} échec(s))`,
      successCount,
      failCount,
    });
  } catch (error: any) {
    console.error('Unexpected error in campaign send API:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du traitement de la campagne.' },
      { status: 500 }
    );
  }
}

