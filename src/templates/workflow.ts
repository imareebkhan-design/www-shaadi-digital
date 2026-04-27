/**
 * Template Workflow Engine
 * ─────────────────────────
 * Defines how each template controls:
 * - Step sequence and visibility
 * - Event types and visibility per template
 * - Field requirements and validation per template
 * - Payment models per template
 * - Wedding type handling per template
 */

export type StepId = "names" | "events" | "photos" | "preview" | "publish";

export interface StepConfig {
  id: StepId;
  label: string;
  visible: boolean;
  required: boolean;
  /** Fields that must be non-empty/valid for this step */
  requiredFields?: string[];
  /** Show this step only if condition is true */
  condition?: (data: any) => boolean;
}

export interface EventTypeConfig {
  id: string;
  label: string;
  emoji: string;
  defaultTagline: string;
  defaultDescription: string;
  /** Whether this event type is shown by default for this template */
  visibleByDefault: boolean;
}

export interface FieldVisibilityConfig {
  [fieldName: string]: {
    visible: boolean;
    required: boolean;
    /** Show field only if condition is true */
    condition?: (data: any) => boolean;
  };
}

export interface ValidationRule {
  field: string;
  message: string;
  validate: (value: any) => boolean;
}

export interface PaymentPlanConfig {
  id: "basic" | "premium" | "elite";
  razorpayId: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  available: boolean;
}

export interface TemplateWorkflow {
  /** Unique identifier */
  templateId: string;

  /** Step sequence for this template */
  steps: StepConfig[];

  /** Event types available in this template */
  eventTypes: EventTypeConfig[];

  /** Field visibility rules (e.g., dresscode, music, etc.) */
  fieldVisibility: FieldVisibilityConfig;

  /** Custom validation rules for this template */
  validationRules: ValidationRule[];

  /** Payment plans available for this template */
  paymentPlans: PaymentPlanConfig[];

  /** Wedding type handling */
  ceremonyNameByWeddingType: Record<string, string>;
  visibleEventsByWeddingType: Record<string, string[]>;

  /** Whether template supports template switching after initialization */
  allowTemplateSwitching: boolean;
}

/**
 * Factory: Create a standard 5-step workflow
 * (most templates will use this)
 */
export const createStandardWorkflow = (templateId: string): TemplateWorkflow => ({
  templateId,
  steps: [
    { id: "names", label: "Names", visible: true, required: true, requiredFields: ["bride_name", "groom_name"] },
    { id: "events", label: "Events", visible: true, required: true, requiredFields: ["events"] },
    { id: "photos", label: "Photos", visible: true, required: false },
    { id: "preview", label: "Preview", visible: true, required: true },
    { id: "publish", label: "Publish", visible: true, required: true },
  ],
  eventTypes: [
    { id: "mehndi", label: "Mehndi", emoji: "🌿", defaultTagline: "The Art of Love", defaultDescription: "An intimate afternoon...", visibleByDefault: false },
    { id: "haldi", label: "Haldi", emoji: "🌼", defaultTagline: "The Golden Glow", defaultDescription: "A joyful morning...", visibleByDefault: false },
    { id: "sangeet", label: "Sangeet", emoji: "🎶", defaultTagline: "The Night of Stars", defaultDescription: "An enchanting evening...", visibleByDefault: false },
    { id: "baraat", label: "Baraat", emoji: "🐴", defaultTagline: "The Grand Arrival", defaultDescription: "A grand and festive...", visibleByDefault: false },
    { id: "ceremony", label: "Ceremony", emoji: "🕉️", defaultTagline: "The Sacred Union", defaultDescription: "The sacred union...", visibleByDefault: true },
    { id: "reception", label: "Reception", emoji: "🥂", defaultTagline: "The Grand Celebration", defaultDescription: "An elegant evening...", visibleByDefault: false },
  ],
  fieldVisibility: {
    dresscode_enabled: { visible: true, required: false },
    music_url: { visible: true, required: false },
    gallery_photos: { visible: true, required: false },
    venue_photo: { visible: true, required: false },
    hero_media_url: { visible: true, required: false },
  },
  validationRules: [
    { field: "bride_name", message: "Bride name is required", validate: (v) => v?.trim?.().length > 0 },
    { field: "groom_name", message: "Groom name is required", validate: (v) => v?.trim?.().length > 0 },
  ],
  paymentPlans: [
    { id: "basic", razorpayId: "shubh", name: "Shubh", price: 999, features: ["Live instantly", "100 RSVPs", "90 days"], popular: false, available: true },
    { id: "premium", razorpayId: "shaadi", name: "Shaadi", price: 1999, originalPrice: 2499, features: ["Priority support", "Unlimited RSVPs", "1 year"], popular: true, available: true },
    { id: "elite", razorpayId: "shaahi", name: "Shaahi", price: 4999, features: ["Everything in Premium", "Custom domain", "Priority support"], popular: false, available: true },
  ],
  ceremonyNameByWeddingType: {
    hindu: "Vivah",
    sikh: "Anand Karaj",
    muslim: "Nikah",
    christian: "Wedding Ceremony",
    other: "Wedding Ceremony",
  },
  visibleEventsByWeddingType: {
    hindu: ["mehndi", "haldi", "sangeet", "baraat", "ceremony", "reception"],
    sikh: ["mehndi", "sangeet", "ceremony", "reception"],
    muslim: ["mehndi", "ceremony", "reception"],
    christian: ["ceremony", "reception"],
    other: ["ceremony", "reception"],
  },
  allowTemplateSwitching: true,
});

/**
 * Factory: Minimalist 3-step workflow
 * (for simple, modern templates)
 */
export const createMinimalistWorkflow = (templateId: string): TemplateWorkflow => ({
  ...createStandardWorkflow(templateId),
  templateId,
  steps: [
    { id: "names", label: "Couple", visible: true, required: true, requiredFields: ["bride_name", "groom_name"] },
    { id: "photos", label: "Photos", visible: true, required: false },
    { id: "publish", label: "Publish", visible: true, required: true },
  ],
  eventTypes: [
    { id: "ceremony", label: "Ceremony", emoji: "💍", defaultTagline: "Our Special Day", defaultDescription: "", visibleByDefault: true },
  ],
  visibleEventsByWeddingType: {
    hindu: ["ceremony"],
    sikh: ["ceremony"],
    muslim: ["ceremony"],
    christian: ["ceremony"],
    other: ["ceremony"],
  },
});

/**
 * Factory: Premium luxury workflow
 * (high-touch, all features)
 */
export const createLuxuryWorkflow = (templateId: string): TemplateWorkflow => ({
  ...createStandardWorkflow(templateId),
  templateId,
  fieldVisibility: {
    ...createStandardWorkflow(templateId).fieldVisibility,
    dresscode_enabled: { visible: true, required: true },
    gift_registry_url: { visible: true, required: false },
    venue_photo: { visible: true, required: true },
  },
  validationRules: [
    ...createStandardWorkflow(templateId).validationRules,
    { field: "venue_description", message: "Venue description required", validate: (v) => v?.trim?.().length > 0 },
  ],
});
