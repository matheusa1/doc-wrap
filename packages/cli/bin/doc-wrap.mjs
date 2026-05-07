#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";

const rootDir = process.cwd();
const binDir = join(rootDir, "node_modules", ".bin");
const [, , command, ...args] = process.argv;

const help = `Uso: doc-wrap <comando> [opcoes]

Comandos:
  dev       Inicia o servidor de desenvolvimento do Vite
  build     Executa type-check, build e o pipeline de pos-build
  preview   Inicia o preview do build de producao
  check     Executa as validacoes do projeto com Biome
`;

const commandAliases = new Set(["--help", "-h", "help"]);

const resolveExecutable = (name) => {
	if (isAbsolute(name)) {
		return name;
	}

	const candidates =
		process.platform === "win32" ? [`${name}.cmd`, name] : [name];

	for (const candidate of candidates) {
		const localPath = join(binDir, candidate);

		if (existsSync(localPath)) {
			return localPath;
		}
	}

	return name;
};

const run = (name, commandArgs) => {
	const result = spawnSync(resolveExecutable(name), commandArgs, {
		cwd: rootDir,
		stdio: "inherit",
		shell: process.platform === "win32",
	});

	if (result.error) {
		console.error(`Falha ao executar ${name}: ${result.error.message}`);
		process.exit(1);
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
};

const commands = {
	dev: () => run("vite", ["--host", ...args]),
	build: () => {
		run("tsc", ["-b"]);
		run("vite", ["build", ...args]);
		run(process.execPath, ["scripts/postbuild.mjs"]);
	},
	preview: () => run("vite", ["preview", "--host", ...args]),
	check: () => run("biome", ["check", ".", ...args]),
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

selectedCommand();
