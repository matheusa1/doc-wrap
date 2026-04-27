import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";

export const Home = () => {
	return (
		<main className="flex min-h-screen flex-col">
			<AppHeader />
			<Container className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
				<h1 className="font-bold text-4xl">
					Template para documentações e publicações
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground leading-8">
					Use este projeto como base para criar uma central de ajuda, manuais
					internos, notas de versão e comunicados de um sistema.
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					<Button nativeButton={false} render={<Link to="/docs" />}>
						Ver documentação do template
					</Button>
					<Button
						nativeButton={false}
						render={<Link to="/blog" />}
						variant="outline"
					>
						Ver publicações de exemplo
					</Button>
				</div>
			</Container>
		</main>
	);
};
