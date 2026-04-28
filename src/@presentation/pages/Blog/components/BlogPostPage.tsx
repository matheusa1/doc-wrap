import type { BlogPost } from "@presentation/blog-map";
import { AppHeader } from "@presentation/components/AppHeader";
import { mdxComponents } from "@presentation/components/docs/mdx-components";
import { Container } from "@presentation/components/ui/container";
import { BlogBreadcrumb } from "./BlogBreadcrumb";
import { BlogPostHeader } from "./BlogPostHeader";

type BlogPostPageProps = {
	post: BlogPost;
};

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
	const Component = post.Component;

	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-3xl">
					<BlogBreadcrumb currentPost={post} />
					<article>
						<BlogPostHeader post={post} />
						<div className="mdx-content mt-8 max-w-none">
							<Component components={mdxComponents} />
						</div>
					</article>
				</Container>
			</main>
		</>
	);
};
