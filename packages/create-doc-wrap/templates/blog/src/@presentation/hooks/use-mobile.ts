import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	const updateIsMobile = React.useCallback(() => {
		setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT);
	}, []);

	React.useEffect(() => {
		const mql = globalThis.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
		);
		mql.addEventListener("change", updateIsMobile);
		updateIsMobile();
		return () => mql.removeEventListener("change", updateIsMobile);
	}, [updateIsMobile]);

	return !!isMobile;
};
