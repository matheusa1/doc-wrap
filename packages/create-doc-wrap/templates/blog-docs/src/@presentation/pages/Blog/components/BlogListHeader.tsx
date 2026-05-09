type BlogListHeaderProps = {
	postsCount: number;
};

export const BlogListHeader: React.FC<BlogListHeaderProps> = ({
	postsCount,
}) => {
	return (
		<section className="border-b pb-8">
			<p className="font-semibold text-primary text-sm uppercase tracking-wide">
				Blog
			</p>
			<div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
				<div>
					<h1 className="font-semibold text-4xl text-foreground tracking-tight">
						Blog
					</h1>
					<p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-8">
						Posts, notas de versão e comunicados publicados para o projeto.
					</p>
				</div>
				<p className="text-muted-foreground text-sm lg:text-right">
					{postsCount} {postsCount === 1 ? "post" : "posts"}
				</p>
			</div>
		</section>
	);
};
