# 🔧 Optimisations du Schéma SQL

Ce document liste les optimisations appliquées au schéma de base de données.

---

## ✅ Optimisations Appliquées

### 1. **Contrainte sur les Prix Promotionnels** (Table `products`)

**Problème** : Rien n'empêchait de mettre un prix barré inférieur ou égal au prix actuel.

**Solution** :
```sql
CONSTRAINT check_compare_price CHECK (
  compare_at_price IS NULL OR compare_at_price > price
)
```

**Bénéfices** :
- Garantit que les promos sont cohérentes
- Évite les erreurs de saisie (ex: prix barré = 5000, prix = 10000)
- Améliore la confiance client

---

### 2. **Index Composite pour Recherche Client** (Table `orders`)

**Problème** : Rechercher toutes les commandes d'un client nécessitait deux index séparés.

**Solution** :
```sql
CREATE INDEX idx_orders_phone_created
ON orders(customer_phone, created_at DESC);
```

**Bénéfices** :
- Recherche ultra-rapide de l'historique client
- Optimise la vue `customer_summary`
- Améliore les performances de la page "Clientes" dans l'admin

**Exemple de requête optimisée** :
```sql
-- Avant : Index séparé sur phone puis tri sur created_at (lent)
-- Après : Index composite direct (rapide !)
SELECT * FROM orders
WHERE customer_phone = '+221771234567'
ORDER BY created_at DESC;
```

---

### 3. **Contrainte UNIQUE sur les Avis** (Table `reviews`)

**Problème** : Une personne pouvait laisser plusieurs avis sur le même produit.

**Solution** :
```sql
UNIQUE(product_id, author_name)
```

**Bénéfices** :
- Empêche le spam d'avis
- Un seul avis par personne par produit
- Évite les manipulations de notes

**Note** : C'est basé sur le nom car pas de compte client. Si quelqu'un change de nom, il peut laisser un nouvel avis (acceptable).

---

### 4. **Fonction generate_order_number() Robuste**

**Problème** : En cas de commandes simultanées, risque de collision de numéros.

**Solution** : Ajout d'une boucle de vérification avec retry
```sql
LOOP
  -- Générer le numéro
  new_order_number := 'CMD-' || year || '-' || LPAD(counter::TEXT, 4, '0');

  -- Vérifier qu'il n'existe pas déjà
  IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
    RETURN new_order_number;
  END IF;

  -- Réessayer jusqu'à 10 fois
  attempt := attempt + 1;
  IF attempt >= max_attempts THEN
    RAISE EXCEPTION 'Impossible de générer un numéro unique';
  END IF;
END LOOP;
```

**Bénéfices** :
- Gère les commandes simultanées (Black Friday, etc.)
- Garantit l'unicité absolue des numéros
- Maximum 10 tentatives avant erreur (sécurité)

---

## 📊 Impact des Optimisations

| Optimisation | Impact Performance | Impact Qualité Données | Complexité |
|--------------|-------------------|------------------------|------------|
| Check prix promo | - | ⭐⭐⭐ Élevé | Faible |
| Index composite | ⭐⭐⭐ Élevé | - | Faible |
| Unique avis | - | ⭐⭐ Moyen | Faible |
| Fonction robuste | ⭐ Faible | ⭐⭐⭐ Élevé | Moyen |

---

## 🔍 Autres Bonnes Pratiques Déjà en Place

### ✅ Index Bien Placés
- `idx_products_slug` : Recherche rapide de produits par URL
- `idx_orders_status` : Filtrage rapide par statut
- `idx_reviews_approved` : Affichage rapide des avis validés

### ✅ Contraintes de Données
- `CHECK (rating BETWEEN 1 AND 5)` : Notes valides uniquement
- `CHECK (stock >= 0)` : Pas de stock négatif
- `CHECK (quantity > 0)` : Pas de commande à 0 article

### ✅ RLS (Row Level Security)
- Lecture publique des produits actifs uniquement
- Écriture réservée aux utilisateurs authentifiés
- Pas d'accès direct aux commandes pour les visiteurs

### ✅ Triggers Automatiques
- `updated_at` mis à jour automatiquement sur products et orders
- Aucun risque d'oubli côté application

---

## 🚫 Ce Qui N'a PAS Été Optimisé (Volontairement)

### 1. Pas de Table `customers`
**Pourquoi ?** Le projet ne nécessite pas de comptes clients (commande invité).
- Vue `customer_summary` agrège les infos par téléphone
- Simplification du modèle
- Moins de maintenance

### 2. Pas de Table `cart`
**Pourquoi ?** Le panier est en localStorage côté client.
- Pas de persistance serveur nécessaire
- Moins de charge sur la base
- Plus simple pour une petite boutique

### 3. Pas de Soft Delete Systématique
**Pourquoi ?** Seuls les produits ont `is_active`.
- Les catégories sont rarement supprimées
- Les commandes ne sont jamais supprimées (historique)
- Les avis peuvent être supprimés définitivement (modération)

---

## 🎯 Optimisations Futures (v2)

Si le projet évolue, voici ce qu'on pourrait ajouter :

### 1. Full-Text Search sur les Produits
```sql
ALTER TABLE products ADD COLUMN search_vector tsvector;
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
```

### 2. Partitionnement de la Table `orders`
Si beaucoup de commandes (>100k), partitionner par année :
```sql
CREATE TABLE orders_2026 PARTITION OF orders
FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

### 3. Materialized View pour les Stats
Pour un dashboard très rapide :
```sql
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders,
  SUM(total) FILTER (WHERE created_at >= CURRENT_DATE) AS today_revenue,
  -- etc.
FROM orders;
```

---

## ✅ Conclusion

Le schéma est maintenant :
- ✅ Robuste (gère les cas limites)
- ✅ Performant (index bien placés)
- ✅ Sécurisé (contraintes + RLS)
- ✅ Maintenable (simple et clair)

**Le schéma est prêt pour la production !** 🚀

---

**Prochaines étapes :**
1. Créer le compte admin ([ADMIN-SETUP.md](ADMIN-SETUP.md))
2. Exécuter le script SQL ([SETUP-DATABASE.md](SETUP-DATABASE.md))
3. Commencer le développement !
