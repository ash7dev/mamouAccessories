# Spécifications complètes — Site e-commerce de bijoux

**Version :** 1.0 — Juillet 2026
**Type de projet :** Boutique en ligne de bijoux (marché sénégalais)
**Complexité :** Faible à moyenne — un développeur, livrable en quelques semaines

---

## 1. Vue d'ensemble

Site e-commerce permettant à une créatrice/revendeuse de bijoux de vendre en ligne avec :

- Un **espace admin** privé pour gérer produits, catégories, commandes, avis et clientes
- Une **boutique publique** avec commande invité (sans création de compte)
- Deux modes de paiement : **lien Wave (par défaut)** et **paiement à la livraison**
- Vérification manuelle des paiements Wave par l'admin (pas d'API, pas de webhook)

### Catégories de produits au lancement

Boucles d'oreilles · Colliers · Montres · Bracelets · Bagues · Ensembles (ex : bracelet + bague vendus comme un seul article)

Les catégories sont dynamiques : l'admin peut en ajouter, renommer ou désactiver sans toucher au code.

---

## 2. Stack technique

| Couche | Choix | Détails |
|---|---|---|
| Framework | **Next.js 15+** (App Router, TypeScript) | Front + back dans un seul projet via Server Actions et Route Handlers |
| Styling | Tailwind CSS | + composants shadcn/ui pour l'admin (tables, formulaires, dialogs) |
| Base de données | **Supabase (plan Free)** | PostgreSQL + Auth + Row Level Security |
| Médias | **Cloudinary (plan Free)** | Images produits (et vidéos plus tard si besoin) |
| Hébergement | Vercel (plan Hobby) | Déploiement automatique depuis GitHub |
| État panier | localStorage + React Context | Pas de persistance serveur du panier |

### Limites des plans gratuits à connaître

- **Supabase Free** : 500 Mo de base, 1 Go de stockage fichiers (non utilisé ici, on passe par Cloudinary), 50 000 utilisateurs actifs/mois. **Le projet est mis en pause après ~7 jours sans requête** → prévoir un cron (Vercel Cron ou GitHub Actions) qui exécute une requête légère tous les 2 jours.
- **Cloudinary Free** : ~25 crédits/mois (≈ 25 Go de bande passante ou transformations). Largement suffisant pour démarrer si on sert les images en tailles optimisées (voir §7).
- **Vercel Hobby** : usage non commercial en théorie — à surveiller, mais toléré pour les petits projets. Alternative : Netlify ou Railway si besoin.

---

## 3. Schéma de base de données

### 3.1 Tables

