import { TooltipProvider } from "@presentation/components/ui/tooltip";
import { ThemeProvider } from "@presentation/context/themeProvider.tsx";
import { App } from "@presentation/pages/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

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
