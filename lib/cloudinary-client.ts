import { resolveProductImageUrl, ImageTransformOptions } from './utils/image-helpers';

export interface BuildImageUrlOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  bustCache?: boolean;
}

export function buildImageUrl(publicId: string | null | undefined, options: BuildImageUrlOptions = {}): string | null {
  if (!publicId) return null;

  const transformOptions: ImageTransformOptions = {
    width: options.width,
    height: options.height,
    quality: options.quality === 'auto' ? 'auto' : options.quality ? Number(options.quality) : 'auto',
    format: options.format as any,
    bustCache: options.bustCache,
  };

  return resolveProductImageUrl(publicId, transformOptions);
}