#### `categories`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL, UNIQUE |
| slug | text | NOT NULL, UNIQUE |
| position | int | default 0 (ordre d'affichage) |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |

#### `products`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| category_id | uuid | FK → categories, NOT NULL |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE (généré depuis le nom) |
| description | text | |
| price | int | NOT NULL, CHECK (price >= 0) — **en FCFA, entier, jamais de décimales** |
| compare_at_price | int | nullable — ancien prix pour afficher une promo barrée |
| stock | int | NOT NULL, default 0, CHECK (stock >= 0) |
| image_orientation | text | CHECK IN ('portrait', 'landscape'), default 'portrait' |
| is_featured | boolean | default false — mis en avant sur l'accueil |
| is_active | boolean | default true — masquer sans supprimer |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

> **Pourquoi `image_orientation` ?** Le front adapte la grille : les produits portrait s'affichent en cartes verticales (ratio 3:4), les landscape en cartes larges (ratio 4:3). L'admin choisit l'orientation à la création et l'upload est recadré en conséquence (voir §7).

#### `product_images`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK → products ON DELETE CASCADE |
| cloudinary_public_id | text | NOT NULL — on stocke le public_id, pas l'URL complète |
| position | int | default 0 — la position 0 est l'image principale |

#### `orders`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| order_number | text | UNIQUE, généré (ex : `CMD-2026-0042`) — lisible pour le suivi WhatsApp |
| customer_name | text | NOT NULL |
| customer_phone | text | NOT NULL — format normalisé `+221XXXXXXXXX` |
| customer_email | text | nullable |
| delivery_address | text | NOT NULL (quartier/ville + précisions) |
| delivery_note | text | nullable (instructions de livraison) |
| payment_method | text | CHECK IN ('wave', 'cash_on_delivery'), **default 'wave'** |
| payment_status | text | CHECK IN ('unpaid', 'pending_verification', 'paid', 'refunded'), default 'unpaid' |
| payment_proof_url | text | nullable — capture d'écran Wave uploadée par la cliente (Cloudinary) |
| status | text | CHECK IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'), default 'pending' |
| cancel_reason | text | nullable |
| subtotal | int | NOT NULL |
| delivery_fee | int | default 0 |
| total | int | NOT NULL |
| admin_note | text | nullable — notes internes |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

#### `order_items`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK → orders ON DELETE CASCADE |
| product_id | uuid | FK → products ON DELETE SET NULL |
| product_name | text | NOT NULL — **copié au moment de la commande** |
| unit_price | int | NOT NULL — **figé au moment de la commande** |
| quantity | int | NOT NULL, CHECK (quantity > 0) |

> On copie nom et prix pour que l'historique reste exact même si le produit est modifié ou supprimé plus tard.

#### `reviews`
| Colonne | Type | Contraintes |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK → products ON DELETE CASCADE |
| author_name | text | NOT NULL |
| rating | int | CHECK (rating BETWEEN 1 AND 5) |
| content | text | NOT NULL |
| is_approved | boolean | default false — **modération obligatoire avant publication** |
| created_at | timestamptz | default now() |

#### `settings` (table clé-valeur, une seule ligne utile)
| Colonne | Type | Exemple |
|---|---|---|
| key | text PK | `wave_payment_link`, `delivery_fee_dakar`, `delivery_fee_regions`, `whatsapp_number`, `store_open` |
| value | text | `https://pay.wave.com/m/M_xxx/c/sn/`, `1500`, `3000`, `+221771234567`, `true` |

> Permet à l'admin de changer le lien Wave, les frais de livraison ou le numéro WhatsApp sans redéploiement.

### 3.2 Index

Rester minimal (peu de volume) :

- `products(category_id)`, `products(slug)`, `products(is_active, is_featured)`
- `orders(status)`, `orders(created_at DESC)`, `orders(customer_phone)`
- `order_items(order_id)`
- `reviews(product_id, is_approved)`

### 3.3 Row Level Security (RLS)

Activer RLS sur **toutes** les tables :

- `categories`, `products`, `product_images` : **SELECT public** (uniquement `is_active = true` pour le public), écriture réservée au rôle authentifié admin
- `orders`, `order_items` : **aucun accès public direct**. Les commandes sont créées via une Server Action Next.js utilisant la clé `service_role` côté serveur (jamais exposée au client). Lecture réservée à l'admin.
- `reviews` : INSERT public autorisé (avec `is_approved = false` forcé), SELECT public uniquement si `is_approved = true`
- `settings` : SELECT public sur les clés nécessaires au front (frais de livraison, WhatsApp), écriture admin

### 3.4 Vue "Clientes" (pour les relances)

Pas de table clients : une **vue SQL** agrège les commandes par téléphone :

```sql
CREATE VIEW customer_summary AS
SELECT
  customer_phone,
  max(customer_name)  AS name,
  count(*)            AS orders_count,
  sum(total) FILTER (WHERE status NOT IN ('cancelled')) AS total_spent,
  max(created_at)     AS last_order_at
FROM orders
GROUP BY customer_phone;
```

---

## 4. Paiement — logique détaillée

### 4.1 Mode par défaut : lien Wave

Il s'agit d'un **lien de paiement Wave statique** (type `pay.wave.com/m/...`), pas d'une intégration API. Conséquence structurante : **Wave ne notifie pas le site**. La confirmation est donc **manuelle**, avec un système de preuve de paiement.

**Flux complet :**

1. La cliente valide son panier → formulaire (nom, téléphone, adresse) → choisit Wave (pré-sélectionné)
2. La commande est créée : `status = pending`, `payment_status = unpaid`
3. Page de confirmation affichant :
   - Le récap et le **numéro de commande** (`CMD-2026-0042`)
   - Le **montant exact à payer**
   - Le **bouton/QR du lien Wave** (ouvre l'app Wave avec le montant à saisir)
   - Un champ d'**upload de capture d'écran** du paiement (→ Cloudinary, `payment_proof_url`)
   - Un bouton **"J'ai payé, envoyer ma preuve sur WhatsApp"** en alternative (message pré-rempli avec le n° de commande)
4. Si preuve uploadée → `payment_status = pending_verification`
5. L'admin vérifie dans son app Wave que le montant est bien reçu → clique **"Paiement vérifié"** → `payment_status = paid`, `status = confirmed`, **stock décrémenté à ce moment-là**
6. Si aucun paiement sous 24 h → la commande apparaît dans une liste "En attente de paiement" avec bouton de relance WhatsApp pré-rempli

**Points de vigilance :**

- Le lien Wave statique ne pré-remplit pas toujours le montant → afficher le montant en très gros et demander la capture comme preuve
- Rapprochement par **montant + heure + nom Wave** ; le numéro de commande dans la description du transfert quand c'est possible
- Le lien Wave est stocké dans `settings` → modifiable par l'admin

### 4.2 Paiement à la livraison

1. Commande créée : `status = pending`, `payment_status = unpaid`, `payment_method = cash_on_delivery`
2. L'admin **appelle ou écrit sur WhatsApp pour confirmer** (indispensable : filtre les fausses commandes) → `status = confirmed`, stock décrémenté
3. Livraison → encaissement → l'admin marque `delivered` + `payment_status = paid`

### 4.3 Règles de gestion du stock

| Événement | Effet sur le stock |
|---|---|
| Création de commande | **Aucun** (on ne bloque pas le stock sur des paniers non payés/non confirmés) |
| Passage à `confirmed` | Décrément (transaction atomique, échec si stock insuffisant) |
| Passage de `confirmed`/`shipped` à `cancelled` | Réincrément |
| Annulation d'une commande `pending` | Aucun (rien n'avait été décrémenté) |

> Conséquence assumée : entre la commande et la confirmation, deux clientes peuvent commander le même dernier article. La confirmation la plus rapide gagne ; l'autre est contactée (voir cas limites §8).

### 4.4 Machine à états des commandes

```
pending ──confirm──▶ confirmed ──ship──▶ shipped ──deliver──▶ delivered
   │                     │                  │
   └──cancel──▶ cancelled ◀──cancel─────────┘   (delivered = état final, pas d'annulation)
```

- Annuler exige un `cancel_reason` (liste : « Injoignable », « Paiement non reçu », « Rupture de stock », « Demande de la cliente », « Autre »)
- Toute transition met à jour `updated_at`

---

## 5. Espace admin (`/admin`)

Accès protégé par **Supabase Auth** (email + mot de passe, un seul compte au départ). Middleware Next.js qui redirige vers `/admin/login` si non authentifié.

### 5.1 Dashboard (`/admin`)
- Cartes : commandes du jour, du mois, revenus du mois (commandes non annulées), panier moyen
- Alertes : nombre de commandes `pending` à traiter, paiements `pending_verification` à vérifier, produits en stock faible (≤ 3) ou en rupture
- Liste des 10 dernières commandes

### 5.2 Produits (`/admin/products`)
- Tableau : image, nom, catégorie, prix, stock, statut — recherche + filtre par catégorie
- **Créer/modifier** : nom, catégorie, description, prix, prix barré (optionnel), stock, orientation d'image (portrait/paysage), mis en avant, actif
- **Upload d'images** : multi-upload vers Cloudinary avec recadrage selon l'orientation choisie ; réordonner par glisser-déposer ; la première image est la principale
- **Supprimer** : soft delete (`is_active = false`) si le produit a des commandes ; suppression réelle seulement s'il n'a jamais été commandé
- Action rapide "ajuster le stock" depuis le tableau

### 5.3 Catégories (`/admin/categories`)
- CRUD simple + réordonnancement. Suppression bloquée si des produits y sont rattachés (proposer la réaffectation).

### 5.4 Commandes (`/admin/orders`)
- Onglets par statut : À traiter (pending) / Paiements à vérifier / Confirmées / Expédiées / Livrées / Annulées
- Fiche commande : infos cliente, articles, totaux, preuve de paiement Wave (image affichée en grand), boutons de transition d'état, bouton **WhatsApp pré-rempli** (confirmation, relance paiement, suivi livraison)
- Badge visuel sur `pending` de plus de 24 h

### 5.5 Avis (`/admin/reviews`)
- File de modération : approuver / supprimer. Aperçu du produit concerné.

### 5.6 Clientes (`/admin/customers`)
- Vue `customer_summary` : nom, téléphone, nb commandes, total dépensé, dernière commande
- Tri par "dernière commande la plus ancienne" → cibler les relances
- Bouton WhatsApp pré-rempli par cliente (message de relance personnalisable)

### 5.7 Paramètres (`/admin/settings`)
- Lien de paiement Wave, frais de livraison (Dakar / régions), numéro WhatsApp boutique, mode "boutique fermée" (bandeau + désactivation du checkout, utile en voyage/rupture générale)

---

## 6. Côté client

### 6.1 Pages

| Route | Contenu |
|---|---|
| `/` | Hero, catégories en vignettes, produits mis en avant, section "À propos" courte, avis approuvés récents, footer (WhatsApp, Instagram, téléphone) |
| `/boutique` | Grille de produits, filtres par catégorie (URL : `/boutique?categorie=colliers`), tri (nouveautés, prix ↑/↓), badge "Promo" si prix barré, badge "Rupture" si stock = 0 |
| `/produit/[slug]` | Galerie d'images (adaptée à l'orientation), prix (+ prix barré), stock (« Plus que 2 en stock » si ≤ 3), description, sélecteur de quantité (max = stock), **Ajouter au panier** + **Commander via WhatsApp**, avis approuvés + formulaire d'avis, suggestions de la même catégorie |
| `/panier` | Lignes modifiables (quantité, suppression), sous-total, revalidation du stock à l'affichage |
| `/commande` | Checkout invité : nom, téléphone (validation format sénégalais), adresse, note ; choix Wave (défaut) / livraison ; frais de livraison selon zone ; récap total |
| `/commande/confirmation/[order_number]` | Selon le mode : instructions Wave + upload de preuve, ou message « Nous vous appelons pour confirmer » |
| `/suivi` | Suivi de commande par numéro de commande + téléphone (évite d'exposer les commandes publiquement) |
| `/a-propos` | Optionnelle — peut rester une section de l'accueil au lancement |

Pas de page contact : le footer (WhatsApp/Instagram/téléphone) remplit ce rôle.

### 6.2 Panier

- Stocké en `localStorage` : `[{product_id, quantity}]` — les prix sont toujours relus depuis la base au moment de l'affichage et du checkout (jamais stockés côté client)
- À l'ouverture du panier et au checkout : revalidation serveur → si un produit est devenu inactif ou en rupture, ligne signalée et retirée avec message clair
- Icône panier avec compteur dans le header, persistant entre les visites

### 6.3 Bouton "Commander via WhatsApp"

Sur chaque fiche produit : lien `wa.me/<numéro>?text=Bonjour, je suis intéressée par "<nom du produit>" (<lien>)`. Canal de vente parallèle assumé — ces ventes-là sont saisies à la main par l'admin si besoin, ou restent hors site.

### 6.4 SEO et partage

- `generateMetadata` par produit (title, description, image OG = image principale Cloudinary)
- Sitemap dynamique + robots.txt
- Données structurées `Product` (JSON-LD) : prix, disponibilité — utile pour Google Shopping plus tard
- Slugs propres partout

---

## 7. Gestion des images (Cloudinary)

- **Upload signé** depuis l'admin (signature générée côté serveur — ne jamais exposer l'API secret)
- Dossier par environnement : `bijoux/products/…`, `bijoux/payment-proofs/…`
- **Recadrage à l'upload selon l'orientation** : portrait → ratio 3:4 (ex. 900×1200), paysage → 4:3 (1200×900), via l'upload widget Cloudinary avec crop imposé
- **Affichage optimisé** : URLs transformées `f_auto,q_auto,w_<taille>` + `next/image` avec un loader Cloudinary → économise drastiquement les crédits du plan gratuit
- Suppression d'un produit → suppression des images Cloudinary associées (Server Action)
- Preuves de paiement : upload **non signé restreint** à un preset dédié, taille max 5 Mo, images uniquement

