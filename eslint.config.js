import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import templateWorkflowRequired from "./eslint-rules/template-workflow-required.js";
import noBuilderCoreTemplateLogic from "./eslint-rules/no-builder-core-template-logic.js";
import noDuplicateModules from "./eslint-rules/no-duplicate-modules.js";
import noWorkflowBloat from "./eslint-rules/no-workflow-bloat.js";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "custom": {
        rules: {
          "template-workflow-required": templateWorkflowRequired,
          "no-builder-core-template-logic": noBuilderCoreTemplateLogic,
          "no-duplicate-modules": noDuplicateModules,
          "no-workflow-bloat": noWorkflowBloat,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "custom/template-workflow-required": "error",
      "custom/no-builder-core-template-logic": "error",
      "custom/no-duplicate-modules": "warn",
      "custom/no-workflow-bloat": "warn",
    },
  },
);
