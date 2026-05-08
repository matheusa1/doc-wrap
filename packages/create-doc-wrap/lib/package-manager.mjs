export const packageManagers = ["npm", "yarn", "pnpm", "bun"];

const packageManagerCommands = {
	bun: {
		dev: "bun run dev",
		install: "bun install",
	},
	npm: {
		dev: "npm run dev",
		install: "npm install",
	},
	pnpm: {
		dev: "pnpm dev",
		install: "pnpm install",
	},
	yarn: {
		dev: "yarn dev",
		install: "yarn",
	},
};

export const isPackageManager = (value) =>
	packageManagers.includes(String(value));

export const assertPackageManager = (value) => {
	if (!isPackageManager(value)) {
		throw new Error(
			`Package manager inválido: ${value}. Use uma das opções: ${packageManagers.join(", ")}.`,
		);
	}

	return value;
};

export const buildFinalInstructions = (packageManager, projectName) => {
	const selectedPackageManager = assertPackageManager(packageManager);
	const commands = packageManagerCommands[selectedPackageManager];

	return [`cd ${projectName}`, commands.install, commands.dev].join("\n");
};
