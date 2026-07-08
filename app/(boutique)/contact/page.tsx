import { Navbar } from "@/components/boutique/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Contact
        </h1>
        <p className="text-muted-foreground">
          Formulaire de contact à venir...
        </p>
      </main>
    </div>
  );
}
