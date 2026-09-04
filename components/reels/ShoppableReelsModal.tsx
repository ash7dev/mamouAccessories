"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { ReelCard } from "./ReelCard";
import type { Reel } from "@/lib/types/reel";

interface ShoppableReelsModalProps {
  reels: Reel[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppableReelsModal({
  reels,
  initialIndex = 0,
  isOpen,
  onClose,
}: ShoppableReelsModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial index when opened
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Track active scroll index using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    const children = Array.from(container.children);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = children.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    children.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [isOpen, reels]);

  // Keyboard Navigation (Esc to close, Arrow up/down to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" && activeIndex < reels.length - 1) {
        setActiveIndex((prev) => prev + 1);
        scrollToReel(activeIndex + 1);
      } else if (e.key === "ArrowUp" && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
        scrollToReel(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, reels.length, onClose]);

  const scrollToReel = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen || reels.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] bg-black flex items-center justify-center"
      >
        {/* ---------- Bouton Fermeture (✕) ---------- */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="fixed top-5 right-5 z-[130] flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-lg hover:bg-black active:scale-90 transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        {/* ---------- Desktop Navigation Up/Down ---------- */}
        <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[130] flex-col gap-3">
          <button
            disabled={activeIndex === 0}
            onClick={() => {
              setActiveIndex(activeIndex - 1);
              scrollToReel(activeIndex - 1);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/40 transition-all"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            disabled={activeIndex === reels.length - 1}
            onClick={() => {
              setActiveIndex(activeIndex + 1);
              scrollToReel(activeIndex + 1);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/40 transition-all"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* ---------- Container Scroll Snap Fullscreen ---------- */}
        <div
          ref={containerRef}
          className="h-full w-full max-w-md mx-auto overflow-y-auto snap-y snap-mandatory scrollbar-none"
        >
          {reels.map((reel, idx) => (
            <div key={reel.id} className="h-full w-full snap-start">
              <ReelCard
                reel={reel}
                isActive={idx === activeIndex}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onCloseModal={onClose}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
