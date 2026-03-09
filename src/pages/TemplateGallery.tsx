import { useState, useMemo, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TemplatePreviewModal from "@/components/TemplatePreviewModal";
import ContactOptionsDialog from "@/components/ContactOptionsDialog";
import { templates, FILTER_OPTIONS, type TemplateConfig } from "@/data/templates";
import { Search, SlidersHorizontal, X, Bell, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ── Filter State ── */
interface FilterState {
  religion: string[];
  region: string[];
  style: string[];
  color: string[];
  badge: string[];
  search: string;
}

const emptyFilters: FilterState = { religion: [], region: [], style: [], color: [], badge: [], search: "" };

const toggleFilter = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

/* ── Filter Logic ── */
function filterTemplates(all: TemplateConfig[], filters: FilterState): TemplateConfig[] {
  return all.filter((t) => {
    if (t.isComingSoon) return true;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.tagline.toLowerCase().includes(q)) return false;
    }
    if (filters.religion.length && !filters.religion.some((r) => t.religion.includes(r as any))) return false;
    if (filters.region.length && !filters.region.some((r) => t.region.includes(r as any))) return false;
    if (filters.style.length && !filters.style.some((s) => t.style.includes(s as any))) return false;
    if (filters.color.length && !filters.color.some((c) => t.colorFamily.includes(c as any))) return false;
    if (filters.badge.length) {
      const matches = filters.badge.some((b) => {
        if (b === "Featured") return t.isFeatured;
        if (b === "New") return t.isNew;
        if (b === "Premium") return t.isPremium;
        return false;
      });
      if (!matches) return false;
    }
    return true;
  });
}

function sortTemplates(list: TemplateConfig[]): TemplateConfig[] {
  return [...list].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    if (a.isComingSoon && !b.isComingSoon) return 1;
    return 0;
  });
}

/* ── Background classes for cards ── */
const cardBgClasses: Record<string, string> = {
  "royal-maroon": "bg-gradient-to-b from-[hsl(345,60%,8%)] via-[hsl(345,60%,18%)] to-[hsl(345,60%,6%)]",
  "emerald-south": "bg-gradient-to-b from-[hsl(160,50%,4%)] via-[hsl(160,50%,18%)] to-[hsl(160,50%,5%)]",
  "midnight-blue": "bg-gradient-to-b from-[hsl(220,50%,5%)] via-[hsl(220,45%,18%)] to-[hsl(220,50%,4%)]",
  "golden-sehra": "bg-gradient-to-b from-[hsl(35,50%,5%)] via-[hsl(40,55%,18%)] to-[hsl(35,50%,4%)]",
  "pearl-nikah": "bg-gradient-to-b from-[hsl(250,25%,6%)] via-[hsl(250,25%,16%)] to-[hsl(250,25%,5%)]",
  "teal-luxury": "bg-marigold",
  "rose-garden": "bg-gradient-to-b from-[hsl(340,50%,6%)] via-[hsl(340,50%,18%)] to-[hsl(340,50%,5%)]",
  "chapel-white": "bg-gradient-to-b from-[hsl(30,10%,88%)] via-[hsl(30,15%,92%)] to-[hsl(30,10%,85%)]",
};

