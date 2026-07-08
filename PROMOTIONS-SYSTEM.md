# 🎁 Système de Promotions - Documentation Complète

Ce document décrit le système de promotions et codes promo pour la boutique.

---

## 📋 Vue d'Ensemble

Le système supporte **deux types de promotions** :

### 1. **Promotions Automatiques** (Réductions sans code)
- S'appliquent automatiquement aux produits éligibles
- Visibles sur la fiche produit et dans le panier
- Exemples :
  - "Soldes d'été : -20% sur tous les colliers"
  - "-15% sur toute la bijouterie du 1er au 15 août"

### 2. **Codes Promo** (Avec code à saisir)
- La cliente entre un code au moment du checkout
- Valident des conditions spécifiques
- Exemples :
  - `WELCOME10` : -10% sur la première commande
  - `SUMMER2026` : -2000 FCFA de réduction immédiate

---

## 🗄️ Structure des Tables

### Table `promotions` (Réductions automatiques)

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,

  -- Type de réduction
  discount_type TEXT, -- 'percentage' ou 'fixed_amount'
  discount_value INT, -- Ex: 20 (pour 20%) ou 5000 (pour 5000 FCFA)

  -- Période de validité
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,

  -- Application
  applies_to TEXT, -- 'all_products', 'specific_category', 'specific_products'
  category_id UUID, -- Si applies_to = 'specific_category'

  -- Conditions
  min_purchase_amount INT, -- Montant minimum requis
  max_discount_amount INT, -- Plafond de réduction

  -- Gestion
  is_active BOOLEAN,
  usage_count INT, -- Nombre de fois appliquée

  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Table `promotion_products`

Liaison pour promotions sur produits spécifiques :

```sql
CREATE TABLE promotion_products (
  promotion_id UUID,
  product_id UUID,
  PRIMARY KEY (promotion_id, product_id)
);
```

### Table `promo_codes` (Codes promo)

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE, -- Ex: 'SUMMER2026'
  description TEXT,

  -- Réduction
  discount_type TEXT,
  discount_value INT,

  -- Validité
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,

  -- Conditions
  min_purchase_amount INT,
  max_discount_amount INT,

  -- Limites d'utilisation
  usage_limit INT, -- Total global (NULL = illimité)
  usage_count INT, -- Compteur actuel
  usage_limit_per_customer INT, -- Par cliente (NULL = illimité)

  -- Application
  applies_to TEXT,
  category_id UUID,

  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Table `promo_code_usage`

Suivi des utilisations par cliente :

```sql
CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY,
  promo_code_id UUID,
  order_id UUID,
  customer_phone TEXT, -- Pour limiter usage par cliente
  discount_amount INT, -- Montant de la réduction appliquée
  used_at TIMESTAMPTZ
);
```

### Mise à Jour `orders`

Nouvelles colonnes ajoutées :

```sql
ALTER TABLE orders ADD COLUMN promo_code_id UUID;
ALTER TABLE orders ADD COLUMN promo_code TEXT; -- Copie pour historique
ALTER TABLE orders ADD COLUMN discount_amount INT DEFAULT 0;
```

---

## 🎯 Cas d'Usage

### Exemple 1 : Promotion sur une catégorie

**Objectif** : -20% sur tous les colliers pendant 2 semaines

```sql
INSERT INTO promotions (
  name, description,
  discount_type, discount_value,
  start_date, end_date,
  applies_to, category_id,
  min_purchase_amount, is_active
) VALUES (
  'Soldes Colliers',
  'Profitez de 20% de réduction sur tous les colliers',
  'percentage', 20,
  '2026-07-01', '2026-07-15',
  'specific_category', '<uuid_categorie_colliers>',
  0, true
);
```

**Résultat côté client** :
- Badge "−20%" sur tous les colliers
- Prix barré + prix réduit affiché
- Réduction appliquée automatiquement au panier

---

### Exemple 2 : Code promo de bienvenue

**Objectif** : WELCOME10 pour 10% sur la première commande (min 5000 FCFA)

```sql
INSERT INTO promo_codes (
  code, description,
  discount_type, discount_value,
  start_date, end_date,
  min_purchase_amount,
  usage_limit_per_customer,
  is_active
) VALUES (
  'WELCOME10',
  'Code de bienvenue : 10% de réduction',
  'percentage', 10,
  NOW(), NOW() + INTERVAL '365 days',
  5000,
  1, -- Une seule utilisation par cliente
  true
);
```

