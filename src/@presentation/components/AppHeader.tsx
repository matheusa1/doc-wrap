import { Button } from "@presentation/components/ui/button";
import { Container } from "@presentation/components/ui/container";
import { ThemeToggle } from "@presentation/components/ui/themeToggle";
import { normalizePath } from "@presentation/lib/path";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

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

const isNavigationItemActive = (currentPath: string, itemPath: string) => {
	if (itemPath === "/") {
		return currentPath === "/";
	}

	return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
};

type AppHeaderBrandProps = {
	leading?: ReactNode;
};

const AppHeaderBrand: React.FC<AppHeaderBrandProps> = ({ leading }) => {
	const leadingContent = leading ? (
		<>
			{leading}
			<div className="h-4 w-px bg-border" />
		</>
	) : null;

	return (
		<div className="flex min-w-0 items-center gap-3">
			{leadingContent}
			<Link className="truncate font-semibold text-sm" to="/">
				Central de Documentação
			</Link>
		</div>
	);
};

type AppHeaderNavigationProps = {
	currentPath: string;
};

const AppHeaderNavigation: React.FC<AppHeaderNavigationProps> = ({
	currentPath,
}) => {
	return (
		<nav
			className="grid min-w-0 flex-1 grid-cols-1 gap-1 pb-1 sm:flex sm:flex-none sm:items-center sm:gap-1 sm:overflow-visible sm:px-0 sm:pb-0 min-[28rem]:grid-cols-3"
			aria-label="Navegação global"
		>
			{navigationItems.map((item) => {
				const isActive = isNavigationItemActive(currentPath, item.path);

				return (
					<Button
						aria-current={isActive ? "page" : undefined}
						className="w-full justify-center sm:w-auto"
						key={item.path}
						nativeButton={false}
						render={<Link to={item.path} />}
						size="sm"
						variant={isActive ? "secondary" : "ghost"}
					>
						{item.label}
					</Button>
				);
			})}
		</nav>
	);
};

export const AppHeader: React.FC<AppHeaderProps> = ({ leading }) => {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	return (
		<header
			className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80"
			data-pagefind-ignore="all"
		>
			<Container className="flex min-h-14 max-w-6xl flex-col gap-2 px-4 py-2 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-0">
				<div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
					<AppHeaderBrand leading={leading} />
					<div className="shrink-0 sm:hidden">
						<ThemeToggle />
					</div>
				</div>

				<div className="flex min-w-0 items-center gap-1.5 sm:w-auto">
					<AppHeaderNavigation currentPath={currentPath} />
					<div className="hidden shrink-0 sm:block">
						<ThemeToggle />
					</div>
				</div>
			</Container>
		</header>
	);
};
