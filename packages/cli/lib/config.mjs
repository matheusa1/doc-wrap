import { readProjectConfig } from "@doc-wrap/project-config";

const subcommandHelp = `Uso: doc-wrap config <subcomando>

Subcomandos:
  validate  Valida o project.config.json do projeto
  print     Imprime a configuracao efetiva com defaults aplicados
`;

const configCommands = {
	validate: async (rootDir) => {
		await readProjectConfig(rootDir);
		console.log(
			"Configuração válida: project.config.json foi carregado com sucesso.",
		);
	},
	print: async (rootDir) => {
		const projectConfig = await readProjectConfig(rootDir);

		console.log(JSON.stringify(projectConfig, null, 2));
	},
};

export const runConfigCommand = async (rootDir, args) => {
	const [subcommand] = args;

	if (!subcommand) {
		throw new Error(subcommandHelp.trimEnd());
	}

	const selectedCommand = configCommands[subcommand];

	if (!selectedCommand) {
		throw new Error(
			`Subcomando desconhecido: config ${subcommand}\n\n${subcommandHelp.trimEnd()}`,
		);
	}

	await selectedCommand(rootDir);
};
