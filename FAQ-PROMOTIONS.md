# ❓ FAQ - Système de Promotions

Questions fréquentes sur le système de promotions.

---

## 🎯 Questions Générales

### Q1 : Quelle est la différence entre une promotion et un code promo ?

**Promotion automatique** :
- S'applique automatiquement sur les produits éligibles
- Visible immédiatement (badge "−20%" sur le produit)
- Pas besoin de saisir un code
- Exemple : "Soldes colliers : -20%"

**Code promo** :
- La cliente doit entrer un code au checkout
- Pas visible avant d'être appliqué
- Permet des conditions spéciales (ex: 1ère commande uniquement)
- Exemple : "WELCOME10" pour -10%

---

### Q2 : Peut-on cumuler une promotion et un code promo ?

**Oui !** Voici l'ordre d'application :

1. **Promotions automatiques** appliquées en premier sur les produits
2. **Code promo** appliqué ensuite sur le sous-total

**Exemple** :
```
Collier : 10 000 FCFA (promo -20%)
Prix après promo : 8 000 FCFA

Code WELCOME10 (-10%) sur le sous-total :
8 000 - 800 = 7 200 FCFA
```

---

### Q3 : Comment limiter un code promo à certains clients ?

Utilisez `usage_limit_per_customer` :

```sql
INSERT INTO promo_codes (
  code,
  usage_limit_per_customer,
  ...
) VALUES (
  'FIRSTORDER',
  1, -- Une seule utilisation par cliente
  ...
);
```

Le système vérifie automatiquement via le numéro de téléphone.

---

## 🛠️ Questions Techniques

### Q4 : Comment créer une promotion sur une seule catégorie ?

```sql
INSERT INTO promotions (
  name,
  discount_type,
  discount_value,
  start_date,
  end_date,
  applies_to,
  category_id
) VALUES (
  'Promo Colliers',
  'percentage',
  20,
  NOW(),
  NOW() + INTERVAL '30 days',
  'specific_category',
  (SELECT id FROM categories WHERE slug = 'colliers')
);
```

---

### Q5 : Comment créer une promotion sur plusieurs produits spécifiques ?

1. Créez la promotion :
```sql
INSERT INTO promotions (
  name,
  discount_type,
  discount_value,
  applies_to,
  ...
) VALUES (
  'Sélection Coup de Coeur',
  'percentage',
  15,
  'specific_products',
  ...
) RETURNING id;
```

2. Liez les produits :
```sql
INSERT INTO promotion_products (promotion_id, product_id)
VALUES
  ('<promotion_id>', '<product_id_1>'),
  ('<promotion_id>', '<product_id_2>'),
  ('<promotion_id>', '<product_id_3>');
```

---

### Q6 : Comment plafonner une réduction en pourcentage ?

Utilisez `max_discount_amount` :

```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  max_discount_amount,
  ...
) VALUES (
  'VIP50',
  'percentage',
  50, -- 50% de réduction
  10000, -- Mais maximum 10000 FCFA
  ...
);
```

**Exemple** :
- Panier de 30 000 FCFA : réduction de 10 000 FCFA (plafonné)
- Panier de 15 000 FCFA : réduction de 7 500 FCFA (non plafonné)

---

### Q7 : Comment vérifier si un code promo est valide ?

Utilisez la fonction SQL :

```typescript
const { data, error } = await supabase
  .rpc('check_promo_code_validity', {
    p_code: 'WELCOME10',
    p_customer_phone: '+221771234567',
    p_cart_total: 15000
  })

if (data.is_valid) {
  console.log('Réduction :', data.discount_amount)
} else {
  console.log('Erreur :', data.error_message)
}
```

---

### Q8 : Comment désactiver temporairement une promotion ?

Deux options :

**Option 1 : Désactiver** (conserve les données)
```sql
UPDATE promotions
SET is_active = false
WHERE id = '<promotion_id>';
```

**Option 2 : Modifier les dates**
```sql
UPDATE promotions
SET end_date = NOW() - INTERVAL '1 day'
WHERE id = '<promotion_id>';
```

---

## 💰 Questions Business

### Q9 : Comment créer un code promo pour les influenceuses ?

```sql
INSERT INTO promo_codes (
  code,
  description,
  discount_type,
  discount_value,
  start_date,
  end_date,
  usage_limit, -- Limite globale
  usage_limit_per_customer,
  is_active
) VALUES (
  'INFLUENCER20',
  'Code réservé aux influenceuses partenaires',
  'percentage',
  20,
  NOW(),
  NOW() + INTERVAL '90 days',
  NULL, -- Illimité au total
  3,    -- Mais 3 commandes max par personne
  true
);
```

---

### Q10 : Comment faire des soldes "flash" (courte durée) ?

```sql
INSERT INTO promotions (
  name,
  description,
  discount_type,
  discount_value,
  start_date,
  end_date, -- Très court
  applies_to,
  is_active
) VALUES (
  'Flash Sale 24h',
  '30% de réduction pendant 24h seulement !',
  'percentage',
  30,
  '2026-07-15 00:00:00',
  '2026-07-15 23:59:59', -- 24h pile
  'all_products',
  true
);
```

**Astuce** : Affichez un compte à rebours sur le site !

---

### Q11 : Comment offrir la livraison gratuite avec un code ?

La livraison n'est pas gérée par le système de promos.

