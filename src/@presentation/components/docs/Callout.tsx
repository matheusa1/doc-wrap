import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@presentation/components/ui/alert.tsx";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "hint" | "warning";

type CalloutProps = {
	children: ReactNode;
	title?: string;
	type?: CalloutType;
};

const icon: Record<CalloutType, ReactNode> = {
	info: <Info />,
	hint: <Lightbulb />,
	warning: <TriangleAlert />,
};

const calloutStyles: Record<CalloutType, { label: string; style: string }> = {
	info: {
		label: "Nota",
		style: "dark:bg-sky-950 bg-sky-50 text-sky-950 dark:text-sky-50",
	},
	hint: {
		label: "Dica",
		style:
			"bg-yellow-50 dark:bg-yellow-950 text-yellow-950 dark:text-yellow-50",
	},
	warning: {
		label: "Atenção",
		style:
			"bg-orange-50 dark:bg-orange-950 text-orange-950 dark:text-orange-50",
	},
};

export const Callout: React.FC<CalloutProps> = (props) => {
	const { children, title, type = "info" } = props;
	const selectedStyle = calloutStyles[type];
	const selectedIcon = icon[type];

	return (
		<Alert className={`${selectedStyle?.style} my-4`}>
			{selectedIcon}
			<AlertTitle>{title ?? selectedStyle.label}</AlertTitle>
			<AlertDescription>{children}</AlertDescription>
		</Alert>
	);
};
