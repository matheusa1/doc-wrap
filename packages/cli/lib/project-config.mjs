import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
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

const formatIssuePath = (issue) => {
	if (issue.path.length === 0) {
		return "<root>";
	}

	return issue.path.join(".");
};

const formatZodError = (filename, error) => {
	const issues = error.issues
		.map((issue) => `- ${formatIssuePath(issue)}: ${issue.message}`)
		.join("\n");

	return `Invalid project config in ${filename}:\n${issues}`;
};

const parseJsonContent = (content, filename) => {
	let parsedContent;

	try {
		parsedContent = JSON.parse(content);
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);

		throw new Error(`Invalid JSON in ${filename}: ${reason}`, {
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

const parseProjectConfigFile = async (filePath, schema) => {
	const filename = basename(filePath);
	const content = await readFile(filePath, "utf8");
	const parsedContent = parseJsonContent(content, filename);

	return parseProjectConfig(parsedContent, filename, schema);
};

export const resolveProjectConfig = (overrides = {}) => {
	const filename = "project.config.json";
	const parsedOverrides = parseProjectConfig(
		overrides,
		filename,
		projectConfigOverrideSchema,
	);

	const result = projectConfigSchema.safeParse({
		...projectConfigDefaults,
		...parsedOverrides,
	});

	if (!result.success) {
		throw new Error(formatZodError(filename, result.error), {
			cause: result.error,
		});
	}

	return result.data;
};

export const readProjectConfig = async (rootDir) => {
	const projectConfigPath = join(rootDir, "project.config.json");
	const parsedConfig = await parseProjectConfigFile(
		projectConfigPath,
		projectConfigOverrideSchema,
	);

	return resolveProjectConfig(parsedConfig);
};
