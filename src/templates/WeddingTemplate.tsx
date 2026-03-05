import { TEMPLATE_REGISTRY } from "./index";
import type { WeddingTemplateConfig } from "./types";
import { configToInvitationData } from "./types";

interface WeddingTemplateProps {
  config: WeddingTemplateConfig;
  templateId?: string;
  isPreview?: boolean;
}

/**
 * Public-facing wrapper component.
 *
 * Usage:
 * ```tsx
 * import { WeddingTemplate } from "@/templates/WeddingTemplate";
 * import type { WeddingTemplateConfig } from "@/templates/types";
 *
 * const config: WeddingTemplateConfig = {
 *   couple: { brideName: "Neha", groomName: "Rahul", brideFamily: "...", groomFamily: "..." },
 *   weddingDate: "2027-02-14",
 *   events: [{ type: "ceremony", name: "Vivah", date: "2027-02-14", time: "21:00", venueName: "...", venueAddress: "..." }],
 * };
 *
 * <WeddingTemplate config={config} templateId="royal-maroon" />
 * ```
 */
const WeddingTemplate = ({ config, templateId = "royal-maroon", isPreview = false }: WeddingTemplateProps) => {
  const entry = TEMPLATE_REGISTRY[templateId];
  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Template "{templateId}" not found.</p>
      </div>
    );
  }

  const TemplateComponent = entry.component;
  const data = configToInvitationData(config);

  return <TemplateComponent data={data} isPreview={isPreview} />;
};

export default WeddingTemplate;
export { WeddingTemplate };
