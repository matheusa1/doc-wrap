import type { MDXComponents } from "mdx/types";
import { Navigate, useLocation } from "react-router-dom";
import { Callout } from "../components/docs/Callout";
import { DocsLayout } from "../components/docs/DocsLayout";
import { Step } from "../components/docs/Step";
import { docPagesByPath, firstDocPath } from "../docs-map";

const mdxComponents = {
	Callout,
	Step,
} satisfies MDXComponents;

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
				<section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
					<p className="font-semibold text-emerald-700 text-sm uppercase tracking-wide">
						404
					</p>
					<h1 className="mt-3 font-semibold text-3xl text-slate-950 tracking-tight">
						Documento nao encontrado
					</h1>
					<p className="mt-4 text-slate-600 leading-7">
						Use a sidebar para acessar uma pagina disponivel da documentacao.
					</p>
				</section>
			</DocsLayout>
		);
	}

	const Component = currentDoc.Component;

	return (
		<DocsLayout currentDoc={currentDoc} currentPath={currentPath}>
			<article
				className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
				data-pagefind-body
			>
				<header className="border-slate-200 border-b pb-8">
					<p className="font-semibold text-emerald-700 text-sm uppercase tracking-wide">
						{currentDoc.category}
					</p>
					<h1
						className="mt-3 font-semibold text-4xl text-slate-950 tracking-tight"
						data-pagefind-meta="title"
					>
						{currentDoc.title}
					</h1>
					<p
						className="mt-4 text-lg text-slate-600 leading-8"
						data-pagefind-meta="description"
					>
						{currentDoc.description}
					</p>
				</header>

				<div className="mt-8 max-w-none text-slate-700 [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-slate-950 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:text-slate-950 [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-slate-950 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
					<Component components={mdxComponents} />
				</div>
			</article>
		</DocsLayout>
	);
}
