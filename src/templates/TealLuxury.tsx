import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function TealLuxury({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-teal-700 to-teal-950" motif="❖" />;
}
