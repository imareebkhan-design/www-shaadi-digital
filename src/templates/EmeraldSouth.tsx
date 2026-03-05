import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function EmeraldSouth({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-emerald-800 to-emerald-950" motif="❂" />;
}
