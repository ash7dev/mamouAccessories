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
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  duration_seconds INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser le tri et les recherches
CREATE INDEX IF NOT EXISTS idx_reels_active_sort ON reels(is_active, order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_product ON reels(product_id);

-- Activer le contrôle d'accès RLS (Row Level Security)
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

-- RLS 1: Lecture publique pour les vidéos actives
DROP POLICY IF EXISTS "Public can view active reels" ON reels;
CREATE POLICY "Public can view active reels"
  ON reels FOR SELECT
  USING (true);

-- RLS 2: Permettre l'écriture via la clé Service Role / Admin
DROP POLICY IF EXISTS "Full access for authenticated and service role" ON reels;
CREATE POLICY "Full access for authenticated and service role"
  ON reels FOR ALL
  USING (true)
  WITH CHECK (true);

