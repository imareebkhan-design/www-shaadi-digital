/**
 * ESLint rule to discourage duplicate module creation.
 * It warns when new module IDs follow a pattern similar to existing ones
 * but appear to be template-specific or redundant.
 */

const KNOWN_MODULE_PREFIXES = ["events.", "media.", "ceremony.", "language.", "custom."];

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Warn when duplicate or template-specific module IDs are created.",
      category: "Best Practices",
      recommended: false,
    },
    schema: [],
    messages: {
      duplicateModule: 'Module ID "{{ moduleId }}" looks like a duplicate or template-specific module. Prefer reusing existing modules and configuration.',
    },
  },

  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        if (!KNOWN_MODULE_PREFIXES.some((prefix) => node.value.startsWith(prefix))) return;

        const value = node.value;
        const parts = value.split(".");
        if (parts.length >= 3 && !/v\d+$/.test(parts[parts.length - 1])) {
          context.report({ node, messageId: "duplicateModule", data: { moduleId: value } });
        }
      },
    };
  },
};
