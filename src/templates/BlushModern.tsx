import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function BlushModern({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-pink-400 to-fuchsia-600" motif="△" />;
}
