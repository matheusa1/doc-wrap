import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";
import { ThemeProvider } from "./context/themeProvider.tsx";
import { App } from "./pages/App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<TooltipProvider>
					<App />
				</TooltipProvider>
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>,
);
