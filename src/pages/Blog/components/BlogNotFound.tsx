import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BlogBreadcrumb } from "./BlogBreadcrumb";

export const BlogNotFound = () => {
	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-3xl">
					<BlogBreadcrumb />
					<section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
						<p className="font-semibold text-primary text-sm uppercase tracking-wide">
							404
						</p>
						<h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight">
							Post não encontrado
						</h1>
						<p className="mt-4 text-muted-foreground leading-7">
							O post solicitado não existe ou ainda não foi publicado.
						</p>
						<div className="mt-5">
							<Button
								nativeButton={false}
								render={<Link to="/blog" />}
								variant="outline"
							>
								Ver posts
							</Button>
						</div>
					</section>
				</Container>
			</main>
		</>
	);
};
