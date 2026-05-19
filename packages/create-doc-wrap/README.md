# create-doc-wrap

CLI para criar um novo projeto Doc Wrap a partir dos templates oficiais.

## Uso

```bash
create-doc-wrap [nome-do-projeto]
```

O nome pode ser informado como argumento posicional:

```bash
create-doc-wrap minha-central
create-doc-wrap @time-interno/docs
```

Quando o comando roda em um terminal interativo, ele usa `terminal-kit` para guiar a criacao do projeto com:

- titulo e descricao inicial;
- pergunta pelo nome do projeto quando necessario;
- selecao de package manager;
- selecao de template;
- feedback das etapas de criacao;
- mensagem final com proximos passos.

## Fallback nao interativo

O comando continua funcionando sem TTY e em CI.

- Se o nome do projeto nao for informado, o processo falha com uma mensagem clara orientando o uso do argumento posicional.
- Se houver entrada padrao disponivel, as selecoes continuam podendo ser resolvidas por numero ou texto.
- Mesmo sem `TTY`, o fluxo continua funcionando com entrada textual simples e sem depender de recursos avancados de terminal.
