import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function TealLuxury({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-amber-700 to-orange-950" motif="🌼" templateId="teal-luxury" />;
}
