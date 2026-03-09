import BaseTemplate from "./BaseTemplate";
import type { TemplateProps } from "./types";

export default function SaffronFest({ data, isPreview = false }: TemplateProps) {
  return <BaseTemplate data={data} isPreview={isPreview} gradient="from-orange-500 to-red-600" motif="✺" templateId="saffron-fest" />;
}
