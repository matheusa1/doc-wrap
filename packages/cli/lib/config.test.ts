import { afterEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { projectConfigDefaults } from "@doc-wrap/project-config";

const createdDirectories: string[] = [];
const cliBinPath = join(
	process.cwd(),
	"packages",
	"cli",
	"bin",
	"doc-wrap.mjs",
);

const createProjectDirectory = async (projectConfig: string) => {
	const directory = await mkdtemp(join(tmpdir(), "doc-wrap-cli-config-"));
	createdDirectories.push(directory);

	await writeFile(
		join(directory, "project.config.json"),
		projectConfig,
		"utf8",
	);

	return directory;
};

const runCli = (cwd: string, args: string[]) =>
	spawnSync("node", [cliBinPath, ...args], {
		cwd,
		encoding: "utf8",
	});

afterEach(async () => {
	await Promise.all(
		createdDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("doc-wrap config", () => {
	test("sem subcomando imprime help em stdout e retorna sucesso", async () => {
		const directory = await createProjectDirectory(`{
			"name": "Central Docs"
		}`);
		const result = runCli(directory, ["config"]);

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		expect(result.stdout).toContain("Uso: doc-wrap config <subcomando>");
		expect(result.stdout).toContain("configuração efetiva");
	});

	test("validate retorna sucesso para config válida", async () => {
		const directory = await createProjectDirectory(`{
			"name": "Central Docs"
		}`);
		const result = runCli(directory, ["config", "validate"]);

		expect(result.status).toBe(0);
		expect(result.stdout).toContain("Configuração válida");
		expect(result.stderr).toBe("");
	});

	test("print exibe a config resolvida com defaults", async () => {
		const directory = await createProjectDirectory(`{
			"name": "Central Docs",
			"hasDocs": false
		}`);
		const result = runCli(directory, ["config", "print"]);

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		expect(JSON.parse(result.stdout)).toEqual({
			...projectConfigDefaults,
			name: "Central Docs",
			hasDocs: false,
		});
	});

	test("print não altera o arquivo do projeto", async () => {
		const originalContent = `{
			"name": "Central Docs"
		}`;
		const directory = await createProjectDirectory(originalContent);
		const projectConfigPath = join(directory, "project.config.json");

		const before = await readFile(projectConfigPath, "utf8");
		const result = runCli(directory, ["config", "print"]);
		const after = await readFile(projectConfigPath, "utf8");

		expect(result.status).toBe(0);
		expect(after).toBe(before);
	});

	test("validate retorna erro amigável para arquivo ausente", async () => {
		const directory = await mkdtemp(join(tmpdir(), "doc-wrap-cli-config-"));
		createdDirectories.push(directory);
		const result = runCli(directory, ["config", "validate"]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain("Arquivo obrigatório ausente");
		expect(result.stderr).not.toContain("ENOENT");
		expect(result.stderr).not.toContain("at ");
	});

	test("validate retorna erro amigável para JSON inválido", async () => {
		const directory = await createProjectDirectory("{");
		const result = runCli(directory, ["config", "validate"]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain("JSON inválido em project.config.json");
		expect(result.stderr).not.toContain("SyntaxError");
		expect(result.stderr).not.toContain("\n    at ");
	});

	test("validate retorna erro amigável para schema inválido", async () => {
		const directory = await createProjectDirectory(`{
			"defaultTheme": "sepia"
		}`);
		const result = runCli(directory, ["config", "validate"]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain(
			"Configuração de projeto inválida em project.config.json",
		);
		expect(result.stderr).toContain("defaultTheme");
		expect(result.stderr).not.toContain("ZodError");
		expect(result.stderr).not.toContain("at ");
	});

	test("subcomandos herdados caem como desconhecidos", async () => {
		const directory = await createProjectDirectory(`{
			"name": "Central Docs"
		}`);

		for (const subcommand of ["toString", "constructor"]) {
			const result = runCli(directory, ["config", subcommand]);

			expect(result.status).toBe(1);
			expect(result.stdout).toBe("");
			expect(result.stderr).toContain(
				`Subcomando desconhecido: config ${subcommand}`,
			);
		}
	});
});
