import { filterBlogPostsByCategory } from "@presentation/blog-map";
import { AppHeader } from "@presentation/components/AppHeader";
import { Container } from "@presentation/components/ui/container";
import { useSearchParams } from "react-router-dom";
import { BlogBreadcrumb } from "./BlogBreadcrumb";
import { BlogCategoryFilters } from "./BlogCategoryFilters";
import { BlogEmptyState } from "./BlogEmptyState";
import { BlogListHeader } from "./BlogListHeader";
import { BlogPostCard } from "./BlogPostCard";

export const BlogListPage = () => {
	const [searchParams] = useSearchParams();
	const selectedCategory = searchParams.get("categoria");
	const posts = filterBlogPostsByCategory(selectedCategory);
	const postsContent = posts.length ? (
		<section className="mt-8 grid gap-4 md:grid-cols-2">
			{posts.map((post) => (
				<BlogPostCard key={post.path} post={post} />
			))}
		</section>
	) : (
		<BlogEmptyState />
	);

	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-6xl">
					<BlogBreadcrumb />
					<BlogListHeader postsCount={posts.length} />
					<BlogCategoryFilters selectedCategory={selectedCategory} />
					{postsContent}
				</Container>
			</main>
		</>
	);
};
