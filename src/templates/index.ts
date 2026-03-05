import { lazy, ComponentType } from "react";
import type { TemplateProps } from "./types";

export type { InvitationData, InvitationEvent, TemplateProps } from "./types";

const templateMap: Record<string, ComponentType<TemplateProps>> = {
  "template-01": lazy(() => import("./RoyalMaroon")),
  "template-02": lazy(() => import("./EmeraldSouth")),
  "template-03": lazy(() => import("./MidnightBlue")),
  "template-04": lazy(() => import("./GoldenPunjabi")),
  "template-05": lazy(() => import("./RoseGarden")),
  "template-06": lazy(() => import("./TealLuxury")),
  "template-07": lazy(() => import("./IvoryClassic")),
  "template-08": lazy(() => import("./SaffronFest")),
  "template-09": lazy(() => import("./PearlNikah")),
  "template-10": lazy(() => import("./BlushModern")),
};

export const getTemplateComponent = (templateId: string): ComponentType<TemplateProps> | null =>
  templateMap[templateId] || null;

export default templateMap;
