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
			className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
			data-pagefind-ignore="all"
		>
			<Container className="flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
				<div className="flex min-w-0 items-center gap-3">
					{leading ? (
						<>
							{leading}
							<div className="h-4 w-px bg-border" />
						</>
					) : null}
					<Link className="truncate font-semibold text-sm" to="/">
						Documentação
					</Link>
				</div>

				<div className="flex items-center gap-1.5">
					<nav
						className="flex items-center gap-1"
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
					<ThemeToggle />
				</div>
			</Container>
		</header>
	);
}
