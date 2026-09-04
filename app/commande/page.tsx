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
            const firstImgObj = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
            const rawImage =
              typeof firstImgObj === 'string'
                ? firstImgObj
                : firstImgObj?.cloudinary_public_id ||
                  firstImgObj?.url ||
                  firstImgObj?.image_url ||
                  product.image_url ||
                  product.imageUrl ||
                  product.cloudinary_public_id ||
                  null;

            const cartItem = items.find(i => i.productId === product.id);

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              imageUrl: rawImage,
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
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Header Skeleton */}
          <div className="mb-8 space-y-3">
            <div className="h-4 w-36 bg-neutral-200 rounded-md animate-pulse" />
            <div className="h-8 w-64 bg-neutral-200 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Skeleton */}
            <div className="lg:col-span-7 space-y-6">
              {/* Form Card Skeleton */}
              <div className="rounded-3xl border border-neutral-100 bg-white p-6 space-y-4 shadow-xs">
                <div className="h-6 w-48 bg-neutral-200 rounded-md animate-pulse mb-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
                  <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
                </div>
                <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
                <div className="h-20 bg-neutral-100 rounded-xl animate-pulse" />
              </div>

              {/* Delivery Skeleton */}
              <div className="rounded-3xl border border-neutral-100 bg-white p-6 space-y-4 shadow-xs">
                <div className="h-6 w-40 bg-neutral-200 rounded-md animate-pulse" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />
                  <div className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />
                </div>
              </div>

              {/* Payment Method Skeleton */}
              <div className="rounded-3xl border border-neutral-100 bg-white p-6 space-y-4 shadow-xs">
                <div className="h-6 w-44 bg-neutral-200 rounded-md animate-pulse" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-neutral-100 rounded-2xl animate-pulse" />
                  <div className="h-20 bg-neutral-100 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Skeleton */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-neutral-100 bg-white p-6 space-y-5 shadow-xs sticky top-24">
                <div className="h-6 w-40 bg-neutral-200 rounded-md animate-pulse" />

                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-neutral-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-neutral-100 rounded-md animate-pulse" />
                        <div className="h-3 w-1/2 bg-neutral-100 rounded-md animate-pulse" />
                      </div>
                      <div className="h-4 w-16 bg-neutral-100 rounded-md animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-neutral-100 rounded-md animate-pulse" />
                    <div className="h-4 w-24 bg-neutral-100 rounded-md animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-neutral-100 rounded-md animate-pulse" />
                    <div className="h-4 w-20 bg-neutral-100 rounded-md animate-pulse" />
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4 flex justify-between items-center">
                  <div className="h-6 w-16 bg-neutral-200 rounded-md animate-pulse" />
                  <div className="h-7 w-32 bg-neutral-200 rounded-md animate-pulse" />
                </div>

                <div className="h-14 w-full bg-neutral-200 rounded-2xl animate-pulse mt-4" />
              </div>
            </div>
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
