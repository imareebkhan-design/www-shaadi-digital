/**
 * ARCHITECTURAL FIX GUIDE
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Problem: Builder system was tightly coupled to hardcoded 5-step flow.
 * Solution: Templates now control their own workflow via declarative config.
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// WHAT CHANGED
// ─────────────────────────────────────────────────────────────────────────────

// BEFORE: Hardcoded flow in InvitationBuilder.tsx
// ─────────────────────────────────────────────────────────────────────────
/*
  const renderStep = () => {
    switch (step) {
      case 1: return <Step1CoupleNames ... />;
      case 2: return <Step2Events ... />;
      case 3: return <Step3PhotoLanguage ... />;
      case 4: return <Step4Preview ... />;
      case 5: return <Step5Publish ... />;
    }
  };
  
  // Event types hardcoded in builder.ts
  const VISIBLE_EVENTS_BY_TYPE = {
    hindu: ["mehndi", "haldi", "sangeet", "baraat", "ceremony", "reception"],
    muslim: ["mehndi", "ceremony", "reception"],
  };
  
  // Wedding type mapping hardcoded in hook
  const CEREMONY_NAME_BY_TYPE = {
    hindu: "Vivah",
    muslim: "Nikah",
  };
*/

// AFTER: Declarative workflow per template in registry
// ─────────────────────────────────────────────────────────────────────────
/*
  export const TEMPLATE_REGISTRY = {
    "royal-maroon": {
      id: "royal-maroon",
      component: RoyalMaroon,
      workflow: createStandardWorkflow("royal-maroon"),  // ← NEW
    },
    "minimalist-modern": {
      id: "minimalist-modern",
      component: MinimalistModern,
      workflow: createMinimalistWorkflow("minimalist-modern"),  // ← NEW: 3 steps instead of 5
    },
  };
*/

// ─────────────────────────────────────────────────────────────────────────────
// NEW FILES CREATED
// ─────────────────────────────────────────────────────────────────────────────

// 1. src/templates/workflow.ts
// ────────────────────────────────────────────────────────────────
// Defines TemplateWorkflow interface with:
// - steps: StepConfig[] (dynamic step sequence)
// - eventTypes: EventTypeConfig[] (template-specific events)
// - fieldVisibility: FieldVisibilityConfig (which fields to show)
// - validationRules: ValidationRule[] (template-specific validation)
// - paymentPlans: PaymentPlanConfig[] (pricing per template)
// - ceremonyNameByWeddingType: Record<string, string> (custom ceremony names)
// - visibleEventsByWeddingType: Record<string, string[]> (event visibility)

// Provides factories:
// - createStandardWorkflow() → 5-step flow (most templates)
// - createMinimalistWorkflow() → 3-step flow (modern templates)
// - createLuxuryWorkflow() → 5-step + required dress code, etc.

// 2. src/templates/stepEngine.ts
// ────────────────────────────────────────────────────────────────
// Replaces hardcoded switch in InvitationBuilder.tsx with:
// - getVisibleSteps() → Get steps that apply to current data
// - validateStep() → Use workflow validation rules
// - isFieldVisible() → Check if field should be shown
// - getCeremonyLabel() → Get name from workflow config
// - getVisibleEventTypes() → Get events from workflow config
// - renderDynamicStep() → Render any step dynamically

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE
// ─────────────────────────────────────────────────────────────────────────────

// In InvitationBuilder.tsx, replace hardcoded renderStep():
// ─────────────────────────────────────────────────────────────────

import { renderDynamicStep, getVisibleSteps } from "@/templates/stepEngine";

