import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/boutique/navbar';
import { ProductDetailPublic } from '@/components/boutique/productsdetail';
import { Footer } from '@/components/footer';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/product-data';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

// Génération des métadonnées dynamiques pour le SEO & le partage sur les réseaux sociaux (Instagram, WhatsApp, Facebook, iMessage)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé | Mamou\'s Accessories',
    };
  }

  const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
  const title = `✨ ${product.name} (${formatFCFA(product.price)}) — Mamou's Accessories`;
  const description = product.description || `Découvrez « ${product.name} » (${product.categoryName}) sur Mamou's Accessories. Pièce d'exception sélectionnée avec soin à Dakar, Sénégal.`;
  const rawImage = product.images[0]?.url || 'https://www.mamouaccessories.com/ensemble.jpg';
  // Forcer le format JPG pour Cloudinary car WhatsApp / iMessage ne prennent pas en charge WebP pour les aperçus OpenGraph
  const mainImage = rawImage.includes('res.cloudinary.com')
    ? rawImage.replace('/f_auto', '/f_jpg')
    : rawImage;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mamouaccessories.com';
  const pageUrl = `${siteUrl}/produit/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Mamou's Accessories",
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: mainImage,
          secureUrl: mainImage,
          type: 'image/jpeg',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, 4);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mamouaccessories.com';

  // Microdonnées JSON-LD Schema.org pour l'affichage enrichi sur Google (Rich Snippets: Prix, Image, Disponibilité)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.length > 0 ? product.images.map((img) => img.url) : [`${siteUrl}/ensemble.jpg`],
    description: product.description || `Découvrez ${product.name} (${product.categoryName}) sur Mamou's Accessories à Dakar, Sénégal.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: "Mamou's Accessories",
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/produit/${product.slug}`,
      priceCurrency: 'XOF',
      price: product.price,
      priceValidUntil: '2030-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: "Mamou's Accessories",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ProductDetailPublic product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
