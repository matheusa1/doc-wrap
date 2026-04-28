import { DocsLayout } from "@presentation/components/docs/DocsLayout";
import {
	docPagesByPath,
	firstDocPath,
	getAdjacentDocPages,
} from "@presentation/docs-map";
import { normalizePath } from "@presentation/lib/path";
import { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DocsArticle } from "./components/DocsArticle";
import { DocsNotFound } from "./components/DocsNotFound";
import { DocsPageAside } from "./components/DocsPageAside";
import { useActiveDocHeadings } from "./hooks/use-active-doc-headings";
import { useDocsScrollToTopOnNavigation } from "./hooks/use-docs-scroll-to-top-on-navigation";
import { useDocsTableOfContents } from "./hooks/use-docs-table-of-contents";
import { formatDocumentDate } from "./utils";

export const DocsPage = () => {
	const location = useLocation();
	const contentRef = useRef<HTMLDivElement>(null);
	const currentPath = normalizePath(location.pathname);
	const currentDoc =
		currentPath === "/docs" ? undefined : docPagesByPath.get(currentPath);
	const { activeHeadingIds, setActiveHeadingIds, tableOfContents } =
		useDocsTableOfContents({ contentRef, currentDoc });

	useDocsScrollToTopOnNavigation({ currentDocPath: currentDoc?.path });
	useActiveDocHeadings({ setActiveHeadingIds, tableOfContents });

	if (currentPath === "/docs") {
		return <Navigate replace to={firstDocPath} />;
	}

	if (!currentDoc) {
		return <DocsNotFound currentPath={currentPath} />;
	}

	const formattedUpdatedAt = formatDocumentDate(currentDoc.updatedAt);
	const { nextDoc, previousDoc } = getAdjacentDocPages(currentDoc);

	return (
		<DocsLayout
			aside={
				<DocsPageAside
					activeHeadingIds={activeHeadingIds}
					currentDoc={currentDoc}
					tableOfContents={tableOfContents}
				/>
			}
			currentDoc={currentDoc}
			currentPath={currentPath}
		>
			<DocsArticle
				contentRef={contentRef}
				currentDoc={currentDoc}
				formattedUpdatedAt={formattedUpdatedAt}
				nextDoc={nextDoc}
				previousDoc={previousDoc}
			/>
		</DocsLayout>
	);
};
