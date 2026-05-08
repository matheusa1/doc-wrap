import type { ProjectConfig, ProjectTheme } from "@doc-wrap/project-config";
import { resolveProjectConfig } from "@doc-wrap/project-config";
import rawProjectConfigJson from "../../../project.config.json";

type ProjectConfigInput = Partial<ProjectConfig> & Record<string, unknown>;

const rawProjectConfig = rawProjectConfigJson as ProjectConfigInput;

export type { ProjectConfig, ProjectTheme };

export const projectConfig: ProjectConfig =
	resolveProjectConfig(rawProjectConfig);

export const buildPageTitle = (pageTitle: string) =>
	`${pageTitle} - ${projectConfig.name}`;
