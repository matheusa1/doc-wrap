import { useTheme } from "@presentation/context/themeProvider";
import { useSmoothHashScroll } from "@presentation/hooks/use-smooth-hash-scroll";
import { Toaster } from "sonner";
import { AppRoutes } from "./AppRoutes";

export const App = () => {
	useSmoothHashScroll();
	const { theme } = useTheme();

	return (
		<>
			<AppRoutes />
			<Toaster richColors theme={theme} />
		</>
	);
};
