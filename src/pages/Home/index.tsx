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
					Bem-vindo à central de documentação!
				</h1>
				<div className="flex flex-wrap justify-center gap-2">
					<Button nativeButton={false} render={<Link to="/docs" />}>
						Abrir central de documentação
					</Button>
					<Button
						nativeButton={false}
						render={<Link to="/blog" />}
						variant="outline"
					>
						Abrir blog
					</Button>
				</div>
			</Container>
		</main>
	);
};
