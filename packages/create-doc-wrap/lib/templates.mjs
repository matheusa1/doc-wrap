import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const templateOptions = [
	{
		description: "Central de publicacoes com rota /blog.",
		label: "Blog",
		value: "blog",
	},
	{
		description: "Central de documentacao com rota /docs.",
		label: "Docs",
		value: "docs",
	},
	{
		description: "Documentacao e publicacoes no mesmo projeto.",
		label: "Blog + Docs",
		value: "blog-docs",
	},
];

export const templates = templateOptions.map((option) => option.value);

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
