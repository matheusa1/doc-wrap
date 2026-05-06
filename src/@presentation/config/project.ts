import projectConfigJson from "../../../project.config.json";
import defaultProjectConfigJson from "../../../project-config.defaults.json";

export type ProjectTheme = "dark" | "light" | "system";

type ProjectConfigInput = {
	defaultTheme?: ProjectTheme;
	description?: string;
	hasBlog?: boolean;
	hasDocs?: boolean;
	name?: string;
};

export type ProjectConfig = {
	defaultTheme: ProjectTheme;
	description: string;
	hasBlog: boolean;
	hasDocs: boolean;
	name: string;
};

const defaultProjectConfig = defaultProjectConfigJson as ProjectConfig;
const rawProjectConfig = projectConfigJson as ProjectConfigInput;

export const projectConfig: ProjectConfig = {
	...defaultProjectConfig,
	...rawProjectConfig,
};

export const buildPageTitle = (pageTitle: string) =>
	`${pageTitle} - ${projectConfig.name}`;
