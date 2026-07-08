-- =====================================================
-- EXTENSION DU SCHÉMA : Système de Promotions
-- À ajouter après l'exécution du script principal
-- =====================================================

-- =====================================================
-- 1. TABLE: promotions (réductions automatiques)
-- =====================================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- Ex: "Soldes d'été", "Promo colliers"
  description TEXT,

  -- Type de réduction
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value INT NOT NULL CHECK (discount_value > 0),
  -- Si percentage: valeur entre 1 et 100 (ex: 20 = 20%)
  -- Si fixed_amount: montant en FCFA (ex: 2000 = 2000 FCFA)

  -- Période de validité
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  CHECK (end_date > start_date),

  -- Application
  applies_to TEXT CHECK (applies_to IN ('all_products', 'specific_category', 'specific_products')) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE, -- Si applies_to = 'specific_category'

  -- Conditions
  min_purchase_amount INT DEFAULT 0 CHECK (min_purchase_amount >= 0), -- Montant minimum de commande
  max_discount_amount INT CHECK (max_discount_amount > 0), -- Plafond de réduction (utile pour les %)

  -- État
  is_active BOOLEAN DEFAULT true,

  -- Statistiques
  usage_count INT DEFAULT 0 CHECK (usage_count >= 0), -- Nombre de fois utilisée

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table de liaison pour promotions sur produits spécifiques
CREATE TABLE IF NOT EXISTS promotion_products (
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (promotion_id, product_id)
);

-- Index pour les promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_category ON promotions(category_id);

-- =====================================================
-- 2. TABLE: promo_codes (codes promo)
-- =====================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- Ex: "SUMMER2026", "WELCOME10"
  description TEXT,

  -- Type de réduction
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value INT NOT NULL CHECK (discount_value > 0),

  -- Période de validité
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  CHECK (end_date > start_date),

  -- Conditions d'utilisation
  min_purchase_amount INT DEFAULT 0 CHECK (min_purchase_amount >= 0),
  max_discount_amount INT CHECK (max_discount_amount > 0),

  -- Limites d'utilisation
  usage_limit INT CHECK (usage_limit > 0), -- NULL = illimité
  usage_count INT DEFAULT 0 CHECK (usage_count >= 0),
  usage_limit_per_customer INT CHECK (usage_limit_per_customer > 0), -- NULL = illimité

  -- Application (optionnel : peut être global ou limité)
  applies_to TEXT CHECK (applies_to IN ('all_products', 'specific_category', 'specific_products')) DEFAULT 'all_products',
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,

  -- État
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table de liaison pour codes promo sur produits spécifiques
CREATE TABLE IF NOT EXISTS promo_code_products (
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (promo_code_id, product_id)
);

-- Table pour tracker l'utilisation des codes promo par client
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  discount_amount INT NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(promo_code_id, order_id)
);

-- Index pour les codes promo
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_dates ON promo_codes(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_phone ON promo_code_usage(customer_phone, promo_code_id);

-- =====================================================
-- 3. MISE À JOUR TABLE orders
-- =====================================================
-- Ajouter les colonnes pour tracer les promotions appliquées
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code TEXT; -- Copie du code pour historique
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount INT DEFAULT 0 CHECK (discount_amount >= 0);

-- Index pour retrouver les commandes avec promo
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code_id);

-- =====================================================
-- 4. TRIGGERS pour mettre à jour updated_at
-- =====================================================
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour vérifier si un code promo est valide
CREATE OR REPLACE FUNCTION check_promo_code_validity(
  p_code TEXT,
  p_customer_phone TEXT,
  p_cart_total INT
)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT,
  discount_amount INT,
  promo_code_id UUID
) AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_usage_count_customer INT;
  v_discount INT;
BEGIN
  -- Chercher le code promo
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE code = UPPER(p_code) AND is_active = true;

  -- Code n'existe pas ou inactif
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Code promo invalide', 0, NULL::UUID;
    RETURN;
  END IF;

  -- Vérifier la date de validité
  IF NOW() < v_promo.start_date THEN
    RETURN QUERY SELECT false, 'Ce code promo n''est pas encore valide', 0, NULL::UUID;
    RETURN;
  END IF;

  IF NOW() > v_promo.end_date THEN
    RETURN QUERY SELECT false, 'Ce code promo a expiré', 0, NULL::UUID;
    RETURN;
  END IF;

  -- Vérifier le montant minimum
  IF p_cart_total < v_promo.min_purchase_amount THEN
    RETURN QUERY SELECT
      false,
      'Montant minimum de ' || v_promo.min_purchase_amount || ' FCFA requis',
      0,
      NULL::UUID;
    RETURN;
  END IF;

  -- Vérifier la limite d'utilisation globale
  IF v_promo.usage_limit IS NOT NULL AND v_promo.usage_count >= v_promo.usage_limit THEN
    RETURN QUERY SELECT false, 'Ce code promo a atteint sa limite d''utilisation', 0, NULL::UUID;
    RETURN;
  END IF;

  -- Vérifier la limite d'utilisation par client
  IF v_promo.usage_limit_per_customer IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_count_customer
    FROM promo_code_usage
    WHERE promo_code_id = v_promo.id AND customer_phone = p_customer_phone;

    IF v_usage_count_customer >= v_promo.usage_limit_per_customer THEN
      RETURN QUERY SELECT false, 'Vous avez déjà utilisé ce code promo', 0, NULL::UUID;
      RETURN;
    END IF;
  END IF;

  -- Calculer la réduction
  IF v_promo.discount_type = 'percentage' THEN
    v_discount := (p_cart_total * v_promo.discount_value) / 100;
    -- Appliquer le plafond si défini
    IF v_promo.max_discount_amount IS NOT NULL AND v_discount > v_promo.max_discount_amount THEN
      v_discount := v_promo.max_discount_amount;
    END IF;
  ELSE -- fixed_amount
    v_discount := v_promo.discount_value;
    -- Ne pas dépasser le total du panier
    IF v_discount > p_cart_total THEN
      v_discount := p_cart_total;
    END IF;
  END IF;

  -- Code valide !
  RETURN QUERY SELECT true, 'Code promo appliqué'::TEXT, v_discount, v_promo.id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer les promotions automatiques applicables
