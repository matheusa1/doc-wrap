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

Quando o comando roda em um terminal interativo, ele usa `terminal-kit` para guiar a criação do projeto com:

- título e descrição inicial;
- pergunta pelo nome do projeto quando necessário;
- seleção de package manager;
- seleção de template;
- feedback das etapas de criação;
- mensagem final com próximos passos.

## Fallback não interativo

O comando continua funcionando sem TTY e em CI.

- Se o nome do projeto não for informado, o processo falha com uma mensagem clara orientando o uso do argumento posicional.
- Se houver entrada padrão disponível, as seleções continuam podendo ser resolvidas por número ou texto.
- Mesmo sem `TTY`, o fluxo continua funcionando com entrada textual simples e sem depender de recursos avançados de terminal.
