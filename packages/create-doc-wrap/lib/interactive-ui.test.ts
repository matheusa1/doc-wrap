import { describe, expect, test } from "bun:test";
import { createInteractiveSession } from "./interactive-ui.mjs";

const createWritableCollector = ({ isTTY = false } = {}) => {
	const chunks = [];

	return {
		chunks,
		isTTY,
		toString: () => chunks.join(""),
		write: (value) => {
			chunks.push(String(value));
		},
	};
};

const createFakeTerminal = ({
	inputAnswers = [],
	menuSelections = [],
	output = createWritableCollector({ isTTY: true }),
} = {}) => {
	const write = (value) => {
		output.write(value);
	};

	const term = Object.assign(write, {
		black: {
			bgGreen: () => undefined,
		},
		brightRed: (value) => {
			output.write(value);
		},
		cyan: (value) => {
			output.write(value);
		},
		grabInput: () => undefined,
		inputField: () => ({
			promise: Promise.resolve(
				inputAnswers.length > 0 ? inputAnswers.shift() : "",
			),
		}),
		singleColumnMenu: (items) => {
			const selectedIndex = menuSelections.shift() ?? 0;

			if (selectedIndex < 0 || selectedIndex >= items.length) {
				return {
					promise: Promise.reject(new Error("Seleção fora do intervalo.")),
				};
			}

			return {
				promise: Promise.resolve({ selectedIndex }),
			};
		},
	});

	return {
		output,
		terminalFactory: () => term,
	};
};

describe("createInteractiveSession", () => {
	test("usa terminal-kit para selecionar opcoes em modo interativo", async () => {
		const { output, terminalFactory } = createFakeTerminal({
			menuSelections: [3],
		});
		const error = createWritableCollector({ isTTY: true });
		const session = createInteractiveSession({
			env: {},
			error,
			input: { isTTY: true },
			output,
			terminalFactory,
		});

		await expect(session.promptPackageManager()).resolves.toBe("bun");
		expect(error.toString()).toBe("");
		expect(output.toString()).toContain("[ok] gerenciador de pacotes: bun");
	});

	test("falha sem retry em fallback nao interativo", async () => {
		const output = createWritableCollector();
		const error = createWritableCollector();
		const session = createInteractiveSession({
			ask: async () => "invalid",
			env: {},
			error,
			input: { isTTY: false },
			output,
		});

		await expect(session.promptTemplate()).rejects.toThrow(
			"Seleção inválida de template",
		);
		expect(error.toString()).toBe("");
	});

	test("repete o nome do projeto em modo interativo ate receber valor valido", async () => {
		const { output, terminalFactory } = createFakeTerminal({
			inputAnswers: ["!!!", "Meu Projeto"],
		});
		const error = createWritableCollector({ isTTY: true });
		const session = createInteractiveSession({
			env: {},
			error,
			input: { isTTY: true },
			output,
			terminalFactory,
		});

		await expect(session.promptProjectName()).resolves.toBe("meu-projeto");
		expect(output.toString()).toContain("[step] Validando nome do projeto...");
		expect(output.toString()).toContain("[ok] Projeto: meu-projeto");
		expect(output.toString()).toContain(
			"Nome do projeto (ex.: docs-internos ou @scope/docs): ",
		);
		expect(output.toString()).toContain(
			"Erro: O nome do projeto é obrigatório e deve resultar em um nome válido para package.json.",
		);
		expect(error.toString()).toBe("");
	});

	test("considera CI como nao interativo mesmo com TTY", () => {
		const output = createWritableCollector({ isTTY: true });
		const error = createWritableCollector({ isTTY: true });
		const session = createInteractiveSession({
			ask: async () => "",
			env: { CI: "1" },
			error,
			input: { isTTY: true },
			output,
		});

		expect(session.isInteractive).toBe(false);
	});

	test("encerra o fluxo quando o prompt de nome e cancelado", async () => {
		const { output, terminalFactory } = createFakeTerminal({
			inputAnswers: [undefined],
		});
		const error = createWritableCollector({ isTTY: true });
		const session = createInteractiveSession({
			env: {},
			error,
			input: { isTTY: true },
			output,
			terminalFactory,
		});

		await expect(session.promptProjectName()).rejects.toThrow(
			"Entrada cancelada pelo usuário.",
		);
		expect(output.toString()).toContain(
			"Nome do projeto (ex.: docs-internos ou @scope/docs): ",
		);
	});

	test("renderiza mensagem final com próximos passos", () => {
		const output = createWritableCollector();
		const session = createInteractiveSession({
			ask: async () => "",
			input: { isTTY: false },
			output,
		});

		session.showFinalInstructions({
			packageManager: "pnpm",
			projectDirectoryName: "meu-projeto",
		});

		expect(output.toString()).toContain("Próximos passos:");
		expect(output.toString()).toContain("  cd meu-projeto");
		expect(output.toString()).toContain("  pnpm install");
		expect(output.toString()).toContain("  pnpm dev");
	});

	test("renderiza erro no stream dedicado em fallback nao interativo", () => {
		const output = createWritableCollector();
		const error = createWritableCollector();
		const session = createInteractiveSession({
			ask: async () => "",
			error,
			input: { isTTY: false },
			output,
		});

		session.showError("Falha qualquer");

		expect(error.toString()).toContain("Erro: Falha qualquer");
		expect(output.toString()).toBe("");
	});
});
