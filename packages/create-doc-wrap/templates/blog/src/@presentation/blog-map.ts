import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

export type BlogPostFrontmatter = {
	category: string;
	description: string;
	eventAt?: string;
	publishedAt: string;
	title: string;
};

type BlogPostModule = {
	default: ComponentType<{ components?: MDXComponents }>;
	frontmatter?: BlogPostFrontmatter;
};

export type BlogPost = BlogPostFrontmatter & {
	Component: BlogPostModule["default"];
	filePath: string;
	path: string;
	segments: string[];
	slug: string;
};

const blogPostModules = import.meta.glob<BlogPostModule>(
	"../@content/blog/**/*.mdx",
	{
		eager: true,
	},
);

const titleFromSlug = (slug: string) =>
	slug
		.split("/")
		.at(-1)
		?.replaceAll("-", " ")
		.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());

const createBlogPost = ([filePath, module]: [
	string,
	BlogPostModule,
]): BlogPost => {
	const slug = filePath.replace("../@content/blog/", "").replace(/\.mdx$/, "");

	return {
		category: module.frontmatter?.category ?? "Avisos",
		Component: module.default,
		description: module.frontmatter?.description ?? "",
		eventAt: module.frontmatter?.eventAt,
		filePath,
		path: `/blog/${slug}`,
		publishedAt: module.frontmatter?.publishedAt ?? "",
		segments: slug.split("/"),
		slug,
		title: module.frontmatter?.title ?? titleFromSlug(slug) ?? slug,
	};
};

const compareBlogPosts = (left: BlogPost, right: BlogPost) => {
	const dateComparison = right.publishedAt.localeCompare(left.publishedAt);

	if (dateComparison !== 0) {
		return dateComparison;
	}

	return left.title.localeCompare(right.title, "pt-BR");
};

export const blogPosts = Object.entries(blogPostModules)
	.map(createBlogPost)
	.sort(compareBlogPosts);

export const blogPostsByPath = new Map(
	blogPosts.map((post) => [post.path, post]),
);

export const blogCategories = Array.from(
	new Set(blogPosts.map((post) => post.category)),
).sort((left, right) => left.localeCompare(right, "pt-BR"));

export const filterBlogPostsByCategory = (category?: string | null) => {
	if (!category) {
		return blogPosts;
	}

	return blogPosts.filter((post) => post.category === category);
};
