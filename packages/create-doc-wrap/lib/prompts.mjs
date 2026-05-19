import { builtinModules } from "node:module";
import { stdin as defaultInput, stdout as defaultOutput } from "node:process";
import { createInterface } from "node:readline";
import { packageManagers } from "./package-manager.mjs";
import { templates } from "./templates.mjs";

export const createPromptSession = ({
	input = defaultInput,
	output = defaultOutput,
} = {}) => {
	const readline = createInterface({
		input,
		output,
		terminal: Boolean(output.isTTY),
	});
	const lines = readline[Symbol.asyncIterator]();

	return {
		ask: async (question) => {
			output.write(question);
			const nextLine = await lines.next();

			return nextLine.done ? "" : nextLine.value;
		},
		close: () => readline.close(),
	};
};

const defaultAsk = async (
	question,
	{ input = defaultInput, output = defaultOutput } = {},
) => {
	const promptSession = createPromptSession({ input, output });

	try {
		return await promptSession.ask(question);
	} finally {
		promptSession.close();
	}
};

const formatOptions = (options) =>
	options.map((option, index) => `  ${index + 1}. ${option}`).join("\n");

export const isInteractiveSession = ({
	env = process.env,
	input = defaultInput,
	output = defaultOutput,
} = {}) => Boolean(input.isTTY && output.isTTY && !env.CI);

export const projectNameErrorMessage =
	"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.";

const builtinModuleNames = new Set(
	builtinModules.map((moduleName) => moduleName.replace(/^node:/, "")),
);

const normalizePackageSegment = (value) =>
	value.replace(/[^a-z0-9._-]/g, "").replace(/-+/g, "-");

export const normalizePackageName = (name) => {
	if (typeof name !== "string") {
		return "";
	}

	const normalizedValue = name.trim().toLowerCase().replace(/\s+/g, "-");

	if (!normalizedValue) {
		return "";
	}

	if (normalizedValue.startsWith("@")) {
		const scopedSegments = normalizedValue
			.slice(1)
			.split("/")
			.map(normalizePackageSegment);

		return `@${scopedSegments.join("/")}`;
	}

	if (normalizedValue.includes("/")) {
		return normalizedValue.split("/").map(normalizePackageSegment).join("/");
	}

	return normalizePackageSegment(normalizedValue);
};

export const isValidProjectPackageName = (name) => {
	if (!name || typeof name !== "string") {
		return false;
	}

	if (name.length > 214) {
		return false;
	}

	if (name.includes(" ") || name.includes("~")) {
		return false;
	}

	if (!/^[a-z0-9._/@-]+$/.test(name)) {
		return false;
	}

	if (name.startsWith("@")) {
		const scopedMatch = /^@([^/]+)\/([^/]+)$/.exec(name);

		if (!scopedMatch) {
			return false;
		}

		const [, scopeName, packageName] = scopedMatch;

		return (
			/^[a-z0-9][a-z0-9._-]*$/.test(scopeName) &&
			/^[a-z0-9][a-z0-9._-]*$/.test(packageName)
		);
	}

	if (name.startsWith(".") || name.startsWith("_") || name.includes("/")) {
		return false;
	}

	if (name === "node_modules" || name === "favicon.ico") {
		return false;
	}

	if (builtinModuleNames.has(name)) {
		return false;
	}

	return /^[a-z0-9][a-z0-9._-]*$/.test(name);
};

export const resolveProjectDirectoryName = (packageName) => {
	const projectDirectoryName = packageName
		.replace(/^@/, "")
		.replaceAll("/", "-");

	if (
		!projectDirectoryName ||
		projectDirectoryName.includes("/") ||
		projectDirectoryName.includes("\\")
	) {
		throw new Error(
			"Não foi possível resolver um diretório válido para o projeto.",
		);
	}

	return projectDirectoryName;
};

export const resolveSelection = (value, options, label) => {
	const normalizedValue = value.trim().toLowerCase();

	if (!normalizedValue) {
		throw new Error(
			`Seleção inválida de ${label}. Escolha uma das opções: ${options.join(", ")}.`,
		);
	}

	const numericValue = Number(normalizedValue);

	if (
		Number.isInteger(numericValue) &&
		numericValue >= 1 &&
		numericValue <= options.length
	) {
		return options[numericValue - 1];
	}

	const optionByValue = options.find(
		(option) => option.toLowerCase() === normalizedValue,
	);

	if (optionByValue) {
		return optionByValue;
	}

	throw new Error(
		`Seleção inválida de ${label}. Escolha uma das opções: ${options.join(", ")}.`,
	);
};

export const resolveProjectName = async (
	projectNameArg,
	{
		ask = defaultAsk,
		env = process.env,
		input = defaultInput,
		output = defaultOutput,
		interactive = isInteractiveSession({ env, input, output }),
	} = {},
) => {
	const normalizedProjectNameArg = projectNameArg
		? normalizePackageName(projectNameArg)
		: "";

	if (
		normalizedProjectNameArg &&
		isValidProjectPackageName(normalizedProjectNameArg)
	) {
		return normalizedProjectNameArg;
	}

	if (projectNameArg) {
		throw new Error(projectNameErrorMessage);
	}

	if (!interactive) {
		throw new Error(
			"O nome do projeto é obrigatório. Informe o nome como argumento ou execute o comando em modo interativo.",
		);
	}

	const promptedProjectName = await ask("Nome do projeto: ", { input, output });
	const normalizedPromptedProjectName =
		normalizePackageName(promptedProjectName);

	if (
		!normalizedPromptedProjectName ||
		!isValidProjectPackageName(normalizedPromptedProjectName)
	) {
		throw new Error(projectNameErrorMessage);
	}

	return normalizedPromptedProjectName;
};

export const promptPackageManager = async ({
	ask = defaultAsk,
	input = defaultInput,
	output = defaultOutput,
} = {}) => {
	const selection = await ask(
		`Qual gerenciador de pacotes deseja usar?\n${formatOptions(packageManagers)}\n> `,
		{ input, output },
	);

	return resolveSelection(selection, packageManagers, "package manager");
};

export const promptTemplate = async ({
	ask = defaultAsk,
	input = defaultInput,
	output = defaultOutput,
} = {}) => {
	const selection = await ask(
		`Qual template deseja usar?\n${formatOptions(templates)}\n> `,
		{ input, output },
	);

	return resolveSelection(selection, templates, "template");
};
