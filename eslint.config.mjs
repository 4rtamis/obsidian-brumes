import tsparser from "@typescript-eslint/parser";
import obsidianmd from "eslint-plugin-obsidianmd";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["node_modules/**", "dist/**", "demo/**"],
	},
	{
		files: ["**/*.ts"],
		extends: [...obsidianmd.configs.recommended],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
]);
