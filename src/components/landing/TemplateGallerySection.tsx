import { Link } from "react-router-dom";
import { templates, type TemplateConfig } from "@/data/templates";

/* Show first 6: featured first, then others */
const displayTemplates = [...templates]
  .sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    if (a.isComingSoon && !b.isComingSoon) return 1;
    return 0;
  })
  .slice(0, 6);

const TemplateCard = ({ t }: { t: TemplateConfig }) => (
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

      {/* Names */}
      <div className="relative z-[1] flex flex-col items-center text-center p-5">
        <div className={`font-display text-lg font-semibold leading-tight ${t.id === "chapel-white" ? "text-foreground" : "text-white"}`}>
          {t.sampleData.brideName}
          <br />
          <span className="font-serif italic text-secondary text-xl">&</span>
          <br />
          {t.sampleData.groomName}
        </div>
        <div className="w-8 h-px bg-secondary/40 my-2" />
        <div className={`text-[10px] tracking-widest ${t.id === "chapel-white" ? "text-muted-foreground" : "text-white/35"}`}>
          {t.sampleData.date} · {t.sampleData.city}
        </div>
      </div>

      {/* Coming Soon overlay */}
      {t.isComingSoon && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/40">
          <span className="font-display text-sm font-semibold text-secondary animate-pulse">Coming Soon</span>
        </div>
      )}

      {/* Badges */}
      {t.isFeatured && (
        <div className="absolute top-2.5 left-2.5 z-[4] px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/85 text-primary-foreground backdrop-blur-lg">
          👑 Featured
        </div>
      )}
      {t.isNew && !t.isComingSoon && (
        <div className="absolute top-2.5 left-2.5 z-[4] px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-700/90 text-green-100 backdrop-blur-lg">
          ✦ New
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {displayTemplates.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  </section>
);

export default TemplateGallerySection;
