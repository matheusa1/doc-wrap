import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/themeToggle";

type AppHeaderProps = {
	leading?: ReactNode;
};

const navigationItems = [
	{
		label: "Início",
		path: "/",
	},
	{
		label: "Publicações",
		path: "/blog",
	},
	{
		label: "Documentação",
		path: "/docs",
	},
];

const normalizePath = (path: string) => {
	if (path.length <= 1) {
		return path;
	}

	return path.replace(/\/$/, "");
};

const isNavigationItemActive = (currentPath: string, itemPath: string) => {
	if (itemPath === "/") {
		return currentPath === "/";
	}

	return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
};

export function AppHeader({ leading }: AppHeaderProps) {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	return (
		<header
			className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
			data-pagefind-ignore="all"
		>
			<Container className="flex min-h-14 max-w-6xl flex-col gap-2 px-4 py-2 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-0">
				<div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
					<div className="flex min-w-0 items-center gap-3">
						{leading ? (
							<>
								{leading}
								<div className="h-4 w-px bg-border" />
							</>
						) : null}
						<Link className="truncate font-semibold text-sm" to="/">
							DocGest
						</Link>
					</div>
					<div className="shrink-0 sm:hidden">
						<ThemeToggle />
					</div>
				</div>

				<div className="flex min-w-0 items-center gap-1.5 sm:w-auto">
					<nav
						className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-none sm:overflow-visible sm:px-0 sm:pb-0"
						aria-label="Navegação global"
					>
						{navigationItems.map((item) => (
							<Button
								aria-current={
									isNavigationItemActive(currentPath, item.path)
										? "page"
										: undefined
								}
								key={item.path}
								nativeButton={false}
								render={<Link to={item.path} />}
								size="sm"
								variant={
									isNavigationItemActive(currentPath, item.path)
										? "secondary"
										: "ghost"
								}
							>
								{item.label}
							</Button>
						))}
					</nav>
					<div className="hidden shrink-0 sm:block">
						<ThemeToggle />
					</div>
				</div>
			</Container>
		</header>
	);
}
