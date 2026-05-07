import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

const collectMdxFiles = async (directory) => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = join(directory, entry.name);

			if (entry.isDirectory()) {
				return collectMdxFiles(entryPath);
			}

			return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
		}),
	);

	return files.flat();
};

const parseFrontmatter = (source) => {
	if (!source.startsWith("---")) {
		return { content: source, frontmatter: {} };
	}

	const closingFenceIndex = source.indexOf("\n---", 3);

	if (closingFenceIndex === -1) {
		return { content: source, frontmatter: {} };
	}

	const rawFrontmatter = source.slice(3, closingFenceIndex).trim();
	const content = source.slice(closingFenceIndex + 4).trim();
	const frontmatter = Object.fromEntries(
		rawFrontmatter
			.split("\n")
			.map((line) => line.match(/^([\w-]+):\s*(.*)$/))
			.filter(Boolean)
			.map((match) => {
				const [, key, value] = match;
				const normalizedValue = value.trim().replace(/^['"]|['"]$/g, "");

				return [
					key,
					key === "order" ? Number(normalizedValue) : normalizedValue,
				];
			}),
	);

	return { content, frontmatter };
};

const escapeHtml = (value) =>
	String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const getAttributeValue = (attributes, name) => {
	const match = attributes.match(new RegExp(`${name}=[{"']([^}"']+)[}"']`));

	return match?.[1];
};

const normalizeInlineMarkdown = (line) =>
	line
		.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/<\/?[A-Z][^>]*>/g, "")
		.trim();

const renderParagraph = (line) => {
	const content = normalizeInlineMarkdown(line);

	return content ? `<p>${escapeHtml(content)}</p>` : "";
};

const mdxToSearchHtml = (content) => {
	const html = [];
	let listItems = [];

	const flushList = () => {
		if (listItems.length === 0) {
			return;
		}

		html.push(`<ul>${listItems.join("")}</ul>`);
		listItems = [];
	};

	for (const rawLine of content.split("\n")) {
		const line = rawLine.trim();

		if (!line) {
			flushList();
			continue;
		}

		const componentMatch = line.match(
			/^<(?<name>Callout|Step)\b(?<attributes>[^>]*)>/,
		);

		if (componentMatch?.groups) {
			flushList();
			const title = getAttributeValue(
				componentMatch.groups.attributes,
				"title",
			);

			if (title) {
				html.push(`<h3>${escapeHtml(title)}</h3>`);
			}

			continue;
		}

		if (/^<\/(Callout|Step)>$/.test(line)) {
			flushList();
			continue;
		}

		const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);

		if (headingMatch) {
			flushList();
			const level = Math.min(headingMatch[1].length, 4);
			const text = normalizeInlineMarkdown(headingMatch[2]);

			html.push(`<h${level}>${escapeHtml(text)}</h${level}>`);
			continue;
		}

		const bulletMatch = line.match(/^-\s+(.+)$/);

		if (bulletMatch) {
			const text = normalizeInlineMarkdown(bulletMatch[1]);

			listItems.push(`<li>${escapeHtml(text)}</li>`);
			continue;
		}

		flushList();
		html.push(renderParagraph(line));
	}

	flushList();

	return html.filter(Boolean).join("\n");
};

const titleFromSlug = (slug) => {
	const lastSegment = slug.split("/").at(-1) ?? slug;

	return lastSegment
		.replaceAll("-", " ")
		.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
};

const injectSearchBody = (template, searchBody, indexHtmlPath) => {
	const rootElement = '<div id="root"></div>';

	if (!template.includes(rootElement)) {
		throw new Error(`Could not find ${rootElement} in ${indexHtmlPath}`);
	}

	return template.replace(
		rootElement,
		`<div id="root">\n${searchBody}\n</div>`,
	);
};

export const buildPagefindDocs = async (rootDir) => {
	const docsDir = join(rootDir, "src", "@content", "docs");
	const distDir = join(rootDir, "dist");
	const indexHtmlPath = join(distDir, "index.html");
	const indexTemplate = await readFile(indexHtmlPath, "utf8");
	const mdxFiles = await collectMdxFiles(docsDir);

	await Promise.all(
		mdxFiles.map(async (filePath) => {
			const source = await readFile(filePath, "utf8");
			const { content, frontmatter } = parseFrontmatter(source);
			const slug = relative(docsDir, filePath)
				.replaceAll(sep, "/")
				.replace(/\.mdx$/, "");
			const title = frontmatter.title ?? titleFromSlug(slug);
			const description = frontmatter.description ?? "";
			const category = frontmatter.category ?? "Documentacao";
			const searchBody = `
<article data-pagefind-body>
	<p data-pagefind-meta="category">${escapeHtml(category)}</p>
	<h1 data-pagefind-meta="title">${escapeHtml(title)}</h1>
	<p data-pagefind-meta="description">${escapeHtml(description)}</p>
	${mdxToSearchHtml(content)}
</article>`.trim();
			const html = injectSearchBody(indexTemplate, searchBody, indexHtmlPath);
			const outputPath = join(
				distDir,
				"docs",
				...slug.split("/"),
				"index.html",
			);

			await mkdir(dirname(outputPath), { recursive: true });
			await writeFile(outputPath, html);
		}),
	);

	console.log(`Generated ${mdxFiles.length} static docs pages for Pagefind.`);
};
