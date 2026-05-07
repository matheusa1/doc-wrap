#!/usr/bin/env node

import { runDocsIndex, runPostbuild } from "../lib/postbuild.mjs";
import { run } from "../lib/run.mjs";

const rootDir = process.cwd();
const [, , command, ...args] = process.argv;

const help = `Uso: doc-wrap <comando> [opcoes]

Comandos:
  dev       Inicia o servidor de desenvolvimento do Vite
  build     Executa type-check, build e o pipeline de pos-build
  preview   Inicia o preview do build de producao
  check     Executa as validacoes do projeto com Biome
  docs:index
            Gera paginas estaticas de docs para o Pagefind
`;

const commandAliases = new Set(["--help", "-h", "help"]);

const commands = {
	dev: () => run(rootDir, "vite", ["--host", ...args]),
	build: async () => {
		run(rootDir, "tsc", ["-b"]);
		run(rootDir, "vite", ["build", ...args]);
		await runPostbuild(rootDir);
	},
	preview: () => run(rootDir, "vite", ["preview", "--host", ...args]),
	check: () => run(rootDir, "biome", ["check", ".", ...args]),
	"docs:index": () => runDocsIndex(rootDir),
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

await selectedCommand();
