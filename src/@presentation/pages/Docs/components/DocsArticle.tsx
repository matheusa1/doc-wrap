import { mdxComponents } from "@presentation/components/docs/mdx-components";
import type { DocPage } from "@presentation/docs-map";
import type { MDXComponents } from "mdx/types";
import type { RefObject } from "react";
import { DocsArticleContent } from "./DocsArticleContent";
import { DocsArticleHeader } from "./DocsArticleHeader";
import { DocsArticlePagination } from "./DocsArticlePagination";

type DocsArticleProps = {
	contentRef: RefObject<HTMLDivElement | null>;
	currentDoc: DocPage;
	formattedUpdatedAt: string;
	nextDoc?: DocPage;
	previousDoc?: DocPage;
};

export const DocsArticle: React.FC<DocsArticleProps> = ({
	contentRef,
	currentDoc,
	formattedUpdatedAt,
	nextDoc,
	previousDoc,
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
			<DocsArticlePagination nextDoc={nextDoc} previousDoc={previousDoc} />
		</article>
	);
};
