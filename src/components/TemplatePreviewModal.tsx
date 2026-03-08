import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles } from "lucide-react";

interface TemplatePreviewModalProps {
  templateId: string;
  onClose: () => void;
}

const DEMO_URL = "https://vivaah-visions-kit.lovable.app";

const TemplatePreviewModal = ({ templateId, onClose }: TemplatePreviewModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBuildForMe = () => {
    onClose();
    navigate(`/templates`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch bg-black/80" onClick={onClose}>
      <div
        className="relative w-full h-full bg-background overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute top-3 right-3 z-[110] flex items-center gap-2">
          <button
            onClick={handleBuildForMe}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-none bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Build for Me
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <iframe
          src={DEMO_URL}
          title={`${templateId} template demo`}
          className="w-full h-full border-0"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
