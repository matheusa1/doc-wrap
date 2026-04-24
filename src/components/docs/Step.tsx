import type { ReactNode } from "react";

type StepProps = {
	children: ReactNode;
	number: number | string;
	title: string;
};

export function Step({ children, number, title }: StepProps) {
	return (
		<section className="my-2 flex flex-col gap-4 rounded-xl border-2 border-foreground p-5 shadow-sm">
			<header className="w-full">
				<div className="flex items-center space-x-5">
					<p className="flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-primary p-2 font-semibold text-primary-foreground text-sm">
						{number}
					</p>
					<h1 className="font-semibold text-foreground text-lg">{title}</h1>
				</div>
			</header>
			<div className="min-w-0 space-y-2">
				<div className="text-foreground text-sm leading-6">{children}</div>
			</div>
		</section>
	);
}
