import { Navigate, Route, Routes } from "react-router-dom";
import { DocsPage } from "./Docs";
import { Home } from "./Home";

export default function App() {
	return (
		<Routes>
			<Route element={<Home />} path="/" />
			<Route element={<DocsPage />} path="/docs/*" />
			<Route element={<Navigate replace to="/" />} path="*" />
		</Routes>
	);
}
