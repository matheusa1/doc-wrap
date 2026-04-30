import { Check, Code, Copy } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	isValidElement,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { Button } from "../ui/button";
import { MermaidDiagram } from "./MermaidDiagram";

type CodePreProps = ComponentPropsWithoutRef<"pre"> & {
	"data-language"?: string;
	"data-code-block-in-figure"?: boolean;
};

type CodeFigureProps = ComponentPropsWithoutRef<"figure"> & {
	"data-rehype-pretty-code-figure"?: string;
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

const normalizeCodeText = (node: ReactNode) => getNodeText(node).trimEnd();

const formatLanguageLabel = (language?: string) =>
	language ? language.replace(/[-_]/g, " ") : undefined;

const copyTextToClipboard = async (text: string) => {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}

	if (typeof document === "undefined") {
		throw new Error("Clipboard API unavailable");
	}

	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "absolute";
	textarea.style.opacity = "0";
	textarea.style.pointerEvents = "none";
	document.body.append(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
};

const CodeBlockToolbar: React.FC<{
	code: string;
	language?: string;
}> = ({ code, language }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setCopied(false);
		}, 2000);

		return () => window.clearTimeout(timeoutId);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await copyTextToClipboard(code);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="mdx-code-block-toolbar">
			<div className="flex gap-4 items-center">

			<Code className="text-muted-foreground" />
			{language ? (
				<span className="mdx-code-block-language">
					{formatLanguageLabel(language)}
				</span>
			) : (
				<span />
			)}
			</div>

			<Button
				aria-label={copied ? "Código copiado" : "Copiar código"}
				className="mdx-code-block-copy"
				onClick={handleCopy}
				size="sm"
				type="button"
				variant="ghost"
			>
				{copied ? <Check /> : <Copy />}
				<span>{copied ? "Copiado" : "Copiar"}</span>
			</Button>
		</div>
	);
};

export const CodeFigure: React.FC<CodeFigureProps> = (props) => {
	const { children, ...rest } = props;
	const language = getLanguage(children);

	if (language === "mermaid") {
		return <MermaidDiagram chart={normalizeCodeText(children)} />;
	}

	return (
		<figure {...rest}>
			{isValidElement<CodePreProps>(children)
				? cloneElement(children, { "data-code-block-in-figure": true })
				: children}
		</figure>
	);
};

export const CodePre: React.FC<CodePreProps> = (props) => {
	const { children, "data-code-block-in-figure": isInFigure, ...rest } = props;

	if (rest["data-language"] === "mermaid") {
		return <MermaidDiagram chart={normalizeCodeText(children)} />;
	}

	const content = (
		<>
			<CodeBlockToolbar
				code={normalizeCodeText(children)}
				language={rest["data-language"]}
			/>
			<pre {...rest}>{children}</pre>
		</>
	);

	if (isInFigure) {
		return content;
	}

	return <div className="mdx-code-block">{content}</div>;
};

export const mdxComponents: MDXComponents = {
	figure: CodeFigure,
	pre: CodePre,
};
