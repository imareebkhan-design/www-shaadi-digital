import { Link } from "react-router-dom";

const MandalaLeft = () => (
  <svg className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] -top-[150px] -right-[150px] opacity-[0.06] animate-spin-slow" viewBox="0 0 400 400" fill="none">
    <circle cx="200" cy="200" r="190" stroke="hsl(var(--secondary))" strokeWidth="1"/>
    <circle cx="200" cy="200" r="160" stroke="hsl(var(--secondary))" strokeWidth="0.5"/>
    <circle cx="200" cy="200" r="130" stroke="hsl(var(--secondary))" strokeWidth="1"/>
    <circle cx="200" cy="200" r="100" stroke="hsl(var(--secondary))" strokeWidth="0.5"/>
    <circle cx="200" cy="200" r="70" stroke="hsl(var(--secondary))" strokeWidth="1"/>
    <path d="M200 10 L210 190 L200 200 L190 190 Z" fill="hsl(var(--secondary))"/>
    <path d="M390 200 L210 210 L200 200 L210 190 Z" fill="hsl(var(--secondary))"/>
    <path d="M200 390 L190 210 L200 200 L210 210 Z" fill="hsl(var(--secondary))"/>
    <path d="M10 200 L190 190 L200 200 L190 210 Z" fill="hsl(var(--secondary))"/>
  </svg>
);

const MandalaRight = () => (
  <svg className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] -bottom-[100px] -left-[100px] opacity-[0.06] animate-spin-slow-reverse" viewBox="0 0 400 400" fill="none">
    <circle cx="200" cy="200" r="190" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="200" cy="200" r="150" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
    <circle cx="200" cy="200" r="110" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="200" cy="200" r="70" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
  </svg>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5 pt-[120px] pb-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-background" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--secondary) / 0.12) 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 10% 80%, hsl(var(--primary) / 0.08) 0%, transparent 60%),
                     hsl(var(--background))`
      }} />

      <MandalaLeft />
      <MandalaRight />

      {/* Badge */}
      <div className="relative animate-fade-up inline-flex items-center gap-2 bg-[hsl(var(--gold-pale))] border border-secondary/40 px-4 py-1.5 rounded-full text-xs font-medium tracking-[1px] uppercase text-secondary mb-7">
        <span className="text-[10px]">✦</span>
        India's Most Beautiful Digital Invitations
        <span className="text-[10px]">✦</span>
      </div>

      {/* Heading */}
      <h1 className="relative animate-fade-up-1 font-display font-bold leading-[1.05] text-[clamp(42px,7vw,88px)]" style={{ color: 'hsl(var(--maroon-dark))' }}>
        Aapki Shaadi,<br />
        <em className="italic text-secondary font-serif text-[1.15em]">Aapka Andaaz</em>
      </h1>

      {/* Subtext */}
      <p className="relative animate-fade-up-2 font-serif text-[clamp(18px,2.5vw,26px)] font-light italic text-muted-foreground mt-4 max-w-[620px]">
        Where tradition meets the digital world — elegantly
      </p>

      {/* Description */}
      <p className="relative animate-fade-up-3 font-body text-[15px] text-muted-foreground max-w-[500px] leading-[1.8] mt-5">
        Send stunning digital wedding invitations with RSVP tracking, WhatsApp sharing, and real-time guest management — designed for every Indian wedding, from Punjabi Shaadi to South Indian Kalyanam.
      </p>

      {/* Actions */}
      <div className="relative animate-fade-up-4 flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          to="/templates"
          className="bg-primary text-primary-foreground px-9 py-4 text-[13px] font-medium tracking-[1.2px] uppercase hover:bg-secondary hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_hsl(var(--primary)/0.25)]"
        >
          Browse Templates
        </Link>
        <button
          onClick={() => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" })}
          className="border-[1.5px] border-primary text-primary px-9 py-4 text-[13px] font-medium tracking-[1.2px] uppercase hover:bg-primary hover:text-primary-foreground transition-all"
        >
          See How It Works
        </button>
      </div>

      {/* Stats */}
      <div className="relative animate-fade-up-5 flex gap-6 md:gap-12 mt-16 items-center">
        <div className="text-center">
          <div className="font-display text-[32px] font-bold text-primary">50,000+</div>
          <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-0.5">Happy Couples</div>
        </div>
        <div className="w-px h-10 bg-secondary/30" />
        <div className="text-center">
          <div className="font-display text-[32px] font-bold text-primary">200+</div>
          <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-0.5">Templates</div>
        </div>
        <div className="w-px h-10 bg-secondary/30" />
        <div className="text-center">
          <div className="font-display text-[32px] font-bold text-primary">₹0</div>
          <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-0.5">Paper Waste</div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[2px] uppercase text-muted-foreground animate-[bounce-scroll_2s_ease_infinite]">
        Scroll
        <span className="text-base">↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
