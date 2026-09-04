/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles, ShoppingBag, MessageSquare } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/boutique", label: "Boutique", icon: Sparkles },
  { href: "/panier", label: "Panier", icon: ShoppingBag, showCount: true },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Masquer la bottom navigation sur la page détail produit et la page commande
  const isProductDetailPage = pathname?.startsWith("/produit/");
  const isCommandePage = pathname?.startsWith("/commande");
  const shouldHideBottomNav = isProductDetailPage || isCommandePage;

  return (
    <>
      {/* Navbar flottante en pilule */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 px-4"
      >
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-center md:justify-between rounded-full border border-white/30 bg-white/70 backdrop-blur-xl px-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:h-16 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none text-center md:text-left">
              <span className="font-serif italic text-xl font-semibold tracking-wide text-[var(--obsidienne,#0E0B09)] md:text-2xl transition-all group-hover:text-[var(--laiton,#B9793E)]" style={{ letterSpacing: '0.05em' }}>
                Mamou&apos;s
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-[var(--laiton,#B9793E)] md:text-[10px] uppercase">
                ACCESSORIES
              </span>
            </div>
          </Link>

          {/* Desktop : liens centrés avec pilule animée */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors text-[var(--obsidienne,#0E0B09)]"
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 rounded-full bg-[var(--obsidienne,#0E0B09)] shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? "text-[var(--porcelaine,#F1ECE3)]" : "opacity-75 hover:opacity-100"}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop uniquement : Panier Drawer */}
          <div className="hidden md:block">
            <CartDrawer />
          </div>
        </nav>
      </motion.header>

      {/* Bottom Navigation Mobile */}
      {!shouldHideBottomNav && (
        <motion.nav
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <div className="mx-auto max-w-md rounded-full border border-[var(--laiton,#B9793E)]/30 bg-white/80 backdrop-blur-xl px-2 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-around">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-3 py-2 transition-all"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 rounded-full bg-[var(--obsidienne,#0E0B09)] shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      className={`relative z-10 flex flex-col items-center gap-1 ${
                        active
                          ? "text-[var(--porcelaine,#F1ECE3)]"
                          : "text-[var(--obsidienne,#0E0B09)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
                      }`}
                    >
                      <div className="relative">
                        <Icon className="h-5 w-5" />
                        {link.showCount && mounted && count > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--laiton,#B9793E)] text-[9px] font-mono font-bold text-white shadow-xs"
                          >
                            {count > 9 ? '9+' : count}
                          </motion.span>
                        )}
                      </div>
                      <span className="text-[10px] font-sans font-semibold tracking-tight">{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </>
  );
}