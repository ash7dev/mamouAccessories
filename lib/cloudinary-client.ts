/**
 * Utilitaires Cloudinary côté client (sans dépendances Node.js)
 */

export interface BuildImageUrlOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  bustCache?: boolean;
}

export function buildImageUrl(publicId: string, options: BuildImageUrlOptions = {}): string | null {
  if (!publicId) {
    console.error('No publicId provided to buildImageUrl');
    return null;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set');
    return null;
  }

  const {
    width = 800,
    height = 800,
    quality = 'auto',
    format = 'auto',
    bustCache = false,
  } = options;

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_limit`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  // Build base URL
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;

  // Add cache-busting timestamp if requested
  if (bustCache) {
    const timestamp = Date.now();
    return `${baseUrl}?_t=${timestamp}`;
  }

  return baseUrl;
}
