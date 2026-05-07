import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";

export const resolveProjectExecutable = (rootDir, name) => {
	if (isAbsolute(name)) {
		return name;
	}

	const binDir = join(rootDir, "node_modules", ".bin");
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

export const run = (rootDir, name, args) => {
	const result = spawnSync(resolveProjectExecutable(rootDir, name), args, {
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
