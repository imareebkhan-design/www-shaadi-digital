/**
 * Workflow Validation
 * ───────────────────
 * Validates workflow configurations and module references.
 *
 * This is one of the live enforcement points for the architecture rulebook.
 * See ARCHITECTURE_RULEBOOK.md and eslint-rules/ for the rest of the checks.
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
  if (!workflow.modules || Object.keys(workflow.modules).length === 0) {
    errors.push("Workflow missing modules configuration");
  } else {
    Object.entries(workflow.modules).forEach(([moduleType, moduleId]) => {
      if (!moduleId) {
        errors.push(`Module reference for ${moduleType} is missing`);
        return;
      }
      if (typeof moduleId !== "string") {
        errors.push(`Module reference for ${moduleType} must be a string`);
        return;
      }
      if (!hasModule(moduleId)) {
        errors.push(`Module ${moduleId} for ${moduleType} not found in registry`);
      }
    });
  }

  // Check validation rules
  if (!Array.isArray(workflow.validationRules)) {
    errors.push("Workflow validationRules must be an array");
  } else {
    workflow.validationRules.forEach((rule, index) => {
      if (!rule.field) {
        errors.push(`Validation rule ${index} missing field`);
      }
      if (typeof rule.validate !== "function") {
        errors.push(`Validation rule ${rule.field || index} missing validate function`);
      }
    });
  }

  // Check payment plans
  if (!Array.isArray(workflow.paymentPlans)) {
    errors.push("Workflow paymentPlans must be an array");
  } else {
    workflow.paymentPlans.forEach((plan, index) => {
      if (!plan.id) {
        errors.push(`Payment plan ${index} missing id`);
      }
      if (typeof plan.price !== "number") {
        errors.push(`Payment plan ${plan.id || index} missing valid price`);
      }
    });
  }

  if (typeof workflow.allowTemplateSwitching !== "boolean") {
    errors.push("Workflow allowTemplateSwitching must be a boolean");
  }

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