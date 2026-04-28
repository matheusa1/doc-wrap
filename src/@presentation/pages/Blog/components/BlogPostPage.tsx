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
						<div className="mdx-content mt-8 max-w-none text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
							<Component components={mdxComponents} />
						</div>
					</article>
				</Container>
			</main>
		</>
	);
};
