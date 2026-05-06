import { spawnSync } from "node:child_process";
import { readProjectConfig, rootDir } from "./project-config.mjs";

const projectConfig = await readProjectConfig();

if (!projectConfig.hasDocs) {
	console.log("Skipping docs static generation and Pagefind indexing.");
	process.exit(0);
}

const commands = [
	["node", ["scripts/build-pagefind-docs.mjs"]],
	["pagefind", ["--site", "dist", "--force-language", "pt"]],
];

for (const [command, args] of commands) {
	const result = spawnSync(command, args, {
		cwd: rootDir,
		encoding: "utf8",
		stdio: "inherit",
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
