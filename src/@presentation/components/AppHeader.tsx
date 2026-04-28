import { Button } from "@presentation/components/ui/button";
import { Container } from "@presentation/components/ui/container";
import { ThemeToggle } from "@presentation/components/ui/themeToggle";
import { normalizePath } from "@presentation/lib/path";
import { cn } from "@presentation/lib/utils";
import { Menu, X } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
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
	className?: string;
	onNavigate?: () => void;
};

const AppHeaderNavigation: React.FC<AppHeaderNavigationProps> = ({
	className,
	currentPath,
	onNavigate,
}) => {
	return (
		<nav
			className={cn(
				"grid min-w-0 flex-1 grid-cols-1 gap-1 pb-1 sm:flex sm:flex-none sm:items-center sm:gap-1 sm:overflow-visible sm:px-0 sm:pb-0 min-[28rem]:grid-cols-3",
				className,
			)}
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
						onClick={onNavigate}
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

type AppHeaderMobileNavigationProps = {
	currentPath: string;
	leading?: ReactNode;
};

const AppHeaderMobileNavigation: React.FC<AppHeaderMobileNavigationProps> = ({
	currentPath,
	leading,
}) => {
	const navigationId = useId();
	const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

	return (
		<>
			<div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
				<AppHeaderBrand leading={leading} />
				<div className="flex shrink-0 items-center gap-1 sm:hidden">
					<ThemeToggle />
					<Button
						aria-controls={navigationId}
						aria-expanded={isMobileNavigationOpen}
						aria-label={
							isMobileNavigationOpen
								? "Fechar navegação global"
								: "Abrir navegação global"
						}
						onClick={() =>
							setIsMobileNavigationOpen((currentState) => !currentState)
						}
						size="icon"
						variant="outline"
					>
						{isMobileNavigationOpen ? <X /> : <Menu />}
					</Button>
				</div>
			</div>

			<div
				id={navigationId}
				className={cn(
					"overflow-hidden transition-[max-height,opacity,margin-top] duration-200 ease-out sm:hidden",
					isMobileNavigationOpen
						? "mt-1 max-h-40 opacity-100"
						: "mt-0 max-h-0 opacity-0",
				)}
			>
				<AppHeaderNavigation
					currentPath={currentPath}
					onNavigate={() => setIsMobileNavigationOpen(false)}
				/>
			</div>
		</>
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
			<Container className="flex h-fit max-w-6xl flex-col gap-0 px-4 py-1.5 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-0">
				<AppHeaderMobileNavigation
					currentPath={currentPath}
					key={currentPath}
					leading={leading}
				/>

				<div className="hidden min-w-0 items-center gap-1.5 sm:flex sm:w-auto">
					<AppHeaderNavigation currentPath={currentPath} />
					<div className="hidden shrink-0 sm:block">
						<ThemeToggle />
					</div>
				</div>
			</Container>
		</header>
	);
};
