import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@presentation/components/ui/sidebar";
import { projectConfig } from "@presentation/config/project";
import { BookOpenText, FileText, FolderTree } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { type DocNavItem, docNavigation } from "../../docs-map";
import { DocsSearch } from "./DocsSearch";

type DocsSidebarProps = {
	className?: string;
	currentPath: string;
};

const isCurrentBranch = (item: DocNavItem, currentPath: string): boolean => {
	if (item.path === currentPath) {
		return true;
	}

	return item.children.some((child) => isCurrentBranch(child, currentPath));
};

const renderLabel = (item: DocNavItem): ReactNode => (
	<>
		{item.children.length > 0 ? (
			<FolderTree className="size-4 text-sidebar-foreground/70" />
		) : (
			<FileText className="size-4 text-sidebar-foreground/70" />
		)}
		<span>{item.title}</span>
	</>
);

const renderChildItems = (
	items: DocNavItem[],
	currentPath: string,
): ReactNode =>
	items.map((item) => {
		const isExactActive = item.path === currentPath;
		const isBranchActive = isCurrentBranch(item, currentPath);

		return (
			<SidebarMenuSubItem key={item.path ?? item.segments.join("/")}>
				{item.path ? (
					<SidebarMenuSubButton
						className={
							isBranchActive && !isExactActive
								? "bg-sidebar-accent/40"
								: undefined
						}
						isActive={isExactActive}
						render={<Link to={item.path} />}
					>
						{renderLabel(item)}
					</SidebarMenuSubButton>
				) : (
					<div className="flex h-7 items-center gap-2 px-2 font-medium text-sidebar-foreground/70 text-sm">
						{renderLabel(item)}
					</div>
				)}
				{item.children.length > 0 ? (
					<SidebarMenuSub>
						{renderChildItems(item.children, currentPath)}
					</SidebarMenuSub>
				) : null}
			</SidebarMenuSubItem>
		);
	});

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
	className,
	currentPath,
}) => {
	return (
		<Sidebar
			className={className}
			collapsible="offcanvas"
			data-pagefind-ignore="all"
		>
			<SidebarHeader className="gap-4 border-sidebar-border border-b p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="h-auto gap-3 py-2"
							render={<Link to="/docs" />}
							size="lg"
						>
							<span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<BookOpenText className="size-4" />
							</span>
							<span className="flex min-w-0 flex-col gap-0.5">
								<span className="truncate font-semibold text-sm">
									{projectConfig.name}
								</span>
								<span className="text-muted-foreground text-xs leading-5">
									Documentação
								</span>
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				<DocsSearch />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{docNavigation.map((item) => {
								const isExactActive = item.path === currentPath;
								const isBranchActive = isCurrentBranch(item, currentPath);

								return (
									<SidebarMenuItem key={item.path ?? item.segments.join("/")}>
										{item.path ? (
											<SidebarMenuButton
												className={
													isBranchActive && !isExactActive
														? "bg-sidebar-accent/40"
														: undefined
												}
												isActive={isExactActive}
												render={<Link to={item.path} />}
											>
												{renderLabel(item)}
											</SidebarMenuButton>
										) : (
											<div className="flex h-8 items-center gap-2 px-2 font-medium text-sidebar-foreground/70 text-sm">
												{renderLabel(item)}
											</div>
										)}
										{item.children.length > 0 ? (
											<SidebarMenuSub>
												{renderChildItems(item.children, currentPath)}
											</SidebarMenuSub>
										) : null}
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
};
