import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { templates, type TemplateConfig, getCeremonyLabel } from "@/data/templates";

/* Show first 6 templates for reels display */
const displayTemplates = [...templates]
  .sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    if (a.isComingSoon && !b.isComingSoon) return 1;
    return 0;
  })
  .slice(0, 6);

type FilterKey = "all" | "north-indian" | "south-indian" | "punjabi-sikh" | "muslim" | "modern";

const filters: { key: FilterKey; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "✦" },
  { key: "north-indian", label: "North Indian", icon: "🪔" },
  { key: "south-indian", label: "South Indian", icon: "🪷" },
  { key: "punjabi-sikh", label: "Punjabi / Sikh", icon: "☬" },
  { key: "muslim", label: "Muslim", icon: "☪️" },
  { key: "modern", label: "Modern", icon: "◆" },
];

/* Background variants for reels */
const reelBgClasses: Record<string, string> = {
  "royal-maroon": "from-[#1E0610] via-[#5A1222] to-[#1A0508]",
  "emerald-south": "from-[#030E0A] via-[#1A6B52] to-[#020C08]",
  "midnight-blue": "from-[#03060E] via-[#1A2F6B] to-[#020408]",
  "golden-sehra": "from-[#0A0400] via-[#5C3A0A] to-[#080200]",
  "pearl-nikah": "from-[#04040E] via-[#2D2D52] to-[#030308]",
  "teal-luxury": "from-[#020A0E] via-[#1A5060] to-[#010608]",
};

const getFilterMatch = (t: TemplateConfig, filter: FilterKey): boolean => {
  if (filter === "all") return true;
  if (filter === "north-indian") return t.region.includes("North") && !t.religion.includes("Sikh");
  if (filter === "south-indian") return t.region.includes("South");
  if (filter === "punjabi-sikh") return t.religion.includes("Sikh");
  if (filter === "muslim") return t.religion.includes("Muslim");
  if (filter === "modern") return t.style.includes("Modern") || t.style.includes("Minimal");
  return true;
};

/* Mandala SVG Pattern */
const MandalaPattern = () => (
  <svg className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.05]" viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="0.5" />
    <line x1="10" y1="100" x2="190" y2="100" stroke="white" strokeWidth="0.5" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="0.5" />
    <line x1="27" y1="27" x2="173" y2="173" stroke="white" strokeWidth="0.5" />
    <line x1="173" y1="27" x2="27" y2="173" stroke="white" strokeWidth="0.5" />
  </svg>
);

