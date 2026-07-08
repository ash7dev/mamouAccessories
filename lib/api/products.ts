import type { CreateProductInput, UpdateProductInput, ProductFilters, ProductWithImages } from '@/lib/types/product';

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

function getApiUrl(path: string) {
  return new URL(path, getApiBaseUrl()).toString();
}

/**
 * Helper pour uploader une image directement vers Cloudinary
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // Récupérer la config Cloudinary
  const configResponse = await fetch(getApiUrl('/api/cloudinary/config'));
  if (!configResponse.ok) {
    throw new Error('Erreur lors de la récupération de la configuration Cloudinary');
  }
  const config = await configResponse.json();

  // Créer le FormData pour l'upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('folder', config.folder);

  // Upload vers Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de l\'upload de l\'image');
  }

  const data = await response.json();
  return data.public_id;
}

/**
 * Upload multiple images vers Cloudinary
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file));
  return Promise.all(uploadPromises);
}

/**
 * Récupérer tous les produits avec filtres optionnels
 */
export async function getProducts(filters?: ProductFilters): Promise<ProductWithImages[]> {
  const params = new URLSearchParams();

  if (filters?.category_id) params.append('category_id', filters.category_id);
  if (filters?.is_featured !== undefined) params.append('is_featured', String(filters.is_featured));
  if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
  if (filters?.search) params.append('search', filters.search);
  if (filters?.min_price !== undefined) params.append('min_price', String(filters.min_price));
  if (filters?.max_price !== undefined) params.append('max_price', String(filters.max_price));

  const url = getApiUrl(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des produits');
  }

  const data = await response.json();
  return data.products;
}

/**
 * Récupérer un produit par son ID
 */
export async function getProductById(id: string): Promise<ProductWithImages> {
  const response = await fetch(getApiUrl(`/api/products/${id}`));

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du produit');
  }

  const data = await response.json();
  return data.product;
}

/**
 * Créer un nouveau produit
 */
export async function createProduct(input: CreateProductInput): Promise<ProductWithImages> {
  const response = await fetch(getApiUrl('/api/products'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la création du produit');
  }

  const data = await response.json();
  return data.product;
}

/**
 * Mettre à jour un produit
 */
export async function updateProduct(id: string, input: UpdateProductInput): Promise<ProductWithImages> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la mise à jour du produit');
  }

  const data = await response.json();
  return data.product;
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(getApiUrl(`/api/products/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la suppression du produit');
  }
}

/**
 * Helper complet pour créer un produit avec upload d'images
 */
export async function createProductWithImages(
  input: Omit<CreateProductInput, 'cloudinary_public_ids'>,
  images: File[]
): Promise<ProductWithImages> {
  // 1. Upload des images vers Cloudinary
  const publicIds = await uploadImagesToCloudinary(images);

  // 2. Créer le produit avec les IDs Cloudinary
  return createProduct({
    ...input,
    cloudinary_public_ids: publicIds,
  });
}

/**
 * Helper complet pour mettre à jour un produit avec upload d'images
 */
export async function updateProductWithImages(
  id: string,
  input: Omit<UpdateProductInput, 'cloudinary_public_ids'>,
  images?: File[]
): Promise<ProductWithImages> {
  // Si de nouvelles images sont fournies, les uploader
  let publicIds: string[] | undefined;
  if (images && images.length > 0) {
    publicIds = await uploadImagesToCloudinary(images);
  }

  // Mettre à jour le produit
  return updateProduct(id, {
    ...input,
    cloudinary_public_ids: publicIds,
  });
}
