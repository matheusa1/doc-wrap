import { describe, expect, test } from "bun:test";
import {
	isValidProjectPackageName,
	normalizeProjectName,
	promptPackageManager,
	promptTemplate,
	resolveProjectName,
	resolveSelection,
} from "./prompts.mjs";

describe("normalizeProjectName", () => {
	test("mantém nome válido simples", () => {
		expect(normalizeProjectName("meu-projeto")).toBe("meu-projeto");
	});

	test("converte espaços em hifens", () => {
		expect(normalizeProjectName("meu projeto")).toBe("meu-projeto");
	});

	test("converte para minúsculo", () => {
		expect(normalizeProjectName("Meu Projeto")).toBe("meu-projeto");
	});

	test("remove espaços nas extremidades", () => {
		expect(normalizeProjectName("  meu-projeto  ")).toBe("meu-projeto");
	});

	test("remove caracteres especiais inválidos", () => {
		expect(normalizeProjectName("meu@projeto!")).toBe("meuprojeto");
	});

	test("trata caracteres permitidos no npm", () => {
		expect(normalizeProjectName("meu_projeto")).toBe("meu_projeto");
		expect(normalizeProjectName("meu~projeto")).toBe("meu~projeto");
	});

	test("retorna string vazia para entrada inválida", () => {
		expect(normalizeProjectName("   ")).toBe("");
		expect(normalizeProjectName("!!!")).toBe("");
		expect(normalizeProjectName(undefined)).toBe("");
	});
});

describe("isValidProjectPackageName", () => {
	test("aceita nomes válidos", () => {
		expect(isValidProjectPackageName("meu-projeto")).toBe(true);
		expect(isValidProjectPackageName("projeto123")).toBe(true);
		expect(isValidProjectPackageName("meu_projeto")).toBe(true);
		expect(isValidProjectPackageName("meu~projeto")).toBe(true);
	});

	test("rejeita nomes que começam com ponto ou underscore", () => {
		expect(isValidProjectPackageName(".projeto")).toBe(false);
		expect(isValidProjectPackageName("_projeto")).toBe(false);
	});

	test("rejeita nomes reservados", () => {
		expect(isValidProjectPackageName("node_modules")).toBe(false);
		expect(isValidProjectPackageName("favicon.ico")).toBe(false);
	});

	test("rejeita nomes com mais de 214 caracteres", () => {
		expect(isValidProjectPackageName("a".repeat(215))).toBe(false);
	});

	test("rejeita nomes vazios ou inválidos", () => {
		expect(isValidProjectPackageName("")).toBe(false);
		expect(isValidProjectPackageName("Meu Projeto")).toBe(false);
		expect(isValidProjectPackageName("meu@projeto")).toBe(false);
	});
});

describe("resolveProjectName", () => {
	test("usa o argumento normalizado quando informado", async () => {
		await expect(resolveProjectName("Meu Projeto")).resolves.toBe(
			"meu-projeto",
		);
	});

	test("pergunta o nome e normaliza quando o argumento não existe em modo interativo", async () => {
		const ask = async () => "Typed Docs";

		await expect(
			resolveProjectName(undefined, { ask, interactive: true }),
		).resolves.toBe("typed-docs");
	});

	test("falha quando o argumento é inválido", async () => {
		await expect(resolveProjectName("!!!")).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
	});

	test("falha quando o argumento normalizado é um nome reservado", async () => {
		await expect(resolveProjectName("node_modules")).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
	});

	test("falha quando o prompt resulta em nome inválido", async () => {
		const ask = async () => "   ";

		await expect(
			resolveProjectName(undefined, { ask, interactive: true }),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
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
