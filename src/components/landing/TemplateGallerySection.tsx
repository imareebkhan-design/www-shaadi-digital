import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface TemplateSlide {
  type: "names" | "countdown" | "invite-text" | "ceremony-info" | "save-date";
  content: React.ReactNode;
}

interface TemplateData {
  name: string;
  tags: string[];
  bg: string;
  badge?: { label: string; type: "limited" | "new" };
  slides: TemplateSlide[];
  altText: string;
}

const templates: TemplateData[] = [
  {
    name: "Royal Maroon",
    tags: ["North Indian", "Traditional"],
    bg: "linear-gradient(160deg,#3A0512 0%,#6B1428 50%,#3A0512 100%)",
    badge: { label: "👑 Limited Ed.", type: "limited" },
    altText: "Royal Maroon digital wedding invitation template - North Indian traditional style",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="font-serif text-[11px] tracking-[2.5px] uppercase text-white/45 mb-1.5">Together Forever</div>
            <div className="font-serif text-[26px] text-white leading-[1.2]">
              Ananya<br /><span className="text-secondary italic text-[26px]">&amp;</span><br />Rohan
            </div>
            <div className="w-10 h-px bg-secondary/50 my-2" />
            <div className="text-[10px] text-white/35 tracking-[1px]">25 · 02 · 2025 · Delhi</div>
          </div>
        ),
      },
      {
        type: "countdown",
        content: (
          <div className="flex flex-col items-center relative z-[1]">
            <div className="text-[8px] tracking-[2px] text-secondary/60 uppercase mb-2.5">Save the Date</div>
            <div className="flex gap-1.5">
              {[{ n: "127", l: "Days" }, { n: "14", l: "Hrs" }, { n: "32", l: "Min" }].map((c) => (
                <div key={c.l} className="flex flex-col items-center bg-white/[0.06] border border-secondary/20 rounded px-2.5 py-1.5 min-w-[44px]">
                  <div className="font-serif text-[24px] text-[#E8C97A] leading-none">{c.n}</div>
                  <div className="text-[7px] text-white/30 tracking-[1px] uppercase mt-0.5">{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        type: "invite-text",
        content: (
          <div className="flex flex-col items-center relative z-[1]">
            <div className="w-11 h-11 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-xl mb-2.5">🪔</div>
            <div className="font-serif text-xs italic text-white/50 leading-[1.8] px-2.5 text-center">
              We warmly invite you to celebrate our wedding day with us…
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Emerald South",
    tags: ["South Indian", "Elegant"],
    bg: "linear-gradient(160deg,#0D2818 0%,#1A5C30 60%,#0D2818 100%)",
    badge: { label: "✦ New", type: "new" },
    altText: "Emerald South digital wedding invitation - South Indian elegant design",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center relative z-[1]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[50%] border border-secondary/20 border-b-0 rounded-t-[90px] pointer-events-none" />
            <div className="text-lg mb-1.5 opacity-60">🪷</div>
            <div className="font-serif text-[20px] text-white leading-[1.2]">
              Kavya<br /><span className="text-secondary italic text-[20px]">&amp;</span><br />Siddharth
            </div>
          </div>
        ),
      },
      {
        type: "ceremony-info",
        content: (
          <div className="font-serif text-sm italic text-white/55 leading-[1.9] text-center relative z-[1]">
            Shubh Vivah · Kalyanam<br />
            <span className="text-[10px] text-secondary/50 not-italic">Bangalore · April 2025</span>
          </div>
        ),
      },
    ],
  },
  {
    name: "Midnight Blue",
    tags: ["Modern", "Minimalist"],
    bg: "linear-gradient(160deg,#0a0d1a,#0e1a3a,#1c2d6b)",
    altText: "Midnight Blue modern minimalist digital wedding invitation",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="font-serif text-[11px] tracking-[2.5px] uppercase text-white/45 mb-1.5">With blessings of</div>
            <div className="font-serif text-[26px] text-white leading-[1.2]">
              Meera<br /><span className="text-secondary italic text-[26px]">&amp;</span><br />Vivek
            </div>
            <div className="w-10 h-px bg-secondary/50 my-2" />
            <div className="font-serif text-[13px] italic text-secondary/75 relative z-[1]">Lagan Patrika</div>
            <div className="text-[10px] text-white/35 tracking-[1px] mt-1">10 · 04 · 2025 · Mumbai</div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Golden Sehra",
    tags: ["Punjabi", "Sikh"],
    bg: "linear-gradient(160deg,#2A1800,#6B4000,#2A1800)",
    altText: "Golden Sehra Punjabi Sikh digital wedding invitation template",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="text-[9px] tracking-[1px] text-[rgba(255,220,100,0.4)] mb-2">ੴ ਸਤਿ ਨਾਮੁ</div>
            <div className="text-[32px] opacity-30">☬</div>
            <div className="font-serif text-[26px] text-[rgba(255,220,100,0.9)] leading-[1.2]">
              Simran<br />&amp;<br />Harjeet
            </div>
          </div>
        ),
      },
      {
        type: "ceremony-info",
        content: (
          <div className="font-serif text-[13px] italic text-[rgba(255,220,100,0.55)] leading-[1.9] text-center relative z-[1]">
            Anand Karaj<br />
            <span className="text-[10px] text-[rgba(255,220,100,0.35)] not-italic">22 · 11 · 2025 · Amritsar</span>
          </div>
        ),
      },
    ],
  },
  {
    name: "Pearl Nikah",
    tags: ["Muslim", "Elegant"],
    bg: "linear-gradient(160deg,#1a0a16 0%,#3a0e2e 50%,#5C1040 100%)",
    altText: "Pearl Nikah Muslim digital wedding invitation - elegant design",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(201,148,26,0.04) 8px,rgba(201,148,26,0.04) 9px)" }} />
            <div className="text-[10px] tracking-[1px] text-secondary/50 mb-2 relative z-[1]">﷽</div>
            <div className="text-[26px] opacity-30 relative z-[1]">☪️</div>
            <div className="font-serif text-[26px] text-white leading-[1.2] relative z-[1]">
              Aisha<br />&amp;<br />Zayan
            </div>
            <div className="w-10 h-px bg-secondary/50 my-2 relative z-[1]" />
            <div className="font-serif text-[13px] italic text-secondary/75 relative z-[1]">Nikah</div>
            <div className="text-[10px] text-white/35 tracking-[1px] mt-1 relative z-[1]">05 · 12 · 2025 · Hyderabad</div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Teal Luxury",
    tags: ["Marathi", "Royal"],
    bg: "linear-gradient(160deg,#0a1a16 0%,#0e3a2e 50%,#1c6b52 100%)",
    altText: "Teal Luxury Marathi royal digital wedding invitation template",
    slides: [
      {
        type: "names",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="font-serif text-[11px] tracking-[2.5px] uppercase text-white/45 mb-1.5">Om Shubham Karoti</div>
            <div className="font-serif text-[26px] text-white leading-[1.2]">
              Kavya<br /><span className="text-secondary italic text-[26px]">&amp;</span><br />Siddharth
            </div>
            <div className="w-10 h-px bg-secondary/50 my-2" />
            <div className="font-serif text-[13px] italic text-secondary/75">Vivah Patrika</div>
          </div>
        ),
      },
      {
        type: "save-date",
        content: (
          <div className="flex flex-col items-center text-center relative z-[1]">
            <div className="text-[8px] tracking-[2px] text-secondary/60 uppercase mb-2.5">Save the Date</div>
            <div className="font-serif text-[32px] text-secondary/70 leading-none">18</div>
            <div className="text-[10px] tracking-[3px] text-white/30 uppercase">January 2026</div>
            <div className="w-10 h-px bg-secondary/50 mt-2.5" />
            <div className="text-[10px] text-white/35 tracking-[1px] mt-1">Pune · Maharashtra</div>
          </div>
        ),
      },
    ],
  },
];

