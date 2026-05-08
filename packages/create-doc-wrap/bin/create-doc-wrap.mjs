#!/usr/bin/env node

import { createProject } from "../lib/create-project.mjs";
import { buildFinalInstructions } from "../lib/package-manager.mjs";
import {
	createPromptSession,
	promptPackageManager,
	promptTemplate,
	resolveProjectName,
} from "../lib/prompts.mjs";

const [, , projectNameArg] = process.argv;
const promptSession = createPromptSession();

try {
	const projectName = await resolveProjectName(projectNameArg, {
		ask: promptSession.ask,
	});
	const packageManager = await promptPackageManager({
		ask: promptSession.ask,
	});
	const template = await promptTemplate({ ask: promptSession.ask });
	const { projectDirectory } = await createProject({
		cwd: process.cwd(),
		packageManager,
		projectName,
		template,
	});

	console.log(`Projeto criado com sucesso em ${projectDirectory}.\n`);
	console.log(buildFinalInstructions(packageManager, projectName));
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);

	console.error(message);
	process.exit(1);
} finally {
	promptSession.close();
}
