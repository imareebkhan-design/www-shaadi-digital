/**
 * ESLint rule to detect excessive workflow config objects.
 * Warns when workflows include fields that should be handled by modules.
 */

const BANNED_WORKFLOW_FIELDS = [
  "eventTypes",
  "fieldVisibility",
  "ceremonyNameByWeddingType",
  "visibleEventsByWeddingType",
  "translationRules",
];

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Warn when workflow config contains fields that should be handled by modules.",
      category: "Best Practices",
      recommended: false,
    },
    schema: [],
    messages: {
      workflowBloat: 'Workflow contains "{{ fieldName }}". Move this concern into a module or config object.',
    },
  },

  create(context) {
    return {
      Property(node) {
        if (node.key.type !== "Identifier") return;
        if (!BANNED_WORKFLOW_FIELDS.includes(node.key.name)) return;

        context.report({ node, messageId: "workflowBloat", data: { fieldName: node.key.name } });
      },
    };
  },
};
