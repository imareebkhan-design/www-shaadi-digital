import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Palette, Type, Sparkles, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorPalette {
  id: string;
  name: string;
  tag: "vibrant" | "pastel";
  preview: string[];          // [primary, secondary, accent, background]
  cssOverrides: Record<string, string>;
}

interface FontOption {
  id: string;
  name: string;
  subtext: string;
  displayFont: string;
  bodyFont: string;
  googleUrl: string;
}

interface AnimationOption {
  id: string;
  name: string;
  description: string;
  cssClass: string;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "royal-gold",
    name: "Royal Gold",
    tag: "vibrant",
    preview: ["#5a1a2a", "#c9943e", "#d4456a", "#f5f0e8"],
    cssOverrides: {
      "--maroon": "345 60% 25%",
      "--gold": "40 72% 52%",
      "--rose": "350 45% 65%",
      "--burgundy": "340 55% 20%",
      "--background": "35 33% 96%",
    },
  },
  {
    id: "sapphire-rose",
    name: "Sapphire & Rose Gold",
    tag: "vibrant",
    preview: ["#1a2e5a", "#b07090", "#c9943e", "#f0eef8"],
    cssOverrides: {
      "--maroon": "220 55% 23%",
      "--gold": "330 35% 63%",
      "--rose": "340 35% 60%",
      "--burgundy": "225 50% 18%",
      "--background": "245 30% 97%",
    },
  },
  {
    id: "emerald-gold",
    name: "Emerald & Gold",
    tag: "vibrant",
    preview: ["#1a3d2e", "#c9943e", "#e8a87c", "#eef5f0"],
    cssOverrides: {
      "--maroon": "155 38% 18%",
      "--gold": "32 65% 57%",
      "--rose": "25 55% 68%",
      "--burgundy": "158 42% 14%",
      "--background": "145 20% 97%",
    },
  },
  {
    id: "burgundy-champagne",
    name: "Burgundy & Champagne",
    tag: "vibrant",
    preview: ["#6b1a2e", "#d4b896", "#e8c068", "#faf5f0"],
    cssOverrides: {
      "--maroon": "342 60% 26%",
      "--gold": "34 55% 72%",
      "--rose": "40 65% 65%",
      "--burgundy": "340 62% 20%",
      "--background": "30 45% 98%",
    },
  },
  {
    id: "blush-sage",
    name: "Blush Pink & Sage",
    tag: "pastel",
    preview: ["#d4a0a8", "#8aaa8a", "#e8c8cc", "#fdf5f6"],
    cssOverrides: {
      "--maroon": "350 32% 67%",
      "--gold": "140 15% 55%",
      "--rose": "350 42% 78%",
      "--burgundy": "348 28% 58%",
      "--background": "350 40% 98%",
    },
  },
  {
    id: "lavender-cream",
    name: "Lavender & Cream Gold",
    tag: "pastel",
    preview: ["#9b8ab4", "#d4c090", "#c4b4d8", "#f8f5ff"],
    cssOverrides: {
      "--maroon": "270 22% 62%",
      "--gold": "38 40% 68%",
      "--rose": "272 30% 75%",
      "--burgundy": "268 20% 52%",
      "--background": "270 40% 98%",
    },
  },
  {
    id: "dusty-mauve",
    name: "Dusty Mauve & Sky",
    tag: "pastel",
    preview: ["#b08898", "#88a0b8", "#c8a8b4", "#f8f4f6"],
    cssOverrides: {
      "--maroon": "340 18% 62%",
      "--gold": "210 22% 62%",
      "--rose": "335 22% 72%",
      "--burgundy": "338 16% 52%",
      "--background": "340 30% 98%",
    },
  },
  {
    id: "coral-ivory",
    name: "Coral & Warm Ivory",
    tag: "pastel",
    preview: ["#c87860", "#d4a878", "#e8b090", "#fdf8f4"],
    cssOverrides: {
      "--maroon": "16 45% 57%",
      "--gold": "32 50% 65%",
      "--rose": "20 55% 73%",
      "--burgundy": "14 42% 47%",
      "--background": "28 50% 98%",
    },
  },
];

