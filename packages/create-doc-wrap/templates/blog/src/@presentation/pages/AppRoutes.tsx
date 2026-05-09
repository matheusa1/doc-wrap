import { projectConfig } from "@presentation/config/project";
import { BlogPage } from "@presentation/pages/Blog";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Home";

const blogRoute = projectConfig.hasBlog ? (
	<Route element={<BlogPage />} path="/blog/*" />
) : undefined;

export const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<Home />} path="/" />
			{blogRoute}
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
};
