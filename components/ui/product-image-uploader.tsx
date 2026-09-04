"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { ProductImage } from "./product-image";

export interface ImageItem {
  id: string;
  url: string;
  cloudinaryPublicId: string;
  file?: File;
  isNew?: boolean;
}

interface ProductImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
  orientation?: "portrait" | "landscape";
  disabled?: boolean;
}

function PhotoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ProductImageUploader({
  images,
  onChange,
  maxImages = 5,
  orientation = "portrait",
  disabled = false,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    if (disabled) return;
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} photos autorisées par produit`);
      return;
    }

    const validFiles: ImageItem[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (!file.type.startsWith("image/")) {
        toast.error(`Le fichier ${file.name} n'est pas une image valide`);
        continue;
      }

      // Max 10 MB per file
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`L'image ${file.name} dépasse la taille maximale autorisée (10 Mo)`);
        continue;
      }

      const tempUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: tempUrl,
        cloudinaryPublicId: "",
        file,
        isNew: true,
      });
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ""; // reset input
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    if (disabled) return;
    onChange(images.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: "prev" | "next") => {
    if (disabled) return;
    const newImages = [...images];
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  const aspectClass = orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <div className="space-y-4">
      {/* Zone de Drop / Sélection vacante */}
      {images.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-[var(--gold)] bg-[var(--ivory)] scale-[1.01]"
              : "border-[var(--gold)]/25 bg-[var(--ivory)]/40 hover:border-[var(--gold)]/60 hover:bg-[var(--ivory)]/70"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--gold-dark)] shadow-sm ring-1 ring-inset ring-[var(--gold)]/20">
              <PhotoIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[var(--text-dark)]">
                Glissez vos photos ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-[var(--text-dark)]/50">
                Jusqu&apos;à {maxImages} photos · Format{" "}
                {orientation === "portrait" ? "vertical (3:4)" : "horizontal (4:3)"} · JPG, PNG, WEBP
              </p>
            </div>
            <button
              type="button"
              className="mt-2 rounded-full bg-[var(--text-dark)] px-6 py-2.5 text-xs font-semibold text-white shadow transition-transform hover:scale-105 active:scale-95"
            >
              Sélectionner des fichiers
            </button>
          </div>
        </div>
      )}

      {/* Grille d'aperçus si des images sont présentes */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-2xl border border-[var(--gold)]/20 bg-neutral-100 ${aspectClass}`}
              >
                <ProductImage
                  src={image.url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="h-full w-full object-cover"
                />

                {/* Badge Principale */}
                {index === 0 && (
                  <div className="absolute left-2 top-2 z-10 rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#241B14] shadow">
                    Principale
                  </div>
                )}

                {/* Badge Nouvelle */}
                {image.isNew && (
                  <div className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-dark)] shadow">
                    Nouveau
                  </div>
                )}

                {/* Overlay d'actions au survol */}
                {!disabled && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-1.5 bg-[#241B14]/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, "prev")}
                        className="rounded-full bg-white p-2 text-neutral-800 shadow transition-transform hover:scale-110 active:scale-95"
                        title="Déplacer vers la gauche"
                      >
                        <ArrowLeftIcon />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="rounded-full bg-red-500 p-2 text-white shadow transition-transform hover:scale-110 active:scale-95"
                      title="Supprimer la photo"
                    >
                      <TrashIcon />
                    </button>

                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, "next")}
                        className="rounded-full bg-white p-2 text-neutral-800 shadow transition-transform hover:scale-110 active:scale-95"
                        title="Déplacer vers la droite"
                      >
                        <ArrowRightIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bouton d'ajout d'autres photos si max non atteint */}
          {images.length < maxImages && !disabled && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed px-5 py-2.5 text-xs font-semibold transition-all ${
                isDragging
                  ? "border-[var(--gold)] bg-[var(--ivory)] text-[var(--gold-dark)]"
                  : "border-[var(--gold)]/40 bg-[var(--ivory)]/40 text-[var(--text-dark)] hover:border-[var(--gold)] hover:bg-[var(--ivory)]"
              }`}
            >
              <PhotoIcon className="h-4 w-4" />
              <span>Ajouter d&apos;autres photos ({images.length}/{maxImages})</span>
            </div>
          )}
        </div>
      )}

      {/* Input de fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || images.length >= maxImages}
      />
    </div>
  );
}