**Résultat côté client** :
- Champ "Code promo" au checkout
- Cliente entre `WELCOME10`
- Validation : montant ≥ 5000 FCFA et première utilisation
- Réduction de 10% appliquée sur le total

---

### Exemple 3 : Réduction fixe sur commandes importantes

**Objectif** : -3000 FCFA sur toute commande de 30 000 FCFA ou plus

```sql
INSERT INTO promotions (
  name, description,
  discount_type, discount_value,
  start_date, end_date,
  applies_to, min_purchase_amount,
  is_active
) VALUES (
  'Bonus Commande',
  '3000 FCFA offerts dès 30000 FCFA d\'achat',
  'fixed_amount', 3000,
  NOW(), NOW() + INTERVAL '30 days',
  'all_products', 30000,
  true
);
```

---

### Exemple 4 : Code VIP limité

**Objectif** : VIP50 pour -50% (50 utilisations max, 1 par cliente)

```sql
INSERT INTO promo_codes (
  code, description,
  discount_type, discount_value,
  start_date, end_date,
  usage_limit,
  usage_limit_per_customer,
  max_discount_amount,
  is_active
) VALUES (
  'VIP50',
  'Code VIP : 50% de réduction (limité)',
  'percentage', 50,
  NOW(), NOW() + INTERVAL '7 days',
  50, -- Max 50 utilisations au total
  1,  -- 1 fois par cliente
  10000, -- Plafond : max 10000 FCFA de réduction
  true
);
```

---

## ⚙️ Fonctions SQL Utilitaires

### 1. `check_promo_code_validity()`

Vérifie si un code promo est valide avant application :

```sql
SELECT * FROM check_promo_code_validity(
  'WELCOME10',           -- Code
  '+221771234567',       -- Téléphone cliente
  15000                  -- Total panier
);

-- Retourne :
-- is_valid | error_message | discount_amount | promo_code_id
-- true     | Code promo...  | 1500            | <uuid>
```

**Validations effectuées** :
- ✅ Code existe et est actif
- ✅ Date valide (entre start_date et end_date)
- ✅ Montant minimum atteint
- ✅ Limite globale non dépassée
- ✅ Limite par cliente non dépassée
- ✅ Calcul de la réduction

---

### 2. `get_applicable_promotions()`

Trouve la meilleure promotion automatique pour un produit :

```sql
SELECT * FROM get_applicable_promotions(
  '<product_id>',       -- ID du produit
  '<category_id>',      -- ID de la catégorie
  15000                 -- Total panier
);

-- Retourne la promo avec la plus grosse réduction
```

---

## 🎨 Interface Admin

### Page `/admin/promotions`

**Réductions Automatiques** :
- Liste des promotions actives/inactives
- Bouton "Créer une promotion"
- Formulaire :
  - Nom et description
  - Type : Pourcentage ou Montant fixe
  - Valeur
  - Dates de début et fin
  - Application : Tous / Catégorie / Produits spécifiques
  - Montant minimum (optionnel)
  - Plafond de réduction (optionnel)
  - Actif/Inactif

**Actions** :
- Activer/Désactiver rapidement
- Modifier
- Supprimer (avec confirmation)
- Voir les statistiques d'usage

---

### Page `/admin/promo-codes`

**Codes Promo** :
- Liste des codes avec statut
- Bouton "Créer un code promo"
- Formulaire similaire + :
  - Code (généré ou personnalisé)
  - Limite d'utilisation globale
  - Limite par cliente
  - Conditions d'application

**Statistiques** :
- Nombre d'utilisations
- Revenus générés
- Taux de conversion

---

## 💻 Côté Client

### Affichage des Promotions Automatiques

**Liste des produits** :
```tsx
{product.has_promo && (
  <div className="badge">−{product.promo_percent}%</div>
)}
<p className="price">
  {product.has_promo && (
    <span className="old-price">{product.price} FCFA</span>
  )}
  <span className="current-price">{product.final_price} FCFA</span>
</p>
```

**Panier** :
```tsx
<div className="cart-summary">
  <p>Sous-total : {subtotal} FCFA</p>
  {hasPromo && (
    <p className="discount">Réduction : −{discount} FCFA</p>
  )}
  <p className="total">Total : {total} FCFA</p>
</div>
```

---

### Application des Codes Promo

