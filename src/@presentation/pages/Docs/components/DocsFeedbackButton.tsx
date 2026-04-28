import { Button } from "@presentation/components/ui/button";
import { cn } from "@presentation/lib/utils";
import { MessageSquareMoreIcon } from "lucide-react";
import type * as React from "react";

type DocsFeedbackButtonProps = React.ComponentProps<typeof Button>;

export const DocsFeedbackButton = ({
	children,
	className,
	...props
}: DocsFeedbackButtonProps) => {
	return (
		<Button
			className={cn("mt-4 w-full justify-start", className)}
			size="lg"
			variant="ghost"
			{...props}
		>
			<MessageSquareMoreIcon />
			{children}
		</Button>
	);
};
