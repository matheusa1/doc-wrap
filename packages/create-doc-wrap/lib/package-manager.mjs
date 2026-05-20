export const packageManagerOptions = [
	{
		description: "Fluxo mais comum para projetos Node.js.",
		label: "npm",
		value: "npm",
	},
	{
		description: "Instalação enxuta com comandos curtos.",
		label: "Yarn",
		value: "yarn",
	},
	{
		description: "Workspace-friendly e rápido em monorepos.",
		label: "pnpm",
		value: "pnpm",
	},
	{
		description: "Instalação e dev server rápidos com Bun.",
		label: "Bun",
		value: "bun",
	},
];

export const packageManagers = packageManagerOptions.map(
	(option) => option.value,
);

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

export const buildFinalInstructions = ({
	packageManager,
	projectDirectoryName,
}) => {
	const selectedPackageManager = assertPackageManager(packageManager);
	const commands = packageManagerCommands[selectedPackageManager];

	return [`cd ${projectDirectoryName}`, commands.install, commands.dev].join(
		"\n",
	);
};
