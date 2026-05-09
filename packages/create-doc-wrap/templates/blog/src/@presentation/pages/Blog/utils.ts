export const formatBlogDate = (value: string) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

	if (!match) {
		return value;
	}

	const [, year, month, day] = match;

	return `${day}/${month}/${year}`;
};

export const getBlogCategoryPath = (category: string) =>
	`/blog?categoria=${encodeURIComponent(category)}`;