CREATE OR REPLACE FUNCTION get_applicable_promotions(
  p_product_id UUID,
  p_category_id UUID,
  p_cart_total INT
)
RETURNS TABLE (
  promotion_id UUID,
  discount_type TEXT,
  discount_value INT,
  max_discount_amount INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.discount_type,
    p.discount_value,
    p.max_discount_amount
  FROM promotions p
  WHERE p.is_active = true
    AND NOW() BETWEEN p.start_date AND p.end_date
    AND p_cart_total >= p.min_purchase_amount
    AND (
      p.applies_to = 'all_products'
      OR (p.applies_to = 'specific_category' AND p.category_id = p_category_id)
      OR (p.applies_to = 'specific_products' AND EXISTS (
        SELECT 1 FROM promotion_products pp
        WHERE pp.promotion_id = p.id AND pp.product_id = p_product_id
      ))
    )
  ORDER BY
    -- Prioriser les réductions les plus avantageuses
    CASE
      WHEN p.discount_type = 'percentage' THEN (p_cart_total * p.discount_value / 100)
      ELSE p.discount_value
    END DESC
  LIMIT 1; -- Retourner uniquement la meilleure promo
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Public peut voir les promotions actives et valides
CREATE POLICY "Public can view active promotions"
  ON promotions FOR SELECT
  USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

-- Public peut voir les produits en promo
CREATE POLICY "Public can view promotion products"
  ON promotion_products FOR SELECT
  USING (true);

-- Codes promo : pas d'accès direct public (vérification via fonction)
CREATE POLICY "Authenticated users can manage promo codes"
  ON promo_codes FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage promo code products"
  ON promo_code_products FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin peut tout gérer
CREATE POLICY "Authenticated users can manage promotions"
  ON promotions FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage promotion products"
  ON promotion_products FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view promo usage"
  ON promo_code_usage FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. DONNÉES DE TEST (optionnel)
-- =====================================================

-- Exemple de promotion automatique : -20% sur tous les colliers
INSERT INTO promotions (name, description, discount_type, discount_value, start_date, end_date, applies_to, category_id, min_purchase_amount, is_active)
SELECT
  'Promotion Colliers -20%',
  'Profitez de 20% de réduction sur tous les colliers',
  'percentage',
  20,
  NOW(),
  NOW() + INTERVAL '30 days',
  'specific_category',
  id,
  0,
  false -- Inactif par défaut, à activer manuellement
FROM categories
WHERE slug = 'colliers'
ON CONFLICT DO NOTHING;

-- Exemple de code promo : WELCOME10 pour 10% de réduction
INSERT INTO promo_codes (code, description, discount_type, discount_value, start_date, end_date, min_purchase_amount, usage_limit, usage_limit_per_customer, is_active)
VALUES (
  'WELCOME10',
  'Code de bienvenue : 10% de réduction sur votre première commande',
  'percentage',
  10,
  NOW(),
  NOW() + INTERVAL '365 days',
  5000, -- Minimum 5000 FCFA
  100, -- Limité à 100 utilisations
  1, -- 1 utilisation par client
  false -- Inactif par défaut
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- FIN DE L'EXTENSION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Système de promotions créé avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables créées:';
  RAISE NOTICE '   - promotions (réductions automatiques)';
  RAISE NOTICE '   - promotion_products';
  RAISE NOTICE '   - promo_codes (codes promo)';
  RAISE NOTICE '   - promo_code_products';
  RAISE NOTICE '   - promo_code_usage';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Fonctions créées:';
  RAISE NOTICE '   - check_promo_code_validity()';
  RAISE NOTICE '   - get_applicable_promotions()';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Colonnes ajoutées à orders:';
  RAISE NOTICE '   - promo_code_id';
  RAISE NOTICE '   - promo_code';
  RAISE NOTICE '   - discount_amount';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Le système de promotions est prêt !';
END $$;
