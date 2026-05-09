import { Button } from "@presentation/components/ui/button";
import { Link } from "react-router-dom";

type HomeActionsProps = {
	hasBlog: boolean;
	hasDocs: boolean;
};

export const HomeActions = ({ hasBlog, hasDocs }: HomeActionsProps) => {
	if (!hasDocs && !hasBlog) {
		return null;
	}

	const docsButton = hasDocs ? (
		<Button nativeButton={false} render={<Link to="/docs" />}>
			Ver documentação
		</Button>
	) : undefined;

	const blogButton = hasBlog ? (
		<Button
			nativeButton={false}
			render={<Link to="/blog" />}
			variant={hasDocs ? "outline" : "default"}
		>
			Ver blog
		</Button>
	) : undefined;

	return (
		<div className="flex flex-wrap justify-center gap-2">
			{docsButton}
			{blogButton}
		</div>
	);
};
