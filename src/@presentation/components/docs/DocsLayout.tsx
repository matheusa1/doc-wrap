import { AppHeader } from "@presentation/components/AppHeader";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@presentation/components/ui/sidebar";
import { cn } from "@presentation/lib/utils";
import type { CSSProperties, ReactNode } from "react";
import type { DocPage } from "../../docs-map";
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
					<div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
						<div
							className={cn(
								"mx-auto grid grid-cols-1",
								aside
									? "max-w-6xl gap-10 xl:grid-cols-[minmax(0,48rem)_16rem] xl:items-start xl:justify-center"
									: "max-w-3xl",
							)}
						>
							<main className="min-w-0">
								<DocsBreadcrumb currentDoc={currentDoc} />
								{children}
							</main>
							{aside ? (
								<aside className="hidden w-64 xl:block">
									<div className="fixed top-20 max-h-[calc(100vh-6rem)] w-64 overflow-y-auto pb-8">
										{aside}
									</div>
								</aside>
							) : null}
						</div>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};
