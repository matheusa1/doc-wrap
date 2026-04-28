import type { HTMLProps } from "@base-ui/react/types";
import { cn } from "@presentation/lib/utils";
import type { FC } from "react";

type TContainer = HTMLProps<HTMLDivElement> & {
	children: React.ReactNode;
};

const Container: FC<TContainer> = (props) => {
	const { children, className, ...rest } = props;
	return (
		<div className={cn("mx-auto max-w-3xl", className)} {...rest}>
			{children}
		</div>
	);
};

export { Container };
