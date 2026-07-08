import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/boutique/about/hero";
import { StorySection } from "@/components/boutique/about/story";
import { ValuesSection } from "@/components/boutique/about/values";
import { TimelineSection } from "@/components/boutique/about/timeline";

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <StorySection />
        <ValuesSection />
        <TimelineSection />
      </main>
      <Footer />
    </div>
  );
}
