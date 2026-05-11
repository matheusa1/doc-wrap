import { describe, expect, test } from "bun:test";
import {
	isValidProjectPackageName,
	normalizePackageName,
	promptPackageManager,
	promptTemplate,
	resolveProjectDirectoryName,
	resolveProjectName,
	resolveSelection,
} from "./prompts.mjs";

describe("normalizePackageName", () => {
	test("mantém nome válido simples", () => {
		expect(normalizePackageName("meu-projeto")).toBe("meu-projeto");
	});

	test("converte espaços em hifens", () => {
		expect(normalizePackageName("meu projeto")).toBe("meu-projeto");
	});

	test("converte para minúsculo", () => {
		expect(normalizePackageName("Meu Projeto")).toBe("meu-projeto");
	});

	test("remove espaços nas extremidades", () => {
		expect(normalizePackageName("  meu-projeto  ")).toBe("meu-projeto");
	});

	test("preserva ponto em nome válido", () => {
		expect(normalizePackageName("docs.v2")).toBe("docs.v2");
	});

	test("preserva scoped package válido", () => {
		expect(normalizePackageName("@main-docs/pax")).toBe("@main-docs/pax");
		expect(normalizePackageName("@Main-Docs/Pax")).toBe("@main-docs/pax");
	});

	test("remove til durante a normalização", () => {
		expect(normalizePackageName("meu~projeto")).toBe("meuprojeto");
	});

	test("retorna string vazia para entrada inválida", () => {
		expect(normalizePackageName("   ")).toBe("");
		expect(normalizePackageName("!!!")).toBe("");
		expect(normalizePackageName(undefined)).toBe("");
	});
});

describe("isValidProjectPackageName", () => {
	test("aceita nomes válidos", () => {
		expect(isValidProjectPackageName("meu-projeto")).toBe(true);
		expect(isValidProjectPackageName("docs.v2")).toBe(true);
		expect(isValidProjectPackageName("meu_projeto")).toBe(true);
		expect(isValidProjectPackageName("@main-docs/pax")).toBe(true);
		expect(isValidProjectPackageName("@scope/docs.v2")).toBe(true);
	});

	test("rejeita nomes que começam com ponto ou underscore", () => {
		expect(isValidProjectPackageName(".docs")).toBe(false);
		expect(isValidProjectPackageName("_docs")).toBe(false);
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
		expect(isValidProjectPackageName("fs")).toBe(false);
		expect(isValidProjectPackageName("path")).toBe(false);
		expect(isValidProjectPackageName("http")).toBe(false);
		expect(isValidProjectPackageName("crypto")).toBe(false);
		expect(isValidProjectPackageName("stream")).toBe(false);
		expect(isValidProjectPackageName("@scope")).toBe(false);
		expect(isValidProjectPackageName("@scope/")).toBe(false);
		expect(isValidProjectPackageName("@/package")).toBe(false);
		expect(isValidProjectPackageName("scope/package")).toBe(false);
		expect(isValidProjectPackageName("meu projeto")).toBe(false);
		expect(isValidProjectPackageName("meu~projeto")).toBe(false);
	});
});

describe("resolveProjectDirectoryName", () => {
	test("mantém nomes simples e converte scoped packages", () => {
		expect(resolveProjectDirectoryName("meu-projeto")).toBe("meu-projeto");
		expect(resolveProjectDirectoryName("docs.v2")).toBe("docs.v2");
		expect(resolveProjectDirectoryName("@main-docs/pax")).toBe("main-docs-pax");
		expect(resolveProjectDirectoryName("@scope/docs.v2")).toBe("scope-docs.v2");
	});
});

describe("resolveProjectName", () => {
	test("usa o argumento normalizado quando informado", async () => {
		await expect(resolveProjectName("Meu Projeto")).resolves.toBe(
			"meu-projeto",
		);
	});

	test("preserva scoped package e pontos válidos", async () => {
		await expect(resolveProjectName("@main-docs/pax")).resolves.toBe(
			"@main-docs/pax",
		);
		await expect(resolveProjectName("docs.v2")).resolves.toBe("docs.v2");
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
		await expect(resolveProjectName("favicon.ico")).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
		await expect(resolveProjectName("fs")).rejects.toThrow(
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
