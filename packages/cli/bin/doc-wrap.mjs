#!/usr/bin/env node

import { runConfigCommand } from "../lib/config.mjs";
import { runDocsIndex, runPostbuild } from "../lib/postbuild.mjs";
import { run } from "../lib/run.mjs";

const rootDir = process.cwd();
const [, , command, ...args] = process.argv;
const defaultOutDir = "dist";

const resolveOutDir = (commandArgs) => {
	for (let index = 0; index < commandArgs.length; index += 1) {
		const arg = commandArgs[index];

		if (arg === "--outDir") {
			return commandArgs[index + 1] ?? defaultOutDir;
		}

		if (arg.startsWith("--outDir=")) {
			return arg.slice("--outDir=".length) || defaultOutDir;
		}
	}

	return defaultOutDir;
};

const help = `Uso: doc-wrap <comando> [opcoes]

Comandos:
  dev       Inicia o servidor de desenvolvimento do Vite
  build     Executa type-check, build e o pipeline de pos-build
  preview   Inicia o preview do build de producao
  check     Executa as validacoes do projeto com Biome
  config
    validate
            Valida o project.config.json do projeto
    print   Imprime a configuracao efetiva com defaults aplicados
  docs:index
            Gera paginas estaticas de docs para o Pagefind
`;

const commandAliases = new Set(["--help", "-h", "help"]);

const commands = {
	dev: () => run(rootDir, "vite", ["--host", ...args]),
	build: async () => {
		const outDir = resolveOutDir(args);

		run(rootDir, "tsc", ["-b"]);
		run(rootDir, "vite", ["build", ...args]);
		await runPostbuild(rootDir, { outDir });
	},
	preview: () => run(rootDir, "vite", ["preview", "--host", ...args]),
	check: () => run(rootDir, "biome", ["check", ".", ...args]),
	config: () => runConfigCommand(rootDir, args),
	"docs:index": () => runDocsIndex(rootDir, { outDir: resolveOutDir(args) }),
};

if (!command || commandAliases.has(command)) {
	console.log(help);
	process.exit(0);
}

const selectedCommand = commands[command];

if (!selectedCommand) {
	console.error(`Comando desconhecido: ${command}\n`);
	console.error(help);
	process.exit(1);
}

try {
	await selectedCommand();
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);

	console.error(message);
	process.exit(1);
}
