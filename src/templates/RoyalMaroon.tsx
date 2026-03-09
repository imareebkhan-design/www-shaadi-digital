import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function RoyalMaroon({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-[#7B1C2E] to-[#4a1019]" motif="✦" templateId="royal-maroon" />;
}
