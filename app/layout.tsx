import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { PageTransition } from "@/components/ui/page-transition";
import { CartProvider } from "@/lib/cart-context";
import { Playfair_Display, Inter, Cinzel } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Font premium pour le logo
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mamou's Accessories - Accessoires Premium",
  description: "Découvrez nos accessoires élégants et bijoux pour sublimer votre style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CartProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
