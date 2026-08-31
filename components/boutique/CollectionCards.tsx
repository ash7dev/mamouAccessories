"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

interface CollectionCardsProps {
  collections: Collection[];
}

export function CollectionCards({ collections }: CollectionCardsProps) {
  return (
    <section className="py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-6 flex items-end justify-between lg:mb-8">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-[var(--text-dark)] md:text-3xl">
              Nos Collections
            </h2>
            <p className="mt-1.5 text-[15px] text-[var(--text-dark)]/60 lg:text-base">
              Explorez nos catégories exclusives
            </p>
          </div>
          {/* Visible sur toutes les tailles désormais : plus de point de sortie perdu sur mobile */}
          <Link
            href="/categories"
            className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[var(--gold-dark)] transition-colors hover:text-[var(--gold)]"
          >
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Le scroller déborde du conteneur max-width pour que la carte suivante affleure au bord de l'écran */}
      <div className="relative">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 lg:mx-auto lg:max-w-7xl lg:gap-6 lg:px-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-[72vw] flex-shrink-0 snap-start sm:w-[280px] md:w-[320px]"
            >
              <Link
                href={collection.slug ? `/boutique?category=${collection.slug}` : "/boutique"}
                className="block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 lg:rounded-[1.75rem]"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-[0_6px_24px_-6px_rgba(36,27,20,0.25)] transition-shadow duration-500 hover:shadow-[0_20px_44px_-12px_rgba(36,27,20,0.4)] lg:rounded-[1.75rem]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241B14]/90 via-[#241B14]/35 to-[#241B14]/0" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                    <span
                      className="mb-1.5 text-[13px] text-[var(--gold)]/90"
                      style={{ fontVariant: "small-caps", letterSpacing: "0.02em" }}
                    >
                      {collection.productCount} articles
                    </span>

                    <h3 className="font-cinzel text-xl font-bold text-white lg:text-2xl">
                      {collection.name}
                    </h3>

                    <p className="mb-3.5 mt-1.5 line-clamp-2 text-sm text-white/75 lg:mb-4">
                      {collection.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      Découvrir
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fondu sur le bord droit : signale qu'il y a du contenu à swiper, sans flèche générique */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-gradient-to-l from-[var(--ivory,#F9F6F0)] to-transparent lg:block" />
      </div>
    </section>
  );
}