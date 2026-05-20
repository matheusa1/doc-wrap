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
		<div className="flex h-full min-h-0 flex-col">
			<div className="min-h-0 flex-1 overflow-y-auto pr-2">
				<DocsTableOfContents
					activeIds={activeHeadingIds}
					items={tableOfContents}
				/>
			</div>
			<div className="border-border border-t pt-4">
				<DocsFeedbackModal
					activeHeadingIds={activeHeadingIds}
					currentDoc={currentDoc}
					tableOfContents={tableOfContents}
				/>
			</div>
		</div>
	);
};
