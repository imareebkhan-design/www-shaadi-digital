import { Link } from "react-router-dom";

const templates = [
  { name: "Royal Maroon", subtitle: "Together Forever", couple: "Ananya & Rohan", ceremony: "Wedding Invitation", date: "25 · 02 · 2025 · Delhi", tags: ["North Indian", "Traditional"], bg: "linear-gradient(160deg,#3A0512 0%,#6B1428 50%,#3A0512 100%)" },
  { name: "Emerald South", subtitle: "Shubh Vivah", couple: "Priya & Arjun", ceremony: "Kalyanam", date: "15 · 03 · 2025 · Chennai", tags: ["South Indian", "Elegant"], bg: "linear-gradient(160deg,#0D2818 0%,#1A5C30 60%,#0D2818 100%)" },
  { name: "Midnight Blue", subtitle: "With Blessings Of", couple: "Meera & Vivek", ceremony: "Lagan Patrika", date: "10 · 04 · 2025 · Mumbai", tags: ["Modern", "Minimalist"], bg: "linear-gradient(160deg,#0a0d1a,#0e1a3a,#1c2d6b)" },
  { name: "Golden Punjabi", subtitle: "ਰੱਬ ਦੀ ਮਿਹਰ", couple: "Simran & Harjeet", ceremony: "Anand Karaj", date: "22 · 11 · 2025 · Amritsar", tags: ["Punjabi", "Sikh"], bg: "linear-gradient(160deg,#2A1800,#6B4000,#2A1800)" },
  { name: "Rose Garden", subtitle: "Two Souls, One Love", couple: "Aisha & Zayan", ceremony: "Nikah", date: "05 · 12 · 2025 · Hyderabad", tags: ["Muslim", "Floral"], bg: "linear-gradient(160deg,#3a0e2e,#6b1c52,#3a0e2e)" },
  { name: "Teal Luxury", subtitle: "Om Shubham Karoti", couple: "Kavya & Siddharth", ceremony: "Vivah Patrika", date: "18 · 01 · 2026 · Pune", tags: ["Marathi", "Royal"], bg: "linear-gradient(160deg,#0a1a16,#0e3a2e,#1c6b52)" },
];

const TemplateGallerySection = () => (
  <section id="templates" className="section-padding bg-background">
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-5">
        <div>
          <div className="section-label">Designs</div>
          <h2 className="section-title">Har Wedding ke liye<br /><em>Perfect Template</em></h2>
        </div>
        <Link
          to="/templates"
          className="border-[1.5px] border-primary text-primary px-9 py-3.5 text-[13px] font-medium tracking-[1.2px] uppercase hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
        >
          View All 200+ Templates
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Link
            key={t.name}
            to="/templates"
            className="rounded-[18px] overflow-hidden bg-card border border-secondary/15 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(92,26,26,0.15)] hover:border-secondary block group"
          >
            {/* Preview area */}
            <div
              className="relative overflow-hidden flex items-center justify-center"
              style={{ aspectRatio: "4/3", background: t.bg }}
            >
              {/* Mandala overlay */}
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='rgba(201,148,26,0.2)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='rgba(201,148,26,0.15)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='40' fill='none' stroke='rgba(201,148,26,0.1)' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              <div className="text-center p-6 relative z-10">
                <p className="font-body text-[11px] tracking-[3px] uppercase text-white/50 mb-2">{t.subtitle}</p>
                <p className="font-display text-[24px] md:text-[26px] font-bold text-white mb-1">{t.couple}</p>
                <div className="w-[50px] h-px mx-auto my-2.5" style={{ background: "#C9941A" }} />
                <p className="font-serif text-sm italic" style={{ color: "#C9941A" }}>{t.ceremony}</p>
                <p className="text-[11px] text-white/40 tracking-[1px] mt-2">{t.date}</p>
              </div>
            </div>

            {/* Info below — separate, never overlapping */}
            <div className="p-5" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
              <h4 className="font-display text-base font-semibold" style={{ color: "#2C1810" }}>{t.name}</h4>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="text-[10px] tracking-[0.8px] uppercase px-2.5 py-0.5 rounded-full bg-[hsl(var(--gold-pale))] text-secondary font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TemplateGallerySection;
