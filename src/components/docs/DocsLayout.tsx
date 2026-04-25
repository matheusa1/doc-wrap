import type { CSSProperties, ReactNode } from "react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { DocPage } from "../../docs-map";
import { ThemeToggle } from "../ui/themeToggle";
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
		<SidebarProvider style={{ "--sidebar-width": "20rem" } as CSSProperties}>
			<DocsSidebar currentPath={currentPath} />
			<SidebarInset>
				<header
					className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
					data-pagefind-ignore="all"
				>
					<div className={"flex items-center gap-3"}>
						<SidebarTrigger />
						<div className="h-4 w-px bg-border" />
						<p className="font-medium text-sm">Documentação</p>
					</div>

					<ThemeToggle />
				</header>

				<div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
					<div className="mx-auto max-w-3xl">
						<DocsBreadcrumb currentDoc={currentDoc} />
						{children}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
