import { ESLintUtils } from "@typescript-eslint/utils";

// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const version: string = require("../../package.json").version;

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/hpersson/eslint-plugin-jsx-expressions/blob/v${version}/lib/rules/${name}.md`
);
