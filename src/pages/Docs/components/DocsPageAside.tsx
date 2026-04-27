import {
	DocsTableOfContents,
	type TableOfContentsItem,
} from "@/components/docs/DocsTableOfContents";

type DocsPageAsideProps = {
	activeHeadingIds: string[];
	tableOfContents: TableOfContentsItem[];
};

export const DocsPageAside: React.FC<DocsPageAsideProps> = ({
	activeHeadingIds,
	tableOfContents,
}) => {
	if (tableOfContents.length === 0) {
		return null;
	}

	return (
		<DocsTableOfContents
			activeIds={activeHeadingIds}
			items={tableOfContents}
		/>
	);
};
