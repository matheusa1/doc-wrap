import { Navigate, Route, Routes } from "react-router-dom";
import { useSmoothHashScroll } from "@/hooks/use-smooth-hash-scroll";
import { BlogPage } from "./Blog";
import { DocsPage } from "./Docs";
import { Home } from "./Home";

export const App = () => {
	useSmoothHashScroll();

	return (
		<Routes>
			<Route element={<Home />} path="/" />
			<Route element={<BlogPage />} path="/blog/*" />
			<Route element={<DocsPage />} path="/docs/*" />
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
};
