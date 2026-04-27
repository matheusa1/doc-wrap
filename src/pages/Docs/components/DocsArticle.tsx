import type { MDXComponents } from "mdx/types";
import type { RefObject } from "react";
import { mdxComponents } from "@/components/docs/mdx-components";
import type { DocPage } from "@/docs-map";
import { DocsArticleContent } from "./DocsArticleContent";
import { DocsArticleHeader } from "./DocsArticleHeader";

type DocsArticleProps = {
	contentRef: RefObject<HTMLDivElement | null>;
	currentDoc: DocPage;
	formattedUpdatedAt: string;
};

export const DocsArticle: React.FC<DocsArticleProps> = ({
	contentRef,
	currentDoc,
	formattedUpdatedAt,
}) => {
	const Component = currentDoc.Component;

	const getArticleComponent = (props: { components?: MDXComponents }) => (
		<Component components={mdxComponents} {...props} />
	);

	return (
		<article data-pagefind-body>
			<DocsArticleHeader
				currentDoc={currentDoc}
				formattedUpdatedAt={formattedUpdatedAt}
			/>
			<DocsArticleContent
				Component={getArticleComponent}
				contentRef={contentRef}
			/>
		</article>
	);
};
