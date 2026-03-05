import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 container text-center px-4 py-32 md:py-40">
        <p className="font-serif italic text-secondary text-lg md:text-xl mb-4 animate-fade-in-up">
          India's Premier Digital Wedding Invitations
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-card leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Your Wedding Story,
          <br />
          <span className="text-secondary">Beautifully Digital</span>
        </h1>
        <p className="font-body text-card/80 text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          Choose from stunning, community-authentic templates. Personalise in minutes.
          Share via WhatsApp. Track RSVPs in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <Button size="lg" className="font-body text-base px-8 py-6">
            Browse Templates
          </Button>
          <Button size="lg" variant="outline" className="font-body text-base px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-card">
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
