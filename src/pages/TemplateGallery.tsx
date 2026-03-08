import { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TemplatePreviewModal from "@/components/TemplatePreviewModal";
import { templates, FILTER_OPTIONS, type TemplateConfig } from "@/data/templates";
import { Search, SlidersHorizontal, X, Bell, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    // Coming soon always shows
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

/* ── Filter Chip ── */
const Chip = ({ label, active, onClick, dot }: { label: string; active: boolean; onClick: () => void; dot?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-body font-medium transition-all duration-200 border ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-transparent text-primary border-primary/30 hover:border-primary/60"
    }`}
  >
    {dot && <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ background: dot }} />}
    {label}
  </button>
);

/* ── Template Card ── */
const TemplateCard = ({ t, index, onPreview }: { t: TemplateConfig; index: number; onPreview: (id: string) => void }) => {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [showNotify, setShowNotify] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`✓ We'll notify you when ${t.name} launches!`);
    setShowNotify(false);
    setNotifyEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flex flex-col rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(123,28,46,0.2)] group ${
        t.isComingSoon ? "opacity-[0.85]" : ""
      }`}
    >
      {/* Preview area */}
      <div
        className="relative w-full overflow-hidden cursor-pointer"
        style={{ aspectRatio: "16/9", background: t.previewGradient }}
        onClick={() => !t.isComingSoon && onPreview(t.id)}
      >
        {/* Mandala pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='55' fill='none' stroke='rgba(201,148,26,0.2)' stroke-width='0.5'/%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='rgba(201,148,26,0.15)' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "80%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />

        {/* Sample names on preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[1]">
          <div className={`font-display text-base font-semibold leading-tight text-center ${t.id === "chapel-white" ? "text-foreground" : "text-white"}`}>
            {t.sampleData.brideName} <span className="font-serif italic text-secondary">&</span> {t.sampleData.groomName}
          </div>
          <div className={`text-[10px] tracking-widest mt-1 ${t.id === "chapel-white" ? "text-muted-foreground" : "text-white/40"}`}>
            {t.sampleData.date}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 z-[3] flex gap-1.5">
          {t.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
              ⭐ Featured
            </span>
          )}
          {t.isNew && !t.isComingSoon && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-700/90 text-green-100 backdrop-blur-sm">
              ✦ New
            </span>
          )}
          {t.isPremium && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
              👑 Premium
            </span>
          )}
        </div>

        {/* Coming Soon overlay */}
        {t.isComingSoon && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-black/40">
            <span className="font-display text-lg font-semibold text-secondary animate-pulse">Coming Soon</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{t.name}</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {t.region.slice(0, 1).map((r) => (
            <span key={r} className="text-[10px] tracking-[0.8px] uppercase px-2 py-0.5 rounded-full bg-[hsl(var(--gold-pale))] text-secondary font-medium">
              {r}
            </span>
          ))}
          {t.style.slice(0, 1).map((s) => (
            <span key={s} className="text-[10px] tracking-[0.8px] uppercase px-2 py-0.5 rounded-full bg-[hsl(var(--gold-pale))] text-secondary font-medium">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body line-clamp-2">{t.tagline}</p>

        <div className="mt-auto pt-2">
          {t.isComingSoon ? (
            <>
              {!showNotify ? (
                <button
                  onClick={() => setShowNotify(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
                >
                  <Bell className="w-3 h-3" /> Notify me
                </button>
              ) : (
                <form onSubmit={handleNotify} className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 min-w-0 px-3 py-1.5 text-xs rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button type="submit" className="px-3 py-1.5 text-xs rounded-full bg-primary text-primary-foreground font-medium shrink-0">
                    Notify
                  </button>
                </form>
              )}
            </>
          ) : (
            <button
              onClick={() => onPreview(t.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ✦ Preview Free →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Filter Panel Content (shared between desktop panel and mobile sheet) ── */
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
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-body hidden md:block">Religion</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.religion.map((r) => (
            <Chip key={r} label={r} active={filters.religion.includes(r)} onClick={() => setFilters((f) => ({ ...f, religion: toggleFilter(f.religion, r) }))} />
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-body hidden md:block">Region</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.region.map((r) => (
            <Chip key={r} label={r} active={filters.region.includes(r)} onClick={() => setFilters((f) => ({ ...f, region: toggleFilter(f.region, r) }))} />
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-body hidden md:block">Style</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.style.map((s) => (
            <Chip key={s} label={s} active={filters.style.includes(s)} onClick={() => setFilters((f) => ({ ...f, style: toggleFilter(f.style, s) }))} />
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-body hidden md:block">Color</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.colorFamily.map((c) => (
            <Chip key={c.label} label={c.label} dot={c.dot} active={filters.color.includes(c.label)} onClick={() => setFilters((f) => ({ ...f, color: toggleFilter(f.color, c.label) }))} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-body hidden md:block">Badges</h4>
        <div className="flex flex-wrap gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
          {FILTER_OPTIONS.badge.map((b) => (
            <Chip key={b} label={`${b === "Featured" ? "⭐" : b === "New" ? "✦" : "👑"} ${b}`} active={filters.badge.includes(b)} onClick={() => setFilters((f) => ({ ...f, badge: toggleFilter(f.badge, b) }))} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          onClick={() => setFilters(emptyFilters)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          Clear all filters
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
  const [showFilters, setShowFilters] = useState(true);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const activeFilterCount = filters.religion.length + filters.region.length + filters.style.length + filters.color.length + filters.badge.length;

  const filtered = useMemo(() => sortTemplates(filterTemplates(templates, filters)), [filters]);
  const nonComingSoonCount = filtered.filter((t) => !t.isComingSoon).length;

  const openPreview = useCallback((id: string) => setPreviewTemplateId(id), []);

  return (
    <div className="min-h-screen bg-background">
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
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-[clamp(28px,5vw,48px)] font-semibold leading-tight text-foreground">
            Apna style chuniye...
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-body">
            200+ designs for every Indian wedding tradition
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-body"
            />
            {filters.search && (
              <button onClick={() => setFilters((f) => ({ ...f, search: "" }))} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-medium font-body text-foreground hover:border-primary transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Filter Templates</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterPanelContent filters={filters} setFilters={setFilters} resultCount={filtered.length} />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-medium font-body text-foreground hover:border-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Hide filters" : "Show filters"}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs text-muted-foreground font-body">
            Showing {nonComingSoonCount} of {templates.filter((t) => !t.isComingSoon).length} templates
            {filtered.filter((t) => t.isComingSoon).length > 0 && ` + ${filtered.filter((t) => t.isComingSoon).length} coming soon`}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(emptyFilters)}
              className="text-xs text-primary underline hover:text-primary/80 transition-colors font-body"
            >
              × Clear all filters
            </button>
          )}
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
                className="overflow-hidden mb-6"
              >
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <FilterPanelContent filters={filters} setFilters={setFilters} resultCount={filtered.length} onClose={() => setShowFilters(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Template Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} t={t} index={i} onPreview={openPreview} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">🪷</div>
            <h3 className="font-display text-xl font-semibold text-foreground">No templates match your filters</h3>
            <p className="text-sm text-muted-foreground font-body mt-1.5">Try removing some filters to see more designs</p>
            <button
              onClick={() => setFilters(emptyFilters)}
              className="mt-4 px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
    </div>
  );
};

export default TemplateGallery;
