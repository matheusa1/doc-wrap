import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	projectConfigDefaults,
	readProjectConfig,
	resolveProjectConfig,
} from "./project-config.mjs";

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
	test("aplica defaults e merge de overrides", () => {
		expect(resolveProjectConfig({ name: "Central Docs" })).toEqual({
			...projectConfigDefaults,
			name: "Central Docs",
		});
	});

	test("rejeita chaves desconhecidas", () => {
		expect(() => resolveProjectConfig({ invalidKey: true })).toThrow(
			"Invalid project config in project.config.json",
		);
		expect(() => resolveProjectConfig({ invalidKey: true })).toThrow(
			"invalidKey",
		);
	});

	test("rejeita defaultTheme inválido", () => {
		expect(() => resolveProjectConfig({ defaultTheme: "sepia" })).toThrow(
			"defaultTheme",
		);
	});
});

describe("readProjectConfig", () => {
	test("lê project.config.json e aplica defaults sem depender de arquivo de defaults", async () => {
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

	test("retorna erro claro para JSON inválido", async () => {
		const directory = await createProjectDirectory("{");

		await expect(readProjectConfig(directory)).rejects.toThrow(
			"Invalid JSON in project.config.json",
		);
	});

	test("retorna erro com caminho do campo problemático", async () => {
		const directory = await createProjectDirectory(`{
			"defaultTheme": "sepia"
		}`);
		const result = readProjectConfig(directory);

		await expect(result).rejects.toThrow(
			"Invalid project config in project.config.json",
		);
		await expect(result).rejects.toThrow("defaultTheme");
	});
});
