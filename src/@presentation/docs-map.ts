import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

export type DocFrontmatter = {
	author: string;
	category: string;
	description: string;
	order: number;
	title: string;
	updatedAt: string;
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

export type AdjacentDocPages = {
	nextDoc?: DocPage;
	previousDoc?: DocPage;
};

export type DocNavItem = {
	children: DocNavItem[];
	description: string;
	order: number;
	path?: string;
	segments: string[];
	title: string;
};

type MutableDocNavItem = DocNavItem & {
	childrenMap: Map<string, MutableDocNavItem>;
};

const docModules = import.meta.glob<DocModule>("../@content/docs/**/*.mdx", {
	eager: true,
});

const formatSegment = (segment: string) =>
	segment
		.replaceAll("-", " ")
		.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());

const normalizeDocSlug = (filePath: string) => {
	const rawSlug = filePath
		.replace("../@content/docs/", "")
		.replace(/\.mdx$/, "");

	if (rawSlug === "index") {
		return "";
	}

	return rawSlug.replace(/\/index$/, "");
};

const createMutableNavItem = (segments: string[]): MutableDocNavItem => ({
	children: [],
	childrenMap: new Map<string, MutableDocNavItem>(),
	description: "",
	order: 999,
	path: segments.length > 0 ? `/docs/${segments.join("/")}` : undefined,
	segments,
	title: formatSegment(segments.at(-1) ?? ""),
});

const getNavSortOrder = (item: MutableDocNavItem): number => {
	if (item.order !== 999 || item.childrenMap.size === 0) {
		return item.order;
	}

	return Math.min(...Array.from(item.childrenMap.values(), getNavSortOrder));
};

const compareNavItems = (left: MutableDocNavItem, right: MutableDocNavItem) => {
	const orderDifference = getNavSortOrder(left) - getNavSortOrder(right);

	if (orderDifference !== 0) {
		return orderDifference;
	}

	return left.title.localeCompare(right.title, "pt-BR");
};

const buildDocNavigation = (pages: DocPage[]): DocNavItem[] => {
	const roots = new Map<string, MutableDocNavItem>();

	for (const page of pages) {
		if (page.segments.length === 0) {
			continue;
		}

		let siblings = roots;
		const segments: string[] = [];

		for (const segment of page.segments) {
			segments.push(segment);

			const existingItem = siblings.get(segment);
			const item = existingItem ?? createMutableNavItem([...segments]);

			if (!existingItem) {
				siblings.set(segment, item);
			}

			siblings = item.childrenMap;
		}

		const navItem = roots.get(page.segments[0]);
		let currentItem = navItem;

		for (let index = 1; index < page.segments.length; index += 1) {
			currentItem = currentItem?.childrenMap.get(page.segments[index]);
		}

		if (!currentItem) {
			continue;
		}

		currentItem.description = page.description;
		currentItem.order = page.order;
		currentItem.path = page.path;
		currentItem.title = page.title;
	}

	const finalizeNavItem = (item: MutableDocNavItem): DocNavItem => ({
		children: Array.from(item.childrenMap.values())
			.sort(compareNavItems)
			.map(finalizeNavItem),
		description: item.description,
		order: getNavSortOrder(item),
		path: item.path,
		segments: item.segments,
		title: item.title,
	});

	return Array.from(roots.values()).sort(compareNavItems).map(finalizeNavItem);
};

const flattenDocNavigationPaths = (items: DocNavItem[]): string[] => {
	const paths: string[] = [];

	for (const item of items) {
		if (item.path) {
			paths.push(item.path);
		}

		paths.push(...flattenDocNavigationPaths(item.children));
	}

	return paths;
};

const createDocPage = ([filePath, module]: [string, DocModule]): DocPage => {
	const slug = normalizeDocSlug(filePath);
	const fallbackTitle = slug.split("/").at(-1)
		? formatSegment(slug.split("/").at(-1) ?? "")
		: "Docs";

	return {
		author: module.frontmatter?.author ?? "",
		category: module.frontmatter?.category ?? "Documentação",
		Component: module.default,
		description: module.frontmatter?.description ?? "",
		filePath,
		order: module.frontmatter?.order ?? 999,
		path: slug ? `/docs/${slug}` : "/docs",
		segments: slug ? slug.split("/") : [],
		slug,
		title: module.frontmatter?.title ?? fallbackTitle ?? slug,
		updatedAt: module.frontmatter?.updatedAt ?? "",
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

export const docNavigation = buildDocNavigation(docPages);

const docPathsInNavigationOrder = flattenDocNavigationPaths(docNavigation);

export const firstDocPath =
	docPages.find((page) => page.slug === "introdução")?.path ??
	docPages[0]?.path ??
	"/docs";

export const getAdjacentDocPages = (currentDoc: DocPage): AdjacentDocPages => {
	const currentDocIndex = docPathsInNavigationOrder.indexOf(currentDoc.path);

	if (currentDocIndex === -1) {
		return {};
	}

	return {
		nextDoc: docPagesByPath.get(docPathsInNavigationOrder[currentDocIndex + 1]),
		previousDoc: docPagesByPath.get(
			docPathsInNavigationOrder[currentDocIndex - 1],
		),
	};
};

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
