#!/usr/bin/env node

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const cliPackageJsonPath = require.resolve("@doc-wrap/cli/package.json");
const cliBinUrl = pathToFileURL(
	join(dirname(cliPackageJsonPath), "bin", "doc-wrap.mjs"),
);

await import(cliBinUrl.href);
