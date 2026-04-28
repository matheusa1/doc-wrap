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
		<div
			className="mdx-content mt-8 max-w-none text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-20 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-20 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
			ref={contentRef}
		>
			<Component />
		</div>
	);
};
