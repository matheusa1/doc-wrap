export const isModifiedClick = (event: MouseEvent) =>
	event.button !== 0 ||
	event.altKey ||
	event.ctrlKey ||
	event.metaKey ||
	event.shiftKey;

export const getSamePageHash = (anchor: HTMLAnchorElement) => {
	if (anchor.hasAttribute("download") || anchor.target) {
		return null;
	}

	const href = anchor.getAttribute("href");

	if (!href || href === "#") {
		return null;
	}

	const url = new URL(anchor.href);

	if (
		url.origin !== globalThis.location.origin ||
		url.pathname !== globalThis.location.pathname ||
		url.search !== globalThis.location.search ||
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

export const getHashTarget = (hash: string) => {
	const id = decodeHash(hash);

	return id ? document.getElementById(id) : null;
};

export const getScrollBehavior = (): ScrollBehavior => {
	const prefersReducedMotion = globalThis.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	return prefersReducedMotion ? "auto" : "smooth";
};
