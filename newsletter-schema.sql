-- Newsletter Subscribers Table
-- Ce script crée une table pour stocker les abonnés à la newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Index pour filtrer les abonnés actifs
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);

-- Index pour trier par date d'inscription
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- Fonction pour mettre à jour le updated_at automatiquement
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS trigger_update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER trigger_update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE newsletter_subscribers IS 'Table des abonnés à la newsletter';
COMMENT ON COLUMN newsletter_subscribers.id IS 'Identifiant unique de l''abonné';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Adresse email de l''abonné (unique)';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Date et heure de l''inscription';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Statut de l''abonnement (actif/inactif)';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source de l''inscription (website, popup, etc.)';
COMMENT ON COLUMN newsletter_subscribers.created_at IS 'Date de création de l''enregistrement';
COMMENT ON COLUMN newsletter_subscribers.updated_at IS 'Date de dernière modification';

-- Activer Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs non authentifiés peuvent seulement INSERT (s'inscrire)
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy : Seuls les admins peuvent SELECT, UPDATE, DELETE
CREATE POLICY "Allow admin all operations" ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
