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
	input = defaultInput,
	output = defaultOutput,
} = {}) => Boolean(input.isTTY && output.isTTY);

export const normalizeProjectName = (name) => {
	if (typeof name !== "string") {
		return "";
	}

	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9_-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const isValidProjectPackageName = (name) => {
	if (!name || typeof name !== "string") {
		return false;
	}

	if (name.length > 214) {
		return false;
	}

	if (name.startsWith(".") || name.startsWith("_")) {
		return false;
	}

	if (name === "node_modules" || name === "favicon.ico") {
		return false;
	}

	return /^[a-z0-9_-]+$/.test(name);
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
		input = defaultInput,
		output = defaultOutput,
		interactive = isInteractiveSession({ input, output }),
	} = {},
) => {
	const normalizedProjectNameArg = projectNameArg
		? normalizeProjectName(projectNameArg)
		: "";

	if (
		normalizedProjectNameArg &&
		isValidProjectPackageName(normalizedProjectNameArg)
	) {
		return normalizedProjectNameArg;
	}

	if (projectNameArg) {
		throw new Error(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
	}

	if (!interactive) {
		throw new Error(
			"O nome do projeto é obrigatório. Informe o nome como argumento ou execute o comando em modo interativo.",
		);
	}

	const promptedProjectName = await ask("Nome do projeto: ", { input, output });
	const normalizedPromptedProjectName =
		normalizeProjectName(promptedProjectName);

	if (
		!normalizedPromptedProjectName ||
		!isValidProjectPackageName(normalizedPromptedProjectName)
	) {
		throw new Error(
			"O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
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
