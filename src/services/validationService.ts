import type { InvitationData } from "@/templates/types";
import type { TemplateWorkflow } from "@/templates/workflow";
import { getVisibleSteps, validateStep } from "@/templates/stepEngine";

export const validateBuilderStep = (
  step: number,
  formData: InvitationData,
  workflow?: TemplateWorkflow,
) => {
  if (workflow) {
    const visibleSteps = getVisibleSteps(workflow, formData);
    const stepId = visibleSteps[step - 1];
    if (stepId) {
      return validateStep(workflow, stepId, formData);
    }
  }

  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!formData.bride_name.trim()) errors.bride_name = "Bride's name is required";
    if (!formData.groom_name.trim()) errors.groom_name = "Groom's name is required";
  }

  if (step === 2) {
    const ceremonyEvent = formData.events.find((event) => event.event_type === "ceremony");
    if (!ceremonyEvent?.is_enabled) errors.events = "Main Ceremony must be enabled";
  }

  return errors;
};
