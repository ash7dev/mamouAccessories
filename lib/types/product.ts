export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  image_orientation: 'portrait' | 'landscape';
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  cloudinary_public_id: string;
  position: number;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface CreateProductInput {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  image_orientation?: 'portrait' | 'landscape';
  is_featured?: boolean;
  is_active?: boolean;
  cloudinary_public_ids: string[]; // IDs des images déjà uploadées sur Cloudinary
}

export interface UpdateProductInput {
  category_id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compare_at_price?: number;
  stock?: number;
  image_orientation?: 'portrait' | 'landscape';
  is_featured?: boolean;
  is_active?: boolean;
  cloudinary_public_ids?: string[]; // Si fourni, remplace toutes les images
}

export interface ProductFilters {
  category_id?: string;
  is_featured?: boolean;
  is_active?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
}
