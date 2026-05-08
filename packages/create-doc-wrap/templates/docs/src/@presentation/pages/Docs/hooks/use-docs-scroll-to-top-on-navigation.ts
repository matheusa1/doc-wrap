import { useEffect } from "react";

const scrollToTop = () => {
	globalThis.scrollTo({ top: 0, behavior: "auto" });
};

type UseDocsScrollToTopOnNavigationProps = {
	currentDocPath?: string;
};

export const useDocsScrollToTopOnNavigation = ({
	currentDocPath,
}: UseDocsScrollToTopOnNavigationProps) => {
	useEffect(() => {
		if (!currentDocPath) {
			return;
		}

		scrollToTop();
	}, [currentDocPath]);
};
