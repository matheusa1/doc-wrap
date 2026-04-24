import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
		<Breadcrumb className="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/docs" />}>Docs</BreadcrumbLink>
				</BreadcrumbItem>
				{parentSegments.map((segment) => (
					<Fragment key={segment}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<span>{formatSegment(segment)}</span>
						</BreadcrumbItem>
					</Fragment>
				))}
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{currentLabel}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
