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

describe("createInteractiveSession", () => {
	test("repete a selecao em modo interativo ate receber valor valido", async () => {
		const output = createWritableCollector({ isTTY: true });
		const error = createWritableCollector({ isTTY: true });
		const answers = ["0", "bun"];
		const session = createInteractiveSession({
			ask: async () => answers.shift() ?? "",
			error,
			input: { isTTY: true },
			output,
		});

		await expect(session.promptPackageManager()).resolves.toBe("bun");
		expect(error.toString()).toContain(
			"Erro: Seleção inválida de gerenciador de pacotes",
		);
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

	test("renderiza mensagem final com proximos passos", () => {
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

		expect(output.toString()).toContain("Proximos passos:");
		expect(output.toString()).toContain("  cd meu-projeto");
		expect(output.toString()).toContain("  pnpm install");
		expect(output.toString()).toContain("  pnpm dev");
	});
});
