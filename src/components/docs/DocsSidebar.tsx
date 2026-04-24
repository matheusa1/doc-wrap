import { Link } from "react-router-dom";
import { docPages, groupDocPages } from "../../docs-map";
import { DocsSearch } from "./DocsSearch";

type DocsSidebarProps = {
	currentPath: string;
};

export function DocsSidebar({ currentPath }: DocsSidebarProps) {
	const groups = groupDocPages(docPages);

	return (
		<aside
			className="border-slate-200 border-b bg-slate-50/95 px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-6"
			data-pagefind-ignore="all"
		>
			<div className="mb-6 space-y-4">
				<div>
					<Link className="font-semibold text-slate-950 text-xl" to="/docs">
						Central de documentacao
					</Link>
					<p className="mt-1 text-slate-500 text-sm">
						Sidebar temporaria para navegar entre os guias.
					</p>
				</div>
				<Link
					className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 text-sm transition hover:border-emerald-300 hover:text-emerald-700"
					to="/"
				>
					Voltar para home
				</Link>
			</div>

			<DocsSearch />

			<nav aria-label="Paginas da documentacao" className="mt-6 space-y-6">
				{groups.map((group) => (
					<section key={group.category}>
						<h2 className="mb-2 font-semibold text-slate-500 text-xs uppercase tracking-wide">
							{group.category}
						</h2>
						<ul className="space-y-1">
							{group.pages.map((page) => {
								const isActive = page.path === currentPath;

								return (
									<li key={page.path}>
										<Link
											aria-current={isActive ? "page" : undefined}
											className={`block rounded-xl px-3 py-2 text-sm transition ${
												isActive
													? "bg-emerald-100 font-semibold text-emerald-900"
													: "text-slate-700 hover:bg-white hover:text-slate-950"
											}`}
											to={page.path}
										>
											<span>{page.title}</span>
											<span className="mt-1 block text-slate-500 text-xs leading-5">
												{page.description}
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</section>
				))}
			</nav>
		</aside>
	);
}
