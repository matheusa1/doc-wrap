import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/themeToggle";

export const Home = () => {
	return (
		<main className="flex min-h-screen flex-col">
			<header className="flex w-full justify-between p-5">
				<p className="font-bold text-xl">Documentação</p>
				<ThemeToggle />
			</header>
			<Container className="flex flex-1 flex-col items-center justify-center gap-5">
				<h1 className="font-bold text-4xl">
					Bem-vindo à central de documentação!
				</h1>
				<Link to="/docs">
					<Button>Abrir central de documentação</Button>
				</Link>
			</Container>
		</main>
	);
};
