# API CRUD des Commandes

Documentation complète de l'API pour la gestion des commandes avec création, suivi, annulation et gestion des paiements.

## 🎯 Caractéristiques

- ✅ **Création de commandes** - Avec validation du stock et calcul automatique
- ✅ **Gestion des statuts** - Suivi complet du cycle de vie d'une commande
- ✅ **Gestion des paiements** - Wave et paiement à la livraison
- ✅ **Annulation intelligente** - Restauration automatique du stock
- ✅ **Filtres avancés** - Recherche par client, date, statut, etc.
- ✅ **Statistiques client** - Historique et total dépensé
- ✅ **Types TypeScript** - Typage complet pour une meilleure DX

## 📊 Cycle de vie d'une commande

### Statuts de commande
- `pending` - En attente de confirmation
- `confirmed` - Confirmée par l'admin
- `shipped` - Expédiée
- `delivered` - Livrée
- `cancelled` - Annulée

### Statuts de paiement
- `unpaid` - Non payé
- `pending_verification` - En attente de vérification (Wave)
- `paid` - Payé et vérifié
- `refunded` - Remboursé

### Méthodes de paiement
- `wave` - Paiement mobile Wave
- `cash_on_delivery` - Paiement à la livraison

## 🚀 Endpoints API

### 1. POST /api/orders

Créer une nouvelle commande.

**Body (JSON):**
```json
{
  "customer_name": "Fatou Diallo",
  "customer_phone": "+221771234567",
  "customer_email": "fatou@example.com",
  "delivery_address": "Dakar, Plateau, Rue 15",
  "delivery_note": "Appeler avant de livrer",
  "delivery_fee": 1500,
  "payment_method": "wave",
  "payment_proof_url": "products/payment_abc123",
  "items": [
    {
      "product_id": "xxx-xxx-xxx",
      "quantity": 2
    },
    {
      "product_id": "yyy-yyy-yyy",
      "quantity": 1
    }
  ]
}
```

**Champs requis:**
- `customer_name` (string)
- `customer_phone` (string)
- `delivery_address` (string)
- `delivery_fee` (number) - En CFA
- `payment_method` ('wave' | 'cash_on_delivery')
- `items` (array) - Au moins 1 article

**Fonctionnement:**
1. Vérifie le stock de chaque produit
2. Calcule automatiquement le sous-total et le total
3. Génère un numéro de commande unique (CMD-2026-0001)
4. Décrémente le stock des produits
5. Si Wave avec preuve, met le statut à `pending_verification`

**Réponse:**
```json
{
  "order": {
    "id": "xxx",
    "order_number": "CMD-2026-0001",
    "status": "pending",
    "payment_status": "pending_verification",
    "subtotal": 30000,
    "delivery_fee": 1500,
    "total": 31500,
    "items": [...],
    ...
  }
}
```

### 2. GET /api/orders

Récupérer toutes les commandes avec filtres.

**Query Parameters:**
- `status` (string) - Filtrer par statut
- `payment_status` (string) - Filtrer par statut de paiement
- `payment_method` (string) - Filtrer par méthode de paiement
- `customer_phone` (string) - Filtrer par téléphone client
- `order_number` (string) - Rechercher par numéro
- `date_from` (string) - Date de début (YYYY-MM-DD)
- `date_to` (string) - Date de fin (YYYY-MM-DD)

**Exemples:**
```bash
GET /api/orders?status=pending
GET /api/orders?payment_status=pending_verification
GET /api/orders?customer_phone=+221771234567
GET /api/orders?date_from=2026-01-01&date_to=2026-01-31
```

**Réponse:**
```json
{
  "orders": [
    {
      "id": "xxx",
      "order_number": "CMD-2026-0001",
      "customer_name": "Fatou Diallo",
      "status": "pending",
      "total": 31500,
      "items": [...],
      ...
    }
  ]
}
```

### 3. GET /api/orders/[id]

Récupérer les détails d'une commande avec statistiques client.

**Exemple:**
```bash
GET /api/orders/xxx-xxx-xxx
```

**Réponse:**
```json
{
  "order": {
    "id": "xxx",
    "order_number": "CMD-2026-0001",
    "customer_name": "Fatou Diallo",
    "customer_orders_count": 5,
    "customer_total_spent": 125000,
    "items": [
      {
        "product_id": "yyy",
        "product_name": "Collier en or",
        "unit_price": 15000,
        "quantity": 2
      }
    ],
    ...
  }
}
```

### 4. PATCH /api/orders/[id]/status

Mettre à jour le statut d'une commande.

