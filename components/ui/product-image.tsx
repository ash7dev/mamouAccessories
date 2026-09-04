"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { resolveProductImageUrl, PLACEHOLDER_IMAGE } from "@/lib/utils/image-helpers";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
  quality?: number;
}

/**
 * Composant Image réutilisable avec fallback automatique & résolution d'URL robuste
 */
export function ProductImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  unoptimized = false,
  quality = 85,
}: ProductImageProps) {
  const resolvedSrc = resolveProductImageUrl(src, {
    width: width || (fill ? 800 : width),
    height: height || (fill ? 800 : height),
  });

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronisation si la prop src change
  useEffect(() => {
    const updated = resolveProductImageUrl(src, {
      width: width || (fill ? 800 : width),
      height: height || (fill ? 800 : height),
    });
    setCurrentSrc(updated);
    setHasError(false);
    setIsLoading(true);
  }, [src, width, height, fill]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(PLACEHOLDER_IMAGE);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const finalSrc = hasError || !currentSrc ? PLACEHOLDER_IMAGE : currentSrc;
  const isSvgOrData = finalSrc.endsWith('.svg') || finalSrc.startsWith('data:');

  if (fill) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${isLoading ? 'animate-pulse bg-gradient-to-tr from-[var(--porcelaine,#F1ECE3)] via-neutral-100 to-[var(--porcelaine,#F1ECE3)]' : ''}`}>
        <Image
          src={finalSrc}
          alt={alt || "Image produit"}
          fill
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
          unoptimized={unoptimized || isSvgOrData}
          quality={quality}
        />
      </div>
    );
  }

  return (
    <div className={`inline-block overflow-hidden ${isLoading ? 'animate-pulse bg-gradient-to-tr from-[var(--porcelaine,#F1ECE3)] via-neutral-100 to-[var(--porcelaine,#F1ECE3)]' : ''}`}>
      <Image
        src={finalSrc}
        alt={alt || "Image produit"}
        width={width || 500}
        height={height || 500}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized || isSvgOrData}
        quality={quality}
      />
    </div>
  );
}
