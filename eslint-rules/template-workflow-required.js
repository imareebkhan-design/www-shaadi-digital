/**
 * ESLint rule to enforce workflow property on all templates
 * Prevents architectural debt in hybrid migration
 */

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that all templates have a workflow property",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      missingWorkflow: 'Template "{{ templateId }}" is missing required "workflow" property. All templates must have a workflow configuration.',
    },
  },

  create: function (context) {
    return {
      Property: function (node) {
        // Check if we're in TEMPLATE_REGISTRY
        if (
          node.key.name === "TEMPLATE_REGISTRY" &&
          node.parent.type === "ObjectExpression"
        ) {
          // Check each property in the registry
          node.parent.properties.forEach((prop) => {
            if (prop.type === "Property" && prop.value.type === "ObjectExpression") {
              const hasWorkflow = prop.value.properties.some(
                (objProp) =>
                  objProp.type === "Property" && objProp.key.name === "workflow"
              );

              if (!hasWorkflow) {
                context.report({
                  node: prop,
                  messageId: "missingWorkflow",
                  data: {
                    templateId: prop.key.value,
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};