import { TooltipProvider } from "@presentation/components/ui/tooltip";
import { projectConfig } from "@presentation/config/project";
import { ThemeProvider } from "@presentation/context/themeProvider.tsx";
import { queryClient } from "@presentation/lib/query-client";
import { App } from "@presentation/pages/App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

document.title = projectConfig.name;

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ThemeProvider
					defaultTheme={projectConfig.defaultTheme}
					storageKey="vite-ui-theme"
				>
					<TooltipProvider>
						<App />
					</TooltipProvider>
				</ThemeProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>,
);
