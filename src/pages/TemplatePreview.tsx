import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TEMPLATE_REGISTRY, DEMO_CONFIG } from "@/templates";
import { WeddingTemplate } from "@/templates/WeddingTemplate";
import { useAuth } from "@/contexts/AuthContext";

const TemplatePreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const template = templateId ? TEMPLATE_REGISTRY[templateId] : null;

  if (!template) return <Navigate to="/templates" replace />;

  const handleUseTemplate = () => {
    if (user) {
      navigate(`/builder/${templateId}`);
    } else {
      sessionStorage.setItem("selectedTemplateId", templateId!);
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f" }}>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/10" style={{ background: "rgba(15,15,15,0.95)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate("/templates")} className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-body transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-display text-base md:text-lg text-white font-semibold">{template.name}</h1>
        <button onClick={handleUseTemplate} className="hidden md:flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2 text-xs font-body font-medium tracking-wide uppercase rounded-full hover:bg-primary/90 transition-colors">
          Use This Template <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <div className="md:hidden w-16" />
      </div>

      {/* Phone frame */}
      <div className="flex justify-center pt-20 pb-28 px-4">
        <div
          className="w-[375px] max-w-full overflow-hidden"
          style={{
            border: "8px solid #333",
            borderRadius: 40,
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <WeddingTemplate config={DEMO_CONFIG} templateId={templateId!} isPreview />
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-white/10" style={{ background: "rgba(15,15,15,0.95)", backdropFilter: "blur(12px)" }}>
        <button onClick={handleUseTemplate} className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-[13px] font-body font-medium tracking-[1px] uppercase rounded-full hover:bg-primary/90 transition-colors">
          Use This Template <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TemplatePreview;
