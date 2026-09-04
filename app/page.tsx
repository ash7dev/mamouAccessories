import { Navbar } from "@/components/boutique/navbar";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { CollectionCards } from "@/components/boutique/CollectionCards";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { MaisonMamouExperience } from "@/components/home/MaisonMamouExperience";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import {
  getHomeCollections,
  getFeaturedProducts,
  getNewArrivals,
  getActivePromo,
  getRecommendedProducts,
} from "@/lib/data/home-data";

// Revalidate the homepage every 10 minutes
export const revalidate = 600;

/* ============================================================
   Page d'accueil — /

   Server Component : charge les données depuis Supabase et les
   passe aux sections client (animées). Ordre pensé mobile-first,
   comme le fil d'une app.
   ============================================================ */

export default async function HomePage() {
  // Requêtes Supabase parallèles pour optimiser le chargement
  const [collections, featured, newArrivals, activePromo, recommended] = await Promise.all([
    getHomeCollections(),
    getFeaturedProducts(),      // is_featured = true, is_active = true
    getNewArrivals(),           // order by created_at desc, limit 8
    getActivePromo(),           // depuis settings/promotions
    getRecommendedProducts(),   // produits aléatoires
  ]);

  return (
    <>
      <Navbar />

      <SearchBar />

      <Hero heroImage="/hero.jpg" />

      <CollectionCards collections={collections} />

      <ProductSection
        eyebrow="Nos préférés"
        title="Coups de cœur"
        products={featured}
        viewAllHref="/boutique"
        mobileLayout="carousel"
      />

      <ProductSection
        eyebrow="Pour vous"
        title="Recommandés"
        products={recommended}
        viewAllHref="/boutique"
        mobileLayout="carousel"
      />

      {activePromo && <PromoBanner promo={activePromo} />}

      <ProductSection
        eyebrow="Fraîchement arrivés"
        title="Nouveautés"
        products={newArrivals}
        viewAllHref="/boutique?tri=recent"
        mobileLayout="grid"
      />

      <MaisonMamouExperience />

      <NewsletterSection />

      <Footer />

      {/* PWA Install Prompt Modal */}
      <PWAInstallPrompt />
    </>
  );
}