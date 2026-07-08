# Configuration de la Base de Données Supabase

Ce guide vous explique comment initialiser la structure de la base de données pour le projet.

## 📋 Prérequis

- Un compte Supabase actif
- Le fichier `supabase-schema.sql` (fourni)

## 🚀 Étapes d'Installation

### Méthode 1 : Via l'interface Supabase (Recommandée)

1. **Connectez-vous à Supabase**
   - Allez sur https://supabase.com
   - Connectez-vous avec votre compte (mariamkoita095@gmail.com)

2. **Ouvrez votre projet**
   - Sélectionnez le projet : `mariamkoita095@gmail.com's Project`
   - ID : `hsnkxtjwfkyzvxisodjs`

3. **Ouvrez l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New query"**

4. **Copiez et collez le script**
   - Ouvrez le fichier `supabase-schema.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL de Supabase

5. **Exécutez le script**
   - Cliquez sur le bouton **"Run"** (ou appuyez sur `Cmd+Enter`)
   - Attendez quelques secondes

6. **Vérifiez que tout s'est bien passé**
   - Vous devriez voir plusieurs messages de confirmation
   - Un message final : "✅ Base de données initialisée avec succès !"

### Méthode 2 : Via la ligne de commande (Alternative)

Si vous préférez utiliser la CLI Supabase :

```bash
# Installer la CLI Supabase (si pas déjà fait)
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref hsnkxtjwfkyzvxisodjs

# Exécuter le script SQL
supabase db execute -f supabase-schema.sql
```

## ✅ Vérification

Après l'exécution du script, vous devriez avoir :

### Tables créées (7) :
- ✅ `categories` - Catégories de produits
- ✅ `products` - Produits
- ✅ `product_images` - Images des produits
- ✅ `orders` - Commandes
- ✅ `order_items` - Articles de commande
- ✅ `reviews` - Avis clients
- ✅ `settings` - Paramètres du site

### Vues créées (1) :
- ✅ `customer_summary` - Vue agrégée des clientes

### Fonctions créées (1) :
- ✅ `generate_order_number()` - Génère des numéros de commande uniques

### Données de départ :
- ✅ 6 catégories par défaut :
  - Boucles d'oreilles
  - Colliers
  - Montres
  - Bracelets
  - Bagues
  - Ensembles
- ✅ 5 paramètres système configurés

### Sécurité :
- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ Politiques d'accès configurées

## 🔍 Comment vérifier que tout fonctionne

1. Dans Supabase, allez dans **"Table Editor"**
2. Vous devriez voir toutes les tables listées
3. Cliquez sur **"categories"**
4. Vous devriez voir 6 catégories déjà créées

## ❓ En cas de problème

### Erreur : "relation already exists"
- C'est normal si vous avez déjà exécuté le script
- Le script est idempotent (peut être exécuté plusieurs fois sans problème)

### Erreur : "permission denied"
- Assurez-vous d'être connecté avec le bon compte
- Vérifiez que vous êtes propriétaire du projet

### Autres erreurs
- Copiez le message d'erreur complet
- Contactez le support ou demandez de l'aide

## 🎯 Prochaines Étapes

Une fois la base de données configurée :

1. ✅ Supabase configuré
2. ✅ Cloudinary configuré
3. ✅ Base de données initialisée
4. **➡️ Prêt à développer l'application !**

Les prochaines étapes de développement :
- Phase 1 : Authentification admin + Dashboard
- Phase 2 : Gestion des produits et catégories
- Phase 3 : Gestion des commandes
- Phase 4 : Front boutique publique
- Phase 5 : Checkout et paiement
- Phase 6 : Finitions (avis, SEO, etc.)

---

**Besoin d'aide ?** N'hésitez pas à poser des questions !
