import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // Files/folders ESLint should never look at (build output, deps, docs).
  {
    ignores: ["dist/**", "node_modules/**", "course_manuscript/**", "resources/**"],
  },

  // Baseline recommended JS rules (no-unused-vars, no-undef, no-const-assign, ...).
  js.configs.recommended,

  // After Demo 7, the only plain .js left is tooling config (this file,
  // vite.config.js) - the whole app is TypeScript, checked below.
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },

  // Type-aware rules for every application module (all of js/**, now fully
  // TypeScript as of Demo 7). `recommendedTypeChecked` needs a real TS
  // program to inspect inferred types (not just syntax), which is what
  // `projectService` below wires up.
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // No escape hatch for `any` in converted modules - that's the whole
      // point of Demo 5's "no any" rule. Left as "error", not a warning.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // Turns off every ESLint stylistic rule that would otherwise fight with
  // Prettier's own formatting decisions (quotes, indentation, semicolons...).
  // Must be last so it overrides anything enabled above.
  prettier
);
