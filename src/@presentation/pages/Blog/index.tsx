import { buildPageTitle } from "@presentation/config/project";
import { blogPostsByPath } from "@presentation/blog-map";
import { useDocumentTitle } from "@presentation/hooks/use-document-title";
import { normalizePath } from "@presentation/lib/path";
import { useLocation } from "react-router-dom";
import { BlogListPage } from "./components/BlogListPage";
import { BlogNotFound } from "./components/BlogNotFound";
import { BlogPostPage } from "./components/BlogPostPage";

export const BlogPage: React.FC = () => {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);
	const currentPost =
		currentPath === "/blog" ? undefined : blogPostsByPath.get(currentPath);

	useDocumentTitle(
		buildPageTitle(
			currentPost?.title ??
				(currentPath === "/blog" ? "Blog" : "Página não encontrada"),
		),
	);

	if (currentPath === "/blog") {
		return <BlogListPage />;
	}

	if (!currentPost) {
		return <BlogNotFound />;
	}

	return <BlogPostPage post={currentPost} />;
};
