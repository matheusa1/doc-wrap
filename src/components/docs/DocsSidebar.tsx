import { BookOpenText, Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { docPages, groupDocPages } from "../../docs-map";
import { DocsSearch } from "./DocsSearch";

type DocsSidebarProps = {
	currentPath: string;
};

export function DocsSidebar({ currentPath }: DocsSidebarProps) {
	const groups = groupDocPages(docPages);

	return (
		<Sidebar collapsible="offcanvas" data-pagefind-ignore="all">
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
									Central de documentação
								</span>
								<span className="text-muted-foreground text-xs leading-5">
									Guias do usuário
								</span>
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				<DocsSearch />
			</SidebarHeader>

			<SidebarContent>
				{groups.map((group) => (
					<SidebarGroup key={group.category}>
						<SidebarGroupLabel>{group.category}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.pages.map((page) => {
									const isActive = page.path === currentPath;

									return (
										<SidebarMenuItem key={page.path}>
											<SidebarMenuButton
												className="h-auto items-start py-2"
												isActive={isActive}
												render={<Link to={page.path} />}
											>
												<span className="flex min-w-0 flex-col gap-1">
													<span className="truncate font-medium">
														{page.title}
													</span>
													<span className="line-clamp-2 text-muted-foreground text-xs leading-5">
														{page.description}
													</span>
												</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="border-sidebar-border border-t p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<Link to="/" />}
							tooltip="Voltar para home"
						>
							<Home className="size-4" />
							<span>Voltar para home</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
