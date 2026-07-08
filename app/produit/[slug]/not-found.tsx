import Link from 'next/link';
import { Navbar } from '@/components/boutique/navbar';
import { Footer } from '@/components/footer';

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 text-6xl text-[var(--gold)]/30">◆</div>
        <h1 className="mb-3 text-2xl font-bold text-[var(--text-dark)]">
          Produit introuvable
        </h1>
        <p className="mb-8 text-[var(--text-dark)]/60">
          Désolé, ce produit n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link
          href="/boutique"
          className="rounded-full bg-[var(--gold)] px-8 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95"
        >
          Retour à la boutique
        </Link>
      </div>
      <Footer />
    </>
  );
}
