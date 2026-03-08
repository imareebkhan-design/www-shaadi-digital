import { useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TemplatePreviewModalProps {
  templateId: string;
  onClose: () => void;
}

const DEMO_URL = "https://vivaah-spark-kit.lovable.app/";

const TemplatePreviewModal = ({ templateId, onClose }: TemplatePreviewModalProps) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBuildForMe = () => {
    const targetPath = templateId ? `/builder/${templateId}` : "/templates";
    onClose();
    window.location.assign(targetPath);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch bg-black/80" onClick={onClose}>
      <div
        className="relative w-full h-full bg-background overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <iframe
          src={DEMO_URL}
          title={`${templateId} template demo`}
          className="w-full h-full border-0"
          allow="autoplay"
        />

        {/* Bottom center pill CTA */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={handleBuildForMe}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-primary/90 hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Build for Me
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
