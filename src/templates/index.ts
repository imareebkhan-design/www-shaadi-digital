export type { InvitationData, InvitationEvent, TemplateProps } from "./types";
export type { WeddingTemplateConfig, CoupleConfig, EventConfig } from "./types";
export { configToInvitationData, invitationDataToConfig } from "./types";
export { WeddingTemplate } from "./WeddingTemplate";
export { TEMPLATE_REGISTRY, templates, getTemplateById, getTemplateConfigById, FILTER_OPTIONS, DEMO_DATA, DEMO_CONFIG } from "./registry";
export type { TemplateConfig, TemplateMeta, TemplateRegistryEntry, TemplateId } from "./registry";
export default TEMPLATE_REGISTRY;
