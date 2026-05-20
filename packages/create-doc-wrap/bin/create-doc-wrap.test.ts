import { afterEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const createdDirectories: string[] = [];
const binPath = join(
	process.cwd(),
	"packages",
	"create-doc-wrap",
	"bin",
	"create-doc-wrap.mjs",
);

afterEach(async () => {
	await Promise.all(
		createdDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("create-doc-wrap bin", () => {
	test("exibe ajuda sem entrar no fluxo interativo", () => {
		const result = spawnSync(process.execPath, [binPath, "--help"], {
			encoding: "utf8",
		});

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		expect(result.stdout).toContain("Uso: create-doc-wrap [nome-do-projeto]");
		expect(result.stdout).toContain("-h, --help");
		expect(result.stdout).not.toContain(
			"Qual gerenciador de pacotes deseja usar?",
		);
	});

	test("gera projeto com argumento posicional e imprime instruções do package manager", async () => {
		const sandboxDirectory = await mkdtemp(
			join(tmpdir(), "create-doc-wrap-bin-"),
		);
		const projectDirectory = join(sandboxDirectory, "my-docs");
		createdDirectories.push(sandboxDirectory);

		const result = spawnSync(process.execPath, [binPath, "my-docs"], {
			cwd: sandboxDirectory,
			encoding: "utf8",
			input: "4\n1\n",
		});

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		expect(result.stdout).toContain("cd my-docs");
		expect(result.stdout).toContain("bun install");
		expect(result.stdout).toContain("bun run dev");
		expect(existsSync(projectDirectory)).toBe(true);

		const generatedPackageJson = JSON.parse(
			await readFile(join(projectDirectory, "package.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("my-docs");
	});

	test("usa o diretório derivado nas instruções finais para scoped package", async () => {
		const sandboxDirectory = await mkdtemp(
			join(tmpdir(), "create-doc-wrap-bin-"),
		);
		const projectDirectory = join(sandboxDirectory, "main-docs-pax");
		createdDirectories.push(sandboxDirectory);

		const result = spawnSync(process.execPath, [binPath, "@main-docs/pax"], {
			cwd: sandboxDirectory,
			encoding: "utf8",
			input: "4\n1\n",
		});

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		expect(result.stdout).toContain("Projeto criado com sucesso em ");
		expect(result.stdout).toContain("main-docs-pax.\n");
		expect(result.stdout).toContain("cd main-docs-pax");
		expect(result.stdout).not.toContain("cd @main-docs/pax");
		expect(existsSync(projectDirectory)).toBe(true);

		const generatedPackageJson = JSON.parse(
			await readFile(join(projectDirectory, "package.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("@main-docs/pax");
	});

	test("falha quando o nome não é informado em modo não interativo", async () => {
		const sandboxDirectory = await mkdtemp(
			join(tmpdir(), "create-doc-wrap-bin-"),
		);
		createdDirectories.push(sandboxDirectory);
		const result = spawnSync(process.execPath, [binPath], {
			cwd: sandboxDirectory,
			encoding: "utf8",
			input: "",
		});

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain("O nome do projeto é obrigatório");
	});
});
