import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["Names", "Events", "Photo", "Preview", "Publish"];

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full bg-card border-b border-border px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</span>
          <span className="font-body text-xs font-medium text-primary">{stepLabels[currentStep - 1]}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 transition-colors duration-300 ${
                i + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
