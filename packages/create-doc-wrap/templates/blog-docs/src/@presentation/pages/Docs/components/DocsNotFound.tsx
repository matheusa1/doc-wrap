import { DocsLayout } from "@presentation/components/docs/DocsLayout";

type DocsNotFoundProps = {
	currentPath: string;
};

export const DocsNotFound: React.FC<DocsNotFoundProps> = ({ currentPath }) => {
	return (
		<DocsLayout currentPath={currentPath}>
			<p className="font-semibold text-primary text-sm uppercase tracking-wide">
				404
			</p>
			<h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight">
				Documento não encontrado
			</h1>
			<p className="mt-4 text-muted-foreground leading-7">
				Use a sidebar para acessar uma página disponível da documentação.
			</p>
		</DocsLayout>
	);
};
