import type { MDXComponents } from "mdx/types";
import type { ComponentType, RefObject } from "react";

type DocsArticleContentProps = {
	Component: ComponentType<{ components?: MDXComponents }>;
	contentRef: RefObject<HTMLDivElement | null>;
};

export const DocsArticleContent: React.FC<DocsArticleContentProps> = ({
	Component,
	contentRef,
}) => {
	return (
		<div className="mdx-content mt-8 max-w-none" ref={contentRef}>
			<Component />
		</div>
	);
};
