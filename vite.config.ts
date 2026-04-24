import mdx from "@mdx-js/rollup";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		{
			enforce: "pre",
			...mdx({
				remarkPlugins: [
					remarkFrontmatter,
					[remarkMdxFrontmatter, { name: "frontmatter" }],
				],
			}),
		},
		react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
	],
});
