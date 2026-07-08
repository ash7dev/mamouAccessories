import { Navbar } from "@/components/boutique/navbar";

export default function PanierPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Panier
        </h1>
        <p className="text-muted-foreground">
          Votre panier est vide
        </p>
      </main>
    </div>
  );
}
