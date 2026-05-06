export type ProjectConfig = {
	defaultTheme: "dark" | "light" | "system";
	description: string;
	hasBlog: boolean;
	hasDocs: boolean;
	name: string;
};

export const rootDir: string;

export function readProjectConfig(): Promise<ProjectConfig>;
