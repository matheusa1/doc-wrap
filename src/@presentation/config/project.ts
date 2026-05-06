import projectConfigJson from "../../../project.config.json";

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

const defaultProjectConfig: ProjectConfig = {
	defaultTheme: "dark",
	description: "",
	hasBlog: true,
	hasDocs: true,
	name: "Projeto",
};

const rawProjectConfig = projectConfigJson as ProjectConfigInput;

export const projectConfig: ProjectConfig = {
	...defaultProjectConfig,
	...rawProjectConfig,
};

export const buildPageTitle = (pageTitle: string) =>
	`${pageTitle} - ${projectConfig.name}`;
