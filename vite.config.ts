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

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (relativePath: string) =>
	path.resolve(rootDir, relativePath);

// https://vite.dev/config/
export default defineConfig(() => {
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
