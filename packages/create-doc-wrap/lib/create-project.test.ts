import { afterEach, describe, expect, test } from "bun:test";
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createProject } from "./create-project.mjs";

const createdDirectories: string[] = [];

const createTemporaryDirectory = async () => {
	const directory = await mkdtemp(join(tmpdir(), "create-doc-wrap-"));
	createdDirectories.push(directory);
	return directory;
};

const readGeneratedPackageJson = async (projectDirectory: string) =>
	JSON.parse(await readFile(join(projectDirectory, "package.json"), "utf8"));

const pathExists = async (path: string) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

afterEach(async () => {
	await Promise.all(
		createdDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("createProject", () => {
	test("cria projeto com template blog", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "blog-project");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "bun",
			projectName: "blog-project",
			template: "blog",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);

		expect(generatedPackageJson.name).toBe("blog-project");
		await expect(
			readFile(
				join(projectDirectory, "src", "@content", "blog", "boas-vindas.mdx"),
				"utf8",
			),
		).resolves.toContain("title:");
		await expect(
			readFile(
				join(
					projectDirectory,
					"src",
					"@presentation",
					"pages",
					"Blog",
					"index.tsx",
				),
				"utf8",
			),
		).resolves.toContain("BlogPage");
		expect(
			await pathExists(
				join(projectDirectory, "src", "@content", "docs", "introducao.mdx"),
			),
		).toBe(false);
		expect(
			await pathExists(
				join(
					projectDirectory,
					"src",
					"@presentation",
					"pages",
					"Docs",
					"index.tsx",
				),
			),
		).toBe(false);
	});

	test("cria projeto com template docs", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "docs-project");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "npm",
			projectName: "docs-project",
			template: "docs",
		});

		await expect(
			readFile(
				join(projectDirectory, "src", "@content", "docs", "introducao.mdx"),
				"utf8",
			),
		).resolves.toContain("title:");
		await expect(
			readFile(
				join(
					projectDirectory,
					"src",
					"@presentation",
					"pages",
					"Docs",
					"index.tsx",
				),
				"utf8",
			),
		).resolves.toContain("DocsPage");
		expect(
			await pathExists(
				join(projectDirectory, "src", "@content", "blog", "boas-vindas.mdx"),
			),
		).toBe(false);
		expect(
			await pathExists(
				join(
					projectDirectory,
					"src",
					"@presentation",
					"pages",
					"Blog",
					"index.tsx",
				),
			),
		).toBe(false);
	});

	test("cria projeto com template blog-docs", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "portal-project");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "pnpm",
			projectName: "portal-project",
			template: "blog-docs",
		});

		await expect(
			readFile(
				join(projectDirectory, "src", "@content", "docs", "introducao.mdx"),
				"utf8",
			),
		).resolves.toContain("title:");
		await expect(
			readFile(
				join(projectDirectory, "src", "@content", "blog", "boas-vindas.mdx"),
				"utf8",
			),
		).resolves.toContain("title:");
	});

	test("gera package.json sem workspaces nem workspace:*", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "my-docs");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "yarn",
			projectName: "my-docs",
			template: "blog-docs",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);
		const serializedPackageJson = JSON.stringify(generatedPackageJson);

		expect(generatedPackageJson).not.toHaveProperty("workspaces");
		expect(serializedPackageJson).not.toContain("workspace:*");
		expect(generatedPackageJson.scripts).toEqual({
			dev: "doc-wrap dev",
			build: "doc-wrap build",
			preview: "doc-wrap preview",
			check: "doc-wrap check",
		});
		expect(generatedPackageJson.devDependencies["@doc-wrap/cli"]).toMatch(
			/^\^?\d+\.\d+\.\d+/,
		);
		expect(generatedPackageJson.devDependencies).not.toHaveProperty("doc-wrap");
		expect(
			generatedPackageJson.dependencies["@doc-wrap/project-config"],
		).toMatch(/^\^?\d+\.\d+\.\d+/);
		expect(serializedPackageJson).not.toContain("file:");
	});

	test("atualiza o nome em package.json e project.config.json", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "custom-docs");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "bun",
			projectName: "custom-docs",
			template: "docs",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);
		const generatedProjectConfig = JSON.parse(
			await readFile(join(projectDirectory, "project.config.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("custom-docs");
		expect(generatedProjectConfig.name).toBe("custom-docs");
	});

	test("normaliza o nome do projeto ao criar o diretório e arquivos", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "meu-projeto");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "npm",
			projectName: "  Meu Projeto  ",
			template: "docs",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);
		const generatedProjectConfig = JSON.parse(
			await readFile(join(projectDirectory, "project.config.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("meu-projeto");
		expect(generatedProjectConfig.name).toBe("meu-projeto");
		expect(await pathExists(projectDirectory)).toBe(true);
	});

	test("separa package name scoped do diretório criado", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "main-docs-pax");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "npm",
			projectName: "@main-docs/pax",
			template: "docs",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);
		const generatedProjectConfig = JSON.parse(
			await readFile(join(projectDirectory, "project.config.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("@main-docs/pax");
		expect(generatedProjectConfig.name).toBe("@main-docs/pax");
		expect(await pathExists(projectDirectory)).toBe(true);
	});

	test("mantém pontos válidos no package name e no diretório", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "docs.v2");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "npm",
			projectName: "docs.v2",
			template: "docs",
		});

		const generatedPackageJson =
			await readGeneratedPackageJson(projectDirectory);
		const generatedProjectConfig = JSON.parse(
			await readFile(join(projectDirectory, "project.config.json"), "utf8"),
		);

		expect(generatedPackageJson.name).toBe("docs.v2");
		expect(generatedProjectConfig.name).toBe("docs.v2");
		expect(await pathExists(projectDirectory)).toBe(true);
	});

	test("restaura .gitignore do template no projeto gerado", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "gitignore-project");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "npm",
			projectName: "gitignore-project",
			template: "docs",
		});

		await expect(
			readFile(join(projectDirectory, ".gitignore"), "utf8"),
		).resolves.toContain("node_modules");
	});

	test("falha quando o nome do projeto é inválido", async () => {
		const sandboxDirectory = await createTemporaryDirectory();

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "!!!",
				template: "blog",
			}),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "node_modules",
				template: "blog",
			}),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "favicon.ico",
				template: "blog",
			}),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "fs",
				template: "blog",
			}),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "_foo",
				template: "blog",
			}),
		).rejects.toThrow(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
	});

	test("falha quando o diretório já existe e não está vazio", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "existing-project");

		await mkdir(projectDirectory, { recursive: true });
		await writeFile(join(projectDirectory, "README.md"), "occupied", "utf8");

		await expect(
			createProject({
				cwd: sandboxDirectory,
				packageManager: "bun",
				projectName: "existing-project",
				template: "blog",
			}),
		).rejects.toThrow("O diretório de destino já existe e não está vazio");
	});

	test("os projetos gerados não incluem arquivos internos do monorepo", async () => {
		const sandboxDirectory = await createTemporaryDirectory();
		const projectDirectory = join(sandboxDirectory, "clean-project");

		await createProject({
			cwd: sandboxDirectory,
			packageManager: "bun",
			projectName: "clean-project",
			template: "blog-docs",
		});

		for (const forbiddenPath of [
			".github",
			".husky",
			"packages",
			"bun.lock",
			"AGENTS.md",
			"CLAUDE.md",
			"CHANGELOG.md",
			".release-please-manifest.json",
			"release-please-config.json",
			"skills-lock.json",
		]) {
			expect(await pathExists(join(projectDirectory, forbiddenPath))).toBe(
				false,
			);
		}
	});
});
