import type { TableOfContentsItem } from "@/components/docs/DocsTableOfContents";

export const formatDocumentDate = (value: string) => {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

	if (!match) {
		return value;
	}

	const [, year, month, day] = match;

	return `${day}/${month}/${year}`;
};

const slugifyHeading = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const createHeadingId = (title: string, idCounts: Map<string, number>) => {
	const baseId = slugifyHeading(title) || "seção";
	const count = idCounts.get(baseId) ?? 0;

	idCounts.set(baseId, count + 1);

	return count === 0 ? baseId : `${baseId}-${count + 1}`;
};

export const createTableOfContents = (
	contentElement: HTMLDivElement,
): TableOfContentsItem[] => {
	const idCounts = new Map<string, number>();
	const headings = Array.from(
		contentElement.querySelectorAll<HTMLHeadingElement>("h2, h3"),
	);

	return headings
		.map((heading) => {
			const title = heading.textContent?.trim();

			if (!title) {
				return null;
			}

			const id = createHeadingId(title, idCounts);
			const level = Number(heading.tagName.slice(1)) as 2 | 3;

			heading.id = id;

			return { id, level, title };
		})
		.filter((item): item is TableOfContentsItem => Boolean(item));
};

export const areStringArraysEqual = (left: string[], right: string[]) =>
	left.length === right.length &&
	left.every((item, index) => item === right[index]);
