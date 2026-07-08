# Page de Détails de Commande - Admin

Documentation complète de la page `/admin/orders/[id]` pour la gestion détaillée des commandes.

## 🎯 Vue d'ensemble

Cette page permet à l'admin de:
- ✅ Voir tous les détails d'une commande
- ✅ Vérifier les paiements Wave avec capture d'écran
- ✅ Faire progresser le statut de la commande (pending → confirmed → shipped → delivered)
- ✅ Annuler une commande avec restauration automatique du stock
- ✅ Contacter le client (téléphone, WhatsApp)
- ✅ Ajouter des notes internes

## 📂 Structure des fichiers

```
app/admin/orders/[id]/
├── page.tsx              # Page principale (Server Component)
├── actions.ts            # Server Actions pour mutations

components/admin/orders/
└── orders-details.tsx    # Composant client UI

lib/adapters/
└── order-adapter.ts      # Adaptateur API → UI
```

## 🔄 Flux de données

```
[Base de données Supabase]
         ↓
[page.tsx] - Récupère les données côté serveur
         ↓
[order-adapter.ts] - Transforme snake_case → camelCase
         ↓
[orders-details.tsx] - Affiche l'UI et gère les interactions
         ↓
[actions.ts] - Server Actions pour mutations
         ↓
[Base de données Supabase]
```

## 🎨 Fonctionnalités de la page

### 1. Stepper de progression

Affiche visuellement l'état de la commande:

```
[1] Reçue → [2] Confirmée → [3] Expédiée → [4] Livrée
```

- Étapes complétées: fond doré avec checkmark ✓
- Étape actuelle: fond noir avec cercle doré
- Étapes futures: fond gris clair

### 2. Vérification paiement Wave (prioritaire)

Si `payment_status === 'pending_verification'`:

**Affiche:**
- 📸 Capture d'écran de la preuve de paiement (Cloudinary)
- 💰 Montant à vérifier en gros caractères
- 👤 Nom et téléphone du client

**Actions:**
- ✅ **Paiement reçu** → `paid` + `confirmed` + décrémente le stock
- ❌ **Paiement introuvable** → `unpaid`

### 3. Actions contextuelles selon le statut

#### Statut: `pending`
```typescript
[Confirmer la commande]
→ status: 'confirmed'
→ Note: "La confirmation réserve le stock"
```

#### Statut: `confirmed`
```typescript
[Marquer comme expédiée]
→ status: 'shipped'
```

#### Statut: `shipped`
```typescript
[Marquer comme livrée (et payée)]
→ status: 'delivered'
→ Si cash_on_delivery: payment_status: 'paid'
```

### 4. Liste des articles

Pour chaque article:
- 🖼️ Image du produit (si disponible)
- 📦 Nom du produit (cliquable si produit existe encore)
- 🔢 Quantité × Prix unitaire
- 💵 Total de la ligne

**Totaux:**
- Sous-total
- Frais de livraison
- **Total général** en gros caractères

### 5. Informations client

**Affiche:**
- 👤 Nom
- 📱 Téléphone (cliquable pour appel)
- ✉️ Email (si fourni)
- 📍 Adresse de livraison
- 💬 Note de livraison (si fournie)

**Actions:**
- 📞 Bouton "Appeler"
- 💚 Bouton "WhatsApp" (avec message pré-rempli)

### 6. Note interne (admin)

Textarea pour ajouter des notes:
- Sauvegarde automatique au blur
- Visible uniquement par l'admin
- Exemple: "Cliente a demandé livraison après 18h"

### 7. Annulation de commande

**Bouton rouge:** "Annuler la commande"

**Au clic:**
1. Affiche choix de motif:
   - Injoignable
   - Paiement non reçu
   - Rupture de stock
   - Demande de la cliente
   - Autre

2. **Avertissements automatiques:**
   - Si `confirmed` ou `shipped`: "Le stock sera automatiquement remis en vente"
   - Si `paid`: "Pensez à rembourser X FCFA via Wave"

3. **Confirmation:**
   - Change `status` → `cancelled`
   - Si payé: `payment_status` → `refunded`
   - **Restaure le stock** de tous les produits

## 🔧 Server Actions

### `updateOrderStatus(orderId, newStatus, extra)`

Met à jour le statut d'une commande.

**Logique spéciale:**
- Si annulation (`cancelled`) ET commande était `confirmed`/`shipped`:
  - ✅ **Restaure le stock** automatiquement
  - ✅ Si payé, marque comme `refunded`

**Exemple:**
```typescript
await updateOrderStatus(orderId, 'confirmed', {
  adminNote: 'Stock vérifié et réservé'
});
```

### `markPaymentVerified(orderId)`

Marque un paiement Wave comme vérifié.

**Actions:**
1. Vérifie le stock disponible
2. Si insuffisant → erreur
3. Décrémente le stock
4. Met `payment_status` → `paid`
5. Met `status` → `confirmed`

**Exemple:**
```typescript
const result = await markPaymentVerified(orderId);
if (!result.success) {
  alert(result.error); // "Stock insuffisant pour Collier Or"
}
```

