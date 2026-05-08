import { z } from "zod";

const supportedThemes = ["dark", "light", "system"];

export const projectConfigSchema = z
	.object({
		defaultTheme: z.enum(supportedThemes),
		description: z.string(),
		hasBlog: z.boolean(),
		hasDocs: z.boolean(),
		name: z.string(),
	})
	.strict();

const projectConfigOverrideSchema = projectConfigSchema.partial().strict();

export const projectConfigDefaults = {
	defaultTheme: "dark",
	description: "",
	hasBlog: true,
	hasDocs: true,
	name: "Projeto",
};

const formatExpectedType = (expected) => {
	const typeLabels = {
		array: "array",
		boolean: "booleano",
		null: "nulo",
		number: "número",
		object: "objeto",
		string: "texto",
	};

	return typeLabels[expected] ?? String(expected);
};

const formatReceivedType = (input) => {
	if (input === null) {
		return "nulo";
	}

	if (Array.isArray(input)) {
		return "array";
	}

	const typeLabels = {
		boolean: "booleano",
		number: "número",
		object: "objeto",
		string: "texto",
		undefined: "indefinido",
	};

	return typeLabels[typeof input] ?? typeof input;
};

const formatIssuePath = (issue) => {
	if (issue.path.length === 0) {
		return "<raiz>";
	}

	return issue.path.join(".");
};

const formatIssueMessage = (issue) => {
	if (issue.code === "unrecognized_keys") {
		const quotedKeys = issue.keys.map((key) => `"${key}"`).join(", ");

		return `Chaves não reconhecidas: ${quotedKeys}`;
	}

	if (issue.code === "invalid_value") {
		const allowedValues = issue.values.map((value) => `"${value}"`).join(", ");

		return `Valor inválido. Use um dos valores permitidos: ${allowedValues}`;
	}

	if (issue.code === "invalid_type") {
		return `Tipo inválido. Esperado ${formatExpectedType(issue.expected)}, recebido ${formatReceivedType(issue.input)}.`;
	}

	return "Valor inválido.";
};

const formatZodError = (filename, error) => {
	const issues = error.issues
		.map((issue) => `- ${formatIssuePath(issue)}: ${formatIssueMessage(issue)}`)
		.join("\n");

	return `Configuração de projeto inválida em ${filename}:\n${issues}`;
};

const parseJsonContent = (content, filename) => {
	let parsedContent;

	try {
		parsedContent = JSON.parse(content);
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);

		throw new Error(`JSON inválido em ${filename}: ${reason}`, {
			cause: error,
		});
	}

	return parsedContent;
};

const parseProjectConfig = (content, filename, schema) => {
	const result = schema.safeParse(content);

	if (!result.success) {
		throw new Error(formatZodError(filename, result.error), {
			cause: result.error,
		});
	}

	return result.data;
};

const parseProjectConfigOverrides = (content, filename) =>
	parseProjectConfig(content, filename, projectConfigOverrideSchema);

const parseResolvedProjectConfig = (content, filename) =>
	parseProjectConfig(content, filename, projectConfigSchema);

export const resolveProjectConfig = (overrides = {}) => {
	const filename = "project.config.json";
	const parsedOverrides = parseProjectConfigOverrides(overrides, filename);
	const mergedConfig = {
		...projectConfigDefaults,
		...parsedOverrides,
	};

	return parseResolvedProjectConfig(mergedConfig, filename);
};

export const readProjectConfig = async (rootDir) => {
	const nodeFsPromisesId = "node:fs/promises";
	const nodePathId = "node:path";
	const [{ readFile }, { join }] = await Promise.all([
		import(nodeFsPromisesId),
		import(nodePathId),
	]);
	const filename = "project.config.json";
	const projectConfigPath = join(rootDir, filename);
	let content;

	try {
		content = await readFile(projectConfigPath, "utf8");
	} catch (error) {
		if (error?.code !== "ENOENT") {
			throw error;
		}

		throw new Error(
			`Arquivo obrigatório ausente: ${filename}. Esperado em ${rootDir}. Crie o arquivo para continuar.`,
			{
				cause: error,
			},
		);
	}

	const parsedContent = parseJsonContent(content, filename);

	return resolveProjectConfig(parsedContent);
};
