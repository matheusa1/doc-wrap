#!/usr/bin/env node

import { createProject } from "../lib/create-project.mjs";
import { createInteractiveSession } from "../lib/interactive-ui.mjs";

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
const session = createInteractiveSession();

try {
	session.showIntro();
	const projectName = await session.promptProjectName(projectNameArg);
	const packageManager = await session.promptPackageManager();
	const template = await session.promptTemplate();
	const { projectDirectory, projectDirectoryName } = await createProject({
		cwd: process.cwd(),
		onStep: (step) => session.showStep(step),
		packageManager,
		projectName,
		template,
	});

	session.showSuccess({ projectDirectory });
	session.showFinalInstructions({
		packageManager,
		projectDirectoryName,
	});
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);

	session.showError(message);
	process.exit(1);
} finally {
	session.close();
}
