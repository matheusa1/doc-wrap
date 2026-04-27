import type { RefObject } from "react";
import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/components/docs/DocsTableOfContents";
import type { DocPage } from "@/docs-map";
import { createTableOfContents } from "../utils";

const getInitialActiveHeadingIds = (items: TableOfContentsItem[]) =>
	items[0] ? [items[0].id] : [];

const getTableOfContentsState = (
	contentRef: RefObject<HTMLDivElement | null>,
): {
	activeHeadingIds: string[];
	tableOfContents: TableOfContentsItem[];
} => {
	const contentElement = contentRef.current;

	if (!contentElement) {
		return {
			activeHeadingIds: [],
			tableOfContents: [],
		};
	}

	const tableOfContents = createTableOfContents(contentElement);

	return {
		activeHeadingIds: getInitialActiveHeadingIds(tableOfContents),
		tableOfContents,
	};
};

type UseDocsTableOfContentsProps = {
	contentRef: RefObject<HTMLDivElement | null>;
	currentDoc?: DocPage;
};

export const useDocsTableOfContents = ({
	contentRef,
	currentDoc,
}: UseDocsTableOfContentsProps) => {
	const [activeHeadingIds, setActiveHeadingIds] = useState<string[]>([]);
	const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
		[],
	);

	useEffect(() => {
		if (!currentDoc) {
			setActiveHeadingIds([]);
			setTableOfContents([]);
			return;
		}

		const nextState = getTableOfContentsState(contentRef);

		setActiveHeadingIds(nextState.activeHeadingIds);
		setTableOfContents(nextState.tableOfContents);
	}, [contentRef, currentDoc]);

	return {
		activeHeadingIds,
		setActiveHeadingIds,
		tableOfContents,
	};
};
