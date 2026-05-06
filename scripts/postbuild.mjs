import { spawnSync } from "node:child_process";
import { readProjectConfig, rootDir } from "./project-config.mjs";

const projectConfig = await readProjectConfig();

if (!projectConfig.hasDocs) {
	console.log("Skipping docs static generation and Pagefind indexing.");
	process.exit(0);
}

const commands = [
	{ command: "node", args: ["scripts/build-pagefind-docs.mjs"] },
	{
		command: "pagefind --site dist --force-language pt",
		shell: true,
	},
];

for (const { command, args, shell = false } of commands) {
	const result = spawnSync(command, args, {
		cwd: rootDir,
		encoding: "utf8",
		shell,
		stdio: "inherit",
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
