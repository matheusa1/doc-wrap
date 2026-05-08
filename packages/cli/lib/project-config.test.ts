import { describe, expect, test } from "bun:test";
import { resolveProjectConfig } from "@doc-wrap/project-config";
import projectConfigJson from "../../../project.config.json";
import {
	buildPageTitle,
	projectConfig,
} from "../../../src/@presentation/config/project.ts";

describe("presentation project config", () => {
	test("pode ser importado fora do Vite com config resolvida", () => {
		const resolvedProjectConfig = resolveProjectConfig(projectConfigJson);

		expect(projectConfig).toEqual(resolvedProjectConfig);
		expect(buildPageTitle("Início")).toBe(
			`Início - ${resolvedProjectConfig.name}`,
		);
	});
});
