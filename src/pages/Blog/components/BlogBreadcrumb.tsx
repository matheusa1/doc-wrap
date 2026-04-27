import { Link } from "react-router-dom";
import type { BlogPost } from "@/blog-map";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BlogBreadcrumbProps = {
	currentPost?: BlogPost;
};

export const BlogBreadcrumb: React.FC<BlogBreadcrumbProps> = ({
	currentPost,
}) => {
	const blogItem = currentPost ? (
		<BreadcrumbLink render={<Link to="/blog" />}>Blog</BreadcrumbLink>
	) : (
		<BreadcrumbPage>Blog</BreadcrumbPage>
	);

	const currentPostItem = currentPost ? (
		<>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>{currentPost.title}</BreadcrumbPage>
			</BreadcrumbItem>
		</>
	) : null;

	return (
		<Breadcrumb className="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>{blogItem}</BreadcrumbItem>
				{currentPostItem}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
