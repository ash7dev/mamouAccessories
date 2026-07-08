import { notFound } from 'next/navigation';
import { Navbar } from '@/components/boutique/navbar';
import { ProductDetailPublic } from '@/components/boutique/productsdetail';
import { Footer } from '@/components/footer';
import { getProductBySlug } from '@/lib/data/product-data';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailPublic product={product} />
      <Footer />
    </>
  );
}

// Génération des métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  return {
    title: `${product.name} - ${product.categoryName} | Mamou Jewelry`,
    description: product.description || `Découvrez ${product.name} - ${product.categoryName}`,
  };
}