---

## 8. Cas limites et règles à implémenter (checklist)

### Stock et produits
- [ ] Deux commandes simultanées sur le dernier article : la confirmation décrémente dans une transaction ; si stock insuffisant à la confirmation → blocage avec message, l'admin contacte la cliente (annulation ou attente réappro)
- [ ] Produit désactivé/supprimé alors qu'il est dans un panier → retiré du panier avec message à la revalidation
- [ ] Prix modifié entre l'ajout au panier et le checkout → le prix du checkout fait foi (relu en base), afficher un message si différence
- [ ] Quantité demandée > stock au checkout → réduire à la quantité dispo avec message
- [ ] Stock à 0 → fiche visible mais bouton remplacé par « Rupture de stock » (+ éventuellement « Me prévenir » via WhatsApp)

### Commandes et paiement
- [ ] Commande Wave sans preuve uploadée sous 24 h → liste de relance admin (WhatsApp pré-rempli)
- [ ] Preuve uploadée mais montant introuvable côté Wave → l'admin peut repasser en `unpaid` avec note, relance cliente
- [ ] Cliente paie le mauvais montant → géré hors ligne (WhatsApp), `admin_note` pour tracer ; complément ou remboursement Wave manuel, `refunded` si remboursement total
- [ ] Annulation après paiement → `cancelled` + `refunded` + raison ; remboursement effectué manuellement via Wave
- [ ] Double soumission du formulaire de commande → bouton désactivé après clic + garde-fou serveur (même téléphone + même total < 2 min → avertissement)
- [ ] Numéro de téléphone : normaliser en `+221…`, valider 9 chiffres commençant par 7 ; accepter les saisies avec espaces
- [ ] Commande passée pendant « boutique fermée » → checkout désactivé, bandeau explicatif
- [ ] Cliente injoignable (COD) après 3 tentatives → annulation raison « Injoignable »

