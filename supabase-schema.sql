-- =====================================================
-- Script SQL pour initialiser la base de données
-- Site e-commerce de bijoux
-- =====================================================

-- Activer l'extension UUID (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLE: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les catégories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position);

-- =====================================================
-- 2. TABLE: products
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INT NOT NULL CHECK (price >= 0),
  compare_at_price INT CHECK (compare_at_price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_orientation TEXT CHECK (image_orientation IN ('portrait', 'landscape')) DEFAULT 'portrait',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Contrainte : le prix barré doit être supérieur au prix actuel
  CONSTRAINT check_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > price)
);

-- Index pour les produits
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TABLE: product_images
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cloudinary_public_id TEXT NOT NULL,
  position INT DEFAULT 0
);

-- Index pour les images
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_position ON product_images(product_id, position);

-- =====================================================
-- 4. TABLE: orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_note TEXT,
  payment_method TEXT CHECK (payment_method IN ('wave', 'cash_on_delivery')) DEFAULT 'wave',
  payment_status TEXT CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'refunded')) DEFAULT 'unpaid',
  payment_proof_url TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  cancel_reason TEXT,
  subtotal INT NOT NULL,
  delivery_fee INT DEFAULT 0,
  total INT NOT NULL,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
-- Index composite pour recherche rapide par client et date
CREATE INDEX IF NOT EXISTS idx_orders_phone_created ON orders(customer_phone, created_at DESC);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. TABLE: order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0)
);

-- Index pour les items de commande
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- =====================================================
-- 6. TABLE: reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Index unique pour éviter qu'une personne laisse plusieurs avis (basé sur nom + produit)
  UNIQUE(product_id, author_name)
);

-- Index pour les avis
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- =====================================================
-- 7. TABLE: settings
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insérer les paramètres par défaut
INSERT INTO settings (key, value) VALUES
  ('wave_payment_link', 'https://pay.wave.com/m/'),
  ('delivery_fee_dakar', '1500'),
  ('delivery_fee_regions', '3000'),
  ('whatsapp_number', '+221771234567'),
  ('store_open', 'true')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 8. VUE: customer_summary
-- =====================================================
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  customer_phone,
  MAX(customer_name) AS name,
  COUNT(*) AS orders_count,
  SUM(total) FILTER (WHERE status NOT IN ('cancelled')) AS total_spent,
  MAX(created_at) AS last_order_at
FROM orders
GROUP BY customer_phone;

-- =====================================================
-- 9. FONCTION: Générer un numéro de commande unique
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  counter INT;
  new_order_number TEXT;
  max_attempts INT := 10;
  attempt INT := 0;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  -- Boucle pour gérer la concurrence (éviter les doublons)
  LOOP
    -- Compter les commandes de l'année en cours
    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE order_number LIKE 'CMD-' || year || '-%';

    -- Générer le numéro avec padding de 4 chiffres
    new_order_number := 'CMD-' || year || '-' || LPAD(counter::TEXT, 4, '0');

    -- Vérifier si le numéro existe déjà
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
      RETURN new_order_number;
    END IF;

    -- Si collision, réessayer
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Impossible de générer un numéro de commande unique après % tentatives', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Politiques pour categories (lecture publique des actives)
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour products (lecture publique des actifs)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour product_images (lecture publique)
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product images"
  ON product_images FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour orders (pas d'accès public direct)
CREATE POLICY "Authenticated users can manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour order_items (pas d'accès public direct)
CREATE POLICY "Authenticated users can manage order items"
  ON order_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour reviews (lecture publique des approuvés, insert public)
CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Public can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (is_approved = false);

CREATE POLICY "Authenticated users can manage reviews"
  ON reviews FOR ALL
  USING (auth.role() = 'authenticated');

-- Politiques pour settings (lecture publique limitée)
CREATE POLICY "Public can view public settings"
  ON settings FOR SELECT
  USING (key IN ('delivery_fee_dakar', 'delivery_fee_regions', 'whatsapp_number', 'store_open'));

CREATE POLICY "Authenticated users can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 11. SEED DATA: Catégories par défaut
-- =====================================================
INSERT INTO categories (name, slug, position) VALUES
  ('Boucles d''oreilles', 'boucles-d-oreilles', 1),
  ('Colliers', 'colliers', 2),
  ('Montres', 'montres', 3),
  ('Bracelets', 'bracelets', 4),
  ('Bagues', 'bagues', 5),
  ('Ensembles', 'ensembles', 6)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Base de données initialisée avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables créées:';
  RAISE NOTICE '   - categories';
  RAISE NOTICE '   - products';
  RAISE NOTICE '   - product_images';
  RAISE NOTICE '   - orders';
  RAISE NOTICE '   - order_items';
  RAISE NOTICE '   - reviews';
  RAISE NOTICE '   - settings';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Row Level Security activé sur toutes les tables';
  RAISE NOTICE '📊 Vue customer_summary créée';
  RAISE NOTICE '🎯 6 catégories par défaut ajoutées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prêt à démarrer le développement !';
END $$;
