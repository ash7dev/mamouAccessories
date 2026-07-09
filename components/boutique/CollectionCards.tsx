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
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-2">
              Nos Collections
            </h2>
            <p className="text-[var(--text-dark)]/60">
              Explorez nos catégories exclusives
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <Link href={`/boutique?category=${collection.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative h-[380px] rounded-[2rem] overflow-hidden shadow-lg"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="text-xs font-semibold tracking-[0.2em] text-[var(--gold)] uppercase mb-2"
                    >
                      {collection.productCount} articles
                    </motion.span>
                    
                    <h3 className="font-cinzel text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-2 text-white font-semibold text-sm"
                    >
                      Découvrir
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
