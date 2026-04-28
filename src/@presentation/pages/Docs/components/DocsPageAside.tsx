import {
	DocsTableOfContents,
	type TableOfContentsItem,
} from "@presentation/components/docs/DocsTableOfContents";
import type { DocPage } from "@presentation/docs-map";
import { DocsFeedbackModal } from "./DocsFeedbackModal";

type DocsPageAsideProps = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
	tableOfContents: TableOfContentsItem[];
};

export const DocsPageAside: React.FC<DocsPageAsideProps> = ({
	activeHeadingIds,
	currentDoc,
	tableOfContents,
}) => {
	if (tableOfContents.length === 0) {
		return null;
	}

	return (
		<div>
			<DocsTableOfContents
				activeIds={activeHeadingIds}
				items={tableOfContents}
			/>
			<DocsFeedbackModal
				activeHeadingIds={activeHeadingIds}
				currentDoc={currentDoc}
				tableOfContents={tableOfContents}
			/>
		</div>
	);
};
