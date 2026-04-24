import type { ReactNode } from "react";

type CalloutType = "info" | "success" | "warning";

type CalloutProps = {
	children: ReactNode;
	title?: string;
	type?: CalloutType;
};

const calloutStyles: Record<CalloutType, { label: string; style: string }> = {
	info: {
		label: "Nota",
		style: "border-sky-200 bg-sky-50 text-sky-950",
	},
	success: {
		label: "Dica",
		style: "border-emerald-200 bg-emerald-50 text-emerald-950",
	},
	warning: {
		label: "Atencao",
		style: "border-amber-200 bg-amber-50 text-amber-950",
	},
};

export function Callout({ children, title, type = "info" }: CalloutProps) {
	const selectedStyle = calloutStyles[type];

	return (
		<aside className={`my-6 rounded-2xl border p-5 ${selectedStyle.style}`}>
			<p className="mb-2 font-semibold text-sm uppercase tracking-wide">
				{title ?? selectedStyle.label}
			</p>
			<div className="space-y-3 text-sm leading-6">{children}</div>
		</aside>
	);
}