**Checkout** :
```tsx
<div className="promo-code">
  <input
    type="text"
    placeholder="Code promo (optionnel)"
    value={promoCode}
    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
  />
  <button onClick={applyPromoCode}>Appliquer</button>
</div>

{promoApplied && (
  <div className="promo-success">
    ✅ Code {promoCode} appliqué : −{discount} FCFA
  </div>
)}

{promoError && (
  <div className="promo-error">
    ❌ {promoError}
  </div>
)}
```

---

## 🔄 Flux Complet

### 1. Cliente Browse la Boutique

1. Produits avec promotion automatique :
   - Badge "−20%" visible
   - Prix barré + prix réduit
2. Ajout au panier : prix réduit automatiquement appliqué

### 2. Cliente au Checkout

1. Récapitulatif avec réductions automatiques
2. Champ "Code promo" disponible
3. Cliente entre un code (ex: WELCOME10)
4. Validation côté serveur :
   ```typescript
   const { data } = await supabase
     .rpc('check_promo_code_validity', {
       p_code: promoCode,
       p_customer_phone: customerPhone,
       p_cart_total: cartTotal
     })

   if (data.is_valid) {
     // Appliquer la réduction
     setDiscount(data.discount_amount)
   } else {
     // Afficher l'erreur
     setError(data.error_message)
   }
   ```

### 3. Création de la Commande

```typescript
const order = {
  // ... autres champs
  subtotal: cartTotal,
  discount_amount: discount,
  total: cartTotal - discount + deliveryFee,
  promo_code_id: promoCodeId,
  promo_code: promoCode, // Copie pour historique
}

// Incrémenter le compteur d'usage
if (promoCodeId) {
  await supabase
    .rpc('increment_promo_usage', { promo_id: promoCodeId })

  // Enregistrer l'usage
  await supabase
    .from('promo_code_usage')
    .insert({
      promo_code_id: promoCodeId,
      order_id: orderId,
      customer_phone: customerPhone,
      discount_amount: discount
    })
}
```

---

## 📊 Règles de Cumul

### Priorité des Réductions

1. **Promotions automatiques** : Appliquées en premier
2. **Code promo** : Appliqué sur le total après promos auto

### Exemple de Calcul

```
Panier :
- Collier A : 10 000 FCFA (promotion -20%)
- Bague B : 5 000 FCFA

Sous-total avec promos auto :
- Collier A : 8 000 FCFA (−2 000 FCFA)
- Bague B : 5 000 FCFA
= 13 000 FCFA

Code promo WELCOME10 (-10%) :
- Réduction : 1 300 FCFA

Total avant livraison : 11 700 FCFA
Frais de livraison : +1 500 FCFA
Total final : 13 200 FCFA
```

---

## ✅ Checklist d'Implémentation

### Phase 1 : Base de Données
- [ ] Exécuter `supabase-promotions.sql`
- [ ] Vérifier les tables créées
- [ ] Tester les fonctions SQL

### Phase 2 : Admin - Promotions Auto
- [ ] Page liste promotions
- [ ] Formulaire création/édition
- [ ] Activation/Désactivation
- [ ] Sélection produits/catégories

### Phase 3 : Admin - Codes Promo
- [ ] Page liste codes promo
- [ ] Formulaire création/édition
- [ ] Génération de codes aléatoires
- [ ] Statistiques d'usage

### Phase 4 : Client - Affichage
- [ ] Badges promo sur produits
- [ ] Prix barrés
- [ ] Récapitulatif panier

### Phase 5 : Client - Checkout
- [ ] Champ code promo
- [ ] Validation en temps réel
- [ ] Messages d'erreur clairs
- [ ] Application de la réduction

### Phase 6 : Tests
- [ ] Promo automatique sur catégorie
- [ ] Promo automatique sur produits
- [ ] Code promo avec conditions
- [ ] Limites d'utilisation
- [ ] Cumul promos + codes

---

## 🚀 Déploiement

### 1. Exécuter le Script SQL

Après avoir exécuté `supabase-schema.sql`, exécutez :

```bash
# Dans Supabase SQL Editor
[Copier/coller le contenu de supabase-promotions.sql]
```

### 2. Vérification

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'promo%' OR table_name = 'promotions';

-- Vérifier les fonctions
SELECT routine_name FROM information_schema.routines
WHERE routine_name LIKE '%promo%';
```

---

**🎁 Système de promotions prêt à l'emploi !**

Ce système offre une flexibilité maximale pour gérer tous types de promotions.
