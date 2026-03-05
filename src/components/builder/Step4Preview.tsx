import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import type { InvitationData } from "@/templates/types";
import { invitationDataToConfig } from "@/templates/types";
import { WeddingTemplate } from "@/templates/WeddingTemplate";

interface Props {
  data: InvitationData;
  templateId: string;
  onProceed: () => void;
  onGoBack: () => void;
}

const viewports = [
  { key: "mobile", label: "Mobile", width: 375, icon: Smartphone },
  { key: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { key: "desktop", label: "Desktop", width: 1024, icon: Monitor },
] as const;

const Step4Preview = ({ data, templateId, onProceed, onGoBack }: Props) => {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const activeVp = viewports.find((v) => v.key === viewport)!;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl text-primary mb-1">Preview Your Invitation</h2>
        <p className="font-body text-sm text-muted-foreground">See how your invitation will look to guests</p>
      </div>

      {/* Viewport toggle */}
      <div className="flex justify-center gap-2">
        {viewports.map((vp) => (
          <button
            key={vp.key}
            onClick={() => setViewport(vp.key)}
            className={`flex items-center gap-1.5 px-4 py-2 border font-body text-xs transition-colors ${
              viewport === vp.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-secondary"
            }`}
          >
            <vp.icon className="w-3.5 h-3.5" />
            {vp.label}
          </button>
        ))}
      </div>

      {/* Preview frame */}
      <div className="flex justify-center">
        <div
          className="border-4 border-foreground/20 rounded-lg overflow-hidden bg-card shadow-xl transition-all duration-300"
          style={{
            width: Math.min(activeVp.width, typeof window !== "undefined" ? window.innerWidth - 80 : 375),
            maxHeight: "70vh",
          }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
            <WeddingTemplate config={invitationDataToConfig(data)} templateId={templateId} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onProceed}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-10 font-body text-base"
        >
          Looks good! Proceed to publish ✨
        </Button>
        <button onClick={onGoBack} className="font-body text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
          Go back and edit
        </button>
      </div>
    </div>
  );
};

export default Step4Preview;
