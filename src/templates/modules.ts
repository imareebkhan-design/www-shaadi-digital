/**
 * Module System for Wedding Invitation Builder
 * ─────────────────────────────────────────────
 * Reusable modules that encapsulate template-specific logic.
 * Each module handles a specific aspect of the invitation building process.
 */

export type WeddingType = "hindu" | "sikh" | "muslim" | "christian" | "other";

export interface ModuleContext {
  weddingType: WeddingType;
  formData: any;
  templateId: string;
}

/**
 * Event Module
 * Handles event types, visibility, and configuration per wedding type
 */
export interface EventModule {
  getVisibleEventTypes(weddingType: WeddingType): string[];
  getEventLabels(): Record<string, { name: string; emoji: string; defaultTagline: string; defaultDescription: string }>;
  getCeremonyLabel(weddingType: WeddingType): string;
  isEventVisible(eventType: string, weddingType: WeddingType): boolean;
}

/**
 * Media Module
 * Handles media uploads, galleries, and template-specific media requirements
 */
export interface MediaModule {
  getRequiredMediaFields(): string[];
  getOptionalMediaFields(): string[];
  validateMediaField(fieldName: string, value: any): boolean;
  getMediaFieldLabels(): Record<string, string>;
}

/**
 * Ceremony Module
 * Handles ceremony-specific naming and configuration
 */
export interface CeremonyModule {
  getCeremonyName(weddingType: WeddingType): string;
  getSupportedWeddingTypes(): WeddingType[];
  getDefaultEvents(weddingType: WeddingType): any[];
}

/**
 * Language Module
 * Handles language-specific content and translations
 */
export interface LanguageModule {
  getSupportedLanguages(): string[];
  getDefaultContent(language: string): Record<string, string>;
  translateField(fieldName: string, value: string, language: string): string;
}

/**
 * Custom Section Module
 * Handles template-specific sections and custom fields
 */
export interface CustomSectionModule {
  getCustomSections(): Array<{ id: string; label: string; required: boolean; component: string }>;
  getCustomFields(): Record<string, { type: string; label: string; required: boolean; validation?: any }>;
  validateCustomFields(data: any): Record<string, string>;
}

/**
 * Module Registry
 * Central registry of all available modules
 */
export interface ModuleRegistry {
  events: EventModule;
  media: MediaModule;
  ceremony: CeremonyModule;
  language: LanguageModule;
  custom: CustomSectionModule;
}

/**
 * Template Modules Configuration
 * Defines which modules a template uses and their configuration
 */
export interface TemplateModules {
  events?: string; // Module ID
  media?: string;
  ceremony?: string;
  language?: string;
  custom?: string;
}