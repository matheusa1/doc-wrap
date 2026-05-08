import { describe, expect, test } from "bun:test";
import {
	promptPackageManager,
	promptTemplate,
	resolveProjectName,
	resolveSelection,
} from "./prompts.mjs";

describe("resolveProjectName", () => {
	test("usa o argumento quando informado", async () => {
		await expect(resolveProjectName("my-docs")).resolves.toBe("my-docs");
	});

	test("pergunta o nome quando o argumento não existe em modo interativo", async () => {
		const ask = async () => "typed-docs";

		await expect(
			resolveProjectName(undefined, { ask, interactive: true }),
		).resolves.toBe("typed-docs");
	});

	test("falha sem argumento em modo não interativo", async () => {
		await expect(
			resolveProjectName(undefined, { interactive: false }),
		).rejects.toThrow("O nome do projeto é obrigatório");
	});
});

describe("resolveSelection", () => {
	test("aceita opção numérica", () => {
		expect(resolveSelection("2", ["npm", "yarn"], "package manager")).toBe(
			"yarn",
		);
	});

	test("aceita opção literal", () => {
		expect(resolveSelection("pnpm", ["npm", "pnpm"], "package manager")).toBe(
			"pnpm",
		);
	});

	test("falha para opção inválida", () => {
		expect(() =>
			resolveSelection("invalid", ["npm", "pnpm"], "package manager"),
		).toThrow("Seleção inválida de package manager");
	});
});

describe("promptPackageManager", () => {
	test("retorna a opção escolhida", async () => {
		const ask = async () => "4";

		await expect(promptPackageManager({ ask })).resolves.toBe("bun");
	});
});

describe("promptTemplate", () => {
	test("retorna o template escolhido", async () => {
		const ask = async () => "blog-docs";

		await expect(promptTemplate({ ask })).resolves.toBe("blog-docs");
	});
});
