import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	projectConfigDefaults,
	readProjectConfig,
	resolveProjectConfig,
} from "./index.mjs";

const createdDirectories: string[] = [];

const createProjectDirectory = async (projectConfig: string) => {
	const directory = await mkdtemp(join(tmpdir(), "doc-wrap-project-config-"));
	createdDirectories.push(directory);

	await writeFile(
		join(directory, "project.config.json"),
		projectConfig,
		"utf8",
	);

	return directory;
};

afterEach(async () => {
	await Promise.all(
		createdDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("resolveProjectConfig", () => {
	test("retorna defaults sem overrides", () => {
		expect(resolveProjectConfig()).toEqual(projectConfigDefaults);
	});

	test("aplica defaults e merge de overrides", () => {
		expect(resolveProjectConfig({ name: "Central Docs" })).toEqual({
			...projectConfigDefaults,
			name: "Central Docs",
		});
	});

	test("rejeita chaves desconhecidas", () => {
		expect(() => resolveProjectConfig({ invalidKey: true })).toThrow(
			"Configuração de projeto inválida em project.config.json",
		);
		expect(() => resolveProjectConfig({ invalidKey: true })).toThrow(
			'Chaves não reconhecidas: "invalidKey"',
		);
	});

	test("rejeita defaultTheme inválido", () => {
		const invalidOverrides = { defaultTheme: "sepia" } as unknown as Parameters<
			typeof resolveProjectConfig
		>[0];

		expect(() => resolveProjectConfig(invalidOverrides)).toThrow(
			"defaultTheme",
		);
		expect(() => resolveProjectConfig(invalidOverrides)).toThrow(
			'Use um dos valores permitidos: "dark", "light", "system"',
		);
	});

	test("rejeita raízes inválidas em runtime", () => {
		const invalidRoots = [null, [], "config"];

		for (const invalidRoot of invalidRoots) {
			expect(() =>
				resolveProjectConfig(
					invalidRoot as unknown as Parameters<typeof resolveProjectConfig>[0],
				),
			).toThrow("<raiz>");
		}
	});
});

describe("readProjectConfig", () => {
	test("lê project.config.json e aplica defaults", async () => {
		const directory = await createProjectDirectory(`{
			"name": "Central Docs",
			"hasDocs": false
		}`);

		await expect(readProjectConfig(directory)).resolves.toEqual({
			...projectConfigDefaults,
			hasDocs: false,
			name: "Central Docs",
		});
	});

	test("aceita objeto vazio e retorna defaults", async () => {
		const directory = await createProjectDirectory("{}");

		await expect(readProjectConfig(directory)).resolves.toEqual(
			projectConfigDefaults,
		);
	});

	test("retorna erro claro para JSON inválido", async () => {
		const directory = await createProjectDirectory("{");
		const result = readProjectConfig(directory);

		await expect(result).rejects.toThrow(
			"JSON inválido em project.config.json",
		);
		await expect(result).rejects.not.toThrow("Invalid JSON");
	});

	test("retorna erro amigável quando project.config.json não existe", async () => {
		const directory = await mkdtemp(join(tmpdir(), "doc-wrap-project-config-"));
		createdDirectories.push(directory);
		const result = readProjectConfig(directory);

		await expect(result).rejects.toThrow("Arquivo obrigatório ausente");
		await expect(result).rejects.toThrow("project.config.json");
		await expect(result).rejects.not.toThrow("ENOENT");
	});

	test("retorna erro com caminho do campo problemático em português", async () => {
		const directory = await createProjectDirectory(`{
			"defaultTheme": "sepia"
		}`);
		const result = readProjectConfig(directory);

		await expect(result).rejects.toThrow(
			"Configuração de projeto inválida em project.config.json",
		);
		await expect(result).rejects.toThrow("defaultTheme");
		await expect(result).rejects.not.toThrow("Invalid project config");
	});
});
