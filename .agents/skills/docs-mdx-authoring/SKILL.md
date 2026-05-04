---
name: docs-mdx-authoring
description: Use esta skill ao criar, revisar ou atualizar documentos MDX da central de documentação em `src/@content/docs`. Ela orienta o uso dos componentes de docs já existentes, preserva o frontmatter e a estrutura da página, e prioriza escrita em parágrafos em vez de listas sempre que isso deixar o conteúdo mais claro.
---

# Docs MDX Authoring

Use esta skill apenas para documentos em `src/@content/docs/**/*.mdx`.

## Objetivo

Garantir que novos documentos e atualizações na central de docs:

- sigam o frontmatter e a estrutura real do projeto
- usem os componentes MDX já existentes apenas quando agregarem clareza
- priorizem texto corrido e explicações em parágrafos
- mantenham títulos e subtítulos úteis para navegação e leitura

## Fluxo de Trabalho

1. Confirmar se o arquivo pertence à central de documentação em `src/@content/docs`.
2. Em documentos novos, criar o arquivo no caminho que represente a rota desejada.
3. Em atualizações, preservar o frontmatter e a estrutura editorial existente sempre que fizer sentido.
4. Revisar ou preencher `title`, `description`, `category`, `order`, `author` e `updatedAt`.
5. Organizar o conteúdo com `h2` e `h3` claros, porque o índice lateral é gerado a partir deles.
6. Escrever a maior parte do conteúdo em parágrafos curtos, exemplos concretos e transições naturais.
7. Usar listas apenas para sequência de passos, enumeração real, checklist ou comparação.
8. Introduzir componentes MDX somente quando eles melhorarem a compreensão do trecho.
9. Validar o resultado com o build do projeto.

## Regras Editoriais

- Priorize parágrafos antes de tópicos.
- Não transforme explicações comuns em listas longas por padrão.
- Abra a página explicando contexto, objetivo ou quando usar aquela orientação.
- Prefira seções com títulos orientados à tarefa ou decisão do usuário.
- Mantenha exemplos de MDX curtos e reaproveitáveis.
- Nunca use caminhos absolutos locais, como `/Users/...`, em links ou referências dentro dos documentos.
- Sempre prefira links MDX válidos no ambiente publicado ou caminhos textuais portáveis, como `.agents/skills/docs-mdx-authoring/SKILL.md`, quando não existir uma rota pública para o destino.

## Componentes e Estrutura

- Use apenas componentes já existentes em `src/@presentation/components/docs`.
- Importe explicitamente componentes como `Callout`, `Steps`, `Cards`, `FileTree` e `Tabs` no topo do `.mdx` quando precisar deles.
- Para Mermaid, prefira bloco de código com linguagem `mermaid`; não é necessário importar componente.
- Antes de adicionar um componente, verifique se um parágrafo simples resolveria melhor.

Leia [references/mdx-doc-components.md](./references/mdx-doc-components.md) para exemplos e critérios de uso dos componentes disponíveis.

## Regras do Projeto

- Os documentos da central vivem em `src/@content/docs`.
- O caminho do arquivo define a rota pública em `/docs/...`.
- O frontmatter esperado contém `title`, `description`, `category`, `order`, `author` e `updatedAt`.
- O índice lateral é gerado automaticamente a partir de títulos `h2` e `h3`.
- Esta skill não cobre arquivos em `src/@content/blog`.

## Checklist Final

- O arquivo está em `src/@content/docs`?
- O frontmatter está completo e consistente?
- A maior parte do conteúdo está em parágrafos, sem listas em excesso?
- Os componentes usados já existem no projeto e foram importados corretamente?
- Os títulos `h2` e `h3` estão claros para navegação?
- `updatedAt` foi revisado?
- `bun run build` passou sem erros?
