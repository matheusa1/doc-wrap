import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectConfigPath = join(rootDir, "project.config.json");
const defaultProjectConfigPath = join(rootDir, "project-config.defaults.json");

export const readProjectConfig = async () => {
	const [defaultConfigContent, configContent] = await Promise.all([
		readFile(defaultProjectConfigPath, "utf8"),
		readFile(projectConfigPath, "utf8"),
	]);
	const defaultProjectConfig = JSON.parse(defaultConfigContent);
	const parsedConfig = JSON.parse(configContent);

	return {
		...defaultProjectConfig,
		...parsedConfig,
	};
};

export { rootDir };
