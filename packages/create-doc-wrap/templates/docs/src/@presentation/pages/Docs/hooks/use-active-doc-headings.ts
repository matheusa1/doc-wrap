import type { TableOfContentsItem } from "@presentation/components/docs/DocsTableOfContents";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { areStringArraysEqual } from "../utils";

const HEADING_ACTIVE_OFFSET = 88;

const getHeadingElements = (tableOfContents: TableOfContentsItem[]) =>
	tableOfContents
		.map((item) => document.getElementById(item.id))
		.filter((heading): heading is HTMLElement => Boolean(heading));

const getVisibleHeadingIds = (headings: HTMLElement[]) => {
	const viewportBottom = window.innerHeight;

	return headings
		.filter((heading) => {
			const rect = heading.getBoundingClientRect();

			return rect.bottom >= HEADING_ACTIVE_OFFSET && rect.top <= viewportBottom;
		})
		.map((heading) => heading.id);
};

const getFallbackActiveHeadingId = (headings: HTMLElement[]) =>
	headings.reduce((current, heading) => {
		if (heading.getBoundingClientRect().top <= HEADING_ACTIVE_OFFSET) {
			return heading;
		}

		return current;
	}, headings[0]).id;

const getActiveHeadingIds = (headings: HTMLElement[]) => {
	const visibleHeadingIds = getVisibleHeadingIds(headings);

	if (visibleHeadingIds.length > 0) {
		return visibleHeadingIds;
	}

	return [getFallbackActiveHeadingId(headings)];
};

const updateActiveHeadings = (
	headings: HTMLElement[],
	setActiveHeadingIds: Dispatch<SetStateAction<string[]>>,
) => {
	const activeIds = getActiveHeadingIds(headings);

	setActiveHeadingIds((current) =>
		areStringArraysEqual(current, activeIds) ? current : activeIds,
	);
};

const observeActiveHeadings = (
	headings: HTMLElement[],
	setActiveHeadingIds: Dispatch<SetStateAction<string[]>>,
) => {
	const syncActiveHeadings = () => {
		updateActiveHeadings(headings, setActiveHeadingIds);
	};

	const observer = new IntersectionObserver(syncActiveHeadings, {
		rootMargin: `-${HEADING_ACTIVE_OFFSET}px 0px -70% 0px`,
		threshold: 0,
	});

	for (const heading of headings) {
		observer.observe(heading);
	}

	syncActiveHeadings();
	window.addEventListener("resize", syncActiveHeadings);
	window.addEventListener("scroll", syncActiveHeadings, { passive: true });

	return () => {
		observer.disconnect();
		window.removeEventListener("resize", syncActiveHeadings);
		window.removeEventListener("scroll", syncActiveHeadings);
	};
};

type UseActiveDocHeadingsProps = {
	setActiveHeadingIds: Dispatch<SetStateAction<string[]>>;
	tableOfContents: TableOfContentsItem[];
};

export const useActiveDocHeadings = ({
	setActiveHeadingIds,
	tableOfContents,
}: UseActiveDocHeadingsProps) => {
	useEffect(() => {
		if (tableOfContents.length === 0) {
			return;
		}

		const headings = getHeadingElements(tableOfContents);

		if (headings.length === 0) {
			return;
		}

		return observeActiveHeadings(headings, setActiveHeadingIds);
	}, [setActiveHeadingIds, tableOfContents]);
};
