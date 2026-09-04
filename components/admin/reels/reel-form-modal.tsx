"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Video, Sparkles, Check, AlertCircle } from "lucide-react";
import type { Reel, CreateReelInput } from "@/lib/types/reel";

interface ReelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReelInput) => Promise<void>;
  initialData?: Reel | null;
  products: Array<{ id: string; name: string; price: number }>;
}

export function ReelFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  products,
}: ReelFormModalProps) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState<number>(15);
  const [productId, setProductId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setVideoUrl(initialData.videoUrl || "");
      setThumbnailUrl(initialData.thumbnailUrl || "");
      setDurationSeconds(initialData.durationSeconds || 15);
      setProductId(initialData.productId || "");
      setIsActive(initialData.isActive ?? true);
    } else {
      setTitle("");
      setVideoUrl("");
      setThumbnailUrl("");
      setDurationSeconds(15);
      setProductId(products[0]?.id || "");
      setIsActive(true);
    }
    setErrorMessage("");
  }, [initialData, products, isOpen]);

  // Video File Upload & Duration Check
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check video duration via video element before uploading
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    videoElement.onloadedmetadata = async () => {
      URL.revokeObjectURL(videoElement.src);
      const duration = Math.round(videoElement.duration);

      if (duration > 45) {
        setErrorMessage(`Cette vidéo dure ${duration}s. La durée maximale autorisée pour un Reel est de 45 secondes.`);
        return;
      }

      setDurationSeconds(duration);
      setErrorMessage("");
      setIsUploading(true);

      try {
        // Upload to Cloudinary
        const configRes = await fetch("/api/cloudinary/config");
        const config = await configRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", config.uploadPreset);
        formData.append("folder", "reels");
        formData.append("resource_type", "video");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          throw new Error("Erreur d'upload vidéo sur Cloudinary.");
        }

        const data = await uploadRes.json();
        setVideoUrl(data.secure_url);
      } catch (err: any) {
        setErrorMessage(err.message || "Impossible d'uploader la vidéo.");
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setErrorMessage("Veuillez importer ou renseigner l'URL de la vidéo.");
      return;
    }
    if (!productId) {
      setErrorMessage("Veuillez sélectionner le bijou associé à cette vidéo.");
      return;
    }
    if (durationSeconds > 45) {
      setErrorMessage("La durée de la vidéo doit être de 45 secondes maximum.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSubmit({
        title: title || "Reel Bijou",
        videoUrl,
        thumbnailUrl,
        durationSeconds,
        productId,
        isActive,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        {/* Overlay Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Form Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-neutral-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] block mb-0.5">
                ✦ CONTENU VIDÉO
              </span>
              <h2 className="font-serif text-xl font-bold text-[var(--obsidienne,#0E0B09)]">
                {initialData ? "Modifier le Reel" : "Ajouter une vidéo Reel"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Titre du Reel */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Titre de la vidéo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Éclat du Collier Or au Soleil"
                className="w-full rounded-2xl border border-neutral-200 bg-white text-neutral-900 px-4 py-3 text-xs font-medium focus:border-[var(--laiton,#B9793E)] focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Upload Fichier Vidéo (Max 45s) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Fichier Vidéo (Max 45s - Format Vertical MP4)
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-5 text-center transition-all hover:border-[var(--laiton)] hover:bg-white">
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-[var(--laiton)]">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--laiton)] border-t-transparent" />
                    <span>Upload de la vidéo en cours...</span>
                  </div>
                ) : (
                  <>
                    <Video className="mx-auto h-8 w-8 text-[var(--laiton)] mb-2" />
                    <p className="text-xs font-bold text-[var(--obsidienne)]">
                      {videoUrl ? "Vidéo sélectionnée (Changer le fichier)" : "Glisser ou importer une vidéo (MP4, WebM)"}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">Durée maximale autorisée : 45 secondes</p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Saisie URL alternative */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Ou coller directement l'URL vidéo HTTP/Cloudinary
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/.../video.mp4"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-[var(--obsidienne)] focus:border-[var(--laiton)] focus:outline-none"
              />
            </div>

            {/* Sélecteur de Bijou Rattaché */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Bijou présenté dans cette vidéo *
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white text-neutral-900 px-4 py-3 text-xs font-bold focus:border-[var(--laiton,#B9793E)] focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 focus:outline-none transition-all cursor-pointer shadow-xs"
              >
                <option value="" className="bg-white text-neutral-900 font-sans py-2">-- Choisir un bijou du catalogue --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-neutral-900 font-sans py-2">
                    {p.name} ({new Intl.NumberFormat("fr-FR").format(p.price)} FCFA)
                  </option>
                ))}
              </select>
            </div>

            {/* Status Actif / Masqué */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-300 text-[var(--laiton)] focus:ring-[var(--laiton)]"
                />
                <span className="text-xs font-bold text-[var(--obsidienne)]">
                  Publier immédiatement en ligne
                </span>
              </label>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[var(--laiton,#B9793E)] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enregistrement...</span>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Enregistrer le Reel</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
