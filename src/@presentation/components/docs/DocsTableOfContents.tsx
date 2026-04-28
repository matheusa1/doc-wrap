import { cn } from "@presentation/lib/utils";

export type TableOfContentsItem = {
	id: string;
	level: 2 | 3;
	title: string;
};

type DocsTableOfContentsProps = {
	activeIds: string[];
	items: TableOfContentsItem[];
};

export const DocsTableOfContents: React.FC<DocsTableOfContentsProps> = (
	props,
) => {
	const { activeIds, items } = props;
	if (items.length === 0) {
		return null;
	}

	const hasSingleActiveItem = activeIds.length === 1;

	return (
		<nav aria-label="Indice da pagina" data-pagefind-ignore="all">
			<p className="font-semibold text-foreground text-sm">Índice</p>
			<ol className="mt-4 space-y-1 border-l">
				{items.map((item) => {
					const isActive = activeIds.includes(item.id);

					return (
						<li key={item.id}>
							<a
								aria-current={
									hasSingleActiveItem && isActive ? "location" : undefined
								}
								className={cn(
									"-ml-px block border-transparent border-l py-1.5 text-muted-foreground text-sm leading-6 transition-colors hover:border-foreground hover:text-foreground",
									item.level === 2 ? "pl-4" : "pl-7 text-xs",
									isActive && "border-primary font-medium text-foreground",
								)}
								href={`#${item.id}`}
							>
								{item.title}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
