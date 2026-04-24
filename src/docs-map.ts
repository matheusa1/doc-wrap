import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

export type DocFrontmatter = {
	title: string;
	description: string;
	category: string;
	order: number;
};

type DocModule = {
	default: ComponentType<{ components?: MDXComponents }>;
	frontmatter?: DocFrontmatter;
};

export type DocPage = DocFrontmatter & {
	Component: DocModule["default"];
	filePath: string;
	path: string;
	segments: string[];
	slug: string;
};

export type DocGroup = {
	category: string;
	pages: DocPage[];
};

const docModules = import.meta.glob<DocModule>("./docs/**/*.mdx", {
	eager: true,
});

const createDocPage = ([filePath, module]: [string, DocModule]): DocPage => {
	const slug = filePath.replace("./docs/", "").replace(/\.mdx$/, "");
	const fallbackTitle = slug
		.split("/")
		.at(-1)
		?.replaceAll("-", " ")
		.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());

	return {
		category: module.frontmatter?.category ?? "Documentação",
		Component: module.default,
		description: module.frontmatter?.description ?? "",
		filePath,
		order: module.frontmatter?.order ?? 999,
		path: `/docs/${slug}`,
		segments: slug.split("/"),
		slug,
		title: module.frontmatter?.title ?? fallbackTitle ?? slug,
	};
};

const compareDocs = (left: DocPage, right: DocPage) => {
	if (left.order !== right.order) {
		return left.order - right.order;
	}

	return left.title.localeCompare(right.title, "pt-BR");
};

export const docPages = Object.entries(docModules)
	.map(createDocPage)
	.sort(compareDocs);

export const docPagesByPath = new Map(
	docPages.map((page) => [page.path, page]),
);

export const firstDocPath =
	docPages.find((page) => page.slug === "introducao")?.path ??
	docPages[0]?.path ??
	"/docs";

export const groupDocPages = (pages: DocPage[]): DocGroup[] => {
	const groups = new Map<string, DocPage[]>();

	for (const page of pages) {
		groups.set(page.category, [...(groups.get(page.category) ?? []), page]);
	}

	return Array.from(groups.entries()).map(([category, groupedPages]) => ({
		category,
		pages: groupedPages.toSorted(compareDocs),
	}));
};

export const searchDocPages = (query: string) => {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return docPages;
	}

	return docPages.filter((page) => {
		const searchableText = `${page.title} ${page.description}`.toLowerCase();

		return searchableText.includes(normalizedQuery);
	});
};
