import {
	cp,
	mkdir,
	readdir,
	readFile,
	stat,
	writeFile,
} from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { assertPackageManager } from "./package-manager.mjs";
import { createProjectPackageJson } from "./project-package.mjs";
import {
	isValidProjectPackageName,
	normalizePackageName,
	resolveProjectDirectoryName,
} from "./prompts.mjs";
import { assertTemplate, resolveTemplateDirectory } from "./templates.mjs";

const updateProjectConfigName = async (projectDirectory, projectName) => {
	const projectConfigPath = join(projectDirectory, "project.config.json");
	const currentProjectConfig = JSON.parse(
		await readFile(projectConfigPath, "utf8"),
	);

	const updatedProjectConfig = {
		...currentProjectConfig,
		name: projectName,
	};

	await writeFile(
		projectConfigPath,
		`${JSON.stringify(updatedProjectConfig, null, "\t")}\n`,
		"utf8",
	);
};

const ensureDestinationDirectory = async (projectDirectory) => {
	try {
		const projectDirectoryStats = await stat(projectDirectory);

		if (!projectDirectoryStats.isDirectory()) {
			throw new Error(
				`O destino já existe e não é um diretório: ${projectDirectory}`,
			);
		}

		const directoryEntries = await readdir(projectDirectory);

		if (directoryEntries.length > 0) {
			throw new Error(
				`O diretório de destino já existe e não está vazio: ${projectDirectory}`,
			);
		}
	} catch (error) {
		if (error?.code === "ENOENT") {
			await mkdir(projectDirectory, { recursive: true });
			return;
		}

		throw error;
	}
};

const copyTemplateContents = async (templateDirectory, projectDirectory) => {
	const templateEntries = await readdir(templateDirectory, {
		withFileTypes: true,
	});

	try {
		await Promise.all(
			templateEntries.map((entry) => {
				const destinationName =
					entry.name === "gitignore" ? ".gitignore" : entry.name;

				return cp(
					join(templateDirectory, entry.name),
					join(projectDirectory, destinationName),
					{
						recursive: entry.isDirectory(),
					},
				);
			}),
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);

		throw new Error(
			`Falha ao copiar o template para ${projectDirectory}: ${message}`,
			{
				cause: error,
			},
		);
	}
};

const resolveProjectDirectory = ({
	cwd,
	destinationDirectory,
	projectDirectoryName,
}) => {
	if (destinationDirectory) {
		return isAbsolute(destinationDirectory)
			? destinationDirectory
			: join(cwd, destinationDirectory);
	}

	return join(cwd, projectDirectoryName);
};

export const createProject = async ({
	cwd = process.cwd(),
	destinationDirectory,
	packageManager,
	projectName,
	template,
}) => {
	const packageName = normalizePackageName(projectName);

	if (!packageName || !isValidProjectPackageName(packageName)) {
		throw new Error(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
	}

	assertPackageManager(packageManager);
	const selectedTemplate = assertTemplate(template);
	const projectDirectoryName = resolveProjectDirectoryName(packageName);
	const projectDirectory = resolveProjectDirectory({
		cwd,
		destinationDirectory,
		projectDirectoryName,
	});
	const templateDirectory = resolveTemplateDirectory(selectedTemplate);

	await ensureDestinationDirectory(projectDirectory);
	await copyTemplateContents(templateDirectory, projectDirectory);
	await updateProjectConfigName(projectDirectory, packageName);

	const packageJson = await createProjectPackageJson({
		destinationDirectory: projectDirectory,
		projectName: packageName,
	});

	await writeFile(
		join(projectDirectory, "package.json"),
		`${JSON.stringify(packageJson, null, "\t")}\n`,
		"utf8",
	);

	return {
		packageJson,
		projectDirectory,
		projectDirectoryName,
		projectName: packageName,
		template: selectedTemplate,
	};
};
