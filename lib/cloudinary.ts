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
    bustCache?: boolean
  } = {}
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden'

  if (!publicId?.trim()) {
    console.warn('buildImageUrl: No publicId provided')
    return null
  }

  const normalizedId = publicId.trim().replace(/^\/+/, '')
  const cleanId = normalizedId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  // Construire l'URL avec transformations
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  // Ajouter les transformations si spécifiées
  const transformations: string[] = []
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)
  
  if (transformations.length > 0) {
    url += '/' + transformations.join(',')
  }
  
  url += `/${cleanId}`
  
  // Ajouter cache-busting si demandé
  if (options.bustCache) {
    url += `?_t=${Date.now()}`
  }

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
