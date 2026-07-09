"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Star, Quote } from "lucide-react";

/* ============================================================
   Testimonials — avis clients premium

   Affiche des témoignages statiques avec design premium.
   ============================================================ */

export interface HomeReview {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  productName?: string;
  location: string;
}

const FAKE_REVIEWS: HomeReview[] = [
  {
    id: "1",
    authorName: "Aminata Diop",
    rating: 5,
    content: "Absolument ravie de mon collier ! La qualité est exceptionnelle et le design unique. J'ai reçu plein de compliments lors de mon mariage. Je recommande à 100%.",
    productName: "Collier LYNA",
    location: "Dakar"
  },
  {
    id: "2",
    authorName: "Fatou Sow",
    rating: 5,
    content: "Service client impeccable et livraison rapide à Pikine. Les boucles d'oreilles sont magnifiques, exactement comme sur les photos. C'est devenu ma boutique de référence.",
    productName: "Boucles ERIKS",
    location: "Pikine"
  },
  {
    id: "3",
    authorName: "Mariama Ba",
    rating: 5,
    content: "J'ai offert le bracelet à ma mère pour son anniversaire, elle était aux anges ! La finition est parfaite et l'emballage très soigné. Une expérience d'achat mémorable.",
    productName: "Bracelet Broks",
    location: "Guediawaye"
  },
  {
    id: "4",
    authorName: "Khady Ndiaye",
    rating: 5,
    content: "La montre est élégante et de très bonne qualité. Le rapport qualité-prix est excellent. Je vais certainement commander d'autres pièces de cette collection.",
    productName: "Montre Premium",
    location: "Dakar"
  },
  {
    id: "5",
    authorName: "Awa Fall",
    rating: 5,
    content: "Des bijoux qui respirent l'élégance et le raffinement. J'adore le style unique de cette marque. Chaque pièce est un véritable chef-d'œuvre.",
    productName: "Ensemble Complet",
    location: "Pikine"
  },
  {
    id: "6",
    authorName: "Rokhaya Gueye",
    rating: 5,
    content: "Premier achat et je suis conquise ! La qualité des matériaux est au rendez-vous et le design est sublime. Je ne peux plus m'en passer.",
    productName: "Bague Dorée",
    location: "Guediawaye"
  }
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--text-dark)]/10"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ reviews }: { reviews?: HomeReview[] }) {
  const displayReviews = FAKE_REVIEWS;

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24 bg-gradient-to-br from-[var(--ivory)]/40 via-white to-[var(--ivory)]/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8935E\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-[var(--gold)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-[var(--gold)]/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote className="w-4 h-4 text-[var(--gold)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-dark)]">
              Témoignages
            </p>
            <Quote className="w-4 h-4 text-[var(--gold)] rotate-180" />
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-dark)] mb-4">
            Elles nous font confiance
          </h2>

          {/* Subtitle */}
          <p className="text-base lg:text-lg text-[var(--text-dark)]/60 max-w-2xl mx-auto">
            Découvrez ce que nos clientes disent de leurs expériences avec nos créations
          </p>
        </motion.div>

        {/* Reviews Horizontal Scroll */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0"
        >
          {displayReviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={fadeUp}
              className="group flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[400px] snap-start"
            >
              <figure className="relative h-full rounded-[2rem] bg-white border border-[var(--gold)]/10 shadow-lg shadow-[var(--gold)]/5 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/10 hover:border-[var(--gold)]/20 overflow-hidden">
                {/* Decorative Quote */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--gold)]/10 group-hover:text-[var(--gold)]/20 transition-colors" />

                {/* Rating */}
                <div className="mb-4">
                  <Stars rating={review.rating} />
                </div>

                {/* Content */}
                <blockquote className="mb-6 text-base leading-relaxed text-[var(--text-dark)]/70">
                  "{review.content}"
                </blockquote>

                {/* Author Info */}
                <figcaption className="flex items-center gap-4 border-t border-[var(--gold)]/10 pt-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--gold)]/20 blur-lg rounded-full" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 ring-1 ring-[var(--gold)]/30">
                      <span className="text-lg font-bold text-[var(--gold-dark)]">
                        {review.authorName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text-dark)]">
                      {review.authorName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-[var(--text-dark)]/50">
                        {review.location}
                      </p>
                      {review.productName && (
                        <>
                          <span className="text-[var(--text-dark)]/20">•</span>
                          <p className="text-xs text-[var(--gold-dark)] font-medium">
                            {review.productName}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-[var(--ivory)] px-6 py-3 border border-[var(--gold)]/10">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]"
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[var(--text-dark)]">
              4.9/5 basé sur +500 avis
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}