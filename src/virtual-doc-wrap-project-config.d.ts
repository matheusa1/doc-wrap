declare module "virtual:doc-wrap/project-config" {
	type ProjectTheme = "dark" | "light" | "system";

	type ProjectConfig = {
		defaultTheme: ProjectTheme;
		description: string;
		hasBlog: boolean;
		hasDocs: boolean;
		name: string;
	};

	const projectConfig: ProjectConfig;

	export default projectConfig;
}
