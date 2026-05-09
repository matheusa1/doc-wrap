import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const createDocWrapLibDir = dirname(fileURLToPath(import.meta.url));

export const repoRootDir = join(createDocWrapLibDir, "..", "..", "..");

const sanitizeDependencies = (dependencies = {}) => {
	const sanitizedDependencies = {};

	for (const [dependencyName, version] of Object.entries(dependencies)) {
		if (String(version).startsWith("workspace:")) {
			continue;
		}

		sanitizedDependencies[dependencyName] = version;
	}

	return sanitizedDependencies;
};

const readRepositoryPackageJson = async () => {
	const repositoryPackageJson = await readFile(
		join(repoRootDir, "package.json"),
		"utf8",
	);

	return JSON.parse(repositoryPackageJson);
};

export const createProjectPackageJson = async ({ projectName }) => {
	const repositoryPackageJson = await readRepositoryPackageJson();
	const dependencies = sanitizeDependencies(repositoryPackageJson.dependencies);
	const devDependencies = sanitizeDependencies(
		repositoryPackageJson.devDependencies,
	);

	delete dependencies["@doc-wrap/project-config"];
	delete devDependencies["@doc-wrap/cli"];
	delete devDependencies.husky;

	return {
		name: projectName,
		private: true,
		type: "module",
		scripts: {
			dev: "doc-wrap dev",
			build: "doc-wrap build",
			preview: "doc-wrap preview",
			check: "doc-wrap check",
		},
		dependencies: {
			...dependencies,
			"@doc-wrap/project-config": "^0.1.0",
		},
		devDependencies: {
			...devDependencies,
			"doc-wrap": "^0.1.0",
		},
	};
};