**Body (JSON):**
```json
{
  "status": "confirmed",
  "admin_note": "Commande validée et prête pour expédition"
}
```

**Restrictions:**
- Impossible de modifier une commande annulée
- Statuts valides: pending, confirmed, shipped, delivered

**Réponse:**
```json
{
  "order": {...},
  "message": "Statut mis à jour avec succès"
}
```

### 5. PATCH /api/orders/[id]/payment

Mettre à jour le statut de paiement.

**Body (JSON):**
```json
{
  "payment_status": "paid",
  "admin_note": "Paiement Wave vérifié"
}
```

**Fonctionnement:**
- Si paiement confirmé (`paid`) et commande en `pending`, passe automatiquement à `confirmed`

**Réponse:**
```json
{
  "order": {...},
  "message": "Statut de paiement mis à jour avec succès"
}
```

### 6. POST /api/orders/[id]/cancel

Annuler une commande et restaurer le stock.

**Body (JSON):**
```json
{
  "cancel_reason": "Client a changé d'avis",
  "refund": true
}
```

**Fonctionnement:**
1. Vérifie que la commande n'est pas déjà annulée ou livrée
2. Passe le statut à `cancelled`
3. Si `refund: true` et payé, passe à `refunded`
4. **Restaure automatiquement le stock** de tous les produits

**Réponse:**
```json
{
  "order": {...},
  "message": "Commande annulée avec succès",
  "stock_restored": true
}
```

## 🛠️ Utilisation côté client

### Import des helpers

```typescript
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
  // Helpers spécifiques
  confirmOrder,
  shipOrder,
  deliverOrder,
  approvePayment,
  rejectPayment,
  getPendingOrders,
  getOrdersAwaitingPaymentVerification,
  calculateOrderTotal,
} from '@/lib/api/orders';
```

### Exemples d'utilisation

#### 1. Créer une commande

```typescript
const order = await createOrder({
  customer_name: 'Fatou Diallo',
  customer_phone: '+221771234567',
  customer_email: 'fatou@example.com',
  delivery_address: 'Dakar, Plateau',
  delivery_fee: 1500,
  payment_method: 'wave',
  items: [
    { product_id: 'xxx', quantity: 2 },
    { product_id: 'yyy', quantity: 1 },
  ],
});

console.log('Numéro de commande:', order.order_number);
```

#### 2. Créer une commande avec preuve de paiement

```typescript
import { createOrderWithPaymentProof } from '@/lib/api/orders';

const order = await createOrderWithPaymentProof(
  {
    customer_name: 'Fatou Diallo',
    customer_phone: '+221771234567',
    delivery_address: 'Dakar, Plateau',
    delivery_fee: 1500,
    payment_method: 'wave',
    items: [{ product_id: 'xxx', quantity: 2 }],
  },
  paymentProofFile // File object
);
```

#### 3. Récupérer les commandes en attente

```typescript
const pendingOrders = await getPendingOrders();
const awaitingVerification = await getOrdersAwaitingPaymentVerification();
```

#### 4. Gérer une commande (Admin)

```typescript
// Confirmer une commande
await confirmOrder('xxx', 'Commande validée');

// Approuver un paiement Wave
await approvePayment('xxx', 'Paiement Wave vérifié');

// Marquer comme expédiée
await shipOrder('xxx', 'Expédiée via DHL');

// Marquer comme livrée
await deliverOrder('xxx', 'Livrée avec succès');
```

#### 5. Annuler une commande

```typescript
// Sans remboursement
await cancelOrder('xxx', {
  cancel_reason: 'Stock insuffisant',
});

// Avec remboursement
await cancelOrder('xxx', {
  cancel_reason: 'Client a annulé',
  refund: true,
});
```

#### 6. Récupérer les commandes d'un client

```typescript
import { getCustomerOrders } from '@/lib/api/orders';

const customerOrders = await getCustomerOrders('+221771234567');
console.log('Total commandes:', customerOrders.length);
```

#### 7. Calculer le total avant création

```typescript
const { subtotal, total, items } = await calculateOrderTotal(
  [
    { product_id: 'xxx', quantity: 2 },
    { product_id: 'yyy', quantity: 1 },
  ],
  1500 // Frais de livraison
);

console.log('Sous-total:', subtotal, 'CFA');
console.log('Total:', total, 'CFA');
```

## 📝 Types TypeScript

Tous les types sont disponibles dans `lib/types/order.ts`:

