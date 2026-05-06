import { projectConfig } from "@presentation/config/project";
import { BlogPage } from "@presentation/pages/Blog";
import { DocsPage } from "@presentation/pages/Docs";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Home";

const blogRoute = projectConfig.hasBlog ? (
	<Route element={<BlogPage />} path="/blog/*" />
) : undefined;

const docsRoute = projectConfig.hasDocs ? (
	<Route element={<DocsPage />} path="/docs/*" />
) : undefined;

export const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<Home />} path="/" />
			{blogRoute}
			{docsRoute}
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
};
