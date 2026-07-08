# Site E-commerce de Bijoux

Site e-commerce pour une bijouterie avec espace admin et boutique publique.

## 🚀 Stack Technique

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de données**: Supabase (PostgreSQL)
- **Médias**: Cloudinary
- **Hébergement**: Vercel

## 📋 Prérequis

- Node.js 20+
- Un compte Supabase (plan Free)
- Un compte Cloudinary (plan Free)

## 🛠️ Installation

1. **Cloner le projet** (déjà fait)

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Copiez le fichier `.env.example` vers `.env.local` et remplissez les valeurs :

   ```bash
   cp .env.example .env.local
   ```

4. **Configurer Supabase**

   - Créez un nouveau projet sur [Supabase](https://supabase.com)
   - Récupérez votre URL et vos clés API dans Project Settings > API
   - Exécutez le script SQL de migration (fourni séparément) pour créer les tables

5. **Configurer Cloudinary**

   - Créez un compte sur [Cloudinary](https://cloudinary.com)
   - Récupérez vos identifiants dans Dashboard > Account Details

6. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

   Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
├── app/
│   ├── (boutique)/          # Pages publiques
│   │   ├── page.tsx         # Accueil
│   │   ├── boutique/        # Liste produits
│   │   ├── produit/[slug]/  # Détail produit
│   │   ├── panier/          # Panier
│   │   ├── commande/        # Checkout
│   │   └── suivi/           # Suivi commande
│   ├── admin/               # Espace admin protégé
│   │   ├── products/        # Gestion produits
│   │   ├── categories/      # Gestion catégories
│   │   ├── orders/          # Gestion commandes
│   │   ├── reviews/         # Modération avis
│   │   ├── customers/       # Liste clientes
│   │   └── settings/        # Paramètres
│   └── api/
├── components/
│   ├── ui/                  # Composants shadcn/ui
│   ├── boutique/            # Composants publics
│   └── admin/               # Composants admin
├── lib/
│   ├── supabase/            # Clients Supabase
│   ├── cloudinary.ts        # Configuration Cloudinary
│   └── validation.ts        # Schémas Zod
└── middleware.ts            # Protection routes admin
```

## 🔑 Étapes Suivantes

1. **Vous allez me fournir les identifiants Supabase**
   - URL du projet
   - Clé anon (publique)
   - Clé service_role (privée)

2. **Vous allez me fournir les identifiants Cloudinary**
   - Cloud Name
   - API Key
   - API Secret

3. **Je créerai ensuite la structure de la base de données** via un script SQL

4. **Puis nous développerons l'application étape par étape** :
   - Phase 1 : Auth admin + Dashboard
   - Phase 2 : Gestion produits et catégories
   - Phase 3 : Gestion commandes
   - Phase 4 : Front boutique
   - Phase 5 : Checkout et paiement
   - Phase 6 : Finitions (avis, relances, SEO)

## 📝 Notes

- Le panier est stocké en localStorage (pas de compte client requis)
- Les paiements Wave sont vérifiés manuellement par l'admin
- Les images sont optimisées automatiquement par Cloudinary
- Le plan gratuit Supabase se met en pause après 7 jours d'inactivité (solution : cron keep-alive)

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables Supabase
- Middleware pour protéger les routes admin
- Clés sensibles côté serveur uniquement
- Upload Cloudinary sécurisé avec signatures

---

**Prêt pour la configuration !** Fournissez-moi vos identifiants Supabase et Cloudinary pour continuer.
