import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type CardsRootProps = ComponentPropsWithoutRef<"div"> & {
	children: ReactNode;
	num?: 1 | 2 | 3 | 4;
};

type CardsCardProps = ComponentPropsWithoutRef<"div"> & {
	arrow?: boolean;
	children?: ReactNode;
	description?: ReactNode;
	href?: string;
	icon?: ReactNode;
	title: ReactNode;
};

const gridColumns: Record<NonNullable<CardsRootProps["num"]>, string> = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 xl:grid-cols-4",
};

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

function CardsRoot({ children, className, num = 3, ...props }: CardsRootProps) {
	return (
		<div
			className={cn("my-6 grid gap-3", gridColumns[num], className)}
			{...props}
		>
			{children}
		</div>
	);
}

function CardContent({
	arrow,
	children,
	description,
	icon,
	title,
}: Pick<
	CardsCardProps,
	"arrow" | "children" | "description" | "icon" | "title"
>) {
	return (
		<>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					{icon ? (
						<div className="mb-4 flex size-10 items-center justify-center rounded-xl border bg-secondary text-secondary-foreground shadow-sm [&_svg]:size-5">
							{icon}
						</div>
					) : null}
					<h3 className="font-semibold text-base text-foreground leading-6">
						{title}
					</h3>
				</div>
				{arrow ? (
					<ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-focus-visible/card:translate-x-0.5" />
				) : null}
			</div>
			{description ? (
				<p className="mt-2 text-muted-foreground text-sm leading-6">
					{description}
				</p>
			) : null}
			{children ? (
				<div className="mt-4 text-sm leading-6">{children}</div>
			) : null}
		</>
	);
}

function CardsCard({
	arrow,
	children,
	className,
	description,
	href,
	icon,
	title,
	...props
}: CardsCardProps) {
	const content = (
		<CardContent
			arrow={arrow}
			description={description}
			icon={icon}
			title={title}
		>
			{children}
		</CardContent>
	);
	const cardClassName = cn(
		"group/card relative block h-full rounded-2xl border bg-card p-5 text-card-foreground shadow-sm transition outline-none",
		href &&
			"hover:-translate-y-0.5 hover:border-ring hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
		className,
	);

	if (!href) {
		return (
			<div className={cardClassName} {...props}>
				{content}
			</div>
		);
	}

	if (isExternalHref(href)) {
		return (
			<a className={cardClassName} href={href} rel="noreferrer" target="_blank">
				{content}
			</a>
		);
	}

	return (
		<Link className={cardClassName} to={href}>
			{content}
		</Link>
	);
}

export const Cards = Object.assign(CardsRoot, {
	Card: CardsCard,
});
