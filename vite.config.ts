import { readFile } from "node:fs/promises";
import path from "node:path";
import mdx from "@mdx-js/rollup";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

type ProjectConfig = {
	defaultTheme: "dark" | "light" | "system";
	description: string;
	hasBlog: boolean;
	hasDocs: boolean;
	name: string;
};

const defaultProjectConfig: ProjectConfig = {
	defaultTheme: "dark",
	description: "",
	hasBlog: false,
	hasDocs: true,
	name: "Projeto",
};

const resolvePath = (relativePath: string) =>
	path.resolve(__dirname, relativePath);

const readProjectConfig = async (): Promise<ProjectConfig> => {
	const configContent = await readFile(
		resolvePath("./project.config.json"),
		"utf8",
	);
	const parsedConfig = JSON.parse(configContent) as Partial<ProjectConfig>;

	return {
		...defaultProjectConfig,
		...parsedConfig,
	};
};

// https://vite.dev/config/
export default defineConfig(async () => {
	const projectConfig = await readProjectConfig();

	return {
		plugins: [
			{
				enforce: "pre",
				...mdx({
					rehypePlugins: [
						rehypeKatex,
						[
							rehypePrettyCode,
							{
								keepBackground: false,
								theme: {
									dark: "github-dark",
									light: "github-light",
								},
							},
						],
					],
					remarkPlugins: [
						remarkFrontmatter,
						remarkMath,
						[remarkMdxFrontmatter, { name: "frontmatter" }],
					],
				}),
			},
			react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
			babel({ presets: [reactCompilerPreset()] }),
			tailwindcss(),
		],
		resolve: {
			alias: [
				{
					find: "@presentation/feature-routes/blog",
					replacement: projectConfig.hasBlog
						? resolvePath("./src/@presentation/pages/Blog/index.tsx")
						: resolvePath(
								"./src/@presentation/feature-routes/BlogPageStub.tsx",
							),
				},
				{
					find: "@presentation/feature-routes/docs",
					replacement: projectConfig.hasDocs
						? resolvePath("./src/@presentation/pages/Docs/index.tsx")
						: resolvePath(
								"./src/@presentation/feature-routes/DocsPageStub.tsx",
							),
				},
				{
					find: "@",
					replacement: resolvePath("./src"),
				},
				{
					find: "@presentation",
					replacement: resolvePath("./src/@presentation"),
				},
				{
					find: "@content",
					replacement: resolvePath("./src/@content"),
				},
				{
					find: "@service",
					replacement: resolvePath("./src/@service"),
				},
			],
		},
	};
});
