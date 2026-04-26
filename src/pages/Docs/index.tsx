import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DocsLayout } from "@/components/docs/DocsLayout";
import {
	DocsTableOfContents,
	type TableOfContentsItem,
} from "@/components/docs/DocsTableOfContents";
import { docPagesByPath, firstDocPath } from "@/docs-map";

const HEADING_ACTIVE_OFFSET = 88;

const normalizePath = (path: string) => {
	if (path.length <= 1) {
		return path;
	}

	return path.replace(/\/$/, "");
};

const formatDocumentDate = (value: string) => {
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
	const baseId = slugifyHeading(title) || "secao";
	const count = idCounts.get(baseId) ?? 0;

	idCounts.set(baseId, count + 1);

	return count === 0 ? baseId : `${baseId}-${count + 1}`;
};

const areStringArraysEqual = (left: string[], right: string[]) =>
	left.length === right.length &&
	left.every((item, index) => item === right[index]);

export function DocsPage() {
	const location = useLocation();
	const contentRef = useRef<HTMLDivElement>(null);
	const [activeHeadingIds, setActiveHeadingIds] = useState<string[]>([]);
	const [tableOfContents, setTableOfContents] = useState<
		TableOfContentsItem[]
	>([]);
	const currentPath = normalizePath(location.pathname);
	const currentDoc =
		currentPath === "/docs" ? undefined : docPagesByPath.get(currentPath);

	useLayoutEffect(() => {
		if (!currentDoc) {
			setActiveHeadingIds([]);
			setTableOfContents([]);
			return;
		}

		const contentElement = contentRef.current;

		if (!contentElement) {
			setActiveHeadingIds([]);
			setTableOfContents([]);
			return;
		}

		const idCounts = new Map<string, number>();
		const headings = Array.from(
			contentElement.querySelectorAll<HTMLHeadingElement>("h2, h3"),
		);
		const items = headings
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

		setTableOfContents(items);
		setActiveHeadingIds(items[0] ? [items[0].id] : []);
	}, [currentDoc]);

	useEffect(() => {
		if (tableOfContents.length === 0) {
			return;
		}

		const headings = tableOfContents
			.map((item) => document.getElementById(item.id))
			.filter((heading): heading is HTMLElement => Boolean(heading));

		if (headings.length === 0) {
			return;
		}

		const updateActiveHeadings = () => {
			const viewportBottom = window.innerHeight;
			const visibleHeadingIds = headings
				.filter((heading) => {
					const rect = heading.getBoundingClientRect();

					return (
						rect.bottom >= HEADING_ACTIVE_OFFSET && rect.top <= viewportBottom
					);
				})
				.map((heading) => heading.id);
			const activeIds =
				visibleHeadingIds.length > 0
					? visibleHeadingIds
					: [
							headings.reduce((current, heading) => {
								if (
									heading.getBoundingClientRect().top <=
									HEADING_ACTIVE_OFFSET
								) {
									return heading;
								}

								return current;
							}, headings[0]).id,
						];

			setActiveHeadingIds((current) =>
				areStringArraysEqual(current, activeIds) ? current : activeIds,
			);
		};
		const observer = new IntersectionObserver(() => updateActiveHeadings(), {
			rootMargin: `-${HEADING_ACTIVE_OFFSET}px 0px -70% 0px`,
			threshold: 0,
		});

		for (const heading of headings) {
			observer.observe(heading);
		}

		updateActiveHeadings();
		window.addEventListener("resize", updateActiveHeadings);
		window.addEventListener("scroll", updateActiveHeadings, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", updateActiveHeadings);
			window.removeEventListener("scroll", updateActiveHeadings);
		};
	}, [tableOfContents]);

	if (currentPath === "/docs") {
		return <Navigate replace to={firstDocPath} />;
	}

	if (!currentDoc) {
		return (
			<DocsLayout currentPath={currentPath}>
				<section className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
					<p className="font-semibold text-primary text-sm uppercase tracking-wide">
						404
					</p>
					<h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight">
						Documento nao encontrado
					</h1>
					<p className="mt-4 text-muted-foreground leading-7">
						Use a sidebar para acessar uma pagina disponivel da documentacao.
					</p>
				</section>
			</DocsLayout>
		);
	}

	const Component = currentDoc.Component;
	const formattedUpdatedAt = formatDocumentDate(currentDoc.updatedAt);

	return (
		<DocsLayout
			aside={
				tableOfContents.length > 0 ? (
					<DocsTableOfContents
						activeIds={activeHeadingIds}
						items={tableOfContents}
					/>
				) : undefined
			}
			currentDoc={currentDoc}
			currentPath={currentPath}
		>
			<article data-pagefind-body>
				<header className="border-b pb-8">
					<p className="font-semibold text-primary text-sm uppercase tracking-wide">
						{currentDoc.category}
					</p>
					<h1
						className="mt-3 font-semibold text-4xl text-foreground tracking-tight"
						data-pagefind-meta="title"
					>
						{currentDoc.title}
					</h1>
					<p
						className="mt-4 text-lg text-muted-foreground leading-8"
						data-pagefind-meta="description"
					>
						{currentDoc.description}
					</p>
					<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
						<span>Por {currentDoc.author}</span>
						<span aria-hidden="true" className="text-border">
							|
						</span>
						<time dateTime={currentDoc.updatedAt}>
							Atualizado em {formattedUpdatedAt}
						</time>
					</div>
				</header>

				<div
					className="mt-8 max-w-none text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-20 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-20 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
					ref={contentRef}
				>
					<Component />
				</div>
			</article>
		</DocsLayout>
	);
}
