import { Badge } from "@/components/ui/badge";

const templates = [
  { id: "royal-rajput", name: "Royal Rajput", community: "North Indian", tone: "Traditional", color: "Maroon & Gold" },
  { id: "kerala-elegance", name: "Kerala Elegance", community: "South Indian", tone: "Modern", color: "Green & White" },
  { id: "punjabi-celebration", name: "Punjabi Celebration", community: "Sikh", tone: "Vibrant", color: "Orange & Pink" },
  { id: "mughal-garden", name: "Mughal Garden", community: "Muslim", tone: "Luxury", color: "Emerald & Gold" },
  { id: "minimalist-bliss", name: "Minimalist Bliss", community: "Universal", tone: "Minimal", color: "Cream & Black" },
  { id: "floral-dreams", name: "Floral Dreams", community: "Universal", tone: "Romantic", color: "Blush & Sage" },
];

const palette: Record<string, string> = {
  "Maroon & Gold": "bg-primary",
  "Green & White": "bg-emerald-700",
  "Orange & Pink": "bg-orange-500",
  "Emerald & Gold": "bg-emerald-800",
  "Cream & Black": "bg-foreground",
  "Blush & Sage": "bg-pink-400",
};

const TemplateGallerySection = () => (
  <section id="templates" className="section-padding bg-card">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">Curated Collection</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        Stunning Templates
      </h2>
      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {templates.map((t) => (
          <div
            key={t.id}
            className="group border border-border hover:border-secondary bg-card overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            {/* Mock template preview */}
            <div className={`aspect-[3/4] ${palette[t.color] || "bg-primary"} relative flex items-center justify-center`}>
              <div className="text-center p-6">
                <p className="font-serif italic text-card/70 text-sm mb-2">You are cordially invited</p>
                <p className="font-display text-2xl md:text-3xl font-bold text-card mb-1">Priya</p>
                <p className="font-serif italic text-secondary text-lg">&</p>
                <p className="font-display text-2xl md:text-3xl font-bold text-card">Arjun</p>
                <div className="w-12 h-px bg-secondary mx-auto my-4" />
                <p className="font-body text-card/60 text-xs">15 December 2026 · Jaipur</p>
              </div>
            </div>
            <div className="p-4 text-left">
              <h3 className="font-display text-base font-semibold text-foreground mb-1">{t.name}</h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="font-body text-xs">{t.community}</Badge>
                <Badge variant="outline" className="font-body text-xs">{t.tone}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <a href="/templates" className="font-body text-sm text-primary hover:text-secondary transition-colors underline underline-offset-4">
          View All Templates →
        </a>
      </div>
    </div>
  </section>
);

export default TemplateGallerySection;
