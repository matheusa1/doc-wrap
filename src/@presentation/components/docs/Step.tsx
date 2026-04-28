import type * as React from "react";

type StepProps = {
	children: React.ReactNode;
	number?: number;
	title: string;
};

type TSteps = {
	steps: StepProps[];
};

export const Step: React.FC<StepProps> = (props) => {
	const { children, number, title } = props;
	return (
		<section className={"flex flex-col"}>
			<header className="flex w-full gap-4">
				<p className="flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-primary p-2 font-semibold text-primary-foreground text-sm">
					{number}
				</p>
				<div className="flex items-center space-x-5">
					<h1 className="font-semibold text-foreground text-lg">{title}</h1>
				</div>
			</header>
			<div className="ml-12 text-foreground text-sm leading-6">{children}</div>
		</section>
	);
};

export const Steps: React.FC<TSteps> = (props) => {
	const { steps = [] } = props;
	const formattedSteps: StepProps[] = steps?.map((step, index) => ({
		children: step.children,
		title: step.title,
		number: step.number ?? index + 1,
	}));

	return (
		<div className={"relative flex flex-col"}>
			{formattedSteps.map((step) => (
				<Step key={step.number} number={step.number} title={step.title}>
					{step.children}
				</Step>
			))}
		</div>
	);
};
