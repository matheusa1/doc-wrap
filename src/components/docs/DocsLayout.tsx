import type { ReactNode } from "react";
import type { DocPage } from "../../docs-map";
import { DocsBreadcrumb } from "./DocsBreadcrumb";
import { DocsSidebar } from "./DocsSidebar";

type DocsLayoutProps = {
	children: ReactNode;
	currentDoc?: DocPage;
	currentPath: string;
};

export function DocsLayout({
	children,
	currentDoc,
	currentPath,
}: DocsLayoutProps) {
	return (
		<div className="min-h-screen bg-stone-50 text-slate-950">
			<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
				<DocsSidebar currentPath={currentPath} />
				<main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
					<div className="mx-auto max-w-3xl">
						<DocsBreadcrumb currentDoc={currentDoc} />
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