### Avis
- [ ] Anti-spam : limite d'un avis par produit par session + honeypot + rate limit sur la Server Action
- [ ] Avis jamais publié sans approbation (`is_approved = false` forcé côté serveur, pas seulement côté formulaire)

### Technique
- [ ] Cron toutes les 48 h qui ping Supabase (empêche la mise en pause du plan Free)
- [ ] Clé `service_role` uniquement dans les variables d'environnement serveur — jamais dans le bundle client
- [ ] RLS activée sur toutes les tables, testée avec la clé `anon`
- [ ] Erreur Cloudinary à l'upload → message clair + retry, jamais de produit sans image principale publié
- [ ] Pages d'erreur 404/500 personnalisées, page produit inexistant → redirection boutique

---

## 9. Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # serveur uniquement
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=                 # serveur uniquement
CLOUDINARY_API_SECRET=              # serveur uniquement
NEXT_PUBLIC_SITE_URL=
```

Le lien Wave, le numéro WhatsApp et les frais de livraison sont en base (`settings`), pas en variables d'environnement.

---

## 10. Structure du projet Next.js

```
src/
├── app/
│   ├── (boutique)/
│   │   ├── page.tsx                  # Accueil
│   │   ├── boutique/page.tsx
│   │   ├── produit/[slug]/page.tsx
│   │   ├── panier/page.tsx
│   │   ├── commande/page.tsx
│   │   ├── commande/confirmation/[orderNumber]/page.tsx
│   │   └── suivi/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # garde d'auth + sidebar
│   │   ├── login/page.tsx
│   │   ├── page.tsx                  # dashboard
│   │   ├── products/…                # liste, création, édition
│   │   ├── categories/page.tsx
│   │   ├── orders/…                  # liste + fiche
│   │   ├── reviews/page.tsx
│   │   ├── customers/page.tsx
│   │   └── settings/page.tsx
│   ├── api/cron/keep-alive/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── components/          # ui/ (shadcn), boutique/, admin/
├── lib/
│   ├── supabase/        # clients browser / server / service-role
│   ├── cloudinary.ts
│   ├── cart.ts          # logique panier (context + localStorage)
│   ├── orders.ts        # création commande, transitions d'état, stock
│   └── validation.ts    # zod : téléphone, checkout, produit
└── middleware.ts        # protection /admin
```

---

## 11. Feuille de route

| Phase | Contenu | Estimation |
|---|---|---|
| 1. Setup | Comptes Supabase + Cloudinary, projet Next.js, Git, variables d'env | 0,5 jour |
| 2. Base de données | Tables, contraintes, index, RLS, vue clientes, seed catégories | 1 jour |
| 3. Auth + coquille admin | Login Supabase, middleware, layout admin | 0,5 jour |
| 4. Admin produits + catégories | CRUD complet, upload Cloudinary avec orientation | 2–3 jours |
| 5. Admin commandes + dashboard | Machine à états, vérification paiement, WhatsApp pré-rempli, stats | 2 jours |
| 6. Front boutique | Accueil, boutique, fiche produit, panier | 3 jours |
| 7. Checkout + paiement | Formulaire invité, flux Wave + preuve, flux COD, page suivi | 2 jours |
| 8. Avis + clientes + settings | Modération, vue relances, paramètres | 1 jour |
| 9. Finitions | SEO, cron keep-alive, pages d'erreur, tests des cas limites (§8), déploiement | 1–2 jours |

**Ordre important :** l'admin d'abord (phases 3–5). Ton amie remplit son catalogue pendant que tu développes le front, et tu testes avec de vraies données.

### Ce qui est volontairement hors périmètre v1 (idées v2)
Codes promo · comptes clients avec historique · wishlist · emailing automatisé · multi-admin avec rôles · vidéos produits · intégration API PayTech/PayDunya si le volume justifie d'automatiser la vérification des paiements.
