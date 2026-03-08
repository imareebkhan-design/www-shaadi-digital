import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["Names", "Events", "Photos", "Preview", "Publish"];
const stepIcons = ["💍", "📅", "📸", "👁", "🚀"];

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full bg-card border-b border-border px-6 py-5">
      <div className="max-w-xl mx-auto">
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
      </div>
    </div>
  );
};

export default StepIndicator;
