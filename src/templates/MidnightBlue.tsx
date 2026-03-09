import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function MidnightBlue({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-slate-800 to-slate-950" motif="◇" templateId="midnight-blue" />;
}
