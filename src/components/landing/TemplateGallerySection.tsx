import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import ContactOptionsDialog from "@/components/ContactOptionsDialog";
import { templates, type TemplateConfig } from "@/templates";

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

/* Background variants for reels — using brand maroon/burgundy tones */
const reelBgClasses: Record<string, string> = {
  "royal-maroon": "from-maroon-dark via-primary to-maroon-dark",
  "emerald-south": "from-[hsl(160,30%,8%)] via-[hsl(160,40%,22%)] to-[hsl(160,30%,6%)]",
  "midnight-blue": "from-[hsl(220,30%,8%)] via-[hsl(220,40%,22%)] to-[hsl(220,30%,6%)]",
  "golden-sehra": "from-[hsl(35,40%,8%)] via-[hsl(40,50%,22%)] to-[hsl(35,40%,6%)]",
  "pearl-nikah": "from-[hsl(250,20%,10%)] via-[hsl(250,20%,22%)] to-[hsl(250,20%,8%)]",
  "teal-luxury": "from-[hsl(25,80%,6%)] via-[hsl(30,70%,18%)] to-[hsl(25,80%,5%)]",
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
  <svg className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="90" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="70" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="50" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="30" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <line x1="27" y1="27" x2="173" y2="173" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
    <line x1="173" y1="27" x2="27" y2="173" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
  </svg>
);

const CUSTOM_TEMPLATES = ["midnight-blue"];

const VIDEO_TEMPLATES: Record<string, string> = {
  "royal-maroon": "/videos/royal-maroon-preview.mov",
  "teal-luxury": "/videos/marigold-mandap.mp4",
  "golden-sehra": "/videos/golden-sehra.mp4?v=2",
  "emerald-south": "/videos/emerald-south.mp4?v=2",
  "pearl-nikah": "/videos/pearl-nikah.mp4",
  "midnight-blue": "/videos/midnight-blue.mp4",
};

