# API CRUD des Produits

Documentation complète de l'API CRUD pour la gestion des produits avec upload direct vers Cloudinary.

## 🎯 Caractéristiques

- ✅ **Upload direct vers Cloudinary** - Pas besoin de token, upload unsigned rapide
- ✅ **CRUD complet** - Create, Read, Update, Delete
- ✅ **Filtres avancés** - Recherche, catégorie, prix, featured, etc.
- ✅ **Gestion automatique des images** - Suppression en cascade
- ✅ **Types TypeScript** - Typage complet pour une meilleure DX
- ✅ **Helpers côté client** - Fonctions prêtes à l'emploi

## 📋 Configuration requise

### 1. Configurer Cloudinary (IMPORTANT)

Avant d'utiliser l'API, vous devez créer un **Upload Preset** unsigned dans Cloudinary:

1. Aller sur [Cloudinary Console](https://console.cloudinary.com/)
2. Settings → Upload → Upload presets
3. Cliquer sur "Add upload preset"
4. Configuration:
   - **Preset name**: `mamoujewelry_unsigned`
   - **Signing Mode**: `Unsigned` ⚠️ Important!
   - **Folder**: `products`
   - **Use filename or externally defined Public ID**: Cocher
5. Sauvegarder

### 2. Variables d'environnement

Assurez-vous que `.env.local` contient:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

## 🚀 Endpoints API

### 1. GET /api/products

Récupérer tous les produits avec filtres optionnels.

**Query Parameters:**
- `category_id` (string) - Filtrer par catégorie
- `is_featured` (boolean) - Produits en vedette uniquement
- `is_active` (boolean) - Produits actifs uniquement
- `search` (string) - Recherche dans le nom et la description
- `min_price` (number) - Prix minimum
- `max_price` (number) - Prix maximum

**Exemple:**
```bash
GET /api/products?category_id=xxx&is_featured=true&search=collier
```

**Réponse:**
```json
{
  "products": [
    {
      "id": "xxx",
      "name": "Collier en or",
      "slug": "collier-en-or",
      "price": 15000,
      "images": [
        {
          "id": "yyy",
          "cloudinary_public_id": "products/abc123",
          "position": 0
        }
      ],
      ...
    }
  ]
}
```

### 2. GET /api/products/[id]

Récupérer un produit spécifique par son ID.

**Exemple:**
```bash
GET /api/products/xxx-xxx-xxx
```

**Réponse:**
```json
{
  "product": {
    "id": "xxx",
    "name": "Collier en or",
    "category": {
      "id": "yyy",
      "name": "Colliers"
    },
    "images": [...],
    ...
  }
}
```

### 3. POST /api/products

Créer un nouveau produit.

**Body (JSON):**
```json
{
  "name": "Nouveau collier",
  "slug": "nouveau-collier",
  "category_id": "xxx",
  "description": "Description du produit",
  "price": 15000,
  "compare_at_price": 20000,
  "stock": 10,
  "image_orientation": "portrait",
  "is_featured": false,
  "is_active": true,
  "cloudinary_public_ids": ["products/img1", "products/img2"]
}
```

**Champs requis:**
- `name` (string)
- `slug` (string) - Doit être unique
- `category_id` (string)
- `price` (number) - En CFA (centimes)

**Réponse:**
```json
{
  "product": {
    "id": "xxx",
    "name": "Nouveau collier",
    ...
  }
}
```

### 4. PUT /api/products/[id]

Mettre à jour un produit existant.

**Body (JSON):** (tous les champs sont optionnels)
```json
{
  "name": "Collier mis à jour",
  "price": 18000,
  "stock": 5,
  "cloudinary_public_ids": ["products/new1", "products/new2"]
}
```

**Note:** Si `cloudinary_public_ids` est fourni, les anciennes images seront supprimées de Cloudinary.

**Réponse:**
```json
{
  "product": {
    "id": "xxx",
    "name": "Collier mis à jour",
    ...
  }
}
```

### 5. DELETE /api/products/[id]

Supprimer un produit et ses images.

**Exemple:**
```bash
DELETE /api/products/xxx-xxx-xxx
```

**Réponse:**
```json
{
  "message": "Produit supprimé avec succès"
}
```

### 6. GET /api/cloudinary/config

Récupérer la configuration Cloudinary pour l'upload direct.

**Réponse:**
```json
{
  "cloudName": "votre_cloud_name",
  "uploadPreset": "mamoujewelry_unsigned",
  "folder": "products"
}
```

## 🛠️ Utilisation côté client

### Import des helpers

```typescript
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageToCloudinary,
  uploadImagesToCloudinary,
  createProductWithImages,
  updateProductWithImages,
} from '@/lib/api/products';
```

### Exemples d'utilisation

#### 1. Récupérer tous les produits

```typescript
const products = await getProducts({
  category_id: 'xxx',
  is_active: true,
  search: 'collier',
});
```

#### 2. Récupérer un produit

```typescript
const product = await getProductById('xxx-xxx-xxx');
```

#### 3. Créer un produit avec images

```typescript
// Avec les helpers
const product = await createProductWithImages(
  {
    name: 'Nouveau collier',
    slug: 'nouveau-collier',
    category_id: 'xxx',
    price: 15000,
    stock: 10,
  },
  [file1, file2, file3] // Array de File objects
);

// Ou manuellement
const publicIds = await uploadImagesToCloudinary([file1, file2]);
const product = await createProduct({
  name: 'Nouveau collier',
  slug: 'nouveau-collier',
  category_id: 'xxx',
  price: 15000,
  stock: 10,
  cloudinary_public_ids: publicIds,
});
```

#### 4. Mettre à jour un produit

```typescript
// Mettre à jour sans changer les images
const product = await updateProduct('xxx', {
  name: 'Collier mis à jour',
  price: 18000,
});

// Mettre à jour avec de nouvelles images
const product = await updateProductWithImages(
  'xxx',
  {
    name: 'Collier mis à jour',
    price: 18000,
  },
  [newFile1, newFile2] // Les anciennes images seront supprimées
);
```

#### 5. Supprimer un produit

```typescript
await deleteProduct('xxx-xxx-xxx');
```

## 📝 Types TypeScript

Tous les types sont disponibles dans `lib/types/product.ts`:

- `Product` - Structure d'un produit
- `ProductImage` - Structure d'une image
- `ProductWithImages` - Produit avec ses images
- `CreateProductInput` - Input pour créer un produit
- `UpdateProductInput` - Input pour mettre à jour un produit
- `ProductFilters` - Filtres pour la recherche

## 🔒 Sécurité

- Les routes API sont **publiques** (pas de RLS pour les produits actifs)
- Pour sécuriser les routes admin, ajoutez un middleware d'authentification
- L'upload Cloudinary est **unsigned** mais limité au preset configuré
- Les images sont automatiquement supprimées de Cloudinary lors de la suppression

## ⚡ Performance

- Upload **direct vers Cloudinary** - Pas de transit par le serveur
- Suppression des images en **arrière-plan** - Pas de ralentissement
- Images optimisées automatiquement par Cloudinary
- Support de la recherche full-text et des index

## 🎨 Exemple complet - Formulaire de création

```tsx
'use client';

import { useState } from 'react';
import { createProductWithImages } from '@/lib/api/products';

export default function CreateProductForm() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const product = await createProductWithImages(
        {
          name: formData.get('name') as string,
          slug: formData.get('slug') as string,
          category_id: formData.get('category_id') as string,
          description: formData.get('description') as string,
          price: parseInt(formData.get('price') as string),
          stock: parseInt(formData.get('stock') as string),
        },
        images
      );

      alert('Produit créé avec succès!');
      console.log(product);
    } catch (error) {
      alert('Erreur: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" required />
      <input name="slug" placeholder="Slug" required />
      <input name="category_id" placeholder="ID Catégorie" required />
      <textarea name="description" placeholder="Description" />
      <input name="price" type="number" placeholder="Prix (CFA)" required />
      <input name="stock" type="number" placeholder="Stock" required />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer le produit'}
      </button>
    </form>
  );
}
```

## 🐛 Débogage

Si l'upload ne fonctionne pas:

1. Vérifiez que l'upload preset `mamoujewelry_unsigned` existe dans Cloudinary
2. Vérifiez qu'il est en mode **Unsigned**
3. Vérifiez les variables d'environnement
4. Vérifiez la console du navigateur pour les erreurs CORS
5. Testez l'upload directement: `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`

## 📚 Ressources

- [Cloudinary Upload Documentation](https://cloudinary.com/documentation/upload_images)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
