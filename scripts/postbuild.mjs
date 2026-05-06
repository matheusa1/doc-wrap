import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { readProjectConfig, rootDir } from "./project-config.mjs";

const projectConfig = await readProjectConfig();
const nodeExecutable = process.execPath;
const pagefindRunner = join(
	rootDir,
	"node_modules",
	"pagefind",
	"lib",
	"runner",
	"bin.cjs",
);

if (!projectConfig.hasDocs) {
	console.log("Skipping docs static generation and Pagefind indexing.");
	process.exit(0);
}

const commands = [
	{ command: nodeExecutable, args: ["scripts/build-pagefind-docs.mjs"] },
	{
		command: nodeExecutable,
		args: [pagefindRunner, "--site", "dist", "--force-language", "pt"],
	},
];

for (const { command, args } of commands) {
	const result = spawnSync(command, args, {
		cwd: rootDir,
		encoding: "utf8",
		stdio: "inherit",
	});

	if (result.error) {
		throw new Error(
			`Failed to run command "${command}": ${result.error.message}`,
			{
				cause: result.error,
			},
		);
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
