import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/generated/**",
    ],
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
  },
  tseslint.configs.recommended,
  {
    settings: {
      react: { version: "detect" } // Убирает предупреждение "React version not specified"
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      // Для расширения типа Express.Request
      "@typescript-eslint/no-namespace": [
        "error",
        {
          "allowDeclarations": true
        }
      ]
    }
  }
]);