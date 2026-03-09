import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function PearlNikah({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-stone-600 to-stone-800" motif="◆" templateId="pearl-nikah" />;
}
