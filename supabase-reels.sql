-- =====================================================
-- Script SQL pour créer la table `reels` dans Supabase
-- Module: Reels & Lookbook Vidéo (Mamou Accessories)
-- =====================================================

CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  duration INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser le tri et les recherches
CREATE INDEX IF NOT EXISTS idx_reels_active_sort ON reels(is_active, sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_product ON reels(product_id);

-- Trigger pour mise à jour automatique de updated_at
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE TRIGGER update_reels_updated_at
      BEFORE UPDATE ON reels
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Activer le contrôle d'accès RLS (Row Level Security)
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

-- RLS 1: Lecture publique pour les vidéos actives
DROP POLICY IF EXISTS "Public can view active reels" ON reels;
CREATE POLICY "Public can view active reels"
  ON reels FOR SELECT
  USING (is_active = true);

-- RLS 2: Les administrateurs peuvent ajouter, modifier et supprimer
DROP POLICY IF EXISTS "Authenticated users can manage reels" ON reels;
CREATE POLICY "Authenticated users can manage reels"
  ON reels FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS 3: Optionnel - Accès anonyme complet si Supabase est configuré sans Auth intégrée
DROP POLICY IF EXISTS "Anon full access for reels" ON reels;
CREATE POLICY "Anon full access for reels"
  ON reels FOR ALL
  USING (true)
  WITH CHECK (true);
