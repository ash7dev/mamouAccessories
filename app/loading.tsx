/* ============================================================
   Luxury Splash Screen — Mamou's Accessories

   Design moderne & épuré : Monogramme avec halo lumineux, 
   typographie dorée et ligne de progression ultra-fine 
   effet "shimmer" (zéro spinner classique).
   ============================================================ */

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F1ECE3] overflow-hidden select-none">
      {/* Halo lumineux ambré/doré en arrière-plan */}
      <div 
        className="absolute w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(185,121,62,0.15)_0%,rgba(241,236,227,0)_70%)] pointer-events-none"
        style={{ animation: "mamou-glow 2.5s ease-in-out infinite alternate" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 px-4">
        {/* Emblème / Monogramme Bijouterie */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#EBE4D8] shadow-[0_8px_30px_rgb(185,121,62,0.12)] border border-[#B9793E]/20">
          {/* Sparkle / Diamond Icon SVG */}
          <svg
            className="w-8 h-8 text-[#B9793E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "mamou-pulse-icon 2s ease-in-out infinite" }}
          >
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="rgba(185,121,62,0.15)" />
          </svg>
        </div>

        {/* Branding Typography */}
        <div className="flex flex-col items-center text-center space-y-1">
          <span
            className="text-2xl sm:text-3xl font-serif tracking-[0.15em] text-[#0E0B09] font-medium"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            MAMOU&apos;S
          </span>
          <span
            className="text-[9px] sm:text-[10px] font-semibold tracking-[0.35em] text-[#B9793E] uppercase"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ACCESSOIRES
          </span>
        </div>

        {/* Ligne de progression moderne (Gold Shimmer Bar) */}
        <div className="relative w-48 sm:w-56 h-[2px] bg-[#B9793E]/15 rounded-full overflow-hidden mt-1">
          <div
            className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-[#B9793E] to-transparent rounded-full"
            style={{
              animation: "mamou-shimmer-bar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />
        </div>
      </div>

      {/* Animations CSS inline pour zéro dépendance */}
      <style>{`
        @keyframes mamou-glow {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes mamou-pulse-icon {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes mamou-shimmer-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

