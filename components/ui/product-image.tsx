"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

/**
 * Composant Image avec fallback automatique
 * Si l'image Cloudinary ne charge pas, affiche une image placeholder
 */
export function ProductImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  sizes,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // Si pas de src ou erreur, utiliser le placeholder
  const finalSrc = !imgSrc || error ? "/placeholder-product.jpg" : imgSrc;

  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setError(true);
  };

  const handleLoad = () => {
    setError(false);
  };

  // Si src change, réinitialiser l'état d'erreur
  if (src !== imgSrc && !error) {
    setImgSrc(src);
    setError(false);
  }

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
        unoptimized // Cloudinary gère déjà l'optimisation
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      sizes={sizes}
      unoptimized // Cloudinary gère déjà l'optimisation
    />
  );
}
