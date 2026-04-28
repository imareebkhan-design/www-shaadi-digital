/**
 * Module Registry
 * ───────────────
 * Central registry of all available modules
 */

import type { ModuleRegistry } from "./modules";
import { StandardEventModule, MinimalistEventModule, LuxuryEventModule } from "./events";
import { StandardMediaModule, LuxuryMediaModule, MinimalistMediaModule } from "./media";
import { StandardCeremonyModule, RegionalCeremonyModule } from "./ceremony";
import { StandardLanguageModule } from "./language";
import { StandardCustomSectionModule, LuxuryCustomSectionModule, MinimalistCustomSectionModule } from "./custom";

/**
 * Global Module Registry
 * Maps module IDs to their implementations
 */
export const MODULE_REGISTRY: Record<string, any> = {
  // Event Modules
  "events.standard": StandardEventModule,
  "events.minimalist": MinimalistEventModule,
  "events.luxury": LuxuryEventModule,

  // Media Modules
  "media.standard": StandardMediaModule,
  "media.luxury": LuxuryMediaModule,
  "media.minimalist": MinimalistMediaModule,

  // Ceremony Modules
  "ceremony.standard": StandardCeremonyModule,
  "ceremony.regional": RegionalCeremonyModule,

  // Language Modules
  "language.standard": StandardLanguageModule,

  // Custom Section Modules
  "custom.standard": StandardCustomSectionModule,
  "custom.luxury": LuxuryCustomSectionModule,
  "custom.minimalist": MinimalistCustomSectionModule,
};

/**
 * Get a module by ID
 */
export function getModule<T>(moduleId: string): T {
  const module = MODULE_REGISTRY[moduleId];
  if (!module) {
    throw new Error(`Module not found: ${moduleId}`);
  }
  return module as T;
}

/**
 * Check if a module exists
 */
export function hasModule(moduleId: string): boolean {
  return moduleId in MODULE_REGISTRY;
}