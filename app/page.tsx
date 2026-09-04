import { Navbar } from "@/components/boutique/navbar";
import { Hero } from "@/components/home/Hero";
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

      <Hero products={featured.length >= 3 ? featured.slice(0, 3) : (newArrivals.length >= 3 ? newArrivals.slice(0, 3) : recommended.slice(0, 3))} />

      <CollectionCards collections={collections} />

      {/* ================= VERSION MOBILE : 2 Sections Produits (1 Grille + 1 Carrousel Horizontale) ================= */}
      <div className="lg:hidden space-y-2">
        <ProductSection
          eyebrow="Nos préférés"
          title="Coups de cœur"
          products={featured.length >= 4 ? featured.slice(0, 4) : (recommended.length >= 4 ? recommended.slice(0, 4) : newArrivals.slice(0, 4))}
          viewAllHref="/boutique"
          mobileLayout="grid"
        />

        {activePromo && <PromoBanner promo={activePromo} />}

        <ProductSection
          eyebrow="Fraîchement arrivés"
          title="Nouveautés"
          products={newArrivals}
          viewAllHref="/boutique?tri=recent"
          mobileLayout="carousel"
        />
      </div>

      {/* ================= VERSION DESKTOP : Expérience Complète Boutique ================= */}
      <div className="hidden lg:block space-y-4">
        <ProductSection
          eyebrow="Nos préférés"
          title="Coups de cœur"
          products={featured}
          viewAllHref="/boutique"
          mobileLayout="grid"
        />

        <ProductSection
          eyebrow="Pour vous"
          title="Recommandés"
          products={recommended}
          viewAllHref="/boutique"
          mobileLayout="grid"
        />

        {activePromo && <PromoBanner promo={activePromo} />}

        <ProductSection
          eyebrow="Fraîchement arrivés"
          title="Nouveautés"
          products={newArrivals}
          viewAllHref="/boutique?tri=recent"
          mobileLayout="grid"
        />
      </div>

      <MaisonMamouExperience />

      <NewsletterSection />

      <Footer />

      {/* PWA Install Prompt Modal */}
      <PWAInstallPrompt />
    </>
  );
}