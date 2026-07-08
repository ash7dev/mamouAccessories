"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, ShoppingBag, Info } from "lucide-react";
import { CartDrawer } from "./cart-drawer";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/boutique", label: "Boutique", icon: ShoppingBag },
  { href: "/a-propos", label: "À propos", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Masquer la bottom navigation sur la page détail produit et la page commande
  const isProductDetailPage = pathname?.startsWith("/produit/");
  const isCommandePage = pathname?.startsWith("/commande");
  const shouldHideBottomNav = isProductDetailPage || isCommandePage;

  return (
    <>
      {/* Navbar flottante en pilule */}
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-border/60 bg-card/85 px-4 shadow-sm backdrop-blur-md md:h-16 md:px-8">
          {/* Mobile : espace vide (bottom navigation gère la navigation) */}
          <div className="w-10 md:hidden" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none">
              <span className="font-cinzel italic text-xl font-semibold tracking-wide text-[var(--text-dark)] md:text-2xl transition-all group-hover:text-[var(--gold-dark)]" style={{ letterSpacing: '0.05em' }}>
                Mamou's
              </span>
              <span className="font-cinzel text-[9px] font-medium tracking-[0.3em] text-[var(--gold-dark)] md:text-[10px] uppercase" style={{ letterSpacing: '0.35em' }}>
                ACCESSORIES
              </span>
            </div>
          </Link>

          {/* Desktop : liens centrés */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary font-medium text-primary"
                    : "font-medium text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Panier (droite) */}
          <CartDrawer />
        </nav>
      </header>

      {/* Bottom Navigation Mobile */}
      {!shouldHideBottomNav && (
        <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <div className="mx-auto max-w-md rounded-full border border-border/60 bg-card/95 px-2 py-2 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-around">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-4 py-2 transition-colors ${
                      isActive(link.href)
                        ? "bg-secondary text-primary"
                        : "text-foreground/60 hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}