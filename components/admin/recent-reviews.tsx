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
  // Mock data
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
          comment: "Très beau produit, livraison rapide. Juste un peu petit.",
          createdAt: "Il y a 3 heures",
        },
        {
          id: "3",
          customerName: "Mariama Fall",
          productName: "Bracelet argent",
          rating: 5,
          comment: "Parfait pour un cadeau. Ma sœur a adoré !",
          createdAt: "Hier",
        },
      ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? "text-[var(--gold)]" : "text-gray-300"
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Avis récents
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucun avis" : `${reviews.length} dernier(s) avis`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/reviews"
            className="text-xs font-medium text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Voir tout
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="text-center">
              {/* Empty state icon */}
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ivory)]">
                <svg
                  className="h-6 w-6 text-[var(--gold-dark)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>

              {/* Empty state text */}
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
                Aucun avis client
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Les avis clients apparaîtront ici après les premières ventes
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/admin/reviews/${review.id}`}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[var(--text-dark)]">
                        {review.customerName}
                      </h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-gray-500 mb-1.5">
                      {review.productName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
                  "{review.comment}"
                </p>

                <p className="text-[10px] text-gray-400">{review.createdAt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
