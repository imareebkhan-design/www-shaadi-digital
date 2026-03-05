import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { templates, TemplateData } from "@/data/templates";
import { useAuth } from "@/contexts/AuthContext";

const filters = ["All", "North Indian", "South Indian", "Muslim", "Sikh", "Modern"];

const TemplateGallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();

  const filtered = activeFilter === "All"
    ? templates
    : templates.filter((t) => t.community === activeFilter);

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

          {/* Filter bar */}
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
                className="group border border-border hover:border-secondary bg-card overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Preview panel */}
                <div className={`aspect-[3/4] bg-gradient-to-br ${t.gradient} relative flex items-center justify-center p-6`}>
                  {/* Decorative corners */}
                  <span className="absolute top-4 left-4 text-2xl text-white/15">{t.motif}</span>
                  <span className="absolute top-4 right-4 text-2xl text-white/15">{t.motif}</span>
                  <span className="absolute bottom-4 left-4 text-2xl text-white/15">{t.motif}</span>
                  <span className="absolute bottom-4 right-4 text-2xl text-white/15">{t.motif}</span>

                  <div className="text-center">
                    <p className="font-serif italic text-white/50 text-xs tracking-widest uppercase mb-4">
                      Together with their families
                    </p>
                    <p className="font-display text-3xl font-bold text-white mb-1">{t.bride}</p>
                    <p className="font-serif italic text-secondary text-xl my-2">&</p>
                    <p className="font-display text-3xl font-bold text-white">{t.groom}</p>
                    <div className="w-10 h-px bg-secondary/60 mx-auto my-5" />
                    <p className="font-body text-white/50 text-xs tracking-wider">{t.date}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="font-body text-xs">{t.community}</Badge>
                    <Badge variant="outline" className="font-body text-xs">{t.style}</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-body text-xs gap-1.5"
                      onClick={() => navigate(`/preview/${t.id}`)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 font-body text-xs"
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
