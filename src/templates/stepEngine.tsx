/**
 * Dynamic Step Engine
 * ───────────────────
 * Renders steps dynamically based on template workflow config.
 * Uses modular system for template-specific logic.
 */

import { ReactNode } from "react";
import type { TemplateWorkflow, StepId } from "@/templates/workflow";
import type { InvitationData } from "@/templates/types";
import type { EventModule, MediaModule, CeremonyModule } from "@/templates/modules";
import { getModule } from "@/templates/modules/registry";

import Step1CoupleNames from "@/components/builder/Step1CoupleNames";
import Step2Events from "@/components/builder/Step2Events";
import Step3PhotoLanguage from "@/components/builder/Step3PhotoLanguage";
import Step4Preview from "@/components/builder/Step4Preview";
import Step5Publish from "@/components/builder/Step5Publish";

/**
 * Map step IDs to their components
 */
const STEP_COMPONENTS: Record<StepId, (props: any) => ReactNode> = {
  names: Step1CoupleNames,
  events: Step2Events,
  photos: Step3PhotoLanguage,
  preview: Step4Preview,
  publish: Step5Publish,
};

export interface DynamicStepRendererProps {
  workflow: TemplateWorkflow;
  currentStep: number; // 1-indexed
  formData: InvitationData;
  errors: Record<string, string>;
  weddingType: string;
  onWeddingTypeChange: (type: string) => void;
  updateFormData: (updates: Partial<InvitationData>) => void;
  onProceed?: () => void;
  onGoBack?: () => void;
  templateId: string;
  publishLoading?: boolean;
  onSelectPlan?: (plan: "basic" | "premium" | "elite") => void;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
}

/**
 * Get visible steps for the current state
 */
export const getVisibleSteps = (workflow: TemplateWorkflow, formData: InvitationData): StepId[] => {
  return workflow.steps
    .filter((step) => step.visible)
    .filter((step) => !step.condition || step.condition(formData))
    .map((step) => step.id);
};

/**
 * Validate current step against workflow rules
 */
export const validateStep = (
  workflow: TemplateWorkflow,
  stepId: StepId,
  formData: InvitationData,
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const stepConfig = workflow.steps.find((s) => s.id === stepId);

  if (!stepConfig) return errors;

  // Check required fields
  if (stepConfig.requiredFields) {
    for (const field of stepConfig.requiredFields) {
      const value = (formData as any)[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        errors[field] = `${field} is required`;
      }
    }
  }

  // Apply custom validation rules
  for (const rule of workflow.validationRules) {
    if (rule.field === stepId || stepConfig.requiredFields?.includes(rule.field)) {
      const value = (formData as any)[rule.field];
      if (!rule.validate(value)) {
        errors[rule.field] = rule.message;
      }
    }
  }

  return errors;
};

/**
 * Get payment plans available for this workflow
 */
export const getPaymentPlans = (workflow: TemplateWorkflow) => {
  return workflow.paymentPlans.filter((plan) => plan.available);
};

/**
 * Get ceremony label for wedding type
 */
export const getCeremonyLabel = (workflow: TemplateWorkflow, weddingType: string): string => {
  if (!workflow.modules.ceremony) return "Wedding Ceremony";
  const ceremonyModule = getModule<CeremonyModule>(workflow.modules.ceremony);
  return ceremonyModule.getCeremonyName(weddingType as any);
};

/**
 * Get visible event types for wedding type
 */
export const getVisibleEventTypes = (workflow: TemplateWorkflow, weddingType: string): string[] => {
  if (!workflow.modules.events) return ["ceremony"];
  const eventModule = getModule<EventModule>(workflow.modules.events);
  return eventModule.getVisibleEventTypes(weddingType as any);
};

/**
 * Render a step dynamically
 */
export function renderDynamicStep(props: DynamicStepRendererProps): ReactNode {
  const {
    workflow,
    currentStep,
    formData,
    errors,
    weddingType,
    onWeddingTypeChange,
    updateFormData,
    onProceed,
    onGoBack,
    templateId,
    publishLoading,
    onSelectPlan,
    brideName,
    groomName,
    weddingDate,
  } = props;

  const visibleSteps = getVisibleSteps(workflow, formData);
  const currentStepId = visibleSteps[currentStep - 1];

  if (!currentStepId) return null;

  const StepComponent = STEP_COMPONENTS[currentStepId];
  if (!StepComponent) return null;

  // Pass appropriate props based on step type
  const baseProps = {
    data: formData,
    onChange: updateFormData,
    errors,
  };

  switch (currentStepId) {
    case "names":
      return (
        <StepComponent
          {...baseProps}
          weddingType={weddingType}
          onWeddingTypeChange={onWeddingTypeChange}
        />
      );

    case "events":
      return (
        <StepComponent
          {...baseProps}
          weddingType={weddingType}
          workflow={workflow}
        />
      );

    case "photos":
      return <StepComponent {...baseProps} />;

    case "preview":
      return (
        <StepComponent
          {...baseProps}
          templateId={templateId}
          onProceed={onProceed}
          onGoBack={onGoBack}
        />
      );

    case "publish":
      return (
        <StepComponent
          onSelectPlan={onSelectPlan}
          loading={publishLoading}
          brideName={brideName}
          groomName={groomName}
          weddingDate={weddingDate}
        />
      );

    default:
      return null;
  }
}
