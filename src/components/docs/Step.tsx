import type { ReactNode } from "react";

type StepProps = {
	children: ReactNode;
	number: number | string;
	title: string;
};

export function Step({ children, number, title }: StepProps) {
	return (
		<section className="my-6 flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-sm text-white">
				{number}
			</div>
			<div className="min-w-0 space-y-2">
				<h3 className="font-semibold text-lg text-slate-950">{title}</h3>
				<div className="text-slate-700 text-sm leading-6">{children}</div>
			</div>
		</section>
	);
}
