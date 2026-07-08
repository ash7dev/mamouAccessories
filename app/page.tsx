import { Navbar } from "@/components/boutique/navbar";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBadges } from "@/components/home/TrustBadges";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/footer";
import {
  getHomeCategories,
  getFeaturedProducts,
  getNewArrivals,
  getApprovedReviews,
  getActivePromo,
  getRecommendedProducts,
} from "@/lib/data/home-data";

/* ============================================================
   Page d'accueil — /

   Server Component : charge les données depuis Supabase et les
   passe aux sections client (animées). Ordre pensé mobile-first,
   comme le fil d'une app.
   ============================================================ */

export default async function HomePage() {
  // Requêtes Supabase parallèles pour optimiser le chargement
  const [categories, featured, newArrivals, reviews, activePromo, recommended] = await Promise.all([
    getHomeCategories(),
    getFeaturedProducts(),      // is_featured = true, is_active = true
    getNewArrivals(),           // order by created_at desc, limit 8
    getApprovedReviews(6),      // is_approved = true
    getActivePromo(),           // depuis settings/promotions
    getRecommendedProducts(),   // produits aléatoires
  ]);

  return (
    <>
      <Navbar />

      <SearchBar />

      <Hero />

      <CategoryRail categories={categories} />

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

      {activePromo && <PromoBanner />}

      <ProductSection
        eyebrow="Fraîchement arrivés"
        title="Nouveautés"
        products={newArrivals}
        viewAllHref="/boutique?tri=recent"
        mobileLayout="grid"
      />

      <TrustBadges />

      <Testimonials reviews={reviews} />

      <Footer />
    </>
  );
}