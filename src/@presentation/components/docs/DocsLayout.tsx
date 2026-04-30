import { AppHeader } from "@presentation/components/AppHeader";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@presentation/components/ui/sidebar";
import type { CSSProperties, ReactNode } from "react";
import type { DocPage } from "../../docs-map";
import { Container } from "../ui/container";
import { DocsBreadcrumb } from "./DocsBreadcrumb";
import { DocsSidebar } from "./DocsSidebar";

type DocsLayoutProps = {
	aside?: ReactNode;
	children: ReactNode;
	currentDoc?: DocPage;
	currentPath: string;
};

export const DocsLayout: React.FC<DocsLayoutProps> = (props) => {
	const { aside, children, currentDoc, currentPath } = props;
	return (
		<SidebarProvider
			className="flex-col"
			style={{ "--sidebar-width": "20rem" } as CSSProperties}
		>
			<AppHeader leading={<SidebarTrigger />} />
			<div className="flex min-h-0 flex-1">
				<DocsSidebar
					className="inset-y-auto top-14 h-[calc(100svh-3.5rem)]"
					currentPath={currentPath}
				/>
				<SidebarInset>
					<Container className="min-w-0 flex-1 px-5 py-8 sm:px-8">
						<div
							className={
								"grid w-full grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-start"
							}
						>
							<main className="min-w-0">
								<DocsBreadcrumb currentDoc={currentDoc} />
								{children}
							</main>
							{aside ? (
								<aside className="hidden w-64 xl:block">
									<div className="fixed top-20 h-[calc(100svh-6rem)] w-64 pb-8">
										{aside}
									</div>
								</aside>
							) : null}
						</div>
					</Container>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};
