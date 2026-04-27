import { useEffect } from "react";

const isModifiedClick = (event: MouseEvent) =>
	event.button !== 0 ||
	event.altKey ||
	event.ctrlKey ||
	event.metaKey ||
	event.shiftKey;

const getSamePageHash = (anchor: HTMLAnchorElement) => {
	if (anchor.hasAttribute("download") || anchor.target) {
		return null;
	}

	const href = anchor.getAttribute("href");

	if (!href || href === "#") {
		return null;
	}

	const url = new URL(anchor.href);

	if (
		url.origin !== window.location.origin ||
		url.pathname !== window.location.pathname ||
		url.search !== window.location.search ||
		!url.hash
	) {
		return null;
	}

	return url.hash;
};

const decodeHash = (hash: string) => {
	try {
		return decodeURIComponent(hash.slice(1));
	} catch {
		return hash.slice(1);
	}
};

const getHashTarget = (hash: string) => {
	const id = decodeHash(hash);

	return id ? document.getElementById(id) : null;
};

export const useSmoothHashScroll = () => {
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
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

			const target = getHashTarget(hash);

			if (!target) {
				return;
			}

			const prefersReducedMotion = globalThis.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;

			event.preventDefault();
			target.scrollIntoView({
				behavior: prefersReducedMotion ? "auto" : "smooth",
				block: "start",
			});
		};

		document.addEventListener("click", handleClick);

		return () => document.removeEventListener("click", handleClick);
	}, []);
};
