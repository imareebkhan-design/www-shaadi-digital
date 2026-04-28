/**
 * Workflow Validation
 * ───────────────────
 * Validates workflow configurations and module references
 */

import type { TemplateWorkflow } from "./workflow";
import { hasModule } from "./modules/registry";

/**
 * Validate a workflow configuration
 */
export function validateWorkflow(workflow: TemplateWorkflow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!workflow.templateId) {
    errors.push("Workflow missing templateId");
  }

  if (!workflow.steps || workflow.steps.length === 0) {
    errors.push("Workflow missing steps configuration");
  }

  // Check steps configuration
  workflow.steps.forEach((step, index) => {
    if (!step.id) {
      errors.push(`Step ${index} missing id`);
    }
    if (typeof step.visible !== "boolean") {
      errors.push(`Step ${step.id || index} missing valid visible flag`);
    }
    if (typeof step.required !== "boolean") {
      errors.push(`Step ${step.id || index} missing valid required flag`);
    }
  });

  // Check module references
  if (workflow.modules) {
    Object.entries(workflow.modules).forEach(([moduleType, moduleId]) => {
      if (moduleId && !hasModule(moduleId)) {
        errors.push(`Module ${moduleId} for ${moduleType} not found in registry`);
      }
    });
  }

  // Check validation rules
  workflow.validationRules.forEach((rule, index) => {
    if (!rule.field) {
      errors.push(`Validation rule ${index} missing field`);
    }
    if (!rule.validate) {
      errors.push(`Validation rule ${index} missing validate function`);
    }
  });

  // Check payment plans
  workflow.paymentPlans.forEach((plan, index) => {
    if (!plan.id) {
      errors.push(`Payment plan ${index} missing id`);
    }
    if (typeof plan.price !== "number") {
      errors.push(`Payment plan ${plan.id || index} missing valid price`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all workflows in the registry
 */
export function validateAllWorkflows(workflows: Record<string, TemplateWorkflow>): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let allValid = true;

  Object.entries(workflows).forEach(([templateId, workflow]) => {
    const result = validateWorkflow(workflow);
    if (!result.valid) {
      errors[templateId] = result.errors;
      allValid = false;
    }
  });

  return {
    valid: allValid,
    errors,
  };
}