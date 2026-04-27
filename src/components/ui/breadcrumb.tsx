import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const Breadcrumb: React.FC<React.ComponentProps<"nav">> = (props) => {
	return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
};

const BreadcrumbList: React.FC<React.ComponentProps<"ol">> = (props) => {
	const { className, ...rest } = props;
	return (
		<ol
			data-slot="breadcrumb-list"
			className={cn(
				"wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5",
				className,
			)}
			{...rest}
		/>
	);
};

const BreadcrumbItem: React.FC<React.ComponentProps<"li">> = (props) => {
	const { className, ...rest } = props;
	return (
		<li
			data-slot="breadcrumb-item"
			className={cn("inline-flex items-center gap-1.5", className)}
			{...rest}
		/>
	);
};

const BreadcrumbLink: React.FC<
	useRender.ComponentProps<"a"> & React.ComponentProps<"a">
> = (props) => {
	const { className, render, ...rest } = props;
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn("transition-colors hover:text-foreground", className),
			},
			rest,
		),
		render,
		state: {
			slot: "breadcrumb-link",
		},
	});
};

const BreadcrumbPage: React.FC<React.ComponentProps<"span">> = (props) => {
	const { className, ...rest } = props;
	return (
		<span
			aria-current="page"
			data-slot="breadcrumb-page"
			className={cn("font-medium text-foreground", className)}
			{...rest}
		/>
	);
};

const BreadcrumbSeparator: React.FC<React.ComponentProps<"li">> = (props) => {
	const { children, className, ...rest } = props;
	return (
		<li
			aria-hidden="true"
			data-slot="breadcrumb-separator"
			role="presentation"
			className={cn("[&>svg]:size-3.5", className)}
			{...rest}
		>
			{children ?? <ChevronRightIcon />}
		</li>
	);
};

const BreadcrumbEllipsis: React.FC<React.ComponentProps<"span">> = (props) => {
	const { className, ...rest } = props;
	return (
		<span
			aria-hidden="true"
			data-slot="breadcrumb-ellipsis"
			role="presentation"
			className={cn("flex size-9 items-center justify-center", className)}
			{...rest}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">Mais</span>
		</span>
	);
};

export {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
};
