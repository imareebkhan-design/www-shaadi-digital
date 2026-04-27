import { useState, useMemo } from "react";
import { X, ArrowLeft, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { templates as allTemplates } from "@/templates";
import { TEMPLATE_REGISTRY } from "@/templates";
import { WeddingTemplate } from "@/templates/WeddingTemplate";
import { invitationDataToConfig } from "@/templates/types";
import type { InvitationData } from "@/templates/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface TemplateSwitcherModalProps {
  currentTemplateId: string;
  formData: InvitationData;
  onSwitch: (newTemplateId: string) => void;
  onClose: () => void;
}

const TemplateSwitcherModal = ({
  currentTemplateId,
  formData,
  onSwitch,
  onClose,
}: TemplateSwitcherModalProps) => {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobilePreviewId, setMobilePreviewId] = useState<string | null>(null);

  // Selected takes priority over hovered
  const previewTemplateId = selectedId || hoveredId || currentTemplateId;

  // Only show templates that exist in the registry (renderable)
  const availableTemplates = useMemo(
    () => allTemplates.filter((t) => !t.isComingSoon || TEMPLATE_REGISTRY[t.id]),
    []
  );

  const isDifferent = previewTemplateId !== currentTemplateId;

  const handleConfirmSwitch = () => {
    const targetId = mobilePreviewId || previewTemplateId;
    if (targetId && targetId !== currentTemplateId) {
      onSwitch(targetId);
    }
  };

  // Mobile: full-screen preview
  if (isMobile && mobilePreviewId) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button
            onClick={() => setMobilePreviewId(null)}
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="font-display text-sm text-foreground">
            {TEMPLATE_REGISTRY[mobilePreviewId]?.name || mobilePreviewId}
          </span>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <WeddingTemplate
            config={invitationDataToConfig(formData)}
            templateId={mobilePreviewId}
          />
        </div>
        <div className="p-4 border-t border-border bg-card flex gap-3">
          <button
            onClick={() => setMobilePreviewId(null)}
            className="flex-1 py-3 text-sm font-body text-muted-foreground"
          >
            ← Back to templates
          </button>
          {mobilePreviewId !== currentTemplateId ? (
            <button
              onClick={handleConfirmSwitch}
              className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-body font-medium rounded-none"
            >
              Use This Template →
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-3 bg-muted text-muted-foreground text-sm font-body rounded-none cursor-not-allowed"
            >
              Already using this
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-stretch"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full h-full bg-background flex flex-col"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to builder
          </button>
          <div className="text-center">
            <h2 className="font-display text-lg md:text-[22px] font-semibold text-foreground">
              Switch Template
            </h2>
            <p className="text-[13px] font-body" style={{ color: "#8a6a5a" }}>
              Your details will carry over to any template you choose
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className={`flex-1 overflow-hidden flex ${isMobile ? "flex-col" : ""}`}>
          {/* Left: Template grid */}
          <div
            className={`${isMobile ? "flex-1" : "w-2/5"} overflow-y-auto p-5 border-r border-border`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTemplates.map((t) => {
                const isCurrent = t.id === currentTemplateId;
                const isSelected = selectedId === t.id;
                const isHovered = hoveredId === t.id && !selectedId;
                const isComingSoon = t.isComingSoon && !TEMPLATE_REGISTRY[t.id];

                return (
                  <button
                    key={t.id}
                    disabled={isComingSoon}
                    onClick={() => {
                      if (isMobile) {
                        setMobilePreviewId(t.id);
                      } else {
                        setSelectedId(t.id === selectedId ? null : t.id);
                      }
                    }}
                    onMouseEnter={() => !isMobile && !isComingSoon && !selectedId && setHoveredId(t.id)}
                    onMouseLeave={() => !isMobile && setHoveredId(null)}
                    className={`relative rounded-xl overflow-hidden text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? "border-secondary ring-2 ring-secondary/30"
                        : isCurrent
                        ? "border-primary ring-2 ring-primary/20"
                        : isHovered
                        ? "border-secondary/60"
                        : "border-transparent hover:border-border"
                    } ${isComingSoon ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer"}`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-full flex items-center justify-center"
                      style={{
                        aspectRatio: "9/16",
                        background: t.previewGradient,
                      }}
                    >
                      {!isComingSoon && (
                        <div className="text-center px-3">
                          <div className="font-display text-[11px] font-semibold text-white leading-tight">
                            {formData.bride_name || t.sampleData.brideName}
                            <br />
                            <span className="font-serif italic text-secondary text-sm">
                              &
                            </span>
                            <br />
                            {formData.groom_name || t.sampleData.groomName}
                          </div>
                        </div>
                      )}
                      {isComingSoon && (
                        <span className="text-[10px] font-body text-white/60 uppercase tracking-wider">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {/* Name + badge */}
                    <div className="p-2 bg-card">
                      <p className="font-body text-[11px] font-medium text-foreground truncate">
                        {t.name}
                      </p>
                      {isCurrent && (
                        <span className="inline-block mt-0.5 text-[9px] font-body font-semibold uppercase tracking-wider text-primary">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Live preview (desktop only) */}
          {!isMobile && (
            <div className="w-3/5 overflow-y-auto bg-muted/20 flex flex-col items-center py-6">
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                Preview with your data
              </p>
              <div
                className="w-full max-w-[500px] mx-auto overflow-hidden rounded-lg border border-border shadow-sm"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                <div
                  className="overflow-y-auto"
                  style={{
                    width: 909,
                    transform: "scale(0.55)",
                    transformOrigin: "top left",
                    height: "calc((100vh - 200px) / 0.55)",
                  }}
                >
                  <WeddingTemplate
                    config={invitationDataToConfig(formData)}
                    templateId={previewTemplateId}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="text-sm font-body hover:underline transition-colors"
            style={{ color: "#8a6a5a" }}
          >
            ← Keep Current Template
          </button>
          {isDifferent || (isMobile && mobilePreviewId) ? (
            <button
              onClick={handleConfirmSwitch}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-body font-medium rounded-none hover:bg-primary/90 transition-colors"
            >
              Use This Template →
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2.5 bg-muted text-muted-foreground text-sm font-body rounded-none cursor-not-allowed"
            >
              Already using this
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateSwitcherModal;
