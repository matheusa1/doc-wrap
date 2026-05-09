import { projectConfig } from "@presentation/config/project";
import { DocsPage } from "@presentation/pages/Docs";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Home";

const docsRoute = projectConfig.hasDocs ? (
	<Route element={<DocsPage />} path="/docs/*" />
) : undefined;

export const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<Home />} path="/" />
			{docsRoute}
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
};