function InvitationBuilder() {
  const { template, step, formData, ... } = useInvitationBuilder(templateId);
  
  // Get workflow from template
  const workflow = template?.workflow;
  if (!workflow) return null;
  
  // Get visible steps for current data
  const visibleSteps = getVisibleSteps(workflow, formData);
  
  // Render any step dynamically
  const rendered = renderDynamicStep({
    workflow,
    currentStep: step,
    formData,
    errors,
    weddingType,
    onWeddingTypeChange,
    updateFormData,
    // ... other props
  });
  
  return rendered;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDING NEW TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

// BEFORE: Had to add steps to hardcoded switch in InvitationBuilder.tsx
// AFTER: Just create workflow and add to registry

import { createStandardWorkflow } from "@/templates/workflow";

export const TEMPLATE_REGISTRY = {
  "your-new-template": {
    id: "your-new-template",
    name: "Your New Template",
    component: YourNewTemplate,
    workflow: createStandardWorkflow("your-new-template"),  // or custom
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────

// Example 1: Template with only 3 steps (names → photos → publish)
const myCustomWorkflow: TemplateWorkflow = {
  templateId: "quick-invite",
  steps: [
    { id: "names", label: "Couple", visible: true, required: true },
    { id: "photos", label: "Photos", visible: true, required: false },
    { id: "publish", label: "Publish", visible: true, required: true },
  ],
  eventTypes: [
    { id: "ceremony", label: "Ceremony", emoji: "💍", visible: true },
  ],
  fieldVisibility: {
    dresscode_enabled: { visible: false, required: false },  // Hidden
    music_url: { visible: true, required: false },
  },
  validationRules: [
    { field: "bride_name", message: "Required", validate: (v) => v?.length > 0 },
  ],
  paymentPlans: [...],
  // ... etc
};

// Example 2: Template that conditionally shows events
const eventualWorkflow: TemplateWorkflow = {
  ...createStandardWorkflow("eventual"),
  fieldVisibility: {
    ...createStandardWorkflow("eventual").fieldVisibility,
    venue_photo: {
      visible: true,
      required: false,
      condition: (data) => data.wedding_date !== "", // Show only if date is set
    },
  },
};

// Example 3: Template with different event visibility per type
const customEventWorkflow: TemplateWorkflow = {
  ...createStandardWorkflow("custom"),
  visibleEventsByWeddingType: {
    hindu: ["mehndi", "haldi", "ceremony"],  // Only 3 events
    muslim: ["nikah"], // Only 1 event
    christian: ["ceremony", "reception"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MIGRATION PATH (Step-by-Step)
// ─────────────────────────────────────────────────────────────────────────────

// Step 1: Create workflow.ts and stepEngine.ts ✅ (DONE)
// Step 2: Update registry.ts to include workflow in entries ✅ (DONE)
// Step 3: Update use-invitation-builder.ts to use stepEngine functions ✅ (DONE)
// Step 4: Update InvitationBuilder.tsx to use renderDynamicStep
// Step 5: Add workflow to all existing templates in registry
// Step 6: Remove hardcoded constants from builder.ts
// Step 7: Remove hardcoded CEREMONY_NAME_BY_TYPE from use-invitation-builder.ts
// Step 8: Update Step2Events to use workflow config

// ─────────────────────────────────────────────────────────────────────────────
// BENEFITS
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Scalable to 50+ templates without hardcoding
// ✅ Each template can have its own step flow
// ✅ Event types are template-specific
// ✅ Field visibility is configurable per template
// ✅ Validation rules are template-aware
// ✅ Payment plans can vary per template
// ✅ No more hardcoded conditionals in builder logic
// ✅ Easy to add new templates by just extending workflow

// ─────────────────────────────────────────────────────────────────────────────
// NEXT STEPS
// ─────────────────────────────────────────────────────────────────────────────

// 1. Update InvitationBuilder.tsx renderStep() to use renderDynamicStep()
// 2. Remove CEREMONY_NAME_BY_TYPE from builder.ts and hook
// 3. Update Step2Events to get event config from workflow instead of hardcoded
// 4. Test with 5+ templates to ensure step flows work correctly
// 5. Add workflow to ALL templates in registry