const FONT_OPTIONS: FontOption[] = [
  {
    id: "playfair-dm",
    name: "Playfair Display",
    subtext: "Classic Elegance",
    displayFont: "'Playfair Display', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "",
  },
  {
    id: "cormorant-dm",
    name: "Cormorant Garamond",
    subtext: "Refined Luxury",
    displayFont: "'Cormorant Garamond', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "",
  },
  {
    id: "great-vibes",
    name: "Great Vibes",
    subtext: "Romantic Script",
    displayFont: "'Great Vibes', cursive",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
  },
  {
    id: "cinzel",
    name: "Cinzel",
    subtext: "Roman Grandeur",
    displayFont: "'Cinzel', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap",
  },
  {
    id: "eb-garamond",
    name: "EB Garamond",
    subtext: "Timeless Heritage",
    displayFont: "'EB Garamond', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap",
  },
  {
    id: "italiana",
    name: "Italiana",
    subtext: "Italian Grace",
    displayFont: "'Italiana', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Italiana&display=swap",
  },
];

const ANIMATION_OPTIONS: AnimationOption[] = [
  {
    id: "fade-elegant",
    name: "Elegant Fade",
    description: "Soft, graceful fade-in with gentle upward drift",
    cssClass: "animate-fade-elegant",
    icon: "✦",
  },
  {
    id: "slide-reveal",
    name: "Silk Reveal",
    description: "Text slides in like silk unfolding",
    cssClass: "animate-slide-reveal",
    icon: "◈",
  },
  {
    id: "shimmer",
    name: "Golden Shimmer",
    description: "A warm golden glow ripples across the text",
    cssClass: "animate-shimmer",
    icon: "✧",
  },
  {
    id: "rise",
    name: "Grand Rise",
    description: "Elements ascend into place with presence",
    cssClass: "animate-rise",
    icon: "◆",
  },
  {
    id: "typewriter",
    name: "Ink Script",
    description: "Text appears as if written by hand",
    cssClass: "animate-typewriter",
    icon: "✒",
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Colour Palette", icon: Palette },
  { id: 2, label: "Calligraphy", icon: Type },
  { id: 3, label: "Animation", icon: Sparkles },
  { id: 4, label: "Preview", icon: Eye },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadGoogleFont(url: string) {
  if (!url) return;
  const existing = document.querySelector(`link[href="${url}"]`);
  if (!existing) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
}

// ─── Phone Preview ────────────────────────────────────────────────────────────

function PhonePreview({
  palette,
  font,
  animation,
}: {
  palette: ColorPalette | null;
  font: FontOption | null;
  animation: AnimationOption | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build query params to pass selections to the iframe
  const params = new URLSearchParams();
  if (palette) params.set("palette", palette.id);
  if (font) params.set("font", font.id);
  if (animation) params.set("animation", animation.id);
  const src = `/?preview=1&${params.toString()}`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Phone shell */}
      <div
        className="relative"
        style={{
          width: 260,
          height: 540,
          borderRadius: 36,
          background: "linear-gradient(145deg, #1a1a2e 60%, #2a2a3e)",
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)",
          padding: 8,
        }}
      >
        {/* Inner screen bezel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 30,
            overflow: "hidden",
            background: "#000",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 20,
              background: "#1a1a2e",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              zIndex: 10,
            }}
          />

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src={src}
            style={{
              width: "390px",
              height: "844px",
              border: "none",
              transform: "scale(0.615)",
              transformOrigin: "top left",
              pointerEvents: "none",
              display: "block",
            }}
            title="Invitation Preview"
          />
        </div>

        {/* Side buttons */}
        <div
          style={{
            position: "absolute",
            right: -3,
            top: 80,
            width: 3,
            height: 40,
            background: "#2a2a3e",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 70,
            width: 3,
            height: 28,
            background: "#2a2a3e",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 108,
            width: 3,
            height: 28,
            background: "#2a2a3e",
            borderRadius: "2px 0 0 2px",
          }}
        />
      </div>

      {/* Glow under phone */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 40,
          background: palette
            ? `hsl(${palette.cssOverrides["--gold"] || "40 72% 52%"} / 0.25)`
            : "hsl(40 72% 52% / 0.25)",
          borderRadius: "50%",
          filter: "blur(20px)",
          transition: "background 0.6s ease",
        }}
      />
    </div>
  );
}

