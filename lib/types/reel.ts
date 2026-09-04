export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number;
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  productComparePrice?: number | null;
  productImageUrl?: string | null;
  productStock: number;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface CreateReelInput {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  productId: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateReelInput {
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  productId?: string;
  isActive?: boolean;
  orderIndex?: number;
}
