"use client";

import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { Checkout } from "@/components/boutique/commande/checkout";
import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return null;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export default function CommandePage() {
  const { items } = useCart();
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [deliveryFees, setDeliveryFees] = useState({ dakar: 1500, regions: 3000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = items.map(item => item.productId);

        // Fetch tous les produits du panier ET les frais de livraison en parallèle
        const [feesResponse, ...productResponses] = await Promise.all([
          fetch('/api/settings/delivery-fees').then(r => r.json()),
          ...productIds.map(id => fetch(`/api/products/${id}`).then(r => r.json()))
        ]);

        // Mettre à jour les frais de livraison
        if (feesResponse.delivery_fee_dakar && feesResponse.delivery_fee_regions) {
          setDeliveryFees({
            dakar: feesResponse.delivery_fee_dakar,
            regions: feesResponse.delivery_fee_regions,
          });
        }

        const results = productResponses;

        const products = results
          .filter(r => r.product)
          .map(r => {
            const product = r.product;
            const mainImage = product.images?.[0]?.cloudinary_public_id;
            const cartItem = items.find(i => i.productId === product.id);

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              imageUrl: mainImage ? buildCloudinaryImageUrl(mainImage) : null,
              isActive: true,
              quantity: cartItem?.quantity || 1
            };
          });

        setCartProducts(products);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartProducts();
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mx-auto mb-4"></div>
            <p className="text-foreground">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Checkout
          cartProducts={cartProducts}
          deliveryFeeDakar={deliveryFees.dakar}
          deliveryFeeRegions={deliveryFees.regions}
        />
      </main>

      <Footer />
    </div>
  );
}
