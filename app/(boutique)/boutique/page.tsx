import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";

// Revalidate the boutique page every 10 minutes
export const revalidate = 600;

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Boutique
        </h1>
        <p className="text-muted-foreground">
          Liste des produits à venir...
        </p>
      </main>
      <Footer />
    </div>
  );
}
