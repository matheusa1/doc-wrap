export const normalizePath = (path: string) => {
	if (path.length <= 1) {
		return path;
	}

	return path.replace(/\/$/, "");
};
