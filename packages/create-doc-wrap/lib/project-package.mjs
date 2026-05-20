const templateDependencies = {
	"@base-ui/react": "^1.4.1",
	"@fontsource-variable/geist": "^5.2.8",
	"@hookform/resolvers": "^5.2.2",
	"@mdx-js/rollup": "^3.1.1",
	"@tailwindcss/vite": "^4.2.4",
	"@tanstack/react-query": "^5.100.9",
	"class-variance-authority": "^0.7.1",
	clsx: "^2.1.1",
	katex: "^0.16.45",
	"lucide-react": "^1.11.0",
	mermaid: "^11.14.0",
	react: "^19.2.5",
	"react-dom": "^19.2.5",
	"react-hook-form": "^7.74.0",
	"react-router-dom": "^7.14.2",
	"rehype-katex": "^7.0.1",
	"rehype-pretty-code": "^0.14.3",
	"remark-frontmatter": "^5.0.0",
	"remark-math": "^6.0.0",
	"remark-mdx-frontmatter": "^5.2.0",
	shadcn: "^4.4.0",
	shiki: "^4.0.0",
	sonner: "^2.0.7",
	"tailwind-merge": "^3.5.0",
	tailwindcss: "^4.2.4",
	"tw-animate-css": "^1.4.0",
	zod: "^4.3.6",
	"@doc-wrap/project-config": "^0.2.0",
};

const templateDevDependencies = {
	"@biomejs/biome": "2.4.13",
	"@types/mdx": "^2.0.13",
	"@types/node": "^25.6.0",
	"@types/react": "^19.2.14",
	"@types/react-dom": "^19.2.3",
	"@vitejs/plugin-react": "^6.0.1",
	"@doc-wrap/cli": "^0.2.0",
	rollup: "^4.0.0",
	typescript: "~6.0.2",
	vite: "^8.0.10",
};

export const createProjectPackageJson = async ({ projectName }) => {
	return {
		name: projectName,
		private: true,
		type: "module",
		scripts: {
			dev: "doc-wrap dev",
			build: "doc-wrap build",
			preview: "doc-wrap preview",
			check: "doc-wrap check",
		},
		dependencies: templateDependencies,
		devDependencies: templateDevDependencies,
	};
};
