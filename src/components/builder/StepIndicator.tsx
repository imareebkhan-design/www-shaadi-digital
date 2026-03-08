import { Check, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { TEMPLATE_REGISTRY } from "@/templates";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  templateId?: string;
  onChangeTemplate?: () => void;
}

const stepLabels = ["Names", "Events", "Photos", "Preview", "Publish"];

const StepIndicator = ({ currentStep, totalSteps, templateId, onChangeTemplate }: StepIndicatorProps) => {
  const isMobile = useIsMobile();
  const templateEntry = templateId ? TEMPLATE_REGISTRY[templateId] : null;

  return (
    <div className="w-full bg-card border-b border-border px-6 py-5">
      <div className="max-w-xl mx-auto relative">
        {/* Step circles with connecting lines */}
        <div className="flex items-center justify-between relative">
          {/* Connecting line behind circles */}
          <div className="absolute top-4 left-0 right-0 h-px bg-border z-0" />
          <div
            className="absolute top-4 left-0 h-px bg-secondary z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={i} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1 : 0.9,
                    backgroundColor: isCompleted
                      ? "hsl(var(--secondary))"
                      : isCurrent
                      ? "hsl(var(--primary))"
                      : "hsl(var(--card))",
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold border-2 transition-colors ${
                    isCompleted
                      ? "border-secondary text-secondary-foreground"
                      : isCurrent
                      ? "border-primary text-primary-foreground shadow-md"
                      : "border-border text-muted-foreground"
                  }`}
                  style={isCurrent ? { boxShadow: "0 0 0 3px hsl(var(--primary) / 0.15)" } : {}}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </motion.div>
                <span
                  className={`font-body text-[10px] mt-1.5 transition-colors ${
                    isCurrent
                      ? "text-primary font-semibold"
                      : isCompleted
                      ? "text-secondary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepLabels[i]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Change Template button — positioned below steps */}
        {onChangeTemplate && (
          <div className="flex items-center justify-center mt-4 pt-3 border-t border-border/50">
            {isMobile ? (
              <button
                onClick={onChangeTemplate}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:border-primary transition-colors"
                title="Change Template"
              >
                <LayoutGrid className="w-4 h-4 text-primary" />
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Thumbnail */}
                {templateEntry && (
                  <div
                    className="w-6 h-6 rounded shrink-0"
                    style={{ background: templateEntry.thumbnail_gradient }}
                  />
                )}
                <span className="text-xs font-body" style={{ color: "#8a6a5a" }}>
                  {templateEntry?.name || templateId}
                </span>
                <button
                  onClick={onChangeTemplate}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-body font-medium transition-all duration-200"
                  style={{
                    border: "1px solid #d4c5b8",
                    color: "#7B1C2E",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#7B1C2E";
                    e.currentTarget.style.backgroundColor = "rgba(123,28,46,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d4c5b8";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  ⟳ Change Template
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepIndicator;
