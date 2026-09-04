import { v2 as cloudinary } from 'cloudinary';
import { resolveProductImageUrl, PLACEHOLDER_IMAGE } from './utils/image-helpers';

// Configuration Cloudinary (côté serveur uniquement)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Générer une signature pour l'upload sécurisé
export function generateUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return { signature, timestamp };
}

// Configuration pour l'upload public (unsigned)
export function getUnsignedUploadConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'mamoujewelry_unsigned',
    folder: 'products',
  };
}

// Helper pour construire des URLs optimisées et sécurisées
export function buildImageUrl(
  publicId: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    bustCache?: boolean;
  } = {}
): string | null {
  if (!publicId) return null;
  const resolved = resolveProductImageUrl(publicId, {
    width: options.width,
    height: options.height,
    quality: options.quality ? (typeof options.quality === 'number' ? options.quality : 'auto') : 'auto',
    format: options.format ? (options.format as any) : 'auto',
    bustCache: options.bustCache,
  });

  return resolved === PLACEHOLDER_IMAGE ? null : resolved;
}

// Supprimer une image de Cloudinary
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Supprimer plusieurs images
export async function deleteImages(publicIds: string[]) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
}
