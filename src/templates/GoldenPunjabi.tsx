import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function GoldenPunjabi({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-amber-600 to-orange-800" motif="☬" />;
}
