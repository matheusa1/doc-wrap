import { describe, expect, test } from "bun:test";
import { buildFinalInstructions } from "./package-manager.mjs";

describe("buildFinalInstructions", () => {
	test("retorna instruções para bun", () => {
		expect(buildFinalInstructions("bun", "my-docs")).toBe(
			"cd my-docs\nbun install\nbun run dev",
		);
	});

	test("retorna instruções para npm", () => {
		expect(buildFinalInstructions("npm", "my-docs")).toBe(
			"cd my-docs\nnpm install\nnpm run dev",
		);
	});

	test("retorna instruções para pnpm", () => {
		expect(buildFinalInstructions("pnpm", "my-docs")).toBe(
			"cd my-docs\npnpm install\npnpm dev",
		);
	});

	test("retorna instruções para yarn", () => {
		expect(buildFinalInstructions("yarn", "my-docs")).toBe(
			"cd my-docs\nyarn\nyarn dev",
		);
	});
});
