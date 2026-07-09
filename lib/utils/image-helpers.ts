/**
 * Helpers pour gérer les images de manière robuste
 * - Validation des URLs Cloudinary
 * - Fallback automatique
 * - Cache-busting si nécessaire
 */

const CLOUDINARY_BASE = 'res.cloudinary.com';
const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

/**
 * Valide si une URL Cloudinary est correctement formée
 */
export function isValidCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes(CLOUDINARY_BASE);
  } catch {
    return false;
  }
}

/**
 * Obtient l'URL d'image avec fallback automatique
 */
export function getImageUrl(cloudinaryUrl: string | null | undefined): string {
  if (!cloudinaryUrl || !isValidCloudinaryUrl(cloudinaryUrl)) {
    return PLACEHOLDER_IMAGE;
  }
  return cloudinaryUrl;
}

/**
 * Obtient l'URL d'image avec cache-busting si nécessaire
 * Ajoute un timestamp pour forcer le reload de l'image
 */
export function getImageUrlWithCacheBusting(
  cloudinaryUrl: string | null | undefined,
  forceRefresh: boolean = false
): string {
  const baseUrl = getImageUrl(cloudinaryUrl);

  if (baseUrl === PLACEHOLDER_IMAGE) return baseUrl;

  if (forceRefresh) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${Date.now()}`;
  }

  return baseUrl;
}

/**
 * Construit une URL Cloudinary optimisée
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
  if (!publicId) return PLACEHOLDER_IMAGE;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';

  // Construire les transformations
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  // Ajouter transformations par défaut pour optimisation
  if (!options.quality) transformations.push('q_auto');
  if (!options.format) transformations.push('f_auto');

  const transformString = transformations.join(',');
  const cleanId = publicId.trim().replace(/^\/+/, '');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanId}`;
}
