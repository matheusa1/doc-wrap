import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { z } from "zod";

const supportedThemes = ["dark", "light", "system"];

const projectConfigSchema = z
	.object({
		defaultTheme: z.enum(supportedThemes),
		description: z.string(),
		hasBlog: z.boolean(),
		hasDocs: z.boolean(),
		name: z.string(),
	})
	.strict();

const projectConfigOverrideSchema = projectConfigSchema.partial().strict();

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

const parseProjectConfigFile = async (filePath, schema) => {
	const filename = basename(filePath);
	const content = await readFile(filePath, "utf8");
	let parsedContent;

	try {
		parsedContent = JSON.parse(content);
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);

		throw new Error(`Invalid JSON in ${filename}: ${reason}`, {
			cause: error,
		});
	}

	const result = schema.safeParse(parsedContent);

	if (!result.success) {
		throw new Error(formatZodError(filename, result.error), {
			cause: result.error,
		});
	}

	return result.data;
};

export const readProjectConfig = async (rootDir) => {
	const defaultProjectConfigPath = join(
		rootDir,
		"project-config.defaults.json",
	);
	const projectConfigPath = join(rootDir, "project.config.json");
	const [defaultProjectConfig, parsedConfig] = await Promise.all([
		parseProjectConfigFile(defaultProjectConfigPath, projectConfigSchema),
		parseProjectConfigFile(projectConfigPath, projectConfigOverrideSchema),
	]);
	const mergedConfig = {
		...defaultProjectConfig,
		...parsedConfig,
	};
	const result = projectConfigSchema.safeParse(mergedConfig);

	if (!result.success) {
		throw new Error(
			`Invalid merged project config:\n${result.error.issues
				.map((issue) => `- ${formatIssuePath(issue)}: ${issue.message}`)
				.join("\n")}`,
			{
				cause: result.error,
			},
		);
	}

	return result.data;
};