### `markPaymentNotReceived(orderId)`

Marque un paiement comme non reçu.

**Actions:**
- Met `payment_status` → `unpaid`

### `saveAdminNote(orderId, note)`

Sauvegarde la note interne de l'admin.

**Actions:**
- Met à jour `admin_note`
- Appelé automatiquement au blur du textarea

## 📊 Données affichées

### Récupération depuis la BDD

```sql
SELECT
  orders.*,
  order_items.*
FROM orders
LEFT JOIN order_items ON order_items.order_id = orders.id
WHERE orders.id = $1
```

### Statistiques client (bonus)

```sql
SELECT
  COUNT(*) as total_orders,
  SUM(total) FILTER (WHERE status != 'cancelled') as total_spent
FROM orders
WHERE customer_phone = $1
```

Affiché discrètement pour contexte (historique client).

## 🎨 Design

### Palette de couleurs

- **Fond sombre (header):** `#241B14`
- **Or principal:** `var(--gold)`
- **Or foncé:** `var(--gold-dark)`
- **Ivoire:** `var(--ivory)`
- **Texte:** `var(--text-dark)`

### Composants clés

**Card:**
```tsx
<Card>
  <Eyebrow>Titre</Eyebrow>
  {/* Contenu */}
</Card>
```

**StatusStepper:**
```tsx
<StatusStepper status={order.status} />
```

### Responsive

- Mobile: layout en colonne unique
- Desktop: grille 2/3 (articles) + 1/3 (infos client)

## 🚀 Utilisation

### Accéder à la page

```
/admin/orders/[id]
```

Exemple: `/admin/orders/550e8400-e29b-41d4-a716-446655440000`

### Workflow typique - Commande Wave

1. 📱 **Client passe commande** avec preuve Wave
   - Statut: `pending` + `pending_verification`

2. 👁️ **Admin ouvre la page** `/admin/orders/[id]`
   - Voit la grosse alerte "Paiement Wave à vérifier"
   - Voit la capture d'écran

3. 📲 **Admin ouvre app Wave** et vérifie
   - Trouve le paiement → Clique "Paiement reçu"
   - Stock décrémenté automatiquement
   - Statut: `confirmed` + `paid`

4. 📦 **Admin prépare et expédie**
   - Clique "Marquer comme expédiée"
   - Statut: `shipped`

5. ✅ **Client reçoit la commande**
   - Admin clique "Marquer comme livrée"
   - Statut: `delivered`

### Workflow typique - Paiement à la livraison

1. 📱 **Client passe commande** sans preuve
   - Statut: `pending` + `unpaid`

2. 📞 **Admin appelle le client** (bouton direct)
   - Confirme l'adresse et la commande
   - Clique "Confirmer la commande"
   - Stock décrémenté
   - Statut: `confirmed`

3. 📦 **Admin expédie**
   - Clique "Marquer comme expédiée"

4. 💰 **Livreur encaisse**
   - Admin clique "Marquer comme livrée et payée"
   - Statut: `delivered` + `paid`

### Annulation

**Scénario 1: Client injoignable**
```
1. Clic "Annuler la commande"
2. Choix motif: "Injoignable"
3. Confirmation
→ Stock restauré automatiquement
```

**Scénario 2: Client annule après paiement**
```
1. Clic "Annuler la commande"
2. Choix motif: "Demande de la cliente"
3. Avertissement: "Pensez à rembourser 15 000 FCFA"
4. Confirmation
→ Stock restauré
→ Statut: cancelled + refunded
```

## 🐛 Gestion des erreurs

### Stock insuffisant

Si le stock a été vendu entre-temps:

```typescript
const result = await markPaymentVerified(orderId);
// result.success = false
// result.error = "Stock insuffisant pour Collier Or"
```

→ Affiche une alerte, commande reste `pending`

### Commande déjà livrée

Impossible d'annuler:

```typescript
canCancel = order.status !== "delivered" && order.status !== "cancelled"
// → Bouton d'annulation caché
```

## 📱 Messages WhatsApp pré-remplis

Format du message:
```
Bonjour [Nom Client] 🌸
Au sujet de votre commande [CMD-2026-0001] :
```

Admin peut ensuite ajouter son message.

## 🔐 Sécurité

⚠️ **Important:** Cette page est dans `/admin/` donc doit être protégée par un middleware d'authentification.

**À ajouter dans `middleware.ts`:**
```typescript
if (pathname.startsWith('/admin')) {
  // Vérifier auth admin
}
```

## 📚 Ressources liées

- [ORDERS-API.md](ORDERS-API.md) - Documentation API complète
- [PRODUCTS-API.md](PRODUCTS-API.md) - Documentation produits
- [supabase-schema.sql](supabase-schema.sql) - Schéma BDD

## 🎯 Améliorations futures

- [ ] Historique des changements de statut (audit log)
- [ ] Notification WhatsApp automatique à chaque changement
- [ ] Export PDF de la commande
- [ ] Timeline visuelle des événements
- [ ] Support multi-admin avec mention de qui a fait quoi
- [ ] Intégration directe API Wave pour vérification automatique
