import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchDocPages } from "../../docs-map";

type PagefindSearchResult = {
	data: () => Promise<PagefindResultData>;
};

type PagefindResultData = {
	excerpt?: string;
	meta?: Record<string, string>;
	url: string;
};

type PagefindModule = {
	options?: (options: { baseUrl?: string }) => Promise<void>;
	search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
};

type SearchMode = "idle" | "loading" | "pagefind" | "local";

type SearchResult = {
	excerpt: string;
	title: string;
	url: string;
};

const stripHtml = (value: string) =>
	value
		.replaceAll(/<[^>]*>/g, "")
		.replaceAll(/\s+/g, " ")
		.trim();

const createLocalResults = (query: string): SearchResult[] =>
	searchDocPages(query).map((page) => ({
		excerpt: page.description,
		title: page.title,
		url: page.path,
	}));

const searchWithPagefind = async (query: string): Promise<SearchResult[]> => {
	const pagefindPath = "/pagefind/pagefind.js";
	const pagefind = (await import(
		/* @vite-ignore */ pagefindPath
	)) as PagefindModule;

	await pagefind.options?.({ baseUrl: "/" });

	const response = await pagefind.search(query);
	const results = await Promise.all(
		response.results.slice(0, 8).map(async (result) => {
			const data = await result.data();

			return {
				excerpt: stripHtml(data.excerpt ?? data.meta?.description ?? ""),
				title: data.meta?.title ?? data.url,
				url: data.url,
			};
		}),
	);

	return results;
};

export function DocsSearch() {
	const [mode, setMode] = useState<SearchMode>("idle");
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);

	useEffect(() => {
		const normalizedQuery = query.trim();

		if (!normalizedQuery) {
			setMode("idle");
			setResults([]);
			return;
		}

		let didCancel = false;

		const runSearch = async () => {
			if (import.meta.env.DEV) {
				setMode("local");
				setResults(createLocalResults(normalizedQuery));
				return;
			}

			setMode("loading");

			try {
				const pagefindResults = await searchWithPagefind(normalizedQuery);

				if (!didCancel) {
					setMode("pagefind");
					setResults(pagefindResults);
				}
			} catch {
				if (!didCancel) {
					setMode("local");
					setResults(createLocalResults(normalizedQuery));
				}
			}
		};

		void runSearch();

		return () => {
			didCancel = true;
		};
	}, [query]);

	const hasQuery = query.trim().length > 0;
	const statusText = (() => {
		if (!hasQuery) {
			return "Digite para buscar no conteudo dos documentos.";
		}

		if (mode === "loading") {
			return "Buscando no indice Pagefind...";
		}

		if (mode === "pagefind") {
			return `${results.length} ${results.length === 1 ? "resultado Pagefind" : "resultados Pagefind"}`;
		}

		return `${results.length} ${results.length === 1 ? "resultado local" : "resultados locais"}`;
	})();

	return (
		<div className="space-y-3" data-pagefind-ignore="all">
			<label
				className="font-medium text-slate-700 text-sm"
				htmlFor="docs-search"
			>
				Buscar com Pagefind
			</label>
			<input
				className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
				id="docs-search"
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Buscar nos guias"
				type="search"
				value={query}
			/>
			<p className="text-slate-500 text-xs">{statusText}</p>

			{hasQuery && mode !== "loading" ? (
				results.length > 0 ? (
					<ul className="space-y-2">
						{results.map((result) => (
							<li key={`${result.url}-${result.title}`}>
								<Link
									className="block rounded-xl border border-slate-200 bg-white p-3 text-sm transition hover:border-emerald-300 hover:text-emerald-800"
									to={result.url}
								>
									<span className="font-semibold text-slate-950">
										{result.title}
									</span>
									{result.excerpt ? (
										<span className="mt-1 line-clamp-2 block text-slate-500 text-xs leading-5">
											{result.excerpt}
										</span>
									) : null}
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p className="rounded-xl border border-slate-200 border-dashed p-3 text-slate-500 text-sm">
						Nenhum resultado encontrado.
					</p>
				)
			) : null}
		</div>
	);
}
