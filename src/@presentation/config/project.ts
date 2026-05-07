import resolvedProjectConfig from "virtual:doc-wrap/project-config";

export type ProjectConfig = typeof resolvedProjectConfig;
export type ProjectTheme = ProjectConfig["defaultTheme"];

export const projectConfig: ProjectConfig = resolvedProjectConfig;

export const buildPageTitle = (pageTitle: string) =>
	`${pageTitle} - ${projectConfig.name}`;
