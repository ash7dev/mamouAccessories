import Link from "next/link";

interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RecentReviewsProps {
  isEmpty?: boolean;
}

export function RecentReviews({ isEmpty = true }: RecentReviewsProps) {
  const reviews: Review[] = isEmpty
    ? []
    : [
        {
          id: "1",
          customerName: "Aïcha Ba",
          productName: "Collier en or 18k",
          rating: 5,
          comment: "Magnifique ! Exactement ce que je cherchais. Qualité exceptionnelle.",
          createdAt: "Il y a 1 heure",
        },
        {
          id: "2",
          customerName: "Khady Sarr",
          productName: "Boucles d'oreilles",
          rating: 4,
          comment: "Très beau produit, livraison rapide. Fini très élégant.",
          createdAt: "Il y a 3 heures",
        },
      ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? "text-[var(--laiton,#B9793E)]" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/20 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] mb-0.5">
            Retours Clientes
          </p>
          <h2 className="font-serif text-lg font-semibold text-[var(--obsidienne,#0E0B09)]">
            Avis récents
          </h2>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/reviews"
            className="text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--laiton-clair,#D9AE78)] transition-colors"
          >
            Consulter
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.401.861-.83.637l-4.722-2.584a.563.563 0 00-.534 0l-4.722 2.584c-.428.224-.946-.151-.83-.637l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>

            <h3 className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-1">
              Aucun avis disponible
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 max-w-xs mx-auto">
              Les appréciations de vos clientes s&apos;afficheront ici.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/admin/reviews/${review.id}`}
                className="group block p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-[var(--porcelaine,#F1ECE3)]/30 hover:border-[var(--laiton)]/40 hover:bg-white transition-all"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-sans text-xs font-bold text-[var(--obsidienne,#0E0B09)]">
                        {review.customerName}
                      </h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-[11px] font-serif font-medium text-[var(--laiton,#B9793E)] mb-1">
                      {review.productName}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/70 italic line-clamp-2 mb-2">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <p className="text-[10px] font-sans font-semibold text-[var(--obsidienne,#0E0B09)]/40">{review.createdAt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
