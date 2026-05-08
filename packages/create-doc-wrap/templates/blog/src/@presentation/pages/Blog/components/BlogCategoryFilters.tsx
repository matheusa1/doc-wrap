import { blogCategories } from "@presentation/blog-map";
import { Button } from "@presentation/components/ui/button";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogCategoryPath } from "../utils";

type BlogCategoryFiltersProps = {
	selectedCategory: string | null;
};

export const BlogCategoryFilters: React.FC<BlogCategoryFiltersProps> = ({
	selectedCategory,
}) => {
	const hasSelectedCategory = Boolean(selectedCategory);

	return (
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
						render={<Link to={getBlogCategoryPath(category)} />}
						size="sm"
						variant={selectedCategory === category ? "default" : "outline"}
					>
						<Tag className="size-3.5" />
						{category}
					</Button>
				))}
			</div>
		</section>
	);
};
