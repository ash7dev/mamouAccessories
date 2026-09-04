"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { ProductImage } from "./product-image";
import {
  UploadCloud,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Info,
} from "lucide-react";

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

export function ProductImageUploader({
  images,
  onChange,
  maxImages = 5,
  orientation = "portrait",
  disabled = false,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
        toast.error(`Le fichier "${file.name}" n'est pas un format d'image supporté`);
        continue;
      }

      // Max 10 MB per file
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`L'image "${file.name}" dépasse la limite de 10 Mo`);
        continue;
      }

      const tempUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: tempUrl,
        cloudinaryPublicId: "",
        file,
        isNew: true,
      });
    }

    if (validFiles.length > 0) {
      const updated = [...images, ...validFiles];
      onChange(updated);
      toast.success(
        validFiles.length === 1
          ? "Photo ajoutée à la galerie"
          : `${validFiles.length} photos ajoutées à la galerie`
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ""; // Reset input
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

  const removeImage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled) return;
    onChange(images.filter((img) => img.id !== id));
    toast.info("Photo retirée");
  };

  const setAsCover = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled || index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
    toast.success("Définie comme photo principale");
  };

  const moveImage = (index: number, direction: "prev" | "next", e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled) return;
    const newImages = [...images];
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  const aspectClass = orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";
  const isMaxReached = images.length >= maxImages;

  return (
    <div className="space-y-5 font-sans">
      {/* Bar de progression du nombre de photos */}
      <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-2.5 border border-[var(--laiton,#B9793E)]/15">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
          <span className="text-xs font-medium text-[var(--obsidienne,#0E0B09)]">
            Galerie visuelle
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[var(--laiton-clair,#D9AE78)] transition-all duration-300"
              style={{ width: `${(images.length / maxImages) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold font-mono text-[var(--obsidienne,#0E0B09)]">
            {images.length} / {maxImages}
          </span>
        </div>
      </div>

      {/* Zone Dropzone si aucune photo ou s'il reste de la place */}
      {images.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/10 scale-[1.01] shadow-lg"
              : "border-[var(--laiton,#B9793E)]/25 bg-gradient-to-b from-white to-neutral-50/50 hover:border-[var(--laiton,#B9793E)]/60 hover:shadow-md"
          }`}
        >
          {/* Halos de lumière décoratifs */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--laiton,#B9793E)]/10 blur-2xl transition-all group-hover:scale-125" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--laiton,#B9793E)]/5 blur-2xl transition-all group-hover:scale-125" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--porcelaine,#F1ECE3)] to-white text-[var(--laiton,#B9793E)] shadow-md ring-1 ring-[var(--laiton,#B9793E)]/20 transition-transform duration-300 group-hover:scale-110">
              <UploadCloud className="h-8 w-8 stroke-[1.5]" />
              <div className="absolute -right-1 -top-1 rounded-full bg-[var(--obsidienne,#0E0B09)] p-1 text-[var(--porcelaine,#F1ECE3)] shadow">
                <Sparkles className="h-3.5 w-3.5 text-[var(--laiton-clair,#D9AE78)]" />
              </div>
            </div>

            <div>
              <p className="font-serif text-lg font-normal text-[var(--obsidienne,#0E0B09)]">
                Glissez vos photographies ici ou{" "}
                <span className="font-sans text-sm font-semibold text-[var(--laiton,#B9793E)] underline underline-offset-4">
                  parcourez votre appareil
                </span>
              </p>
              <p className="mt-1.5 text-xs text-[var(--obsidienne,#0E0B09)]/60">
                Jusqu&apos;à {maxImages} clichés HD · Format {orientation === "portrait" ? "vertical (3:4)" : "horizontal (4:3)"} · JPG, PNG, WEBP (Max 10 Mo)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-[var(--obsidienne,#0E0B09)]/65">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-neutral-200/60 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Fond neutre recommandé
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-neutral-200/60 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Résolution min. 1080px
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Grille des photos déjà ajoutées */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {images.map((image, index) => {
              const isCover = index === 0;

              return (
                <div
                  key={image.id}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${aspectClass} ${
                    isCover
                      ? "border-[var(--laiton,#B9793E)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/30"
                      : "border-neutral-200 hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-sm"
                  } bg-neutral-900`}
                >
                  <ProductImage
                    src={image.url}
                    alt={`Photo produit ${index + 1}`}
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge Photo de Couverture */}
                  {isCover ? (
                    <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-[var(--obsidienne,#0E0B09)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] backdrop-blur-md border border-[var(--laiton,#B9793E)]/40 shadow-md">
                      <Star className="h-3 w-3 fill-[var(--laiton-clair,#D9AE78)] text-[var(--laiton-clair,#D9AE78)]" />
                      Principale
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => setAsCover(index, e)}
                      className="absolute left-2.5 top-2.5 z-10 hidden items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md transition-all hover:bg-[var(--laiton,#B9793E)] group-hover:flex"
                      title="Définir comme photo principale"
                    >
                      <Star className="h-3 w-3" />
                      Couverture
                    </button>
                  )}

                  {/* Badge Nouveau Cliché */}
                  {image.isNew && (
                    <div className="absolute right-2.5 top-2.5 z-10 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-xs">
                      Nouveau
                    </div>
                  )}

                  {/* Index Indicator */}
                  <div className="absolute left-2.5 bottom-2.5 z-10 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-mono text-white/90 backdrop-blur-xs">
                    #{index + 1}
                  </div>

                  {/* Overlay d'action au survol */}
                  {!disabled && (
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 bg-gradient-to-t from-[var(--obsidienne,#0E0B09)]/80 via-[var(--obsidienne,#0E0B09)]/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[2px]">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(image.url)}
                          className="rounded-full bg-white/90 p-2 text-neutral-800 shadow transition-transform hover:scale-110 active:scale-95 hover:bg-white"
                          title="Agrandir / Aperçu HD"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => removeImage(image.id, e)}
                          className="rounded-full bg-rose-600/90 p-2 text-white shadow transition-transform hover:scale-110 active:scale-95 hover:bg-rose-600"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Contrôles d'ordre (Gauche / Droite) */}
                      <div className="flex items-center justify-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={(e) => moveImage(index, "prev", e)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow hover:bg-white transition-transform hover:scale-110 active:scale-95"
                            title="Déplacer vers la gauche"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => moveImage(index, "next", e)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow hover:bg-white transition-transform hover:scale-110 active:scale-95"
                            title="Déplacer vers la droite"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bouton d'ajout dans la grille s'il reste de la place */}
            {!isMaxReached && !disabled && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all duration-300 ${aspectClass} ${
                  isDragging
                    ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/10"
                    : "border-[var(--laiton,#B9793E)]/25 bg-neutral-50/80 hover:border-[var(--laiton,#B9793E)]/60 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] transition-transform group-hover:scale-110">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-[var(--obsidienne,#0E0B09)]/75">
                  Ajouter photo
                </span>
                <span className="text-[9px] font-mono text-[var(--obsidienne,#0E0B09)]/40">
                  ({images.length + 1}/{maxImages})
                </span>
              </div>
            )}
          </div>

          {/* Banner conseils de photo si moins de 3 photos */}
          {images.length > 0 && images.length < 3 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 text-xs text-amber-800">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                Conseil : Ajoutez au moins 3 visuels (vue d&apos;ensemble, porté, détail martelé) pour maximiser les ventes.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Input fichier masqué */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isMaxReached}
      />

      {/* Modal Lightbox de prévisualisation HD */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/40 shadow-2xl">
            <ProductImage
              src={previewImage}
              alt="Aperçu grand format"
              width={1200}
              height={1600}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
