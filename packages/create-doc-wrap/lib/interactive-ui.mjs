import { createRequire } from "node:module";
import { stdin as defaultInput, stdout as defaultOutput } from "node:process";
import {
	buildFinalInstructions,
	packageManagerOptions,
} from "./package-manager.mjs";
import {
	createPromptSession,
	isInteractiveSession,
	isValidProjectPackageName,
	normalizePackageName,
	projectNameErrorMessage,
	resolveProjectName,
	resolveSelection,
} from "./prompts.mjs";
import { templateOptions } from "./templates.mjs";

const require = createRequire(import.meta.url);

const createSelectionPrompt = ({ options, question }) =>
	`${question}\n${options
		.map(
			(option, index) =>
				`  ${index + 1}. ${option.label} (${option.value})\n     ${option.description}`,
		)
		.join("\n")}\n> `;

const writeBlock = (output, message = "") => {
	output.write(`${message}\n`);
};

const loadTerminalFactory = () => {
	const terminalKit = require("terminal-kit");

	if (typeof terminalKit.createTerminal === "function") {
		return ({ input = defaultInput, output = defaultOutput } = {}) =>
			terminalKit.createTerminal({
				stdin: input,
				stdout: output,
			});
	}

	if (typeof terminalKit.terminal === "function") {
		return ({ input = defaultInput, output = defaultOutput } = {}) =>
			terminalKit.terminal({
				stdin: input,
				stdout: output,
			});
	}

	throw new Error("Não foi possível inicializar o terminal-kit.");
};

const createFallbackPromptAdapter = ({
	ask,
	error = process.stderr,
	input = defaultInput,
	output = defaultOutput,
} = {}) => {
	const promptSession = ask
		? { ask, close: () => {} }
		: createPromptSession({ input, output });

	return {
		close: () => promptSession.close(),
		promptSelection: ({ options, question }) =>
			promptSession.ask(createSelectionPrompt({ options, question })),
		promptText: (question) => promptSession.ask(question),
		write: (message = "") => writeBlock(output, message),
		writeError: (message = "") => writeBlock(error, message),
	};
};

const createTerminalPromptAdapter = ({
	error = process.stderr,
	input = defaultInput,
	output = defaultOutput,
	terminalFactory = loadTerminalFactory(),
} = {}) => {
	const term = terminalFactory({ input, output });

	const write = (message = "") => {
		term(`${message}\n`);
	};

	const writeError = (message = "") => {
		if (typeof term.brightRed === "function") {
			term.brightRed(`${message}\n`);
			return;
		}

		error.write(`${message}\n`);
	};

	return {
		close: () => {
			if (typeof term.grabInput === "function") {
				term.grabInput(false);
			}
		},
		promptSelection: async ({ options, question }) => {
			write(question);
			const items = options.map(
				(option) => `${option.label} (${option.value}) - ${option.description}`,
			);
			const response = await term.singleColumnMenu(items, {
				cancelable: false,
				selectedStyle: term.black?.bgGreen ?? term.green,
				submitOnEnter: true,
			}).promise;

			write();
			return options[response.selectedIndex].value;
		},
		promptText: async (question) => {
			if (typeof term.cyan === "function") {
				term.cyan(question);
			} else {
				term(question);
			}

			const value = await term.inputField().promise;
			write();
			return value ?? "";
		},
		write,
		writeError,
	};
};

export const createInteractiveSession = ({
	ask: askOverride,
	env = process.env,
	error = process.stderr,
	input = defaultInput,
	output = defaultOutput,
	terminalFactory,
} = {}) => {
	const interactive = isInteractiveSession({ env, input, output });
	const promptAdapter =
		interactive && !askOverride
			? createTerminalPromptAdapter({
					error,
					input,
					output,
					terminalFactory,
				})
			: createFallbackPromptAdapter({
					ask: askOverride,
					error,
					input,
					output,
				});

	const showSelection = (label, value) => {
		promptAdapter.write(`[ok] ${label}: ${value}`);
		promptAdapter.write();
	};

	const askUntilValid = async ({ label, options, question }) => {
		const optionValues = options.map((option) => option.value);

		while (true) {
			try {
				const selection = await promptAdapter.promptSelection({
					options,
					question,
				});
				const resolvedSelection = resolveSelection(
					selection,
					optionValues,
					label,
				);
				showSelection(label, resolvedSelection);
				return resolvedSelection;
			} catch (selectionError) {
				const message =
					selectionError instanceof Error
						? selectionError.message
						: String(selectionError);

				if (!interactive) {
					throw new Error(message);
				}

				promptAdapter.writeError(`Erro: ${message}`);
				promptAdapter.write();
			}
		}
	};

	return {
		close: () => promptAdapter.close(),
		isInteractive: interactive,
		promptPackageManager: async () =>
			askUntilValid({
				label: "gerenciador de pacotes",
				options: packageManagerOptions,
				question: "Escolha o gerenciador de pacotes do projeto:",
			}),
		promptProjectName: async (projectNameArg) => {
			if (projectNameArg) {
				return resolveProjectName(projectNameArg, {
					env,
					input,
					output,
				});
			}

			if (!interactive) {
				return resolveProjectName(undefined, {
					env,
					input,
					output,
				});
			}

			while (true) {
				const promptedProjectName = await promptAdapter.promptText(
					"Nome do projeto (ex.: docs-internos ou @scope/docs): ",
				);

				promptAdapter.write("[step] Validando nome do projeto...");
				const normalizedProjectName = normalizePackageName(promptedProjectName);

				if (
					normalizedProjectName &&
					isValidProjectPackageName(normalizedProjectName)
				) {
					showSelection("Projeto", normalizedProjectName);
					return normalizedProjectName;
				}

				promptAdapter.writeError(`Erro: ${projectNameErrorMessage}`);
				promptAdapter.write();
			}
		},
		promptTemplate: async () =>
			askUntilValid({
				label: "template",
				options: templateOptions,
				question: "Escolha a base inicial do projeto:",
			}),
		showError: (message) => {
			promptAdapter.writeError(`Erro: ${message}`);
		},
		showFinalInstructions: ({ packageManager, projectDirectoryName }) => {
			promptAdapter.write("Proximos passos:");

			for (const command of buildFinalInstructions({
				packageManager,
				projectDirectoryName,
			}).split("\n")) {
				promptAdapter.write(`  ${command}`);
			}
		},
		showIntro: () => {
			promptAdapter.write("Create Doc Wrap");
			promptAdapter.write(
				"Cria um novo projeto Doc Wrap a partir de um template pronto.",
			);
			promptAdapter.write();
		},
		showStep: ({ message }) => {
			promptAdapter.write(`[step] ${message}`);
		},
		showSuccess: ({ projectDirectory }) => {
			promptAdapter.write(
				`[ok] Projeto criado com sucesso em ${projectDirectory}.`,
			);
			promptAdapter.write();
		},
	};
};
