"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   Testimonials — avis clients approuvés

   Affiche les avis modérés (is_approved = true). Carrousel
   horizontal sur mobile, grille sur desktop.
   ============================================================ */

export interface HomeReview {
  id: string;
  authorName: string;
  rating: number; // 1..5
  content: string;
  productName?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "text-[var(--gold)]" : "text-[var(--text-dark)]/15"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ reviews }: { reviews: HomeReview[] }) {
  return (
    <section className="px-5 py-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-6 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
            Elles nous font confiance
          </p>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--text-dark)] lg:text-2xl">
            Ce qu&apos;en disent nos clientes
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        >
          {reviews.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="w-full text-center py-8"
            >
              <p className="text-sm text-[var(--text-dark)]/50">
                Aucun avis pour le moment. Soyez la première à partager votre expérience !
              </p>
            </motion.div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                className="w-[80%] shrink-0 snap-start lg:w-auto"
              >
                <figure className="flex h-full flex-col rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-dark)]/70">
                    « {review.content} »
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--gold)]/10 pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-sm font-bold text-[var(--gold-dark)]">
                      {review.authorName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-dark)]">
                        {review.authorName}
                      </p>
                      {review.productName && (
                        <p className="text-xs text-[var(--text-dark)]/45">{review.productName}</p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}