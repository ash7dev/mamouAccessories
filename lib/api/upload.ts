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
 * Upload direct depuis le navigateur vers Cloudinary (Évite le serveur Vercel/Next.js)
 * Supporte la progression en temps réel (%) pour les vidéos et images lourdes
 */
export async function uploadMediaFile(
  file: File,
  folder: string = 'products',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'auto';

  // 1. Upload direct client Unsigned Cloudinary avec suivi de progression (XHR)
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'mamoujewelry_unsigned';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    return await new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.public_id) {
              resolve({
                publicId: data.public_id,
                url: data.secure_url || data.url,
                provider: 'cloudinary',
              });
              return;
            }
          } catch (e) {
            reject(e);
          }
        }
        reject(new Error(`Upload direct Cloudinary statut : ${xhr.status}`));
      };

      xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload direct Cloudinary"));
      xhr.send(formData);
    });
  } catch (err) {
    console.warn("L'upload direct Cloudinary a échoué. Tentative via le serveur fallback...", err);
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
    throw new Error(errData.error || `Erreur d'upload du fichier (${response.status})`);
  }

  const data = await response.json();
  return {
    publicId: data.public_id || data.url,
    url: data.url || data.public_id,
    provider: data.provider || 'fallback',
  };
}

/**
 * Upload une image unique (Alias rétrocompatible)
 */
export async function uploadProductImage(
  file: File,
  folder: string = 'products',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return uploadMediaFile(file, folder, onProgress);
}

/**
 * Upload plusieurs images en parallèle
 */
export async function uploadProductImages(files: File[], folder: string = 'products'): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadProductImage(file, folder));
  return Promise.all(uploadPromises);
}

