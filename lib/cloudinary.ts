import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary (côté serveur uniquement)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Générer une signature pour l'upload sécurisé
export function generateUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return { signature, timestamp }
}

// Configuration pour l'upload public (unsigned) - rapide et sans token
export function getUnsignedUploadConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: 'mamoujewelry_unsigned', // À créer dans Cloudinary Dashboard
    folder: 'products',
  }
}

// Helper pour construire des URLs optimisées
export function buildImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  } = {}
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden'

  if (!publicId) {
    console.error('buildImageUrl: No publicId provided')
    return null
  }

  // Nettoyer le public_id s'il contient déjà le chemin complet
  // Certains IDs sont stockés comme "products/xxx" d'autres comme "xxx"
  let cleanId = publicId;
  if (publicId.startsWith('products/')) {
    cleanId = publicId; // Garder le chemin complet
  }

  // URL simple sans transformations car les transformations causent des 404
  // Les transformations Cloudinary nécessitent peut-être une configuration spéciale
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${cleanId}`

  console.log('buildImageUrl (simple):', url, 'from publicId:', publicId)
  return url
}

// Supprimer une image de Cloudinary
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

// Supprimer plusieurs images
export async function deleteImages(publicIds: string[]) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds)
    return result
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error)
    throw error
  }
}
