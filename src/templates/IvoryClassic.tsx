import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function IvoryClassic({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-[#5c4a2f] to-[#3a2e1a]" motif="❧" templateId="ivory-classic" />;
}