const TemplateCard = ({ t }: { t: TemplateData }) => {
  const [current, setCurrent] = useState(0);
  const total = t.slides.length;

  // Auto-slide
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <Link
      to="/templates"
      aria-label={t.altText}
      className="rounded-2xl overflow-hidden bg-card border border-secondary/15 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(92,26,26,0.16)] hover:border-secondary block group flex flex-col"
    >
      {/* Preview area — 9:16 aspect ratio */}
      <div className="relative overflow-hidden shrink-0" role="img" aria-label={t.altText} style={{ aspectRatio: "9/16", background: t.bg }}>
        {/* Mandala overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='rgba(201,148,26,0.12)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='70' fill='none' stroke='rgba(201,148,26,0.09)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='50' fill='none' stroke='rgba(201,148,26,0.07)' stroke-width='1'/%3E%3Cline x1='100' y1='10' x2='100' y2='190' stroke='rgba(201,148,26,0.05)' stroke-width='0.5'/%3E%3Cline x1='10' y1='100' x2='190' y2='100' stroke='rgba(201,148,26,0.05)' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "55%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />

        {/* Slides container */}
        <div className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(-${current * 100}%)` }}>
          {t.slides.map((slide, i) => (
            <div key={i} className="min-w-full h-full flex flex-col items-center justify-center p-5 text-center relative">
              {slide.content}
            </div>
          ))}
        </div>

        {/* Badge */}
        {t.badge && (
          <div className={`absolute top-2.5 left-2.5 z-[4] px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 backdrop-blur-lg ${
            t.badge.type === "limited"
              ? "bg-[rgba(92,26,26,0.85)] text-[#FFCFCF]"
              : "bg-[rgba(30,130,60,0.9)] text-[#C8FFD8]"
          }`}>
            {t.badge.label}
          </div>
        )}

        {/* Dot pagination */}
        {total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[5] flex gap-[5px]">
            {t.slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
                className={`w-[5px] h-[5px] rounded-full transition-all duration-300 ${i === current ? "bg-white scale-[1.3]" : "bg-white/35"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info below */}
      <div className="p-[16px_20px_18px]" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <h4 className="font-display text-base font-semibold" style={{ color: "hsl(var(--maroon-dark))" }}>{t.name}</h4>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {t.tags.map((tag) => (
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((t) => (
          <TemplateCard key={t.name} t={t} />
        ))}
      </div>
    </div>
  </section>
);

export default TemplateGallerySection;
