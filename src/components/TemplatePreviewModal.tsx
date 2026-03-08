import { useEffect } from "react";
import { X } from "lucide-react";

interface TemplatePreviewModalProps {
  templateId: string;
  onClose: () => void;
}

const DEMO_URL = "https://vivaah-visions-kit.lovable.app";

const TemplatePreviewModal = ({ templateId, onClose }: TemplatePreviewModalProps) => {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch bg-black/80" onClick={onClose}>
      <div
        className="relative w-full h-full bg-background overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Iframe preview */}
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
