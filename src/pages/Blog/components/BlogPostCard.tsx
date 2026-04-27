import { Link } from "react-router-dom";
import type { BlogPost } from "@/blog-map";
import { Button } from "@/components/ui/button";
import { formatBlogDate } from "../utils";

type BlogPostCardProps = {
	post: BlogPost;
};

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
	return (
		<article className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition hover:border-ring">
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
				<span className="font-medium text-primary">{post.category}</span>
				<span aria-hidden="true" className="text-border">
					|
				</span>
				<time dateTime={post.publishedAt}>
					{formatBlogDate(post.publishedAt)}
				</time>
			</div>
			<h2 className="mt-3 font-semibold text-2xl text-foreground tracking-tight">
				<Link
					className="outline-none transition hover:text-primary focus-visible:text-primary"
					to={post.path}
				>
					{post.title}
				</Link>
			</h2>
			<p className="mt-3 line-clamp-3 text-muted-foreground leading-7">
				{post.description}
			</p>
			<div className="mt-5">
				<Button
					nativeButton={false}
					render={<Link to={post.path} />}
					size="sm"
					variant="outline"
				>
					Ler post
				</Button>
			</div>
		</article>
	);
};