/* ── Filter Chip ── */
const Chip = ({ label, active, onClick, dot }: { label: string; active: boolean; onClick: () => void; dot?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 border whitespace-nowrap ${
      active
        ? "bg-gradient-to-br from-primary to-[hsl(340,55%,20%)] border-secondary/40 text-white shadow-[0_2px_12px_rgba(123,28,46,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
        : "bg-transparent text-white/40 border-secondary/20 hover:border-secondary/50 hover:text-secondary hover:bg-secondary/[0.06]"
    }`}
  >
    {dot && <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/10" style={{ background: dot }} />}
    {label}
  </button>
);

/* ── Template Card (dark cinematic style) ── */
const TemplateCard = ({
  t,
  index,
  onPreview,
  draftTemplateId,
  onSwitchTemplate,
  onGetInTouch,
}: {
  t: TemplateConfig;
  index: number;
  onPreview: (id: string) => void;
  draftTemplateId: string | null;
  onSwitchTemplate?: (templateId: string) => void;
  onGetInTouch?: () => void;
}) => {
  const badgeLabel = t.isFeatured ? "👑 Limited Ed." : t.isNew && !t.isComingSoon ? "✦ New" : t.isPremium ? "👑 Premium" : null;
  const badgeClass = t.isFeatured
    ? "bg-secondary/20 border-secondary/50 text-secondary"
    : t.isNew && !t.isComingSoon
    ? "bg-green-500/20 border-green-500/40 text-green-400"
    : "bg-secondary/20 border-secondary/50 text-secondary";

  const hasDraft = !!draftTemplateId;
  const isCurrentDraft = draftTemplateId === t.id;

  const isCustomTemplate = t.id === "midnight-blue";

  const ctaLabel = t.isComingSoon
    ? null
    : isCustomTemplate
    ? "Get in Touch"
    : hasDraft
    ? isCurrentDraft
      ? "Continue editing"
      : "Switch to this"
    : "Use This Template";

  const handleCtaClick = () => {
    if (t.isComingSoon) return;
    if (isCustomTemplate) {
      // handled by parent via onGetInTouch
      return;
    }
    if (hasDraft && !isCurrentDraft && onSwitchTemplate) {
      onSwitchTemplate(t.id);
    } else if (isCurrentDraft) {
      window.location.assign(`/builder/${t.id}`);
    } else {
      onPreview(t.id);
    }
  };

  const bgClass = cardBgClasses[t.id] || "bg-gradient-to-b from-[hsl(345,60%,8%)] via-primary to-[hsl(345,60%,6%)]";
  const isLightCard = t.id === "chapel-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`group relative rounded-2xl overflow-hidden border border-white/5 transition-all duration-400 cursor-pointer hover:scale-[1.03] hover:-translate-y-1.5 hover:border-secondary/35 hover:shadow-[0_4px_30px_rgba(201,148,26,0.15)] ${bgClass}`}
      style={{ aspectRatio: "9/16" }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 z-10" />

      {/* Badge */}
      {badgeLabel && (
        <span className={`absolute top-3 left-3 z-20 text-[8px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full backdrop-blur-lg border ${badgeClass}`}>
          {badgeLabel}
        </span>
      )}

      {/* Number */}
      <span className={`absolute top-3 right-3 z-20 font-serif text-[11px] tracking-wide ${isLightCard ? "text-foreground/30" : "text-white/20"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <svg className="absolute -bottom-10 -right-10 w-56 h-56 opacity-[0.05]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="50" stroke="hsl(40,72%,52%)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 z-[5] rounded-2xl opacity-0 transition-opacity duration-300 border border-secondary/40 pointer-events-none group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-0 z-[6] flex flex-col">
        {/* Top area - Couple names (only for non-coming-soon) */}
        {!t.isComingSoon && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-12">
            <span className="text-2xl mb-3 block drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-[float_5s_ease-in-out_infinite]">
              {t.motif}
            </span>
            <div className={`font-serif text-lg font-normal leading-tight tracking-wide ${isLightCard ? "text-foreground" : "text-white"}`} style={{ textShadow: isLightCard ? "none" : "0 2px 16px rgba(0,0,0,0.6)" }}>
              {t.sampleData.brideName}
              <span className="block italic text-secondary text-sm opacity-85 my-0.5">&amp;</span>
              {t.sampleData.groomName}
            </div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent my-3" />
            <span className={`text-[8px] tracking-[2.5px] uppercase ${isLightCard ? "text-muted-foreground" : "text-white/30"}`}>
              {t.sampleData.date} · {t.sampleData.city}
            </span>
          </div>
        )}

        {/* Coming Soon overlay */}
        {t.isComingSoon && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
              <Bell className="w-4 h-4 text-white/60" />
            </div>
            <span className="font-serif text-base font-semibold text-secondary italic">Coming Soon</span>
            <span className="text-[9px] text-white/40 mt-1">Naye designs aa rahe hain...</span>
          </div>
        )}

        {/* Bottom info panel */}
        <div className="bg-gradient-to-t from-black/95 via-black/85 to-transparent px-4 pt-8 pb-4">
          <h3 className="font-serif text-base font-semibold text-white mb-1.5 tracking-wide">
            {t.name}
          </h3>
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="text-[8px] font-semibold tracking-[1.2px] uppercase px-2 py-0.5 rounded-full bg-primary/50 border border-primary/40 text-white/80">
              {t.community}
            </span>
            {t.style.slice(0, 1).map((s) => (
              <span key={s} className="text-[8px] font-semibold tracking-[1.2px] uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {t.isComingSoon ? (
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-secondary/40 text-secondary font-body text-[10px] font-bold tracking-[1.2px] uppercase py-2.5 px-3 rounded-full transition-all hover:bg-secondary hover:text-secondary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success(`✓ We'll notify you when ${t.name} launches!`);
                }}
              >
                <Bell className="w-3 h-3" /> Notify me
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (t.id === "midnight-blue" && onGetInTouch) {
                      onGetInTouch();
                    } else {
                      handleCtaClick();
                    }
                  }}
                  className="flex-1 bg-white text-[hsl(345,60%,15%)] font-body text-[9px] font-bold tracking-[1.2px] uppercase py-2.5 px-3 rounded-full transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                >
                  {ctaLabel}
                </button>
              {({"royal-maroon": "https://vivaah.shaadi.digital/", "emerald-south": "https://dravidian-gold.shaadi.digital/", "golden-sehra": "https://golden-sehra.shaadi.digital/", "pearl-nikah": "https://midnight-nikkah.shaadi.digital/", "midnight-blue": "https://midnight-blue.shaadi.digital/", "teal-luxury": "https://marigold-mandap.shaadi.digital"} as Record<string, string>)[t.id] ? (
                  <a
                    href={({"royal-maroon": "https://vivaah.shaadi.digital/", "emerald-south": "https://dravidian-gold.shaadi.digital/", "golden-sehra": "https://golden-sehra.shaadi.digital/", "pearl-nikah": "https://midnight-nikkah.shaadi.digital/", "midnight-blue": "https://midnight-blue.shaadi.digital/", "teal-luxury": "https://marigold-mandap.shaadi.digital"} as Record<string, string>)[t.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-full border border-white/20 bg-transparent text-white/50 flex items-center justify-center transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/10"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(t.id);
                    }}
                    className="w-9 h-9 rounded-full border border-white/20 bg-transparent text-white/50 flex items-center justify-center transition-all hover:border-secondary hover:text-secondary hover:bg-secondary/10"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Filter Panel Content ── */
const FilterPanelContent = ({
  filters,
  setFilters,
  resultCount,
  onClose,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resultCount: number;
  onClose?: () => void;
}) => {
  const activeCount = filters.religion.length + filters.region.length + filters.style.length + filters.color.length + filters.badge.length;

  return (
    <div className="space-y-6">
      {/* Religion */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-secondary mb-3 font-body">Religion</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.religion.map((r) => (
            <Chip key={r} label={r} active={filters.religion.includes(r)} onClick={() => setFilters((f) => ({ ...f, religion: toggleFilter(f.religion, r) }))} />
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-secondary mb-3 font-body">Region</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.region.map((r) => (
            <Chip key={r} label={r} active={filters.region.includes(r)} onClick={() => setFilters((f) => ({ ...f, region: toggleFilter(f.region, r) }))} />
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-secondary mb-3 font-body">Style</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.style.map((s) => (
            <Chip key={s} label={s} active={filters.style.includes(s)} onClick={() => setFilters((f) => ({ ...f, style: toggleFilter(f.style, s) }))} />
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-secondary mb-3 font-body">Color</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.colorFamily.map((c) => (
            <Chip key={c.label} label={c.label} dot={c.dot} active={filters.color.includes(c.label)} onClick={() => setFilters((f) => ({ ...f, color: toggleFilter(f.color, c.label) }))} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-secondary mb-3 font-body">Badges</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.badge.map((b) => (
            <Chip key={b} label={`${b === "Featured" ? "⭐" : b === "New" ? "✦" : "👑"} ${b}`} active={filters.badge.includes(b)} onClick={() => setFilters((f) => ({ ...f, badge: toggleFilter(f.badge, b) }))} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
        <button
          onClick={() => setFilters(emptyFilters)}
          className="text-xs text-white/40 hover:text-secondary transition-colors font-body"
        >
          Clear all filters
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-xs font-bold tracking-[1px] uppercase rounded-full bg-white text-[hsl(345,60%,15%)] hover:bg-secondary transition-colors"
        >
          Show {resultCount} templates →
        </button>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ── */
const TemplateGallery = () => {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [switchConfirm, setSwitchConfirm] = useState<{ templateId: string; name: string } | null>(null);
  const [showContact, setShowContact] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [draftTemplateId, setDraftTemplateId] = useState<string | null>(null);
  const [draftInvitationId, setDraftInvitationId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setDraftTemplateId(null); return; }
    const fetchDraft = async () => {
      const { data } = await supabase
        .from("invitations")
        .select("id, template_id")
        .eq("user_id", user.id)
        .eq("status", "draft")
        .limit(1)
        .maybeSingle();
      if (data) {
        setDraftTemplateId(data.template_id);
        setDraftInvitationId(data.id);
      }
    };
    fetchDraft();
  }, [user]);

  const handleSwitchTemplate = useCallback((templateId: string) => {
    const t = templates.find((t) => t.id === templateId);
    setSwitchConfirm({ templateId, name: t?.name || templateId });
  }, []);

  const confirmSwitch = useCallback(async () => {
    if (!switchConfirm || !draftInvitationId) return;
    await supabase
      .from("invitations")
      .update({ template_id: switchConfirm.templateId } as any)
      .eq("id", draftInvitationId);
    setSwitchConfirm(null);
    toast.success("✓ Template switched! Redirecting to builder...");
    navigate(`/builder/${switchConfirm.templateId}`);
  }, [switchConfirm, draftInvitationId, navigate]);

  const activeFilterCount = filters.religion.length + filters.region.length + filters.style.length + filters.color.length + filters.badge.length;

  const filtered = useMemo(() => sortTemplates(filterTemplates(templates, filters)), [filters]);
  const nonComingSoonCount = filtered.filter((t) => !t.isComingSoon).length;

  const openPreview = useCallback((id: string) => setPreviewTemplateId(id), []);

  /* Page background with maroon radial gradients */
  const pageBg = `
    radial-gradient(ellipse 100% 50% at 50% 0%, rgba(123,28,46,0.28) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 0% 60%, rgba(74,14,26,0.2) 0%, transparent 40%),
    radial-gradient(ellipse 50% 40% at 100% 80%, rgba(74,14,26,0.2) 0%, transparent 40%),
    hsl(349 68% 4%)
  `;

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      <SEOHead
        title="Wedding Invitation Templates | Shaadi.Digital"
        description="200+ digital wedding invitation templates for every Indian tradition — Hindu, Muslim, Sikh, Christian. Preview free, customise in minutes."
        canonical="https://shaadi.digital/templates"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://shaadi.digital" },
            { "@type": "ListItem", position: 2, name: "Templates", item: "https://shaadi.digital/templates" },
          ],
        })}</script>
      </Helmet>
      
      {/* Grain texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <main className="relative z-[1] max-w-[1200px] mx-auto px-4 md:px-8 pt-24 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-14 relative">
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-secondary/[0.04] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] border border-secondary/[0.025] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-3.5 text-[10px] font-medium tracking-[4.5px] uppercase text-secondary opacity-85 mb-5 relative z-[1]">
            <span className="w-9 h-px bg-gradient-to-r from-transparent to-secondary" />
            <span>Choose Your Style</span>
            <span className="w-9 h-px bg-gradient-to-l from-transparent to-secondary" />
          </div>

          <h1 className="font-serif text-white font-light leading-[1.05] tracking-tight mb-5 relative z-[1]" style={{ fontSize: "clamp(36px, 6.5vw, 72px)" }}>
            Apna style chuniye,
            <br />
            <em className="italic font-normal bg-gradient-to-r from-secondary via-[hsl(40,75%,60%)] to-secondary bg-clip-text text-transparent">
              ise unique banayein
            </em>
          </h1>

          <p className="text-sm text-white/35 font-light tracking-wide leading-relaxed max-w-md mx-auto mb-10 relative z-[1]">
            Har theme aapki love story sunane ke liye design kiya gaya hai
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative z-[1]">
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search templates..."
                className="w-full bg-white/[0.04] border border-secondary/20 rounded-full py-3.5 pl-5 pr-12 text-sm text-white placeholder:text-white/25 font-light tracking-wide outline-none transition-all backdrop-blur-lg focus:border-secondary/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(201,148,26,0.08)]"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              {filters.search && (
                <button onClick={() => setFilters((f) => ({ ...f, search: "" }))} className="absolute right-10 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/40 hover:text-secondary" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-[66px] z-50 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-[hsl(349,68%,4%,0.92)] backdrop-blur-2xl border-b border-secondary/15 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter pills - horizontal scroll on mobile */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1 pb-1">
              {[
                { key: "all", label: "All", icon: "✦" },
                ...FILTER_OPTIONS.religion.slice(0, 4).map((r) => ({ key: r, label: r, icon: r === "Hindu" ? "🪔" : r === "Muslim" ? "☪️" : r === "Sikh" ? "☬" : "✝" })),
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    if (f.key === "all") {
                      setFilters(emptyFilters);
                    } else {
                      setFilters((prev) => ({ ...emptyFilters, religion: [f.key] }));
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all whitespace-nowrap ${
                    (f.key === "all" && activeFilterCount === 0) || (f.key !== "all" && filters.religion.includes(f.key) && filters.religion.length === 1)
                      ? "bg-gradient-to-br from-primary to-[hsl(340,55%,20%)] border border-secondary/35 text-white shadow-[0_2px_12px_rgba(123,28,46,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "bg-transparent border border-secondary/15 text-white/40 hover:border-secondary/40 hover:text-secondary hover:bg-secondary/[0.06]"
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* More filters button */}
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 text-[11px] font-medium text-white/50 hover:border-secondary/40 hover:text-secondary transition-colors shrink-0">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    More
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[hsl(349,68%,6%)] border-secondary/20">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-white">Filter Templates</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterPanelContent filters={filters} setFilters={setFilters} resultCount={filtered.length} />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 text-[11px] font-medium text-white/50 hover:border-secondary/40 hover:text-secondary transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showFilters ? "Hide filters" : "More filters"}
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Result count */}
            <span className="text-[11px] text-white/20 tracking-wide shrink-0 hidden sm:block">
              {nonComingSoonCount} templates found
            </span>
          </div>
        </div>

        {/* Desktop filter panel */}
        {!isMobile && (
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="p-6 rounded-2xl border border-secondary/20 bg-[hsl(349,68%,5%,0.8)] backdrop-blur-lg">
                  <FilterPanelContent filters={filters} setFilters={setFilters} resultCount={filtered.length} onClose={() => setShowFilters(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Template Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} t={t} index={i} onPreview={openPreview} draftTemplateId={draftTemplateId} onSwitchTemplate={handleSwitchTemplate} onGetInTouch={() => setShowContact(true)} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">🪷</div>
            <h3 className="font-serif text-xl font-semibold text-white">No templates match your filters</h3>
            <p className="text-sm text-white/40 font-body mt-1.5">Try removing some filters to see more designs</p>
            <button
              onClick={() => setFilters(emptyFilters)}
              className="mt-4 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-[hsl(345,60%,15%)] hover:bg-secondary transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {previewTemplateId && (
        <TemplatePreviewModal
          templateId={previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
        />
      )}

      {/* Switch confirmation dialog */}
      <Dialog open={!!switchConfirm} onOpenChange={(open) => !open && setSwitchConfirm(null)}>
        <DialogContent className="max-w-md bg-[hsl(349,68%,6%)] border-secondary/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-white">
              Switch to {switchConfirm?.name}?
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-white/50">
              Your invitation details (names, events, photos) will carry over. Only the design will change.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-end">
            <Button variant="outline" onClick={() => setSwitchConfirm(null)} className="rounded-none font-body border-secondary/30 text-white/70 hover:bg-secondary/10">
              Cancel
            </Button>
            <Button onClick={confirmSwitch} className="bg-white text-[hsl(345,60%,15%)] rounded-none font-body hover:bg-secondary">
              Switch Template →
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContactOptionsDialog open={showContact} onOpenChange={setShowContact} />
    </div>
  );
};

export default TemplateGallery;
