type HomeDescriptionProps = {
	description: string;
};

export const HomeDescription = ({ description }: HomeDescriptionProps) => {
	return (
		<p className="max-w-2xl text-lg text-muted-foreground leading-8">
			{description}
		</p>
	);
};
