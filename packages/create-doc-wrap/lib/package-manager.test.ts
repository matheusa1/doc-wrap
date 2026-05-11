import { describe, expect, test } from "bun:test";
import { buildFinalInstructions } from "./package-manager.mjs";

describe("buildFinalInstructions", () => {
	test("retorna instruções para bun", () => {
		expect(
			buildFinalInstructions({
				packageManager: "bun",
				projectDirectoryName: "my-docs",
			}),
		).toBe("cd my-docs\nbun install\nbun run dev");
	});

	test("retorna instruções para npm", () => {
		expect(
			buildFinalInstructions({
				packageManager: "npm",
				projectDirectoryName: "my-docs",
			}),
		).toBe("cd my-docs\nnpm install\nnpm run dev");
	});

	test("retorna instruções para pnpm", () => {
		expect(
			buildFinalInstructions({
				packageManager: "pnpm",
				projectDirectoryName: "my-docs",
			}),
		).toBe("cd my-docs\npnpm install\npnpm dev");
	});

	test("retorna instruções para yarn", () => {
		expect(
			buildFinalInstructions({
				packageManager: "yarn",
				projectDirectoryName: "my-docs",
			}),
		).toBe("cd my-docs\nyarn\nyarn dev");
	});
});
