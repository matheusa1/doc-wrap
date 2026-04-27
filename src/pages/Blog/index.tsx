import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
	type BlogPost,
	blogCategories,
	blogPostsByPath,
	filterBlogPostsByCategory,
} from "@/blog-map";
import { AppHeader } from "@/components/AppHeader";
import { mdxComponents } from "@/components/docs/mdx-components";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const normalizePath = (path: string) => {
	if (path.length <= 1) {
		return path;
	}

	return path.replace(/\/$/, "");
};

const formatDate = (value: string) => {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

	if (!match) {
		return value;
	}

	const [, year, month, day] = match;

	return `${day}/${month}/${year}`;
};

const getCategoryPath = (category: string) =>
	`/blog?categoria=${encodeURIComponent(category)}`;

type BlogBreadcrumbProps = {
	currentPost?: BlogPost;
};

const BlogBreadcrumb: React.FC<BlogBreadcrumbProps> = ({ currentPost }) => {
	return (
		<Breadcrumb className="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{currentPost ? (
						<BreadcrumbLink render={<Link to="/blog" />}>Blog</BreadcrumbLink>
					) : (
						<BreadcrumbPage>Blog</BreadcrumbPage>
					)}
				</BreadcrumbItem>
				{currentPost ? (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentPost.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				) : null}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

const BlogListPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const selectedCategory = searchParams.get("categoria");
	const posts = filterBlogPostsByCategory(selectedCategory);
	const hasSelectedCategory = Boolean(selectedCategory);

	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-6xl">
					<BlogBreadcrumb />
					<section className="border-b pb-8">
						<p className="font-semibold text-primary text-sm uppercase tracking-wide">
							Publicações
						</p>
						<div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
							<div>
								<h1 className="font-semibold text-4xl text-foreground tracking-tight">
									Publicações do template
								</h1>
								<p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-8">
									Exemplos de notas de versão, avisos e agendamentos que podem
									ser publicados junto da documentação.
								</p>
							</div>
							<p className="text-muted-foreground text-sm lg:text-right">
								{posts.length} {posts.length === 1 ? "post" : "posts"}
							</p>
						</div>
					</section>

					<section className="mt-8">
						<div className="flex flex-wrap gap-2">
							<Button
								nativeButton={false}
								render={<Link to="/blog" />}
								size="sm"
								variant={hasSelectedCategory ? "outline" : "default"}
							>
								Todas
							</Button>
							{blogCategories.map((category) => (
								<Button
									key={category}
									nativeButton={false}
									render={<Link to={getCategoryPath(category)} />}
									size="sm"
									variant={
										selectedCategory === category ? "default" : "outline"
									}
								>
									<Tag className="size-3.5" />
									{category}
								</Button>
							))}
						</div>
					</section>

					{posts.length > 0 ? (
						<section className="mt-8 grid gap-4 md:grid-cols-2">
							{posts.map((post) => (
								<article
									className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition hover:border-ring"
									key={post.path}
								>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
										<span className="font-medium text-primary">
											{post.category}
										</span>
										<span aria-hidden="true" className="text-border">
											|
										</span>
										<time dateTime={post.publishedAt}>
											{formatDate(post.publishedAt)}
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
							))}
						</section>
					) : (
						<section className="mt-8 rounded-lg border border-dashed p-8">
							<h2 className="font-semibold text-foreground text-xl">
								Nenhum post encontrado
							</h2>
							<p className="mt-3 text-muted-foreground leading-7">
								Não há posts publicados nesta categoria.
							</p>
							<div className="mt-5">
								<Button
									nativeButton={false}
									render={<Link to="/blog" />}
									variant="outline"
								>
									Ver todos os posts
								</Button>
							</div>
						</section>
					)}
				</Container>
			</main>
		</>
	);
};

type BlogPostPageProps = {
	post: BlogPost;
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
	const Component = post.Component;

	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-3xl">
					<BlogBreadcrumb currentPost={post} />
					<article>
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
										Publicado em {formatDate(post.publishedAt)}
									</time>
								</span>
								{post.eventAt ? (
									<>
										<span aria-hidden="true" className="text-border">
											|
										</span>
										<time dateTime={post.eventAt}>
											Evento em {formatDate(post.eventAt)}
										</time>
									</>
								) : null}
							</div>
						</header>

						<div className="mdx-content mt-8 max-w-none text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-xl [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
							<Component components={mdxComponents} />
						</div>
					</article>
				</Container>
			</main>
		</>
	);
};

const BlogNotFoundPage: React.FC = () => {
	return (
		<>
			<AppHeader />
			<main className="px-5 py-8 sm:px-8 lg:px-12">
				<Container className="max-w-3xl">
					<BlogBreadcrumb />
					<section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
						<p className="font-semibold text-primary text-sm uppercase tracking-wide">
							404
						</p>
						<h1 className="mt-3 font-semibold text-3xl text-foreground tracking-tight">
							Post não encontrado
						</h1>
						<p className="mt-4 text-muted-foreground leading-7">
							O post solicitado não existe ou ainda não foi publicado.
						</p>
						<div className="mt-5">
							<Button
								nativeButton={false}
								render={<Link to="/blog" />}
								variant="outline"
							>
								Ver posts
							</Button>
						</div>
					</section>
				</Container>
			</main>
		</>
	);
};

export const BlogPage: React.FC = () => {
	const location = useLocation();
	const currentPath = normalizePath(location.pathname);

	if (currentPath === "/blog") {
		return <BlogListPage />;
	}

	const currentPost = blogPostsByPath.get(currentPath);

	if (!currentPost) {
		return <BlogNotFoundPage />;
	}

	return <BlogPostPage post={currentPost} />;
};
