/**
 * Simplified Template Workflow Engine
 * ───────────────────────────────────
 * Minimal workflow system using reusable modules
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

  /** Module configuration */
  modules: {
    events?: string;
    media?: string;
    ceremony?: string;
    language?: string;
    custom?: string;
  };

  /** Custom validation rules for this template */
  validationRules: ValidationRule[];

  /** Payment plans available for this template */
  paymentPlans: PaymentPlanConfig[];

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
  modules: {
    events: "events.standard",
    media: "media.standard",
    ceremony: "ceremony.standard",
    language: "language.standard",
    custom: "custom.standard",
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
  modules: {
    events: "events.minimalist",
    media: "media.minimalist",
    ceremony: "ceremony.standard",
    language: "language.standard",
    custom: "custom.minimalist",
  },
});

/**
 * Factory: Premium luxury workflow
 * (high-touch, all features)
 */
export const createLuxuryWorkflow = (templateId: string): TemplateWorkflow => ({
  ...createStandardWorkflow(templateId),
  templateId,
  modules: {
    events: "events.luxury",
    media: "media.luxury",
    ceremony: "ceremony.standard",
    language: "language.standard",
    custom: "custom.luxury",
  },
});
