/* Boutique loading skeleton — s'affiche immédiatement pendant le fetch API */

export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen bg-[#F1ECE3]">
      {/* Spacer for navbar */}
      <div className="h-20" />

      {/* Header skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-3 w-28 rounded-full bg-[#B9793E]/10 animate-pulse" />
          <div className="h-8 w-48 rounded-lg bg-neutral-200 animate-pulse" />
        </div>

        {/* Category pills skeleton */}
        <div className="flex gap-3 justify-center mb-10 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-neutral-200/80 animate-pulse shrink-0"
              style={{ width: `${70 + Math.random() * 40}px` }}
            />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div
                className="aspect-[3/4] rounded-2xl bg-gradient-to-tr from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
              <div className="h-3 w-3/4 rounded bg-neutral-200 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-neutral-200/60 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
