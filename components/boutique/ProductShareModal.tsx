'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface ProductShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    categoryName?: string;
    imageUrl: string;
  };
}

export function ProductShareModal({ isOpen, onClose, product }: ProductShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getShareSiteUrl = () => {
    if (typeof window !== 'undefined' && (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))) {
      return window.location.origin;
    }
    return 'https://www.mamouaccessories.com';
  };
  const siteUrl = getShareSiteUrl();
  const productUrl = `${siteUrl}/produit/${product.slug}`;
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price) + ' FCFA';
  const formattedComparePrice = product.compareAtPrice 
    ? new Intl.NumberFormat('fr-FR').format(product.compareAtPrice) + ' FCFA' 
    : null;

  // Pre-filled message for sharing
  const shareMessage = `✨ Regarde ce bijou d'exception sur Mamou's Accessories :\n« ${product.name} » (${formattedPrice})\n\n👉 Découvrez la collection ici : ${productUrl}`;

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — Mamou's Accessories`,
          text: `Découvrez « ${product.name} » (${formattedPrice}) sur Mamou's Accessories.`,
          url: productUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Copy Link to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // WhatsApp Share Link
  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Download Story Card (Canvas Render)
  const handleDownloadStoryCard = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      // 9:16 Instagram Story dimensions
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      // 1. Background Gradient (Luxury Dark Obsidian)
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#0F0E0C');
      grad.addColorStop(0.5, '#191612');
      grad.addColorStop(1, '#080706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Decorative Gold Borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1000, 1840);
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 52, 976, 1816);

      // Header Brand
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ MAMOU\'S ACCESSORIES ✨', 540, 140);

      ctx.fillStyle = '#A39B8B';
      ctx.font = '24px sans-serif';
      ctx.fillText('HAUTE JOAILLERIE & ACCESSOIRES • DAKAR', 540, 190);

      // Load Product Image onto Canvas
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = product.imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue even if CORS restricts image canvas export
      });

      // Product Image Container (Centered Card 800x800)
      const imgX = 140;
      const imgY = 260;
      const imgSize = 800;

      // Draw image frame
      ctx.fillStyle = '#1A1815';
      ctx.fillRect(imgX - 10, imgY - 10, imgSize + 20, imgSize + 20);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(imgX - 10, imgY - 10, imgSize + 20, imgSize + 20);

      try {
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
      } catch {
        // Fallback placeholder text if tainted
        ctx.fillStyle = '#2A251E';
        ctx.fillRect(imgX, imgY, imgSize, imgSize);
      }

      // Category Tag
      if (product.categoryName) {
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(product.categoryName.toUpperCase(), 540, 1140);
      }

      // Product Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 52px serif';
      
      // Wrap text if needed
      const words = product.name.split(' ');
      let line = '';
      let currentY = 1220;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 900 && n > 0) {
          ctx.fillText(line.trim(), 540, currentY);
          line = words[n] + ' ';
          currentY += 65;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 540, currentY);

      // Price Tag Badge
      const priceY = currentY + 90;
      ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(540 - 240, priceY - 50, 480, 80, 40);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#E5C158';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(formattedPrice, 540, priceY + 6);

      // Footer Call to Action
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 28px sans-serif';
      ctx.fillText('CLIQUEZ SUR LE LIEN EN STORY POUR COMMANDER', 540, 1720);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('www.mamouaccessories.com', 540, 1770);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `story-mamou-${product.slug}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate story card:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#12100E] border border-[#D4AF37]/30 rounded-3xl p-5 md:p-6 shadow-2xl text-amber-50 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-medium text-[#F3E5AB]">Partager en Story & Réseaux</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story Preview Body */}
        <div className="my-4 overflow-y-auto pr-1 space-y-4">
          {/* 9:16 Instagram Story Preview Card */}
          <div 
            ref={cardRef}
            className="relative mx-auto w-[240px] h-[426px] sm:w-[260px] sm:h-[462px] rounded-2xl bg-gradient-to-b from-[#1C1A17] via-[#12100E] to-[#0A0908] border-2 border-[#D4AF37]/40 shadow-xl flex flex-col justify-between p-4 overflow-hidden group select-none transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Ambient Gold Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 blur-2xl rounded-full pointer-events-none" />
            
            {/* Top Brand Header */}
            <div className="text-center space-y-0.5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold flex items-center justify-center gap-1">
                <span>✨</span> MAMOU'S ACCESSORIES <span>✨</span>
              </div>
              <p className="text-[8px] text-stone-400 tracking-wider">HAUTE JOAILLERIE DAKAR</p>
            </div>

            {/* Product Image Frame */}
            <div className="relative w-full aspect-square my-2 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-stone-900 shadow-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 260px, 300px"
              />
            </div>

            {/* Product Info */}
            <div className="text-center space-y-1">
              {product.categoryName && (
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-medium block">
                  {product.categoryName}
                </span>
              )}
              <h4 className="font-serif text-sm font-semibold text-amber-50 line-clamp-2 leading-tight">
                {product.name}
              </h4>

              {/* Price Pill */}
              <div className="pt-1 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D77F] font-bold text-xs">
                  {formattedPrice}
                </span>
                {formattedComparePrice && (
                  <span className="text-[10px] text-stone-400 line-through">
                    {formattedComparePrice}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="pt-2 border-t border-[#D4AF37]/15 text-center">
              <p className="text-[8px] tracking-widest uppercase text-stone-400 font-medium">
                CLIQUE SUR LE LIEN POUR COMMANDER 📲
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-stone-400 px-2">
            La carte est formatée pour s'adapter parfaitement aux stories Instagram, WhatsApp & Snapchat.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#D4AF37]/20">
          {/* Native Mobile Share / General Share */}
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-stone-950 font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager</span>
          </button>

          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/30 text-white font-semibold text-xs shadow-md active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-[#D4AF37]/50 text-stone-200 text-xs font-medium active:scale-95 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D4AF37]" />
                <span>Copier le lien</span>
              </>
            )}
          </button>

          {/* Download Canvas Image */}
          <button
            onClick={handleDownloadStoryCard}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-[#D4AF37]/50 text-stone-200 text-xs font-medium active:scale-95 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{downloading ? 'Création...' : 'Télécharger Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
