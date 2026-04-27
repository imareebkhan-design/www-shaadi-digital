export type { TemplateConfig } from "@/templates";
export { templates, FILTER_OPTIONS, getTemplateById, getTemplateConfigById } from "@/templates";

export const getCeremonyLabel = (community: string): string => {
  switch (community) {
    case "Muslim":
      return "Nikah";
    case "Sikh":
      return "Anand Karaj";
    case "South Indian":
      return "Kalyanam";
    default:
      return "Vivah";
  }
};
