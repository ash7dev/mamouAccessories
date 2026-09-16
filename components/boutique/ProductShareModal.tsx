'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  MessageCircle,
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

/* ------------------------------------------------------------------ */
/*  Constantes de rendu (format Story 9:16)                            */
/* ------------------------------------------------------------------ */

const CANVAS_W = 1080;
const CANVAS_H = 1920;

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5D77F';
const GOLD_SOFT = 'rgba(212, 175, 55, 0.15)';
const CREAM = '#F3E5AB';
const MUTED = '#A39B8B';

/* ------------------------------------------------------------------ */
/*  Helpers canvas                                                     */
/* ------------------------------------------------------------------ */

/** Charge une image en gérant CORS et les échecs de chargement proprement. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('[ProductShareModal] Échec du chargement de l\'image produit:', src);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Dessine une image en mode "cover" (comme object-fit: cover en CSS) :
 * recadre la source pour remplir exactement dw x dh sans la déformer.
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = dw / dh;

  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Découpe un texte en lignes tenant dans maxWidth, centré sur x. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let y = startY;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y; // renvoie la position Y de la dernière ligne dessinée
}

/** Petit ornement doré (losange + traits) pour séparer les sections. */
function drawGoldOrnament(ctx: CanvasRenderingContext2D, centerX: number, y: number) {
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(centerX - 90, y);
  ctx.lineTo(centerX - 16, y);
  ctx.moveTo(centerX + 16, y);
  ctx.lineTo(centerX + 90, y);
  ctx.stroke();

  ctx.save();
  ctx.translate(centerX, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = GOLD;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  ctx.restore();
}

interface StoryCardData {
  name: string;
  slug: string;
  categoryName?: string;
  imageUrl: string;
  formattedPrice: string;
  formattedComparePrice: string | null;
}

/**
 * Génère la carte "story" complète en PNG (1080x1920) et renvoie un Blob.
 * Fonction unique réutilisée par le téléchargement ET le partage natif,
 * pour éviter toute duplication de logique de rendu.
 */
async function renderStoryCard(data: StoryCardData): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.textAlign = 'center';

  // 1. Fond dégradé "obsidienne"
  const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bgGrad.addColorStop(0, '#0F0E0C');
  bgGrad.addColorStop(0.5, '#191612');
  bgGrad.addColorStop(1, '#080706');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Vignette subtile pour donner de la profondeur
  const vignette = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.25,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.75
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 2. Double bordure dorée
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, CANVAS_W - 80, CANVAS_H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, CANVAS_W - 104, CANVAS_H - 104);

  // 3. En-tête de marque
  ctx.shadowColor = 'rgba(212,175,55,0.5)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 40px Georgia, serif';
  ctx.fillText("✨ MAMOU'S ACCESSORIES ✨", CANVAS_W / 2, 150);
  ctx.shadowBlur = 0;

  ctx.fillStyle = MUTED;
  ctx.font = '500 22px system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('HAUTE JOAILLERIE & ACCESSOIRES • DAKAR', CANVAS_W / 2, 195);
  ctx.letterSpacing = '0px';

  drawGoldOrnament(ctx, CANVAS_W / 2, 225);

  // 4. Image produit — cadre + halo + coins arrondis, sans déformation
  const imgX = 140;
  const imgY = 270;
  const imgSize = 800;
  const radius = 28;

  // Halo doré derrière l'image
  ctx.save();
  ctx.shadowColor = 'rgba(212,175,55,0.35)';
  ctx.shadowBlur = 45;
  ctx.fillStyle = '#1A1815';
  ctx.beginPath();
  ctx.roundRect(imgX - 12, imgY - 12, imgSize + 24, imgSize + 24, radius + 6);
  ctx.fill();
  ctx.restore();

  const img = await loadImage(data.imageUrl);
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgSize, imgSize, radius);
    ctx.clip();
    drawImageCover(ctx, img, imgX, imgY, imgSize, imgSize);
    ctx.restore();
  } else {
    ctx.fillStyle = '#2A251E';
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgSize, imgSize, radius);
    ctx.fill();
    ctx.fillStyle = MUTED;
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('Image indisponible', CANVAS_W / 2, imgY + imgSize / 2);
  }

  // Liseré doré fin autour de l'image
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(imgX, imgY, imgSize, imgSize, radius);
  ctx.stroke();

  // 5. Catégorie
  let cursorY = imgY + imgSize + 70;
  if (data.categoryName) {
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(data.categoryName.toUpperCase(), CANVAS_W / 2, cursorY);
    ctx.letterSpacing = '0px';
    cursorY += 55;
  }

  // 6. Nom du produit (multi-ligne, centré)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px Georgia, serif';
  cursorY = wrapText(ctx, data.name, CANVAS_W / 2, cursorY + 10, 900, 62) + 60;

  // 7. Badge prix (dégradé + prix barré éventuel)
  const badgeW = 480;
  const badgeH = 84;
  ctx.save();
  ctx.shadowColor = 'rgba(212,175,55,0.4)';
  ctx.shadowBlur = 25;
  ctx.fillStyle = GOLD_SOFT;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(CANVAS_W / 2 - badgeW / 2, cursorY - badgeH / 2, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const priceGrad = ctx.createLinearGradient(
    CANVAS_W / 2 - 150, 0, CANVAS_W / 2 + 150, 0
  );
  priceGrad.addColorStop(0, '#B89628');
  priceGrad.addColorStop(0.5, GOLD_LIGHT);
  priceGrad.addColorStop(1, '#B89628');
  ctx.fillStyle = priceGrad;
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText(data.formattedPrice, CANVAS_W / 2, cursorY + 15);

  cursorY += badgeH / 2 + 20;

  if (data.formattedComparePrice) {
    ctx.fillStyle = MUTED;
    ctx.font = '26px system-ui, sans-serif';
    cursorY += 38;
    ctx.fillText(data.formattedComparePrice, CANVAS_W / 2, cursorY);
    const w = ctx.measureText(data.formattedComparePrice).width;
    ctx.strokeStyle = MUTED;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2 - w / 2, cursorY - 9);
    ctx.lineTo(CANVAS_W / 2 + w / 2, cursorY - 9);
    ctx.stroke();
  }

  // 8. Pied de page — suit le contenu réel avec un espacement fixe
  // (donc pas de vide quand le nom du produit est court), tout en
  // restant plafonné pour ne jamais coller à la bordure basse si le
  // nom du produit est très long.
  const footerMaxY = CANVAS_H - 220;
  const footerY = Math.min(cursorY + 130, footerMaxY);

  drawGoldOrnament(ctx, CANVAS_W / 2, footerY);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 28px system-ui, sans-serif';
  ctx.fillText('CLIQUEZ SUR LE LIEN EN STORY POUR COMMANDER', CANVAS_W / 2, footerY + 60);

  ctx.fillStyle = GOLD;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('www.mamouaccessories.com', CANVAS_W / 2, footerY + 105);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 1));
}

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export function ProductShareModal({ isOpen, onClose, product }: ProductShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!isOpen) return null;

  const getShareSiteUrl = () => {
    if (
      typeof window !== 'undefined' &&
      (window.location.origin.includes('localhost') ||
        window.location.origin.includes('127.0.0.1'))
    ) {
      return window.location.origin;
    }
    return 'https://www.mamouaccessories.com';
  };

  const siteUrl = getShareSiteUrl();
  const productUrl = `${siteUrl}/produit/${product.slug}`;
  const formattedPrice = `${new Intl.NumberFormat('fr-FR').format(product.price)} FCFA`;
  const formattedComparePrice = product.compareAtPrice
    ? `${new Intl.NumberFormat('fr-FR').format(product.compareAtPrice)} FCFA`
    : null;

  const shareMessage = `✨ Regarde ce bijou d'exception sur Mamou's Accessories :\n« ${product.name} » (${formattedPrice})\n\n👉 Découvrez la collection ici : ${productUrl}`;

  const storyData: StoryCardData = {
    name: product.name,
    slug: product.slug,
    categoryName: product.categoryName,
    imageUrl: product.imageUrl,
    formattedPrice,
    formattedComparePrice,
  };

  // Partage natif (mobile) avec image jointe quand c'est possible
  const handleNativeShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        const blob = await renderStoryCard(storyData);
        if (blob) {
          const file = new File([blob], `story-mamou-${product.slug}.png`, {
            type: 'image/png',
          });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${product.name} — Mamou's Accessories`,
              text: `Découvrez « ${product.name} » (${formattedPrice}) sur Mamou's Accessories :\n${productUrl}`,
            });
            return;
          }
        }
        // Repli sans fichier (lien seul)
        await navigator.share({
          title: `${product.name} — Mamou's Accessories`,
          text: `Découvrez « ${product.name} » (${formattedPrice}) sur Mamou's Accessories :\n${productUrl}`,
          url: productUrl,
        });
      } else {
        handleCopyLink();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erreur lors du partage:', err);
      }
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadStoryCard = async () => {
    setDownloading(true);
    try {
      const blob = await renderStoryCard(storyData);
      if (!blob) throw new Error('Échec de génération du canvas');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `story-mamou-${product.slug}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Échec de la génération de la story:', err);
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
            <h3 className="font-serif text-lg font-medium text-[#F3E5AB]">
              Partager en Story &amp; Réseaux
            </h3>
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
          <div className="relative mx-auto w-[240px] h-[426px] sm:w-[260px] sm:h-[462px] rounded-2xl bg-gradient-to-b from-[#1C1A17] via-[#12100E] to-[#0A0908] border-2 border-[#D4AF37]/40 shadow-xl flex flex-col justify-between p-4 overflow-hidden group select-none transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 blur-2xl rounded-full pointer-events-none" />

            <div className="text-center space-y-0.5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold flex items-center justify-center gap-1">
                <span>✨</span> MAMOU&apos;S ACCESSORIES <span>✨</span>
              </div>
              <p className="text-[8px] text-stone-400 tracking-wider">HAUTE JOAILLERIE DAKAR</p>
            </div>

            <div className="relative w-full aspect-square my-2 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-stone-900 shadow-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 260px, 300px"
              />
            </div>

            <div className="text-center space-y-1">
              {product.categoryName && (
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-medium block">
                  {product.categoryName}
                </span>
              )}
              <h4 className="font-serif text-sm font-semibold text-amber-50 line-clamp-2 leading-tight">
                {product.name}
              </h4>

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

            <div className="pt-2 border-t border-[#D4AF37]/15 text-center">
              <p className="text-[8px] tracking-widest uppercase text-stone-400 font-medium">
                CLIQUE SUR LE LIEN POUR COMMANDER 📲
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-stone-400 px-2">
            La carte est formatée pour s&apos;adapter parfaitement aux stories Instagram, WhatsApp &amp; Snapchat.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#D4AF37]/20">
          <button
            onClick={handleNativeShare}
            disabled={sharing}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-stone-950 font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>{sharing ? 'Préparation...' : 'Partager'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/30 text-white font-semibold text-xs shadow-md active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

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