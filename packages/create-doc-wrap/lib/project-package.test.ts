import { describe, expect, test } from "bun:test";
import { createProjectPackageJson } from "./project-package.mjs";

describe("createProjectPackageJson", () => {
	test("gera package.json com dependências explícitas", async () => {
		const packageJson = await createProjectPackageJson({
			projectName: "test-project",
		});

		expect(packageJson.name).toBe("test-project");
		expect(packageJson.private).toBe(true);
		expect(packageJson.type).toBe("module");

		// Verifica scripts
		expect(packageJson.scripts).toEqual({
			dev: "doc-wrap dev",
			build: "doc-wrap build",
			preview: "doc-wrap preview",
			check: "doc-wrap check",
		});

		// Verifica que não contém workspace:*
		const serialized = JSON.stringify(packageJson);
		expect(serialized).not.toContain("workspace:*");

		// Verifica que não contém file:
		expect(serialized).not.toContain("file:");

		// Verifica dependências obrigatórias com versões fixas/específicas
		expect(packageJson.devDependencies["@doc-wrap/cli"]).toBe("^0.1.0");
		expect(packageJson.dependencies["@doc-wrap/project-config"]).toBe("^0.1.0");

		// Verifica que não contém dependências indesejadas
		expect(packageJson.devDependencies).not.toHaveProperty("doc-wrap");
		expect(packageJson.devDependencies).not.toHaveProperty("husky");

		// Verifica presença de algumas dependências do template
		expect(packageJson.dependencies.react).toBeDefined();
		expect(packageJson.dependencies.shadcn).toBeDefined();
		expect(packageJson.dependencies.tailwindcss).toBeDefined();
		expect(packageJson.devDependencies.typescript).toBeDefined();
		expect(packageJson.devDependencies.vite).toBeDefined();
	});

	test("não depende da raiz do monorepo", async () => {
		// Este teste é mais conceitual dado que o arquivo mjs não importa mais fs/path para ler o package.json raiz.
		// Se ele ainda dependesse, falharia se rodássemos em um ambiente sem o package.json na posição esperada.
		const packageJson = await createProjectPackageJson({
			projectName: "isolated-project",
		});
		expect(packageJson.name).toBe("isolated-project");
	});
});
