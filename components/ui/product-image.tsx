"use client";

import { useState, useEffect, useRef } from "react";
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
 * Composant Image réutilisable avec fallback automatique, résolution d'URL & chargement instantané sans blocage
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
  const imgRef = useRef<HTMLImageElement | null>(null);

  const resolvedSrc = resolveProductImageUrl(src, {
    width: width || (fill ? 800 : width),
    height: height || (fill ? 800 : height),
  });

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronisation si la prop src change + détection du cache DOM
  useEffect(() => {
    const updated = resolveProductImageUrl(src, {
      width: width || (fill ? 800 : width),
      height: height || (fill ? 800 : height),
    });
    setCurrentSrc(updated);
    setHasError(false);

    // Vérifier si l'image est déjà en cache dans le DOM
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [src, width, height, fill]);

  // Sécurité : Si l'événement onLoad stagne ou est contourné par le navigateur
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoading(false);
    }
  }, [currentSrc]);

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
  const isCloudinaryOrRemote = finalSrc.includes('res.cloudinary.com') || finalSrc.includes('supabase.co');
  
  // Désactiver l'optimisation serveur proxy Next.js si l'URL est déjà une URL Cloudinary/Supabase optimisée ou SVG
  const shouldUseDirectCdn = unoptimized || isSvgOrData || isCloudinaryOrRemote;

  if (fill) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${isLoading ? 'bg-[var(--porcelaine,#F1ECE3)] animate-pulse' : ''}`}>
        <Image
          ref={imgRef}
          src={finalSrc}
          alt={alt || "Image produit"}
          fill
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
          unoptimized={shouldUseDirectCdn}
          quality={quality}
        />
      </div>
    );
  }

  return (
    <div className={`inline-block overflow-hidden ${isLoading ? 'bg-[var(--porcelaine,#F1ECE3)] animate-pulse' : ''}`}>
      <Image
        ref={imgRef}
        src={finalSrc}
        alt={alt || "Image produit"}
        width={width || 500}
        height={height || 500}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
        unoptimized={shouldUseDirectCdn}
        quality={quality}
      />
    </div>
  );
}

