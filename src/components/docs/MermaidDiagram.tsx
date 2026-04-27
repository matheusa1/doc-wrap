import { useEffect, useId, useState } from "react";
import { useTheme } from "@/context/themeProvider";

type MermaidDiagramProps = {
	chart: string;
};

const getRenderedTheme = () =>
	document.documentElement.classList.contains("dark") ? "dark" : "default";

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
	const reactId = useId();
	const { theme } = useTheme();
	const [error, setError] = useState<string>();
	const [svg, setSvg] = useState("");

	useEffect(() => {
		let isCurrent = true;
		const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

		async function renderDiagram() {
			try {
				const { default: mermaid } = await import("mermaid");

				mermaid.initialize({
					fontFamily: "Geist Variable, sans-serif",
					securityLevel: "strict",
					startOnLoad: false,
					theme: theme === "light" ? "default" : getRenderedTheme(),
				});

				const result = await mermaid.render(diagramId, chart);

				if (isCurrent) {
					setSvg(result.svg);
					setError(undefined);
				}
			} catch (caughtError) {
				if (isCurrent) {
					setSvg("");
					setError(
						caughtError instanceof Error
							? caughtError.message
							: "Não foi possível renderizar este diagrama.",
					);
				}
			}
		}

		renderDiagram();

		return () => {
			isCurrent = false;
		};
	}, [chart, reactId, theme]);

	if (error) {
		return (
			<figure className="mermaid-diagram mermaid-diagram-error">
				<figcaption>Erro ao renderizar Mermaid</figcaption>
				<pre>{chart}</pre>
				<p>{error}</p>
			</figure>
		);
	}

	return (
		<figure className="mermaid-diagram">
			<div
				aria-label="Diagrama Mermaid"
				className="mermaid-diagram-canvas"
				role="img"
				// Mermaid returns an SVG string generated from trusted local MDX content.
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid render output is SVG markup.
				dangerouslySetInnerHTML={{ __html: svg }}
			/>
		</figure>
	);
};
