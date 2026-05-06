import { AppHeader } from "@presentation/components/AppHeader";
import { Container } from "@presentation/components/ui/container";
import { buildPageTitle, projectConfig } from "@presentation/config/project";
import { useDocumentTitle } from "@presentation/hooks/use-document-title";
import { HomeActions } from "./components/HomeActions";
import { HomeDescription } from "./components/HomeDescription";

export const Home = () => {
	useDocumentTitle(buildPageTitle("Início"));

	const description = projectConfig.description ? (
		<HomeDescription description={projectConfig.description} />
	) : undefined;

	return (
		<main className="flex min-h-screen flex-col">
			<AppHeader />
			<Container className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
				<h1 className="font-bold text-4xl">{projectConfig.name}</h1>
				{description}
				<HomeActions
					hasBlog={projectConfig.hasBlog}
					hasDocs={projectConfig.hasDocs}
				/>
			</Container>
		</main>
	);
};
