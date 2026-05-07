export type ProjectTheme = "dark" | "light" | "system";

export type ProjectConfig = {
	defaultTheme: ProjectTheme;
	description: string;
	hasBlog: boolean;
	hasDocs: boolean;
	name: string;
};

export declare const projectConfigDefaults: ProjectConfig;
export declare const projectConfigSchema: unknown;
export declare const resolveProjectConfig: (
	overrides?: Partial<ProjectConfig> & Record<string, unknown>,
) => ProjectConfig;
export declare const readProjectConfig: (
	rootDir: string,
) => Promise<ProjectConfig>;
