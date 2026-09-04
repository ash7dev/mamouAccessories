/**
 * Helper client universel d'upload d'images
 * Stratégie double :
 * 1. Upload direct client unsigned Cloudinary (rapide)
 * 2. Fallback automatique vers l'API serveur /api/upload si l'upload direct échoue
 */

export interface UploadResult {
  publicId: string;
  url: string;
  provider: 'cloudinary' | 'supabase' | 'fallback';
}

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Upload une image unique
 */
export async function uploadProductImage(file: File, folder: string = 'products'): Promise<UploadResult> {
  // 1. Essai d'upload direct Unsigned Cloudinary
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'mamoujewelry_unsigned';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.public_id) {
        return {
          publicId: data.public_id,
          url: data.secure_url || data.url,
          provider: 'cloudinary',
        };
      }
    } else {
      console.warn('L\'upload direct Cloudinary a échoué. Tentative via l\'API serveur fallback...');
    }
  } catch (err) {
    console.warn('Erreur lors de l\'upload direct Cloudinary:', err);
  }

  // 2. Fallback API Serveur /api/upload
  const serverFormData = new FormData();
  serverFormData.append('file', file);
  serverFormData.append('folder', folder);

  const response = await fetch(`${getApiBaseUrl()}/api/upload`, {
    method: 'POST',
    body: serverFormData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Erreur d'upload de l'image (${response.status})`);
  }

  const data = await response.json();
  return {
    publicId: data.public_id || data.url,
    url: data.url || data.public_id,
    provider: data.provider || 'fallback',
  };
}

/**
 * Upload plusieurs images en parallèle
 */
export async function uploadProductImages(files: File[], folder: string = 'products'): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadProductImage(file, folder));
  return Promise.all(uploadPromises);
}
