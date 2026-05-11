#!/usr/bin/env node

import { createProject } from "../lib/create-project.mjs";
import { buildFinalInstructions } from "../lib/package-manager.mjs";
import {
	createPromptSession,
	promptPackageManager,
	promptTemplate,
	resolveProjectName,
} from "../lib/prompts.mjs";

const help = `Uso: create-doc-wrap [nome-do-projeto]

Cria um novo projeto Doc Wrap a partir de um dos templates disponíveis.

Opções:
  -h, --help  Exibe esta ajuda.
`;

const [, , firstArg] = process.argv;

if (firstArg === "-h" || firstArg === "--help") {
	console.log(help);
	process.exit(0);
}

const projectNameArg = firstArg;
const promptSession = createPromptSession();

try {
	const projectName = await resolveProjectName(projectNameArg, {
		ask: promptSession.ask,
	});
	const packageManager = await promptPackageManager({
		ask: promptSession.ask,
	});
	const template = await promptTemplate({ ask: promptSession.ask });
	const { projectDirectory, projectDirectoryName } = await createProject({
		cwd: process.cwd(),
		packageManager,
		projectName,
		template,
	});

	console.log(`Projeto criado com sucesso em ${projectDirectory}.\n`);
	console.log(
		buildFinalInstructions({
			packageManager,
			projectDirectoryName,
		}),
	);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);

	console.error(message);
	process.exit(1);
} finally {
	promptSession.close();
}
