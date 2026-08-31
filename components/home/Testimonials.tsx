"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Star } from "lucide-react";

export interface HomeReview {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  productName?: string;
  location: string;
}

/* Le contenu ci-dessous est un exemple de mise en page tant que de vrais
   avis ne sont pas branchés — à remplacer dès que possible par `reviews`.
   Ne pas afficher de moyenne ("4.9/5") tant qu'elle n'est pas réelle. */
const PLACEHOLDER_REVIEWS: HomeReview[] = [
  {
    id: "1",
    authorName: "Aminata Diop",
    rating: 5,
    content: "Absolument ravie de mon collier ! La qualité est exceptionnelle et le design unique.",
    productName: "Collier LYNA",
    location: "Dakar",
  },
  {
    id: "2",
    authorName: "Fatou Sow",
    rating: 5,
    content: "Service client impeccable et livraison rapide à Pikine. Exactement comme sur les photos.",
    productName: "Boucles ERIKS",
    location: "Pikine",
  },
  {
    id: "3",
    authorName: "Mariama Ba",
    rating: 5,
    content: "J'ai offert le bracelet à ma mère, elle était aux anges. Finition parfaite, emballage soigné.",
    productName: "Bracelet Broks",
    location: "Guédiawaye",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--text-dark)]/10"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ reviews }: { reviews?: HomeReview[] }) {
  const displayReviews = reviews && reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS;

  return (
    <section className="bg-[var(--ivory)]/40 py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-9 text-center lg:mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] text-[var(--gold-dark)]"
            style={{ fontVariant: "small-caps", letterSpacing: "0.03em" }}
          >
            Témoignages
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-cinzel mt-3 text-3xl font-bold text-[var(--text-dark)] lg:text-4xl"
          >
            Elles nous font confiance
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-4 h-px w-14 bg-[var(--gold)]"
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Scroller qui déborde jusqu'au bord de l'écran, cohérent avec CollectionCards */}
      <div className="relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 lg:mx-auto lg:max-w-6xl lg:gap-6 lg:px-8"
        >
          {displayReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={fadeUp}
              className="w-[82vw] flex-shrink-0 snap-start sm:w-[360px]"
            >
              <figure className="flex h-full flex-col rounded-[1.5rem] border border-[var(--text-dark)]/[0.08] bg-white p-6 lg:p-7">
                <Stars rating={review.rating} />

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--text-dark)]/70">
                  {review.content}
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--text-dark)]/10 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/10">
                    <span className="font-cinzel text-sm font-bold text-[var(--gold-dark)]">
                      {review.authorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-dark)]">
                      {review.authorName}
                    </p>
                    <p className="text-xs text-[var(--text-dark)]/50">
                      {review.location}
                      {review.productName ? ` · ${review.productName}` : ""}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-gradient-to-l from-[var(--ivory,#F9F6F0)] to-transparent lg:block" />
      </div>
    </section>
  );
}