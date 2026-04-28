import fs from "fs";
import path from "path";

const MODULE_TEMPLATE = `/**
 * New module implementation
 * -------------------------
 * Replace the placeholder methods with domain logic.
 */

import type { ModuleContext } from "@/templates/modules";

export const NewModule = {
  getRequiredMediaFields(): string[] {
    return [];
  },
  getOptionalMediaFields(): string[] {
    return [];
  },
  validateMediaField(fieldName: string, value: any): boolean {
    return true;
  },
  getMediaFieldLabels(): Record<string, string> {
    return {};
  },
};
`;

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("Usage: yarn new-module <module-name>");
  process.exit(1);
}

const filePath = path.join(process.cwd(), "src/templates/modules", `${moduleName}.ts`);
if (fs.existsSync(filePath)) {
  console.error(`Module file already exists: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, MODULE_TEMPLATE);
console.log(`Created module template at ${filePath}`);
