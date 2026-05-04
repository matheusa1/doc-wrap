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

// https://vite.dev/config/
export default defineConfig({
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
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@presentation": path.resolve(__dirname, "./src/@presentation"),
			"@content": path.resolve(__dirname, "./src/@content"),
			"@service": path.resolve(__dirname, "./src/@service"),
		},
	},
});
