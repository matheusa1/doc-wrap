import type { MDXComponents } from "mdx/types";
import {
	type ComponentPropsWithoutRef,
	isValidElement,
	type ReactNode,
} from "react";
import { MermaidDiagram } from "./MermaidDiagram";

type CodePreProps = ComponentPropsWithoutRef<"pre"> & {
	"data-language"?: string;
};

const getNodeText = (node: ReactNode): string => {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map(getNodeText).join("");
	}

	if (isValidElement<{ children?: ReactNode; "data-line"?: string }>(node)) {
		const text = getNodeText(node.props.children);

		return node.props["data-line"] !== undefined ? `${text}\n` : text;
	}

	return "";
};

const getLanguage = (node: ReactNode) => {
	if (!isValidElement<Record<string, unknown>>(node)) {
		return undefined;
	}

	return node.props["data-language"];
};

function CodeFigure({
	children,
	...props
}: ComponentPropsWithoutRef<"figure">) {
	if (getLanguage(children) === "mermaid") {
		return <MermaidDiagram chart={getNodeText(children).trim()} />;
	}

	return <figure {...props}>{children}</figure>;
}

function CodePre({ children, ...props }: CodePreProps) {
	if (props["data-language"] === "mermaid") {
		return <MermaidDiagram chart={getNodeText(children).trim()} />;
	}

	return <pre {...props}>{children}</pre>;
}

export const mdxComponents: MDXComponents = {
	figure: CodeFigure,
	pre: CodePre,
};
