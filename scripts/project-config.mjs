import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectConfigPath = join(rootDir, "project.config.json");

const defaultProjectConfig = {
	defaultTheme: "dark",
	description: "",
	hasBlog: false,
	hasDocs: true,
	name: "Projeto",
};

export const readProjectConfig = async () => {
	const configContent = await readFile(projectConfigPath, "utf8");
	const parsedConfig = JSON.parse(configContent);

	return {
		...defaultProjectConfig,
		...parsedConfig,
	};
};

export { rootDir };