**Solution** :
1. Code promo qui réduit le montant des frais de livraison :
```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value, -- Montant des frais de livraison
  min_purchase_amount,
  ...
) VALUES (
  'FREELIVERY',
  'fixed_amount',
  1500, -- Montant des frais Dakar
  20000, -- Minimum 20000 FCFA
  ...
);
```

2. Ou ajouter une logique côté application pour mettre `delivery_fee = 0`.

---

### Q12 : Comment créer un code "parrainage" ?

Le code de parrainage nécessite une fonctionnalité supplémentaire (non incluse v1).

**Pour v1, workaround** :
- Créez un code unique par cliente qui parraine
- Exemple : `MARIE10`, `FATOU10`
- Chaque code = 1 utilisation

**Pour v2** :
- Ajouter une table `referrals`
- Lier parrain ↔ filleul
- Bonus pour les deux

---

## 📊 Questions Admin

### Q13 : Comment voir les statistiques d'un code promo ?

```sql
SELECT
  pc.code,
  pc.usage_count,
  pc.usage_limit,
  COUNT(pcu.id) AS actual_uses,
  SUM(pcu.discount_amount) AS total_discount_given
FROM promo_codes pc
LEFT JOIN promo_code_usage pcu ON pc.id = pcu.promo_code_id
WHERE pc.code = 'WELCOME10'
GROUP BY pc.id, pc.code, pc.usage_count, pc.usage_limit;
```

---

### Q14 : Comment supprimer une promotion qui a déjà été utilisée ?

**Recommandation** : Ne jamais supprimer, désactivez plutôt.

```sql
-- ❌ NE PAS FAIRE
DELETE FROM promotions WHERE id = '...';

-- ✅ FAIRE PLUTÔT
UPDATE promotions SET is_active = false WHERE id = '...';
```

**Pourquoi ?**
- Conserve l'historique
- Les commandes passées restent cohérentes
- Les statistiques restent accessibles

---

### Q15 : Comment modifier un code promo en cours ?

```sql
UPDATE promo_codes
SET
  discount_value = 15, -- Passer de 10% à 15%
  end_date = NOW() + INTERVAL '60 days', -- Prolonger
  usage_limit = 200 -- Augmenter la limite
WHERE code = 'WELCOME10';
```

**Attention** : Les commandes déjà passées ne sont PAS affectées.

---

## 🚨 Cas Limites

### Q16 : Que se passe-t-il si deux promotions s'appliquent au même produit ?

**Le système choisit automatiquement la meilleure.**

La fonction `get_applicable_promotions()` trie par montant de réduction décroissant et retourne la première (la plus avantageuse).

---

### Q17 : Une cliente peut-elle utiliser plusieurs codes promo sur une commande ?

**Non.** Une seule utilisation par commande.

C'est une contrainte de la table `orders` :
```sql
promo_code_id UUID -- Un seul code
```

Si besoin de cumuler, il faudrait :
- Ajouter une table `order_promo_codes` (relation many-to-many)
- Modifier la logique de calcul

---

### Q18 : Comment éviter qu'une promotion crée des prix négatifs ?

Le système vérifie automatiquement :

```sql
-- Dans check_promo_code_validity()
IF v_discount > p_cart_total THEN
  v_discount := p_cart_total; -- Plafonner au total du panier
END IF;
```

**Impossible d'avoir un total négatif.**

---

## 🔒 Sécurité

### Q19 : Les codes promo sont-ils sensibles à la casse ?

**Oui, par défaut.** Mais on normalise en majuscules :

```typescript
// Côté client
const promoCode = input.toUpperCase()

// Côté serveur (fonction SQL)
WHERE code = UPPER(p_code)
```

**Conseil** : Toujours créer les codes en MAJUSCULES.

---

### Q20 : Comment empêcher l'abus de codes promo ?

**Protections en place** :
1. `usage_limit` : Limite globale
2. `usage_limit_per_customer` : Limite par téléphone
3. Table `promo_code_usage` : Historique complet

**Protection supplémentaire (à implémenter)** :
- Rate limiting côté application (max 5 tentatives/minute)
- Honeypot sur le formulaire
- Blocage IP en cas d'abus

---

## 💡 Bonnes Pratiques

### Q21 : Faut-il toujours définir une date de fin ?

**Oui, absolument.**

Même pour les codes "permanents", mettez une date lointaine :
```sql
end_date = NOW() + INTERVAL '10 years'
```

**Pourquoi ?**
- Permet de désactiver facilement
- Évite les codes "morts" oubliés
- Facilite la maintenance

---

### Q22 : Combien de promotions actives maximum ?

**Pas de limite technique**, mais recommandations :
- Max 3-5 promotions automatiques simultanées
- Éviter la confusion client
- Tester les performances si >20 promotions actives

---

### Q23 : Comment nommer les codes promo ?

**Bonnes pratiques** :
- Descriptifs : `WELCOME10`, `SUMMER2026`, `VIP50`
- Courts (6-15 caractères)
- Majuscules uniquement
- Faciles à taper sur mobile

❌ **À éviter** :
- `a1b2c3d4` (trop cryptique)
- `PromotionDEteDesColliersEtBraclets2026` (trop long)
- `Été-2026` (caractères spéciaux)

---

**📖 Plus de questions ? Consultez [PROMOTIONS-SYSTEM.md](PROMOTIONS-SYSTEM.md)**
