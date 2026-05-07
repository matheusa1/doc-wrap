import path from "node:path";
import { fileURLToPath } from "node:url";
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
import { readProjectConfig } from "./packages/cli/lib/project-config.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (relativePath: string) =>
	path.resolve(rootDir, relativePath);
const virtualProjectConfigId = "virtual:doc-wrap/project-config";
const resolvedVirtualProjectConfigId = `\0${virtualProjectConfigId}`;

const createProjectConfigPlugin = (projectConfig: unknown) => ({
	name: "doc-wrap-project-config",
	resolveId(source: string) {
		if (source === virtualProjectConfigId) {
			return resolvedVirtualProjectConfigId;
		}

		return undefined;
	},
	load(id: string) {
		if (id === resolvedVirtualProjectConfigId) {
			return `export default ${JSON.stringify(projectConfig)};`;
		}

		return undefined;
	},
});

// https://vite.dev/config/
export default defineConfig(async () => {
	const projectConfig = await readProjectConfig(rootDir);

	return {
		plugins: [
			createProjectConfigPlugin(projectConfig),
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
