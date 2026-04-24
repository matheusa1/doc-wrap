import { Link, Navigate, Route, Routes } from "react-router-dom";
import HomeContent from "./content/home.mdx";
import { DocsPage } from "./pages/DocsPage";

const Home = () => {
	return (
		<main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-50">
			<div className="mx-auto max-w-3xl space-y-6">
				<Link
					className="inline-flex rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
					to="/docs"
				>
					Abrir central de documentação
				</Link>
				<article className="space-y-6 [&_a]:text-emerald-300 [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:font-semibold [&_h1]:text-4xl [&_h1]:tracking-tight [&_h2]:mt-10 [&_h2]:font-semibold [&_h2]:text-2xl [&_p]:text-base [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
					<HomeContent />
				</article>
			</div>
		</main>
	);
};

export default function App() {
	return (
		<Routes>
			<Route element={<Home />} path="/" />
			<Route element={<DocsPage />} path="/docs/*" />
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
}
