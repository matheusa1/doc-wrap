import {
	Field,
	FieldDescription,
	FieldLabel,
} from "@presentation/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@presentation/components/ui/input-group";
import { Kbd, KbdGroup } from "@presentation/components/ui/kbd";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@presentation/components/ui/popover";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const normalizeSearchResultUrl = (url: string) => {
	if (!url.startsWith("/")) {
		return url;
	}

	const normalizedUrl = url.replace(/\/index\/?$/, "");

	return normalizedUrl || "/";
};

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
			const excerpt =
				data.meta?.description && data.meta.description.trim().length > 0
					? data.meta.description
					: data.excerpt ?? "";

			return {
				excerpt: stripHtml(excerpt),
				title: data.meta?.title ?? data.url,
				url: normalizeSearchResultUrl(data.url),
			};
		}),
	);

	return results;
};

export const DocsSearch = () => {
	const inputGroupRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [mode, setMode] = useState<SearchMode>("idle");
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);

	const isAppleDevice =
		typeof globalThis.navigator !== "undefined" &&
		/Mac|iPhone|iPad|iPod/.test(globalThis.navigator.platform);

	useEffect(() => {
		const normalizedQuery = query.trim();

		if (!normalizedQuery) {
			setMode("idle");
			setResults([]);
			setIsPopoverOpen(false);
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

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.defaultPrevented ||
				event.key.toLowerCase() !== "k" ||
				(!event.ctrlKey && !event.metaKey) ||
				event.altKey ||
				event.shiftKey
			) {
				return;
			}

			event.preventDefault();
			inputRef.current?.focus();

			if (query.trim().length > 0) {
				setIsPopoverOpen(true);
			}
		};

		globalThis.addEventListener("keydown", handleKeyDown);

		return () => {
			globalThis.removeEventListener("keydown", handleKeyDown);
		};
	}, [query]);

	const hasQuery = query.trim().length > 0;
	const popoverOpen = hasQuery && isPopoverOpen;
	const statusText = (() => {
		if (!hasQuery) {
			return "Digite para buscar no conteúdo dos documentos.";
		}

		if (mode === "loading") {
			return "Buscando...";
		}

		return `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`;
	})();

	const handleQueryChange = (value: string) => {
		setQuery(value);
		setIsPopoverOpen(value.trim().length > 0);
	};

	const clearSearch = () => {
		setQuery("");
		setIsPopoverOpen(false);
		inputRef.current?.focus();
	};

	const resultsContent = (() => {
		if (mode === "loading") {
			return (
				<p className="px-2.5 py-2 text-muted-foreground text-sm">Buscando...</p>
			);
		}

		if (results.length === 0) {
			return (
				<p className="rounded-md border border-dashed p-3 text-muted-foreground text-sm">
					Nenhum resultado encontrado.
				</p>
			);
		}

		return (
			<ul className="grid gap-1">
				{results.map((result) => (
					<li key={`${result.url}-${result.title}`}>
						<Link
							className="block rounded-md px-2.5 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={() => setIsPopoverOpen(false)}
							to={result.url}
						>
							<span className="font-medium text-foreground">
								{result.title}
							</span>
							{result.excerpt ? (
								<span className="mt-1 line-clamp-2 block text-muted-foreground text-xs leading-5">
									{result.excerpt}
								</span>
							) : null}
						</Link>
					</li>
				))}
			</ul>
		);
	})();

	return (
		<Field className="gap-1.5" data-pagefind-ignore="all">
			<FieldLabel htmlFor="docs-search" className="text-sidebar-foreground">
				Buscar
			</FieldLabel>
			<Popover
				open={popoverOpen}
				onOpenChange={(nextOpen, details) => {
					if (!nextOpen && details.reason === "trigger-press" && hasQuery) {
						setIsPopoverOpen(true);
						return;
					}

					setIsPopoverOpen(nextOpen && hasQuery);
				}}
			>
				<div className="w-full" ref={inputGroupRef}>
					<InputGroup className="bg-background">
						<InputGroupAddon>
							<PopoverTrigger
								aria-label="Abrir busca"
								onClick={() => {
									inputRef.current?.focus();
								}}
								render={<InputGroupButton size="icon-xs" variant="ghost" />}
							>
								<Search className="size-3.5" />
							</PopoverTrigger>
						</InputGroupAddon>
						<InputGroupInput
							id="docs-search"
							onChange={(event) => handleQueryChange(event.target.value)}
							onFocus={() => {
								if (hasQuery) {
									setIsPopoverOpen(true);
								}
							}}
							onKeyDown={(event) => {
								if (event.key === "Escape") {
									setIsPopoverOpen(false);
								}
							}}
							placeholder="Buscar nos guias"
							ref={inputRef}
							type="search"
							value={query}
						/>
						<InputGroupAddon align="inline-end">
							{hasQuery ? (
								<InputGroupButton
									aria-label="Limpar busca"
									onClick={clearSearch}
									size="icon-xs"
								>
									<X className="size-3.5" />
								</InputGroupButton>
							) : (
								<KbdGroup aria-label="Atalho de busca">
									<Kbd>{isAppleDevice ? "⌘" : "Ctrl"}</Kbd>
									<Kbd>K</Kbd>
								</KbdGroup>
							)}
						</InputGroupAddon>
					</InputGroup>
				</div>
				<PopoverContent
					align="start"
					anchor={inputGroupRef}
					className="max-h-80 min-w-(--anchor-width) max-w-[calc(100vw-2rem)] w-96 overflow-y-auto p-1"
					initialFocus={false}
					sideOffset={6}
				>
					{resultsContent}
				</PopoverContent>
			</Popover>
			<FieldDescription className="text-xs">{statusText}</FieldDescription>
		</Field>
	);
};
