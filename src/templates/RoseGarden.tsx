import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function RoseGarden({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-rose-700 to-pink-900" motif="✿" />;
}
