import type { DocPage } from "@presentation/docs-map";

type DocsArticleHeaderProps = {
	currentDoc: DocPage;
	formattedUpdatedAt: string;
};

export const DocsArticleHeader: React.FC<DocsArticleHeaderProps> = ({
	currentDoc,
	formattedUpdatedAt,
}) => {
	return (
		<header className="border-b pb-8">
			<p className="font-semibold text-primary text-sm uppercase tracking-wide">
				{currentDoc.category}
			</p>
			<h1
				className="mt-3 font-semibold text-4xl text-foreground tracking-tight"
				data-pagefind-meta="title"
			>
				{currentDoc.title}
			</h1>
			<p
				className="mt-4 text-muted-foreground text-sm leading-8"
				data-pagefind-meta="description"
			>
				{currentDoc.description}
			</p>
			<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
				<span>Por {currentDoc.author}</span>
				<span aria-hidden="true" className="text-border">
					|
				</span>
				<time dateTime={currentDoc.updatedAt}>
					Atualizado em {formattedUpdatedAt}
				</time>
			</div>
		</header>
	);
};