- `Order` - Structure d'une commande
- `OrderItem` - Article de commande
- `OrderWithItems` - Commande avec articles
- `OrderWithDetails` - Commande avec stats client
- `CreateOrderInput` - Input pour créer une commande
- `UpdateOrderStatusInput` - Input pour changer le statut
- `UpdatePaymentStatusInput` - Input pour changer le paiement
- `CancelOrderInput` - Input pour annuler
- `OrderFilters` - Filtres de recherche
- `PaymentMethod`, `PaymentStatus`, `OrderStatus` - Types énumérés

## 🔒 Logique métier

### Gestion du stock

**Création de commande:**
- Le stock est décrémenté immédiatement
- Si stock insuffisant, la commande est rejetée

**Annulation de commande:**
- Le stock est **automatiquement restauré**
- Fonctionne même si le produit a été modifié entre temps

### Gestion des paiements

**Wave:**
1. Client upload sa preuve de paiement
2. Statut: `pending_verification`
3. Admin vérifie et approuve → `paid`
4. Commande passe automatiquement à `confirmed`

**Paiement à la livraison:**
1. Statut initial: `unpaid`
2. À la livraison, admin marque comme `paid`

### Workflow typique

```
[Création]
   ↓
pending + unpaid/pending_verification
   ↓
[Admin approuve paiement]
   ↓
confirmed + paid
   ↓
[Admin expédie]
   ↓
shipped + paid
   ↓
[Admin confirme livraison]
   ↓
delivered + paid
```

## 🎨 Exemple complet - Formulaire de commande

```tsx
'use client';

import { useState } from 'react';
import { createOrder } from '@/lib/api/orders';

export default function OrderForm() {
  const [cart, setCart] = useState([
    { product_id: 'xxx', quantity: 2 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const order = await createOrder({
        customer_name: formData.get('name') as string,
        customer_phone: formData.get('phone') as string,
        customer_email: formData.get('email') as string,
        delivery_address: formData.get('address') as string,
        delivery_note: formData.get('note') as string,
        delivery_fee: 1500,
        payment_method: formData.get('payment_method') as 'wave' | 'cash_on_delivery',
        items: cart,
      });

      alert(`Commande créée! Numéro: ${order.order_number}`);
    } catch (error) {
      alert('Erreur: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Informations client</h2>
      <input name="name" placeholder="Nom complet" required />
      <input name="phone" placeholder="Téléphone" required />
      <input name="email" placeholder="Email" type="email" />

      <h2>Livraison</h2>
      <textarea name="address" placeholder="Adresse" required />
      <input name="note" placeholder="Note de livraison" />

      <h2>Paiement</h2>
      <select name="payment_method" required>
        <option value="wave">Wave</option>
        <option value="cash_on_delivery">Paiement à la livraison</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Passer la commande'}
      </button>
    </form>
  );
}
```

## 🎨 Exemple - Dashboard Admin

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getPendingOrders, confirmOrder } from '@/lib/api/orders';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getPendingOrders();
    setOrders(data);
  };

  const handleConfirm = async (orderId: string) => {
    await confirmOrder(orderId, 'Commande validée');
    loadOrders(); // Recharger
  };

  return (
    <div>
      <h1>Commandes en attente ({orders.length})</h1>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.order_number}</h3>
          <p>Client: {order.customer_name}</p>
          <p>Total: {order.total} CFA</p>
          <button onClick={() => handleConfirm(order.id)}>
            Confirmer
          </button>
        </div>
      ))}
    </div>
  );
}
```

## ⚠️ Points importants

### Sécurité
- Les routes API sont **publiques** pour permettre aux clients de passer commande
- Pour l'admin, ajoutez un middleware d'authentification sur les routes de modification
- Exemple: seul un admin peut confirmer/expédier/annuler

### Performance
- La vérification du stock se fait en temps réel
- Le stock est décrémenté immédiatement (pas de réservation)
- Les statistiques client sont calculées à la volée

### Gestion des erreurs
- Stock insuffisant → Erreur 400
- Commande non trouvée → Erreur 404
- Impossible d'annuler une commande livrée → Erreur 400
- Le numéro de commande est généré via une fonction PostgreSQL (pas de collision)

## 📚 Ressources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Functions](https://supabase.com/docs/guides/database/functions)

## 🎯 TODO / Améliorations futures

- [ ] Notifications WhatsApp lors de changement de statut
- [ ] Webhook Wave pour vérification automatique des paiements
- [ ] Export PDF des factures
- [ ] Envoi d'email de confirmation
- [ ] Tableau de bord avec graphiques
- [ ] Historique des modifications (audit log)
