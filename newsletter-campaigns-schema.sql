-- Table d'historique des campagnes email newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    template_type TEXT DEFAULT 'custom',
    recipients_count INT DEFAULT 0,
    body_content TEXT,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour accélérer les requêtes par date
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_sent_at ON public.newsletter_campaigns (sent_at DESC);
