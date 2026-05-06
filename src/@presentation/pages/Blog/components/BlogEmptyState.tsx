import { Button } from "@presentation/components/ui/button";
import { Link } from "react-router-dom";

export const BlogEmptyState = () => {
	return (
		<section className="mt-8 rounded-lg border border-dashed p-8">
			<h2 className="font-semibold text-foreground text-xl">
				Nenhum post encontrado
			</h2>
			<p className="mt-3 text-muted-foreground leading-7">
				Não há posts publicados nesta categoria.
			</p>
			<div className="mt-5">
				<Button
					nativeButton={false}
					render={<Link to="/blog" />}
					variant="outline"
				>
					Ver todo o blog
				</Button>
			</div>
		</section>
	);
};
