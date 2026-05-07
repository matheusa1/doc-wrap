import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPagefindDocs } from "./build-pagefind-docs.mjs";
import { defaultOutDir, resolveOutDir } from "./out-dir.mjs";
import { readProjectConfig } from "./project-config.mjs";
import { run } from "./run.mjs";

const cliLibDir = dirname(fileURLToPath(import.meta.url));

const resolvePagefindRunner = () => {
	let currentDir = cliLibDir;
	const { root } = parse(currentDir);

	while (true) {
		const pagefindRoot = join(currentDir, "node_modules", "pagefind");
		const pagefindRunner = join(pagefindRoot, "lib", "runner", "bin.cjs");

		if (existsSync(pagefindRunner)) {
			return pagefindRunner;
		}

		if (currentDir === root) {
			break;
		}

		currentDir = dirname(currentDir);
	}

	throw new Error("Could not find Pagefind runner from @doc-wrap/cli.");
};

export const runPagefindIndex = (
	rootDir,
	{ outDir = defaultOutDir } = {},
) => {
	const resolvedOutDir = resolveOutDir(rootDir, outDir);

	run(rootDir, process.execPath, [
		resolvePagefindRunner(),
		"--site",
		resolvedOutDir,
		"--force-language",
		"pt",
	]);
};

export const runDocsIndex = async (
	rootDir,
	{ outDir = defaultOutDir } = {},
) => {
	const projectConfig = await readProjectConfig(rootDir);

	if (!projectConfig.hasDocs) {
		console.log("Skipping docs static generation because hasDocs is disabled.");
		return;
	}

	await buildPagefindDocs(rootDir, { outDir });
};

export const runPostbuild = async (
	rootDir,
	{ outDir = defaultOutDir } = {},
) => {
	const projectConfig = await readProjectConfig(rootDir);

	if (!projectConfig.hasDocs) {
		console.log("Skipping docs static generation and Pagefind indexing.");
		return;
	}

	await buildPagefindDocs(rootDir, { outDir });
	runPagefindIndex(rootDir, { outDir });
};
