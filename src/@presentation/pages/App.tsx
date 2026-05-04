import { useTheme } from "@presentation/context/themeProvider";
import { useSmoothHashScroll } from "@presentation/hooks/use-smooth-hash-scroll";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { BlogPage } from "./Blog";
import { DocsPage } from "./Docs";
import { Home } from "./Home";

export const App = () => {
	useSmoothHashScroll();
	const { theme } = useTheme();

	return (
		<>
			<Routes>
				<Route element={<Home />} path="/" />
				<Route element={<BlogPage />} path="/blog/*" />
				<Route element={<DocsPage />} path="/docs/*" />
				<Route element={<Navigate replace to="/" />} path="*" />
			</Routes>
			<Toaster richColors theme={theme} />
		</>
	);
};
