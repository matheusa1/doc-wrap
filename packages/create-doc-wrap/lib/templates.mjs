import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const templates = ["blog", "docs", "blog-docs"];

const templatesDir = join(
	dirname(fileURLToPath(import.meta.url)),
	"..",
	"templates",
);

export const isTemplate = (value) => templates.includes(String(value));

export const assertTemplate = (value) => {
	if (!isTemplate(value)) {
		throw new Error(
			`Template inválido: ${value}. Use uma das opções: ${templates.join(", ")}.`,
		);
	}

	return value;
};

export const resolveTemplateDirectory = (template) =>
	join(templatesDir, assertTemplate(template));
