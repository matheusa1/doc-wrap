import { useCallback, useEffect } from "react";
import {
	getHashTarget,
	getSamePageHash,
	getScrollBehavior,
	isModifiedClick,
} from "./use-smooth-hash-scroll.utils";

const scrollToHashTarget = (hash: string) => {
	const target = getHashTarget(hash);

	if (!target) {
		return;
	}

	target.scrollIntoView({
		behavior: getScrollBehavior(),
		block: "start",
	});

	return target;
};

export const useSmoothHashScroll = () => {
	const handleDocumentClick = useCallback((event: MouseEvent) => {
		if (event.defaultPrevented || isModifiedClick(event)) {
			return;
		}

		if (!(event.target instanceof Element)) {
			return;
		}

		const anchor = event.target.closest("a[href]");

		if (!(anchor instanceof HTMLAnchorElement)) {
			return;
		}

		const hash = getSamePageHash(anchor);

		if (!hash) {
			return;
		}

		const target = scrollToHashTarget(hash);

		if (!target) {
			return;
		}

		event.preventDefault();
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleDocumentClick);

		return () => document.removeEventListener("click", handleDocumentClick);
	}, [handleDocumentClick]);
};
