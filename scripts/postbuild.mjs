import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { readProjectConfig, rootDir } from "./project-config.mjs";

const projectConfig = await readProjectConfig();
const pagefindBinary = join(
	rootDir,
	"node_modules",
	".bin",
	process.platform === "win32" ? "pagefind.cmd" : "pagefind",
);

if (!projectConfig.hasDocs) {
	console.log("Skipping docs static generation and Pagefind indexing.");
	process.exit(0);
}

const commands = [
	{ command: "node", args: ["scripts/build-pagefind-docs.mjs"] },
	{
		command: pagefindBinary,
		args: ["--site", "dist", "--force-language", "pt"],
		// Windows installs Pagefind as a .cmd wrapper, which spawnSync needs a shell to execute.
		shell: process.platform === "win32",
	},
];

for (const { command, args, shell = false } of commands) {
	const result = spawnSync(command, args, {
		cwd: rootDir,
		encoding: "utf8",
		shell,
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
