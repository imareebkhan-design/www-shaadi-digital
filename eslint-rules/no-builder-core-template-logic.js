/**
 * ESLint rule to prevent template-specific logic in builder core files.
 * This rule is intended for files that should remain workflow-driven only.
 */

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow template-specific logic in builder core files",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      builderCoreSwitch: "Builder core should not use switch statements for template-specific behavior. Use workflow-driven rendering instead.",
      builderCoreTemplateLogic: "Template-specific conditionals are not allowed in builder core. Move behavior into workflow config or modules.",
    },
  },

  create(context) {
    const filename = context.getFilename();
    if (!/(InvitationBuilder\.tsx|use-invitation-builder\.ts)$/.test(filename)) {
      return {};
    }

    return {
      SwitchStatement(node) {
        context.report({ node, messageId: "builderCoreSwitch" });
      },
      BinaryExpression(node) {
        if (node.operator !== "===" && node.operator !== "!==") return;

        const isTemplateReference = (side) => {
          if (!side) return false;
          if (side.type === "Identifier") {
            return /template/i.test(side.name);
          }
          if (side.type === "MemberExpression" && side.property && side.property.type === "Identifier") {
            return /template/i.test(side.property.name);
          }
          return false;
        };

        const isStringLiteral = (side) => side.type === "Literal" && typeof side.value === "string";

        if ((isTemplateReference(node.left) && isStringLiteral(node.right)) || (isTemplateReference(node.right) && isStringLiteral(node.left))) {
          context.report({ node, messageId: "builderCoreTemplateLogic" });
        }
      },
    };
  },
};
