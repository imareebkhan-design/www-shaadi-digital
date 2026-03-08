import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { templates, type TemplateConfig, getCeremonyLabel } from "@/data/templates";

/* Show first 8: featured first, then non-coming-soon, then coming soon */
const displayTemplates = [...templates]
  .sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    if (a.isComingSoon && !b.isComingSoon) return 1;
    return 0;
  })
  .slice(0, 8);

/* ── Per-template preview slides ── */
type Slide = (t: TemplateConfig) => React.ReactNode;

const slideA: Slide = (t) => (
  <div className="flex flex-col items-center text-center px-5">
    <span className="text-3xl text-white/15 mb-3">{t.motif}</span>
    <p className="font-serif italic text-white/50 text-[10px] tracking-widest uppercase mb-4">
      We warmly invite you to celebrate our wedding day with us...
    </p>
  </div>
);

const slideB: Slide = (t) => (
  <div className="flex flex-col items-center text-center px-5">
    <p className="font-serif italic text-white/40 text-[9px] tracking-widest uppercase mb-3">
      {t.religion.includes("Muslim") ? "Bismillah" : t.religion.includes("Sikh") ? "Ik Onkar" : "Shubh"} {getCeremonyLabel(t.community)}
    </p>
    <p className="text-[10px] text-white/30 tracking-wide">
      {t.sampleData.city} · {t.sampleData.date.replace(/·/g, "").replace(/\s+/g, " ").trim().split(" ").slice(-1)[0]}
    </p>
  </div>
);

const slideC: Slide = (t) => (
  <div className="flex flex-col items-center text-center px-5">
    <p className="font-serif italic text-white/40 text-[9px] tracking-widest uppercase mb-4">With blessings of</p>
    <div className={`font-display text-lg font-semibold leading-tight ${t.id === "chapel-white" ? "text-foreground" : "text-white"}`}>
      {t.sampleData.brideName}
      <br />
      <span className="font-serif italic text-secondary text-xl">&</span>
      <br />
      {t.sampleData.groomName}
    </div>
    <p className="font-serif italic text-secondary/70 text-xs mt-2">{getCeremonyLabel(t.community)} Patrika</p>
    <div className="w-8 h-px bg-secondary/40 my-2" />
    <div className={`text-[10px] tracking-widest ${t.id === "chapel-white" ? "text-muted-foreground" : "text-white/35"}`}>
      {t.sampleData.date} · {t.sampleData.city}
    </div>
  </div>
);

const slideD: Slide = (t) => (
  <div className="flex flex-col items-center text-center px-5">
    <p className="text-[9px] tracking-[2px] uppercase text-white/40 mb-2">Save the Date</p>
    <div className="font-display text-4xl font-bold text-secondary/90">{t.sampleData.date.split("·")[0].trim()}</div>
    <p className="font-serif italic text-white/60 text-sm mt-1">
      {t.sampleData.date.replace(/·/g, "").replace(/\s+/g, " ").trim().split(" ").slice(-1)[0] === "2026" ? "January" : "Month"} 2026
    </p>
    <p className="text-[10px] text-white/30 mt-2 tracking-wide">{t.sampleData.city}</p>
  </div>
);

/* Assign slides per template for variety */
const templateSlides: Record<string, Slide[]> = {
  "royal-maroon": [slideA, slideC],
  "emerald-south": [slideB, slideC],
  "midnight-blue": [slideC, slideD],
  "golden-sehra": [slideB, slideD],
  "pearl-nikah": [slideC, slideA],
  "teal-luxury": [slideD, slideC],
  "rose-garden": [slideA, slideD],
  "chapel-white": [slideC, slideB],
};

const getSlides = (t: TemplateConfig): Slide[] => templateSlides[t.id] || [slideC, slideA];

/* ── Template Card with auto-cycling slides ── */
const TemplateCard = ({ t }: { t: TemplateConfig }) => {
  const slides = getSlides(t);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const badgeLabel = t.isFeatured ? "🏅 Limited Ed." : t.isNew && !t.isComingSoon ? "✦ New" : t.isPremium ? "👑 Premium" : null;
  const badgeColor = t.isFeatured
    ? "bg-primary/85 text-primary-foreground"
    : t.isNew && !t.isComingSoon
    ? "bg-green-700/90 text-green-100"
    : "bg-secondary/90 text-secondary-foreground";

  return (
    <Link
      to="/templates"
      aria-label={`${t.name} wedding invitation template`}
      className="rounded-2xl overflow-hidden bg-card border border-secondary/15 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(92,26,26,0.16)] hover:border-secondary block group flex flex-col"
    >
      {/* Preview area */}
      <div
        className="relative overflow-hidden shrink-0 flex items-center justify-center"
        role="img"
        aria-label={`${t.name} template preview`}
        style={{ aspectRatio: "9/16", background: t.previewGradient }}
      >
        {/* Mandala overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='rgba(201,148,26,0.12)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='70' fill='none' stroke='rgba(201,148,26,0.09)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='50' fill='none' stroke='rgba(201,148,26,0.07)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "55%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />

        {/* Slide content */}
        {!t.isComingSoon && (
          <div className="relative z-[1] transition-opacity duration-500">
            {slides[activeSlide](t)}
          </div>
        )}

        {/* Coming Soon overlay */}
        {t.isComingSoon && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-black/30">
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
              <span className="text-white/70 text-xs">🔔</span>
            </div>
            <span className="font-display text-base font-semibold text-secondary">Coming Soon</span>
            <span className="text-[10px] text-white/50 font-body mt-1">Naye designs aa rahe hain...</span>
          </div>
        )}

        {/* Badge */}
        {badgeLabel && (
          <div className={`absolute top-2.5 left-2.5 z-[4] px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-lg ${badgeColor}`}>
            {badgeLabel}
          </div>
        )}

        {/* Slide dots */}
        {!t.isComingSoon && slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setActiveSlide(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === activeSlide ? "bg-white scale-110" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info below */}
      <div className="p-[16px_20px_18px]" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <h4 className="font-display text-base font-semibold" style={{ color: "hsl(var(--maroon-dark))" }}>{t.name}</h4>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {t.region.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[10px] tracking-[0.8px] uppercase px-2.5 py-0.5 rounded-full bg-[hsl(var(--gold-pale))] text-secondary font-medium">
              {tag}
            </span>
          ))}
          {t.style.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[10px] tracking-[0.8px] uppercase px-2.5 py-0.5 rounded-full bg-[hsl(var(--gold-pale))] text-secondary font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const TemplateGallerySection = () => (
  <section id="templates" className="section-padding bg-background">
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-5">
        <div>
          <div className="section-label">Designs</div>
          <h2 className="section-title">Har Wedding ke liye<br /><em>Perfect Template</em></h2>
        </div>
        <Link
          to="/templates"
          className="w-full md:w-auto text-center border-[1.5px] border-primary text-primary px-9 py-3.5 min-h-[52px] flex items-center justify-center text-[13px] font-medium tracking-[1.2px] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
        >
          View All 200+ Templates
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayTemplates.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  </section>
);

export default TemplateGallerySection;
