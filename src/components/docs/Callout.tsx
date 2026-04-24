import { BatteryWarning, Info, Lamp } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "success" | "warning";

type CalloutProps = {
	children: ReactNode;
	title?: string;
	type?: CalloutType;
};

const icon = {
	info: <Info />,
	hint: <Lamp />,
	warning: <BatteryWarning />,
};

const calloutStyles: Record<CalloutType, { label: string; style: string }> = {
	info: {
		label: "Nota",
		style: "border-sky-500 bg-sky-100/10 text-sky-500",
	},
	success: {
		label: "Dica",
		style: "border-emerald-500 bg-emerald-100/10 text-emerald-500",
	},
	warning: {
		label: "Atenção",
		style: "border-amber-500 bg-amber-100/10 text-amber-500",
	},
};

export function Callout({ children, title, type = "info" }: CalloutProps) {
	const selectedStyle = calloutStyles[type];

	return (
		<aside className={`my-6 rounded-2xl border p-4 ${selectedStyle.style}`}>
			<p className="m-0 font-semibold text-lg tracking-wide">
				{title ?? selectedStyle.label}
			</p>
			<div className="text-sm leading-6">{children}</div>
		</aside>
	);
}
