import { Button } from "@presentation/components/ui/button";
import { cn } from "@presentation/lib/utils";
import { BugIcon } from "lucide-react";
import type * as React from "react";

type DocsTechnicalProblemButtonProps = React.ComponentProps<typeof Button>;

export const DocsTechnicalProblemButton = ({
	children,
	className,
	...props
}: DocsTechnicalProblemButtonProps) => {
	return (
		<Button
			className={cn(
				"fixed right-5 bottom-5 z-10 shadow-lg sm:right-4 sm:bottom-4",
				className,
			)}
			size="lg"
			{...props}
		>
			<BugIcon data-icon="inline-start" />
			{children}
		</Button>
	);
};
