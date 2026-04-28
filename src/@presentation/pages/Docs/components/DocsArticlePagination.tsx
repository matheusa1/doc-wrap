import type { DocPage } from "@presentation/docs-map";
import { cn } from "@presentation/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/@presentation/components/ui/button";

type DocsArticlePaginationProps = {
	nextDoc?: DocPage;
	previousDoc?: DocPage;
};

type DocsPaginationLinkProps = {
	direction: "next" | "previous";
	doc: DocPage;
};

const paginationCopy = {
	next: {
		Icon: ArrowRight,
		align: "items-end text-right",
	},
	previous: {
		Icon: ArrowLeft,
		align: "items-start text-left",
	},
} as const;

const DocsPaginationLink: React.FC<DocsPaginationLinkProps> = ({
	direction,
	doc,
}) => {
	const { Icon, align } = paginationCopy[direction];

	const previousIcon =
		direction === "previous" ? (
			<Icon className="size-4 transition-transform group-hover/pagination:-translate-x-0.5 group-focus-visible/pagination:-translate-x-0.5" />
		) : null;
	const nextIcon =
		direction === "next" ? (
			<Icon className="size-4 transition-transform group-hover/pagination:translate-x-0.5 group-focus-visible/pagination:translate-x-0.5" />
		) : null;

	return (
		<Button
			render={
				<Link
					className={cn(
						"group/pagination flex h-full flex-col justify-between p-5",
						align,
					)}
					to={doc.path}
				/>
			}
			variant={"ghost"}
		>
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				{previousIcon}
				<span>{doc.title}</span>
				{nextIcon}
			</div>
		</Button>
	);
};

export const DocsArticlePagination: React.FC<DocsArticlePaginationProps> = ({
	nextDoc,
	previousDoc,
}) => {
	if (!previousDoc && !nextDoc) {
		return null;
	}

	const previousDocComponent = previousDoc ? (
		<DocsPaginationLink direction="previous" doc={previousDoc} />
	) : (
		<div aria-hidden="true" className="hidden md:block" />
	);

	const nextDocComponent = nextDoc ? (
		<DocsPaginationLink direction="next" doc={nextDoc} />
	) : null;

	return (
		<nav
			aria-label="Navegação entre documentos"
			className="mt-12 border-t pt-8"
		>
			<div className="grid gap-4 md:grid-cols-2">
				{previousDocComponent}
				{nextDocComponent}
			</div>
		</nav>
	);
};