/* Single Reel Card */
const ReelCard = ({ t, index, total }: { t: TemplateConfig; index: number; total: number }) => {
  const bgClass = reelBgClasses[t.id] || "from-[#1E0610] via-[#5A1222] to-[#1A0508]";
  const badgeLabel = t.isFeatured ? "👑 Limited Ed." : t.isNew && !t.isComingSoon ? "✦ New" : null;
  const badgeClass = t.isFeatured
    ? "bg-secondary/20 border-secondary/50 text-secondary"
    : "bg-green-500/20 border-green-500/40 text-green-400";

  return (
    <div
      className={`reel-card flex-shrink-0 w-[300px] h-[520px] rounded-[20px] relative overflow-hidden scroll-snap-align-center cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] border border-white/[0.06] hover:scale-[1.04] hover:-translate-y-2 bg-gradient-to-b ${bgClass}`}
    >
      {/* Shimmer lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent z-10" />

      {/* Badge */}
      {badgeLabel && (
        <span className={`absolute top-4 left-4 z-20 text-[9px] font-semibold tracking-[1.8px] uppercase px-3 py-1 rounded-full backdrop-blur-lg border ${badgeClass}`}>
          {badgeLabel}
        </span>
      )}

      {/* Index number */}
      <span className="absolute top-4 right-4 z-20 font-serif text-[13px] text-white/25 tracking-wide">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      {/* Pattern background */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <MandalaPattern />
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 z-[4] rounded-[20px] opacity-0 transition-opacity duration-400 border border-secondary/40 shadow-[inset_0_0_40px_rgba(201,148,26,0.06)] pointer-events-none group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-0 z-[5] flex flex-col justify-between p-7">
        {/* Top: Couple names */}
        <div className="flex flex-col items-center text-center pt-10 flex-1 justify-center">
          <span className="text-4xl mb-5 block drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] animate-[float_5s_ease-in-out_infinite]">
            {t.motif}
          </span>
          <div className="font-serif text-[28px] font-normal text-white leading-tight tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            {t.sampleData.brideName}
            <span className="block italic text-xl font-light text-secondary opacity-85 my-1">&amp;</span>
            {t.sampleData.groomName}
          </div>
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent my-4" />
          <span className="text-[9px] tracking-[3px] uppercase text-white/35">
            {t.sampleData.date} · {t.sampleData.city}
          </span>
        </div>

        {/* Bottom: Info panel */}
        <div className="bg-gradient-to-t from-black/95 via-black/85 to-transparent -mx-7 -mb-7 px-6 pt-8 pb-6">
          <h3 className="font-serif text-2xl font-semibold text-white mb-1.5 tracking-wide">
            {t.name}
          </h3>
          <p className="text-xs text-white/45 font-light leading-relaxed mb-3 tracking-wide">
            {t.tagline}
          </p>
          <div className="flex gap-1.5 flex-wrap mb-4">
            <span className="text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full bg-primary/50 border border-primary/50 text-pink-200">
              {t.community}
            </span>
            {t.style.slice(0, 1).map((s) => (
              <span key={s} className="text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12] text-white/55">
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              to="/signup"
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-[#3D0A14] font-body text-[11px] font-bold tracking-[1.5px] uppercase py-3 px-4 rounded-full transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              Use This Template
            </Link>
            <Link
              to={`/templates/${t.id}`}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-transparent text-white/60 text-base transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/10"
              title="Preview"
            >
              👁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateGallerySection = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = displayTemplates.filter((t) => getFilterMatch(t, activeFilter));

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section
      id="templates"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 120% 60% at 50% -10%, rgba(123,28,46,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 0% 100%, rgba(74,14,26,0.3) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 100% 100%, rgba(74,14,26,0.3) 0%, transparent 50%),
          #0C0408
        `,
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="text-center px-6 mb-14 relative z-[2]">
        <div className="inline-flex items-center gap-3.5 text-[10px] font-medium tracking-[5px] uppercase text-secondary opacity-90 mb-5">
          <span className="w-10 h-px bg-gradient-to-r from-transparent to-secondary" />
          <span>Designs</span>
          <span className="w-10 h-px bg-gradient-to-l from-transparent to-secondary" />
        </div>
        <h2 className="font-serif text-white font-light leading-none tracking-tight mb-5" style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
          Find Your Perfect
          <br />
          <em className="italic font-normal bg-gradient-to-br from-secondary via-secondary to-[#A8780F] bg-clip-text text-transparent">
            Wedding Invitation
          </em>
        </h2>
        <p className="text-sm text-white/40 font-light tracking-wide leading-relaxed max-w-md mx-auto">
          Handcrafted for every Indian tradition. Swipe through and find the one that feels like you.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex justify-center flex-wrap gap-2 px-6 mb-14 relative z-[2]">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-medium tracking-wide transition-all whitespace-nowrap backdrop-blur-lg cursor-pointer ${
              activeFilter === f.key
                ? "bg-gradient-to-br from-[#5A1222] to-primary border-secondary/40 text-white shadow-[0_4px_20px_rgba(123,28,46,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
                : "bg-white/[0.03] border-secondary/20 text-white/45 hover:border-secondary/50 hover:text-secondary hover:bg-secondary/[0.06]"
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Reels Track */}
      <div className="relative z-[2] pb-10">
        {/* Fade edges */}
        <div className="absolute top-0 bottom-10 left-0 w-20 md:w-24 z-[3] pointer-events-none bg-gradient-to-r from-[#0C0408] to-transparent" />
        <div className="absolute top-0 bottom-10 right-0 w-20 md:w-24 z-[3] pointer-events-none bg-gradient-to-l from-[#0C0408] to-transparent" />

        <div
          ref={trackRef}
          className="flex gap-5 px-10 md:px-20 overflow-x-auto scroll-snap-x-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {filteredTemplates.map((t, i) => (
            <ReelCard key={t.id} t={t} index={i} total={filteredTemplates.length} />
          ))}
        </div>
      </div>

      {/* Nav Arrows */}
      <div className="flex justify-center items-center gap-3 mt-2 relative z-[2]">
        <button
          onClick={scrollLeft}
          className="w-12 h-12 rounded-full border border-secondary/25 bg-white/[0.04] text-white/50 text-lg flex items-center justify-center backdrop-blur-lg transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/[0.08] hover:scale-110"
        >
          ←
        </button>
        <button
          onClick={scrollRight}
          className="w-12 h-12 rounded-full border border-secondary/25 bg-white/[0.04] text-white/50 text-lg flex items-center justify-center backdrop-blur-lg transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/[0.08] hover:scale-110"
        >
          →
        </button>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12 relative z-[2] px-6">
        <span className="block text-xs tracking-[8px] text-secondary/30 font-serif mb-6">❖ ❖ ❖</span>
        <Link
          to="/templates"
          className="relative inline-flex items-center gap-3 bg-transparent border border-secondary/35 text-white/80 font-body text-[11px] font-medium tracking-[3px] uppercase py-4 px-12 rounded-full transition-all overflow-hidden group hover:border-secondary/60 hover:text-secondary hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-secondary/15 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-[1]">View All 200+ Templates</span>
          <span className="relative z-[1]">→</span>
        </Link>
        <span className="block text-xs text-white/20 mt-4 tracking-wide font-light">
          New designs added every month
        </span>
      </div>
    </section>
  );
};

export default TemplateGallerySection;
