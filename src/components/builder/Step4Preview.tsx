import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, ArrowRight, ChevronLeft, Eye } from "lucide-react";
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
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
          <Eye className="w-4.5 h-4.5 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">Preview Your Invitation</h2>
        <p className="font-body text-sm text-muted-foreground">See exactly how your guests will experience it</p>
      </div>

      {/* Viewport toggle */}
      <div className="flex justify-center">
        <div className="inline-flex border border-border bg-muted/50 p-1 gap-0.5">
          {viewports.map((vp) => (
            <button
              key={vp.key}
              onClick={() => setViewport(vp.key)}
              className={`flex items-center gap-1.5 px-4 py-2 font-body text-xs transition-all ${
                viewport === vp.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <vp.icon className="w-3.5 h-3.5" />
              {vp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex justify-center">
        <div
          className="border-2 border-foreground/10 overflow-hidden bg-card transition-all duration-300"
          style={{
            width: Math.min(activeVp.width, typeof window !== "undefined" ? window.innerWidth - 80 : 375),
            maxHeight: "65vh",
            borderRadius: viewport === "mobile" ? 24 : 8,
            boxShadow: "0 20px 50px -12px hsl(var(--foreground) / 0.12)",
          }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "65vh" }}>
            <WeddingTemplate config={invitationDataToConfig(data)} templateId={templateId} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          onClick={onProceed}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-10 font-body text-base gap-2 shadow-md"
        >
          Looks perfect! Proceed <ArrowRight className="w-4 h-4" />
        </Button>
        <button onClick={onGoBack} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Go back and edit
        </button>
      </div>
    </div>
  );
};

export default Step4Preview;
