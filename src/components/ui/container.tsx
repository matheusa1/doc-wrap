import type { HTMLProps } from "@base-ui/react/types";
import type { FC } from "react";
import { cn } from "@/lib/utils";

type TContainer = HTMLProps<HTMLDivElement> & {
	children: React.ReactNode;
};

const Container: FC<TContainer> = ({ children, ...props }) => {
	return (
		<div className={cn("mx-auto max-w-3xl", props.className)} {...props}>
			{children}
		</div>
	);
};

export default Container;
