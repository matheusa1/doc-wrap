import type { BlogPost } from "@presentation/blog-map";
import { Button } from "@presentation/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { formatBlogDate } from "../utils";

type BlogPostHeaderProps = {
	post: BlogPost;
};

export const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
	const eventMeta = post.eventAt ? (
		<>
			<span aria-hidden="true" className="text-border">
				|
			</span>
			<time dateTime={post.eventAt}>
				Evento em {formatBlogDate(post.eventAt)}
			</time>
		</>
	) : null;

	return (
		<header className="border-b pb-8">
			<Button
				nativeButton={false}
				render={<Link to="/blog" />}
				size="sm"
				variant="ghost"
			>
				<ArrowLeft className="size-4" />
				Voltar
			</Button>
			<p className="mt-6 font-semibold text-primary text-sm uppercase tracking-wide">
				{post.category}
			</p>
			<h1 className="mt-3 font-semibold text-4xl text-foreground tracking-tight">
				{post.title}
			</h1>
			<p className="mt-4 text-lg text-muted-foreground leading-8">
				{post.description}
			</p>
			<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
				<span className="inline-flex items-center gap-1.5">
					<CalendarDays className="size-4" />
					<time dateTime={post.publishedAt}>
						Publicado em {formatBlogDate(post.publishedAt)}
					</time>
				</span>
				{eventMeta}
			</div>
		</header>
	);
};
