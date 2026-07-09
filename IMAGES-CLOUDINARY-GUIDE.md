# Guide: Gestion Robuste des Images Cloudinary

## Problème Identifié
Les images Cloudinary peuvent disparaître après quelques heures pour plusieurs raisons:
1. **Cache côté serveur/CDN** - Les images peuvent être en cache et expirer
2. **URLs Cloudinary modifiées** - Si le public_id change
3. **Quota Cloudinary dépassé** - Le compte gratuit a des limites
4. **Images supprimées accidentellement** - Via l'interface Cloudinary

## Solutions Implémentées

### 1. Composant `ProductImage` avec Fallback Automatique ✅
**Fichier:** `components/ui/product-image.tsx`

Ce composant gère automatiquement les erreurs de chargement:
- Détecte quand une image ne charge pas
- Bascule automatiquement vers le placeholder
- Réessaie si la `src` change
- Désactive l'optimisation Next.js (Cloudinary optimise déjà)

**Utilisation:**
```tsx
import { ProductImage } from "@/components/ui/product-image";

<ProductImage
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  className="rounded-lg"
/>
```

### 2. Helpers d'Images Robustes ✅
**Fichier:** `lib/utils/image-helpers.ts`

Fonctions utilitaires:
- `getImageUrl()` - Retourne l'URL ou le placeholder
- `isValidCloudinaryUrl()` - Valide les URLs Cloudinary
- `getImageUrlWithCacheBusting()` - Force le reload avec timestamp
- `buildOptimizedCloudinaryUrl()` - URLs optimisées avec transformations

**Utilisation:**
```ts
import { getImageUrl, buildOptimizedCloudinaryUrl } from "@/lib/utils/image-helpers";

// URL simple avec fallback
const imageUrl = getImageUrl(product.cloudinary_public_id);

// URL optimisée
const optimizedUrl = buildOptimizedCloudinaryUrl(product.cloudinary_public_id, {
  width: 800,
  height: 800,
  quality: 'auto',
  format: 'auto'
});
```

### 3. Image Placeholder SVG ✅
**Fichier:** `public/placeholder-product.svg`

Image par défaut élégante qui s'affiche quand:
- L'image Cloudinary ne charge pas
- Le `public_id` est null/undefined
- L'URL est invalide

### 4. Revalidation du Cache Next.js ✅
**Déjà en place** - `export const revalidate = 60`

Les pages sont re-générées toutes les 60 secondes pour avoir les données les plus récentes.

## Recommandations pour Éviter les Problèmes

### Configuration Cloudinary
1. **Vérifier le quota:**
   - Connectez-vous à votre dashboard Cloudinary
   - Vérifiez "Usage" dans les settings
   - Si proche de la limite, passer au plan payant

2. **Activer "Backup":**
   - Dans Settings > Upload > Backup
   - Activer la sauvegarde automatique

3. **Configuration Upload Preset:**
   - Créer un preset nommé `mamoujewelry_unsigned`
   - Folder: `products`
   - Mode: `unsigned`
   - Allowed formats: `jpg,png,webp`

### Bonnes Pratiques

1. **Ne jamais supprimer manuellement** les images depuis Cloudinary
   - Toujours utiliser l'interface admin du site
   - Cela garantit la cohérence avec la base de données

2. **Vérifier les images après upload:**
   ```ts
   // Dans le code d'upload
   const response = await uploadToCloudinary(file);

   // Vérifier que l'image est accessible
   const testUrl = buildImageUrl(response.public_id);
   const isValid = await fetch(testUrl).then(r => r.ok);

   if (!isValid) {
     throw new Error('Image upload failed validation');
   }
   ```

3. **Monitorer les erreurs d'images:**
   - Ajouter logging quand ProductImage.onError est appelé
   - Créer une alerte si trop d'erreurs

## Debug: Si une Image ne S'Affiche Pas

### 1. Vérifier l'URL dans la Console
```tsx
<ProductImage
  src={imageUrl}
  alt="Product"
  onError={() => console.error('Failed to load:', imageUrl)}
/>
```

### 2. Tester l'URL Directement
Copier l'URL depuis la console et l'ouvrir dans un nouvel onglet:
- ✅ Image s'affiche → Problème Next.js/React
- ❌ 404 / Erreur → Problème Cloudinary

### 3. Vérifier le public_id en Base de Données
```sql
SELECT id, name, cloudinary_public_id
FROM product_images
WHERE product_id = 'xxx';
```

### 4. Vérifier sur Cloudinary Dashboard
- Aller sur cloudinary.com/console
- Media Library > Rechercher le public_id
- Si absent → Image supprimée, il faut la re-uploader

## Migration: Utiliser les Nouveaux Composants

### Remplacer les `<img>` par `<ProductImage>`

**Avant:**
```tsx
<img
  src={product.imageUrl}
  alt={product.name}
  className="w-full h-full object-cover"
/>
```

**Après:**
```tsx
<ProductImage
  src={product.imageUrl}
  alt={product.name}
  fill
  className="object-cover"
/>
```

### Remplacer `buildImageUrl()` par les helpers

**Avant:**
```ts
import { buildImageUrl } from '@/lib/cloudinary';
const url = buildImageUrl(publicId);
```

**Après:**
```ts
import { getImageUrl } from '@/lib/utils/image-helpers';
const url = getImageUrl(publicId);
```

## Résultat

Avec ces améliorations:
- ✅ **Aucune image cassée** - Fallback automatique vers placeholder
- ✅ **Chargement optimisé** - Format WebP automatique pour navigateurs compatibles
- ✅ **Meilleure UX** - L'utilisateur voit toujours quelque chose
- ✅ **Debugging facile** - Logs et validations pour identifier les problèmes
- ✅ **Cache géré** - Revalidation toutes les 60s

## Support

Si le problème persiste:
1. Vérifier les logs Vercel pour les erreurs Cloudinary
2. Vérifier le quota Cloudinary (dashboard)
3. Vérifier que les `public_id` en BDD correspondent aux images sur Cloudinary
4. Contacter le support Cloudinary si problème de leur côté
