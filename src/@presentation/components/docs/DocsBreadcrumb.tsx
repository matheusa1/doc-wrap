import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@presentation/components/ui/breadcrumb";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { type DocPage, docPagesByPath } from "../../docs-map";

type DocsBreadcrumbProps = {
	currentDoc?: DocPage;
};

const formatSegment = (segment: string) =>
	segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const DocsBreadcrumb: React.FC<DocsBreadcrumbProps> = (props) => {
	const { currentDoc } = props;
	const parentSegments = currentDoc?.segments.slice(0, -1) ?? [];
	const currentLabel = currentDoc?.title ?? "Página não encontrada";
	const parentItems = parentSegments.map((segment, index) => {
		const segments = parentSegments.slice(0, index + 1);
		const path = `/docs/${segments.join("/")}`;
		const page = docPagesByPath.get(path);

		return {
			label: page?.title ?? formatSegment(segment),
			path: page?.path,
		};
	});

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
				{parentItems.map((item) => (
					<Fragment key={item.path ?? item.label}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{item.path ? (
								<BreadcrumbLink render={<Link to={item.path} />}>
									{item.label}
								</BreadcrumbLink>
							) : (
								<span>{item.label}</span>
							)}
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
};
