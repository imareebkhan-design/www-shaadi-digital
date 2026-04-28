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
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier" || node.id.name !== "TEMPLATE_REGISTRY") {
          return;
        }
        if (!node.init || node.init.type !== "ObjectExpression") {
          return;
        }

        node.init.properties.forEach((prop) => {
          if (prop.type !== "Property" || prop.value.type !== "ObjectExpression") {
            return;
          }

          const hasWorkflow = prop.value.properties.some((objProp) => {
            if (objProp.type !== "Property") {
              return false;
            }
            if (objProp.key.type === "Identifier") {
              return objProp.key.name === "workflow";
            }
            if (objProp.key.type === "Literal") {
              return objProp.key.value === "workflow";
            }
            return false;
          });

          const templateId =
            prop.key.type === "Literal" ? prop.key.value : prop.key.type === "Identifier" ? prop.key.name : "unknown";

          if (!hasWorkflow) {
            context.report({
              node: prop,
              messageId: "missingWorkflow",
              data: {
                templateId,
              },
            });
          }
        });
      },
    };
  },
};