/**
 * Helpers pour gérer les images de manière robuste
 * - Résolution d'URL universelle (Cloudinary, Supabase, Data URL, URLs relatives, public IDs bruts)
 * - Fallback automatique vers placeholder
 * - Cache-busting & optimisation
 */

export const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  bustCache?: boolean;
}

/**
 * Valide si une chaîne est une URL Cloudinary valide
 */
export function isValidCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('res.cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * Résolveur d'URL universel pour les images de produits.
 * Gère de façon totalement sécurisée et sans bug :
 * 1. Les URLs Cloudinary complètes
 * 2. Les URLs HTTP/HTTPS externes (Supabase Storage, Unsplash, etc.)
 * 3. Les Data URLs (data:image/...)
 * 4. Les chemins relatifs (/placeholder-product.svg, etc.)
 * 5. Les Public IDs Cloudinary bruts (ex: "products/my_image")
 * 6. Les valeurs nulles, indéfinies ou vides -> fallback placeholder
 */
export function resolveProductImageUrl(
  input: string | null | undefined,
  options: ImageTransformOptions = {}
): string {
  if (!input || typeof input !== 'string') {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return PLACEHOLDER_IMAGE;
  }

  // 1. Data URLs
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // 2. Chemins relatifs
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // 3. URLs HTTP/HTTPS complètes (Cloudinary, Supabase Storage, CDN externe)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (options.bustCache) {
      const separator = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${separator}t=${Date.now()}`;
    }
    return trimmed;
  }

  // 4. Public ID Cloudinary brut
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  // Transformations par défaut pour optimisation
  if (!options.quality) transformations.push('q_auto');
  if (!options.format) transformations.push('f_auto');

  const transformString = transformations.join(',');
  const cleanPublicId = trimmed.replace(/^\/+/, '');

  let url = `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanPublicId}`;
  if (options.bustCache) {
    url += `?t=${Date.now()}`;
  }

  return url;
}

/**
 * Obtient l'URL d'image avec fallback automatique (Rétrocompatibilité)
 */
export function getImageUrl(urlInput: string | null | undefined): string {
  return resolveProductImageUrl(urlInput);
}

/**
 * Obtient l'URL d'image avec cache-busting si nécessaire (Rétrocompatibilité)
 */
export function getImageUrlWithCacheBusting(
  urlInput: string | null | undefined,
  forceRefresh: boolean = false
): string {
  return resolveProductImageUrl(urlInput, { bustCache: forceRefresh });
}

/**
 * Construit une URL Cloudinary optimisée (Rétrocompatibilité)
 */
export function buildOptimizedCloudinaryUrl(
  publicId: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  return resolveProductImageUrl(publicId, options);
}
