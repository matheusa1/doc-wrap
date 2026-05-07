import { isAbsolute, resolve } from "node:path";

export const defaultOutDir = "dist";

export const resolveOutDir = (rootDir, outDir = defaultOutDir) => {
	const normalizedOutDir = outDir || defaultOutDir;

	if (isAbsolute(normalizedOutDir)) {
		return normalizedOutDir;
	}

	return resolve(rootDir, normalizedOutDir);
};
