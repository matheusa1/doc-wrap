import { Link } from "react-router-dom";
import type { DocPage } from "../../docs-map";

type DocsBreadcrumbProps = {
	currentDoc?: DocPage;
};

const formatSegment = (segment: string) =>
	segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function DocsBreadcrumb({ currentDoc }: DocsBreadcrumbProps) {
	const parentSegments = currentDoc?.segments.slice(0, -1) ?? [];
	const currentLabel = currentDoc?.title ?? "Pagina nao encontrada";

	return (
		<nav aria-label="Breadcrumb" className="mb-8 text-slate-500 text-sm">
			<ol className="flex flex-wrap items-center gap-2">
				<li>
					<Link className="transition hover:text-slate-900" to="/">
						Inicio
					</Link>
				</li>
				<li aria-hidden="true">/</li>
				<li>
					<Link className="transition hover:text-slate-900" to="/docs">
						Docs
					</Link>
				</li>
				{parentSegments.map((segment) => (
					<li className="contents" key={segment}>
						<span aria-hidden="true">/</span>
						<span>{formatSegment(segment)}</span>
					</li>
				))}
				<li aria-hidden="true">/</li>
				<li aria-current="page" className="font-medium text-slate-950">
					{currentLabel}
				</li>
			</ol>
		</nav>
	);
}
