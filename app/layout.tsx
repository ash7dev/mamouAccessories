import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { PageTransition } from "@/components/ui/page-transition";
import { CartProvider } from "@/lib/cart-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-custom",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading-custom",
  display: "swap",
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-custom",
  display: "swap",
  weight: ["400", "600", "700"],
});


const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mamouaccessories.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mamou's Accessories — Haute Joaillerie & Accessoires à Dakar",
    template: "%s | Mamou's Accessories",
  },
  description: "Découvrez la collection exclusive de bijoux et accessoires raffinés par Mamou's Accessories à Dakar, Sénégal. Écrin de luxe offert, livraison en 24h & paiement sécurisé (Wave, Orange Money).",
  keywords: [
    "bijoux dakar",
    "accessoires dakar",
    "haute joaillerie senegal",
    "mamou accessories",
    "bague dakar",
    "collier dakar",
    "boucles d'oreilles dakar",
    "cadeau femme senegal",
    "bijouterie dakar",
    "boutique en ligne dakar"
  ],
  authors: [{ name: "Mamou's Accessories" }],
  creator: "Mamou's Accessories",
  applicationName: "Mamou's Accessories",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mamou's Accessories",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Mamou's Accessories — Haute Joaillerie & Accessoires à Dakar",
    description: "Boutique en ligne de bijoux d'exception à Dakar, Sénégal. Écrin offert & livraison 24h.",
    url: baseUrl,
    siteName: "Mamou's Accessories",
    locale: "fr_SN",
    type: "website",
    images: [
      {
        url: `${baseUrl}/ensemble.jpg`,
        width: 1200,
        height: 630,
        alt: "Mamou's Accessories - Haute Joaillerie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mamou's Accessories — Haute Joaillerie & Accessoires à Dakar",
    description: "Boutique en ligne de bijoux d'exception à Dakar, Sénégal.",
    images: [`${baseUrl}/ensemble.jpg`],
  },
  verification: {
    google: "google045039b5e8be6150",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#B8935E",
};

import { SplashScreen } from "@/components/ui/splash-screen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased ${plusJakartaSans.variable} ${outfit.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SplashScreen />
        <CartProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster position="top-right" richColors />
        </CartProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful:', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