const ReelCard = ({ t, index, total, onGetInTouch }: { t: TemplateConfig; index: number; total: number; onGetInTouch: () => void }) => {
  const bgClass = reelBgClasses[t.id] || "from-maroon-dark via-primary to-maroon-dark";
  const badgeLabel = t.isFeatured ? "👑 Limited Ed." : t.isNew && !t.isComingSoon ? "✦ New" : null;
  const badgeClass = t.isFeatured
    ? "bg-secondary/20 border-secondary/50 text-secondary"
    : "bg-secondary/15 border-secondary/40 text-secondary";
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const hasVideo = !!VIDEO_TEMPLATES[t.id];

  /* IntersectionObserver for autoplay video cards */
  useEffect(() => {
    if (!hasVideo) return;
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoVisible(true);
          video.play().catch(() => {});
        } else {
          setVideoVisible(false);
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasVideo]);

  return (
    <div
      ref={cardRef}
      className={`reel-card group flex-shrink-0 w-[300px] h-[520px] rounded-[20px] relative overflow-hidden scroll-snap-align-center cursor-pointer border border-secondary/10 bg-gradient-to-b ${bgClass}`}
      style={{
        animation: `reelFadeUp 0.6s ease-out ${index * 100}ms both`,
        transition: "transform 0.5s cubic-bezier(0.34,1.2,0.64,1), border-color 0.3s ease",
      }}
    >
      {/* Hover shimmer overlay */}
      <div 
        className="absolute inset-0 z-[6] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, transparent 0%, hsl(40 72% 52% / 0.08) 50%, transparent 100%)",
        }}
      />


      {/* Video background for templates with video */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={VIDEO_TEMPLATES[t.id]}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[2]"
          style={{
            opacity: videoVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          muted
          loop
          playsInline
          preload="auto"
        />
      )}

      {/* Shimmer lines — gold */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent z-10" />

      {/* Badge */}
      {badgeLabel && (
        <span className={`absolute top-4 left-4 z-20 text-[9px] font-semibold tracking-[1.8px] uppercase px-3 py-1 rounded-full backdrop-blur-lg border ${badgeClass}`}>
          {badgeLabel}
        </span>
      )}

      {/* Index number */}
      <span className="absolute top-4 right-4 z-20 font-serif text-[13px] text-primary-foreground/25 tracking-wide">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      {/* Pattern background with parallax */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] transition-transform duration-700 ease-out group-hover:scale-110"
      >
        <MandalaPattern />
      </div>

      {/* Hover glow — gold */}
      <div className="absolute inset-0 z-[4] rounded-[20px] opacity-0 transition-opacity duration-400 border border-secondary/40 shadow-gold pointer-events-none group-hover:opacity-100" />

      {/* Content with parallax float */}
      <div 
        className="absolute inset-0 z-[5] flex flex-col justify-end p-7 transition-transform duration-500 ease-out group-hover:-translate-y-1"
      >
        {/* Top: Couple names - hidden for cards with video background */}
        {!hasVideo && (
          <div className="flex flex-col items-center text-center pt-10 flex-1 justify-center transition-transform duration-700 ease-out group-hover:-translate-y-2">
            <span 
              className="text-4xl mb-5 block drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ animation: "float 5s ease-in-out infinite" }}
            >
              {t.motif}
            </span>
            <div className="font-serif text-[28px] font-normal text-primary-foreground leading-tight tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
              {t.sampleData.brideName}
              <span className="block italic text-xl font-light text-secondary opacity-85 my-1">&amp;</span>
              {t.sampleData.groomName}
            </div>
            <div className="w-10 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent my-4 transition-all duration-500 group-hover:w-16" />
            <span className="text-[9px] tracking-[3px] uppercase text-primary-foreground/35">
              {t.sampleData.date} · {t.sampleData.city}
            </span>
          </div>
        )}

        {/* Bottom: Info panel */}
        <div className="bg-gradient-to-t from-foreground/95 via-foreground/85 to-transparent -mx-7 -mb-7 px-6 pt-8 pb-6 transition-transform duration-500 ease-out group-hover:translate-y-0.5">
          <h3 className="font-serif text-2xl font-semibold text-primary-foreground mb-1.5 tracking-wide">
            {t.name}
          </h3>
          <p className="text-xs text-primary-foreground/45 font-light leading-relaxed mb-3 tracking-wide">
            {t.tagline}
          </p>
          <div className="flex gap-1.5 flex-wrap mb-4">
            <span className="text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full bg-primary/60 border border-primary/50 text-primary-foreground/80">
              {t.community}
            </span>
            {t.style.slice(0, 1).map((s) => (
              <span key={s} className="text-[9px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full bg-primary-foreground/[0.07] border border-primary-foreground/[0.12] text-primary-foreground/55">
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
          {CUSTOM_TEMPLATES.includes(t.id) ? (
            <button
              onClick={onGetInTouch}
              className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground font-body text-[11px] font-bold tracking-[1.5px] uppercase py-3 px-4 rounded-full transition-all hover:bg-secondary/90 hover:-translate-y-0.5 shadow-gold"
            >
              Get in Touch
            </button>
          ) : (
          <Link
            to={`/builder/${t.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground font-body text-[11px] font-bold tracking-[1.5px] uppercase py-3 px-4 rounded-full transition-all hover:bg-secondary/90 hover:-translate-y-0.5 shadow-gold"
          >
            Use This Template
          </Link>
          )}
          {t.id === "royal-maroon" || t.id === "emerald-south" || t.id === "golden-sehra" || t.id === "pearl-nikah" || t.id === "midnight-blue" || t.id === "teal-luxury" ? (
            <a
              href={{"royal-maroon": "https://vivaah.shaadi.digital/", "emerald-south": "https://dravidian-gold.shaadi.digital/", "golden-sehra": "https://golden-sehra.shaadi.digital/", "pearl-nikah": "https://midnight-nikkah.shaadi.digital/", "midnight-blue": "https://midnight-blue.shaadi.digital/", "teal-luxury": "https://marigold-mandap.shaadi.digital"}[t.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-primary-foreground/20 bg-transparent text-primary-foreground/60 text-base transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/10"
              title="Preview"
            >
              👁
            </a>
          ) : (
            <Link
              to={`/templates/${t.id}`}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-primary-foreground/20 bg-transparent text-primary-foreground/60 text-base transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/10"
              title="Preview"
            >
              👁
            </Link>
          )}
          </div>
        </div>
      </div>

      {/* Scale transform on hover applied via CSS */}
      <style>{`
        .reel-card:hover {
          transform: scale(1.03) translateY(-8px);
          border-color: hsl(40 72% 52% / 0.3);
        }
        @keyframes reelFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const TemplateGallerySection = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showContact, setShowContact] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = displayTemplates.filter((t) => getFilterMatch(t, activeFilter));

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  /* Section bg uses brand maroon-dark */
  const sectionBg = `
    radial-gradient(ellipse 120% 60% at 50% -10%, hsl(345 60% 25% / 0.35) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 0% 100%, hsl(340 55% 20% / 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, hsl(340 55% 20% / 0.3) 0%, transparent 50%),
    hsl(349 68% 6%)
  `;

  return (
    <section
      id="templates"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: sectionBg }}
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
        <h2 className="font-serif text-primary-foreground font-light leading-none tracking-tight mb-5" style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
          Find Your Perfect
          <br />
          <em className="italic font-normal text-gold-gradient">
            Wedding Invitation
          </em>
        </h2>
        <p className="text-sm text-primary-foreground/40 font-light tracking-wide leading-relaxed max-w-md mx-auto">
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
                ? "bg-gradient-to-br from-primary to-[hsl(340,55%,20%)] border-secondary/40 text-primary-foreground shadow-gold"
                : "bg-primary-foreground/[0.03] border-secondary/20 text-primary-foreground/45 hover:border-secondary/50 hover:text-secondary hover:bg-secondary/[0.06]"
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Reels Track */}
      <div className="relative z-[2] pb-10">
        {/* Fade edges — match section bg */}
        <div className="absolute top-0 bottom-10 left-0 w-20 md:w-24 z-[3] pointer-events-none" style={{ background: "linear-gradient(to right, hsl(349 68% 6%), transparent)" }} />
        <div className="absolute top-0 bottom-10 right-0 w-20 md:w-24 z-[3] pointer-events-none" style={{ background: "linear-gradient(to left, hsl(349 68% 6%), transparent)" }} />

        <div
          ref={trackRef}
          className="flex gap-5 px-10 md:px-20 overflow-x-auto scroll-snap-x-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {filteredTemplates.map((t, i) => (
            <ReelCard key={t.id} t={t} index={i} total={filteredTemplates.length} onGetInTouch={() => setShowContact(true)} />
          ))}
        </div>
      </div>

      {/* Nav Arrows */}
      <div className="flex justify-center items-center gap-3 mt-2 relative z-[2]">
        <button
          onClick={scrollLeft}
          className="w-12 h-12 rounded-full border border-secondary/25 bg-primary-foreground/[0.04] text-primary-foreground/50 text-lg flex items-center justify-center backdrop-blur-lg transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/[0.08] hover:scale-110"
        >
          ←
        </button>
        <button
          onClick={scrollRight}
          className="w-12 h-12 rounded-full border border-secondary/25 bg-primary-foreground/[0.04] text-primary-foreground/50 text-lg flex items-center justify-center backdrop-blur-lg transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/[0.08] hover:scale-110"
        >
          →
        </button>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12 relative z-[2] px-6">
        <span className="block text-xs tracking-[8px] text-secondary/30 font-serif mb-6">❖ ❖ ❖</span>
        <Link
          to="/templates"
          className="relative inline-flex items-center gap-3 bg-transparent border border-secondary/35 text-primary-foreground/80 font-body text-[11px] font-medium tracking-[3px] uppercase py-4 px-12 rounded-full transition-all overflow-hidden group hover:border-secondary/60 hover:text-secondary hover:-translate-y-0.5 hover:shadow-gold"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-secondary/15 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-[1]">View All 200+ Templates</span>
          <span className="relative z-[1]">→</span>
        </Link>
        <span className="block text-xs text-primary-foreground/20 mt-4 tracking-wide font-light">
          New designs added every month
        </span>
      </div>

      <ContactOptionsDialog open={showContact} onOpenChange={setShowContact} />
    </section>
  );
};

export default TemplateGallerySection;