// ─── Step 1: Colour Palette ────────────────────────────────────────────────────

function PaletteStep({
  selected,
  onSelect,
}: {
  selected: ColorPalette | null;
  onSelect: (p: ColorPalette) => void;
}) {
  const [activeTab, setActiveTab] = useState<"vibrant" | "pastel">("vibrant");
  const filtered = COLOR_PALETTES.filter((p) => p.tag === activeTab);

  return (
    <div className="space-y-6">
      {/* Tab toggle */}
      <div className="flex gap-2 p-1 rounded-full bg-[hsl(var(--muted))] w-fit">
        {(["vibrant", "pastel"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-5 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300"
            style={{
              color:
                activeTab === tab
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--muted-foreground))",
            }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-full"
                style={{ background: "hsl(var(--maroon))" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-body">{tab}</span>
          </button>
        ))}
      </div>

      {/* Palette grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="wait">
          {filtered.map((palette, i) => (
            <motion.button
              key={palette.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => onSelect(palette)}
              className="relative group text-left rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                border:
                  selected?.id === palette.id
                    ? "2px solid hsl(var(--gold))"
                    : "2px solid hsl(var(--border))",
                boxShadow:
                  selected?.id === palette.id
                    ? "0 0 0 4px hsl(var(--gold) / 0.15)"
                    : "none",
              }}
            >
              {/* Colour swatches */}
              <div className="flex h-14">
                {palette.preview.map((color, ci) => (
                  <div
                    key={ci}
                    className="flex-1 transition-all duration-500"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Name */}
              <div
                className="px-3 py-2.5"
                style={{ background: "hsl(var(--card))" }}
              >
                <p
                  className="font-body text-xs font-medium"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {palette.name}
                </p>
              </div>

              {/* Selected checkmark */}
              <AnimatePresence>
                {selected?.id === palette.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(var(--gold))" }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step 2: Font ─────────────────────────────────────────────────────────────

function FontStep({
  selected,
  onSelect,
}: {
  selected: FontOption | null;
  onSelect: (f: FontOption) => void;
}) {
  useEffect(() => {
    FONT_OPTIONS.forEach((f) => loadGoogleFont(f.googleUrl));
  }, []);

  return (
    <div className="space-y-3">
      {FONT_OPTIONS.map((font, i) => (
        <motion.button
          key={font.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          onClick={() => onSelect(font)}
          className="w-full text-left rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] group"
          style={{
            background: "hsl(var(--card))",
            border:
              selected?.id === font.id
                ? "2px solid hsl(var(--gold))"
                : "2px solid hsl(var(--border))",
            boxShadow:
              selected?.id === font.id
                ? "0 0 0 4px hsl(var(--gold) / 0.12)"
                : "none",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-2xl md:text-3xl leading-tight mb-1"
                style={{
                  fontFamily: font.displayFont,
                  color: "hsl(var(--foreground))",
                }}
              >
                Arjun & Priya
              </p>
              <p
                className="font-body text-xs tracking-[0.2em] uppercase"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {font.name} · {font.subtext}
              </p>
            </div>

            <AnimatePresence>
              {selected?.id === font.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(var(--gold))" }}
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              ) : (
                <div
                  className="w-7 h-7 rounded-full border-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: "hsl(var(--border))" }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Step 3: Animation ────────────────────────────────────────────────────────

function AnimationStep({
  selected,
  onSelect,
}: {
  selected: AnimationOption | null;
  onSelect: (a: AnimationOption) => void;
}) {
  const [previewing, setPreviewing] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <style>{`
        @keyframes fadeElegant {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideReveal {
          from { opacity: 0; transform: translateX(-16px); clip-path: inset(0 100% 0 0); }
          to   { opacity: 1; transform: translateX(0); clip-path: inset(0 0% 0 0); }
        }
        @keyframes shimmerPulse {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes grandRise {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .preview-fade { animation: fadeElegant 1.2s ease forwards; }
        .preview-slide { animation: slideReveal 1.2s ease forwards; }
        .preview-shimmer {
          background: linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--gold)), hsl(var(--foreground)));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerPulse 2s linear infinite;
        }
        .preview-rise { animation: grandRise 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {ANIMATION_OPTIONS.map((anim, i) => (
        <motion.div
          key={anim.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            border:
              selected?.id === anim.id
                ? "2px solid hsl(var(--gold))"
                : "2px solid hsl(var(--border))",
            boxShadow:
              selected?.id === anim.id
                ? "0 0 0 4px hsl(var(--gold) / 0.12)"
                : "none",
          }}
        >
          <button
            className="w-full text-left p-4 transition-colors"
            style={{ background: "hsl(var(--card))" }}
            onClick={() => onSelect(anim)}
          >
            <div className="flex items-start gap-3">
              <span
                className="text-xl flex-shrink-0 mt-0.5"
                style={{ color: "hsl(var(--gold))" }}
              >
                {anim.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="font-body text-sm font-medium"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {anim.name}
                  </p>
                  {selected?.id === anim.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(var(--gold))" }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </motion.div>
                  )}
                </div>
                <p
                  className="font-body text-xs mt-0.5"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {anim.description}
                </p>
              </div>
            </div>
          </button>

          {/* Preview strip */}
          <div
            className="px-4 pb-3 pt-1"
            style={{ background: "hsl(var(--card))" }}
          >
            <button
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
              style={{ color: "hsl(var(--gold))" }}
              onClick={() => setPreviewing(anim.id)}
            >
              Preview →
            </button>

            <AnimatePresence>
              {previewing === anim.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div
                    key={Date.now()}
                    className="mt-3 py-4 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--muted))" }}
                    onClick={() => setPreviewing(null)}
                  >
                    <p
                      className={`font-display text-xl ${
                        anim.id === "fade-elegant"
                          ? "preview-fade"
                          : anim.id === "slide-reveal"
                          ? "preview-slide"
                          : anim.id === "shimmer"
                          ? "preview-shimmer"
                          : anim.id === "rise"
                          ? "preview-rise"
                          : "preview-fade"
                      }`}
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      Arjun & Priya
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({
  palette,
  font,
  animation,
}: {
  palette: ColorPalette | null;
  font: FontOption | null;
  animation: AnimationOption | null;
}) {
  const complete = palette && font && animation;

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <h3
        className="font-body text-xs tracking-[0.3em] uppercase"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Your Selection
      </h3>

      <div className="space-y-3">
        {[
          { label: "Palette", value: palette?.name },
          { label: "Font", value: font?.name },
          { label: "Animation", value: animation?.name },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span
              className="font-body text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {label}
            </span>
            <span
              className="font-body text-xs font-medium text-right"
              style={{ color: value ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.5)" }}
            >
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>

      {complete && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full py-3 rounded-full font-body text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)))",
            color: "hsl(var(--secondary-foreground))",
            boxShadow: "0 4px 20px -4px hsl(var(--gold) / 0.4)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Confirm & Continue
        </motion.button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomizationPage() {
  const [step, setStep] = useState(1);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [font, setFont] = useState<FontOption | null>(null);
  const [animation, setAnimation] = useState<AnimationOption | null>(null);

  const canAdvance =
    (step === 1 && palette !== null) ||
    (step === 2 && font !== null) ||
    (step === 3 && animation !== null);

  const handleNext = () => {
    if (step < 4 && canAdvance) setStep((s) => s + 1);
    if (step === 3) setStep(4);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b"
        style={{
          background: "hsl(var(--background) / 0.92)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (s.id <= step || (s.id === 2 && palette) || (s.id === 3 && font) || (s.id === 4 && animation))
                    setStep(s.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-body text-[10px] tracking-[0.15em] uppercase"
                style={{
                  background:
                    step === s.id
                      ? "hsl(var(--maroon))"
                      : "transparent",
                  color:
                    step === s.id
                      ? "hsl(var(--primary-foreground))"
                      : step > s.id
                      ? "hsl(var(--gold))"
                      : "hsl(var(--muted-foreground))",
                }}
              >
                {step > s.id ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <s.icon className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: "hsl(var(--muted-foreground) / 0.4)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-16" />
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">

        {/* Left panel — customization controls */}
        <div className="lg:w-[440px] xl:w-[480px] flex-shrink-0 border-r overflow-y-auto"
          style={{ borderColor: "hsl(var(--border))" }}>
          <div className="p-6 xl:p-8 space-y-6">

            {/* Step heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <span
                  className="font-body text-[10px] tracking-[0.4em] uppercase block mb-2"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  Step {step} of 4
                </span>
                <h1
                  className="font-display text-3xl xl:text-4xl leading-tight"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {step === 1 && "Choose your\ncolour palette"}
                  {step === 2 && "Select your\ncalligraphy"}
                  {step === 3 && "Pick an\nanimation"}
                  {step === 4 && "Your invitation\nis ready"}
                </h1>
                <p
                  className="font-body text-sm mt-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {step === 1 && "Choose between vibrant and pastel combinations to set the mood."}
                  {step === 2 && "Select the perfect typeface that speaks to your love story."}
                  {step === 3 && "How should your invitation come to life on screen?"}
                  {step === 4 && "Review your selections and confirm your personalised invitation."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-content-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                {step === 1 && (
                  <PaletteStep selected={palette} onSelect={setPalette} />
                )}
                {step === 2 && (
                  <FontStep selected={font} onSelect={setFont} />
                )}
                {step === 3 && (
                  <AnimationStep selected={animation} onSelect={setAnimation} />
                )}
                {step === 4 && (
                  <SummaryCard palette={palette} font={font} animation={animation} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && (
              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
                    style={{
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--muted-foreground))",
                      background: "transparent",
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className="flex-[2] py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: canAdvance
                      ? "linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)))"
                      : "hsl(var(--muted))",
                    color: canAdvance
                      ? "hsl(var(--secondary-foreground))"
                      : "hsl(var(--muted-foreground))",
                    boxShadow: canAdvance
                      ? "0 4px 20px -4px hsl(var(--gold) / 0.4)"
                      : "none",
                    cursor: canAdvance ? "pointer" : "not-allowed",
                  }}
                >
                  {step === 3 ? "Review" : "Continue"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel — phone preview */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, hsl(var(--muted) / 0.6) 0%, hsl(var(--background)) 100%)`,
          }}
        >
          {/* Decorative background grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Ambient glow that changes with palette */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: palette
                ? `radial-gradient(ellipse 60% 50% at 50% 60%, hsl(${palette.cssOverrides["--gold"] ?? "40 72% 52%"} / 0.08) 0%, transparent 70%)`
                : "none",
            }}
            transition={{ duration: 1.2 }}
          />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Label */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className="font-body text-[10px] tracking-[0.4em] uppercase"
                style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}
              >
                Live Preview
              </span>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PhonePreview palette={palette} font={font} animation={animation} />
            </motion.div>

            {/* Selection indicators */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { label: "Palette", value: palette?.name, step: 1 },
                { label: "Font", value: font?.name, step: 2 },
                { label: "Animation", value: animation?.name, step: 3 },
              ].map(({ label, value, step: s }) => (
                <button
                  key={label}
                  onClick={() => setStep(s)}
                  className="text-center group"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mx-auto mb-1.5 transition-all duration-300"
                    style={{
                      background: value
                        ? "hsl(var(--gold))"
                        : "hsl(var(--muted-foreground) / 0.3)",
                      transform: value ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <p
                    className="font-body text-[9px] tracking-[0.15em] uppercase transition-colors"
                    style={{
                      color: value
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground) / 0.5)",
                    }}
                  >
                    {value ?? label}
                  </p>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
