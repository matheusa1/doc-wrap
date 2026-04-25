import { Navigate, useLocation } from "react-router-dom";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { docPagesByPath, firstDocPath } from "@/docs-map";

const normalizePath = (path: string) => {
	if (path.length <= 1) {
		return path;
	}

	return path.replace(/\/$/, "");
};

export function DocsPage() {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	if (currentPath === "/docs") {
		return <Navigate replace to={firstDocPath} />;
	}

	const currentDoc = docPagesByPath.get(currentPath);

	if (!currentDoc) {
		return (
			<DocsLayout currentPath={currentPath}>
				<section className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
					<p className="font-semibold text-primary text-sm uppercase tracking-wide">
						404
					</p>
					<h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight">
						Documento nao encontrado
					</h1>
					<p className="mt-4 text-muted-foreground leading-7">
						Use a sidebar para acessar uma pagina disponivel da documentacao.
					</p>
				</section>
			</DocsLayout>
		);
	}

	const Component = currentDoc.Component;

	return (
		<DocsLayout currentDoc={currentDoc} currentPath={currentPath}>
			<article data-pagefind-body>
				<header className="border-b pb-8">
					<p className="font-semibold text-primary text-sm uppercase tracking-wide">
						{currentDoc.category}
					</p>
					<h1
						className="mt-3 font-semibold text-4xl text-foreground tracking-tight"
						data-pagefind-meta="title"
					>
						{currentDoc.title}
					</h1>
					<p
						className="mt-4 text-lg text-muted-foreground leading-8"
						data-pagefind-meta="description"
					>
						{currentDoc.description}
					</p>
				</header>

				<div className="mt-8 max-w-none text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
					<Component />
				</div>
			</article>
		</DocsLayout>
	);
}
