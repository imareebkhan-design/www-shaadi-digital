import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TEMPLATE_REGISTRY, DEMO_DATA } from "@/templates";
import type { TemplateRegistryEntry } from "@/templates";
import { useAuth } from "@/contexts/AuthContext";

const filters = ["All", "North Indian", "South Indian", "Sikh", "Muslim", "Modern"];

const TemplateThumbnail = ({ entry }: { entry: TemplateRegistryEntry }) => {
  const Component = entry.component;
  return (
    <div style={{ width: "100%", paddingBottom: "133%", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "400%",
          height: "400%",
          transform: "scale(0.25)",
          transformOrigin: "top left",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Component data={DEMO_DATA} isPreview={true} />
      </div>
    </div>
  );
};

const TemplateGallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();

  const entries = useMemo(() => Object.values(TEMPLATE_REGISTRY), []);

  const filtered = activeFilter === "All"
    ? entries
    : entries.filter((t) => t.community === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 md:pt-28 section-padding">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-serif italic text-secondary text-base mb-2">Find Your Perfect Design</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Template Gallery
            </h1>
            <div className="gold-divider mb-6" />
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              Every template is crafted for Indian weddings — authentic to your community, beautiful on every device.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-body text-sm px-5 py-2 border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="group border border-border hover:border-secondary bg-card overflow-hidden transition-all duration-300 hover:shadow-lg relative"
              >
                {/* Premium badge */}
                {t.is_premium && (
                  <div className="absolute top-3 right-3 z-10 bg-secondary text-secondary-foreground px-2.5 py-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider">
                    <Crown className="w-3 h-3" /> Premium
                  </div>
                )}

                {/* Live thumbnail */}
                <TemplateThumbnail entry={t} />

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t.name}</h3>
                  <div className="flex gap-2 mb-1">
                    <Badge variant="secondary" className="font-body text-xs">{t.community}</Badge>
                    <Badge variant="outline" className="font-body text-xs">{t.tone}</Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-4">{t.description}</p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-body text-xs gap-1.5 rounded-none"
                      onClick={() => navigate(`/templates/preview/${t.id}`)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 font-body text-xs rounded-none"
                      onClick={() => {
                        if (user) {
                          navigate(`/builder/${t.id}`);
                        } else {
                          sessionStorage.setItem("selectedTemplateId", t.id);
                          navigate("/signup");
                        }
                      }}
                    >
                      Use This Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-xl text-muted-foreground">No templates found for this filter.</p>
              <button onClick={() => setActiveFilter("All")} className="font-body text-sm text-primary underline underline-offset-4 mt-3">
                Show all templates
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateGallery;
