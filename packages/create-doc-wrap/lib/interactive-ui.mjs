import { stdin as defaultInput, stdout as defaultOutput } from "node:process";
import { createInterface } from "node:readline";
import {
	buildFinalInstructions,
	packageManagerOptions,
} from "./package-manager.mjs";
import {
	isInteractiveSession,
	isValidProjectPackageName,
	normalizePackageName,
	projectNameErrorMessage,
	resolveProjectName,
	resolveSelection,
} from "./prompts.mjs";
import { templateOptions } from "./templates.mjs";

const createPromptSession = ({
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

const formatChoiceList = (options) =>
	options
		.map(
			(option, index) =>
				`  ${index + 1}. ${option.label} (${option.value})\n     ${option.description}`,
		)
		.join("\n");

const createSelectionPrompt = ({ options, question }) =>
	`${question}\n${formatChoiceList(options)}\n> `;

const writeBlock = (output, message = "") => {
	output.write(`${message}\n`);
};

export const createInteractiveSession = ({
	ask: askOverride,
	env = process.env,
	error = process.stderr,
	input = defaultInput,
	output = defaultOutput,
} = {}) => {
	const promptSession = askOverride
		? { ask: askOverride, close: () => {} }
		: createPromptSession({ input, output });
	const interactive = isInteractiveSession({ env, input, output });

	const showSelection = (label, value) => {
		writeBlock(output, `[ok] ${label}: ${value}`);
		writeBlock(output);
	};

	const askUntilValid = async ({ label, options, question }) => {
		const optionValues = options.map((option) => option.value);

		while (true) {
			try {
				const selection = await promptSession.ask(
					createSelectionPrompt({ options, question }),
				);
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

				writeBlock(error, `Erro: ${message}`);
				writeBlock(output);
			}
		}
	};

	return {
		close: () => promptSession.close(),
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
				const promptedProjectName = await promptSession.ask(
					"Nome do projeto (ex.: docs-internos ou @scope/docs): ",
				);

				writeBlock(output, "[step] Validando nome do projeto...");
				const normalizedProjectName = normalizePackageName(promptedProjectName);

				if (
					normalizedProjectName &&
					isValidProjectPackageName(normalizedProjectName)
				) {
					showSelection("Projeto", normalizedProjectName);
					return normalizedProjectName;
				}

				writeBlock(error, `Erro: ${projectNameErrorMessage}`);
				writeBlock(output);
			}
		},
		promptTemplate: async () =>
			askUntilValid({
				label: "template",
				options: templateOptions,
				question: "Escolha a base inicial do projeto:",
			}),
		showError: (message) => {
			writeBlock(error, `Erro: ${message}`);
		},
		showFinalInstructions: ({ packageManager, projectDirectoryName }) => {
			writeBlock(output, "Proximos passos:");

			for (const command of buildFinalInstructions({
				packageManager,
				projectDirectoryName,
			}).split("\n")) {
				writeBlock(output, `  ${command}`);
			}
		},
		showIntro: () => {
			writeBlock(output, "Create Doc Wrap");
			writeBlock(
				output,
				"Cria um novo projeto Doc Wrap a partir de um template pronto.",
			);
			writeBlock(output);
		},
		showStep: ({ message }) => {
			writeBlock(output, `[step] ${message}`);
		},
		showSuccess: ({ projectDirectory }) => {
			writeBlock(
				output,
				`[ok] Projeto criado com sucesso em ${projectDirectory}.`,
			);
			writeBlock(output);
		},
	};
};
