import { useLocation } from "react-router-dom";
import { blogPostsByPath } from "@/blog-map";
import { normalizePath } from "@/lib/path";
import { BlogListPage } from "./components/BlogListPage";
import { BlogNotFound } from "./components/BlogNotFound";
import { BlogPostPage } from "./components/BlogPostPage";

export const BlogPage: React.FC = () => {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	if (currentPath === "/blog") {
		return <BlogListPage />;
	}

	const currentPost = blogPostsByPath.get(currentPath);

	if (!currentPost) {
		return <BlogNotFound />;
	}

	return <BlogPostPage post={currentPost} />;
};
