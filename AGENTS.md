# AGENTS / CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
`CLAUDE.md` é um symlink para este arquivo — edite apenas `AGENTS.md`.

## Comandos

```bash
bun install          # instala dependências
bun run dev          # servidor de desenvolvimento (Vite)
bun run build        # type-check + vite build + pós-build (static pages + Pagefind)
bun run preview      # preview do build de produção
bun test             # todos os testes
bun test <arquivo>   # testa um arquivo específico (ex: bun test packages/cli/lib/config.test.ts)
bun run check        # lint + format via Biome (read-only)
bun run check:fix    # lint + format com auto-fix
bun run format       # formata todos os arquivos
```

Comandos da CLI do template (disponível em `packages/cli/bin/doc-wrap.mjs`):

```bash
node packages/cli/bin/doc-wrap.mjs config validate   # valida project.config.json
node packages/cli/bin/doc-wrap.mjs config print       # imprime a config resolvida com defaults
node packages/cli/bin/doc-wrap.mjs docs:index         # gera páginas estáticas para Pagefind
```

## Arquitetura

Este é um monorepo Bun com workspaces em `packages/` e uma aplicação React principal em `src/`.

### Pacotes (`packages/`)

| Pacote | Nome publicado | Função |
|---|---|---|
| `cli` | `@doc-wrap/cli` | CLI que orquestra dev/build/preview/check/config |
| `create-doc-wrap` | `create-doc-wrap` | Scaffolding de novos projetos |
| `project-config` | `@doc-wrap/project-config` | Leitura e validação do `project.config.json` via Zod |

### Aplicação principal (`src/`)

Três camadas com aliases de path configurados no `vite.config.ts`:

- `@content` → `src/@content/` — arquivos MDX de `docs/` e `blog/`
- `@presentation` → `src/@presentation/` — componentes, páginas, hooks, lib, context
- `@service` → `src/@service/` — integrações e side effects (ex: feedback de docs)

### Configuração do projeto (`project.config.json`)

Controla o comportamento da aplicação em runtime:

```json
{ "hasDocs": true, "hasBlog": true, "defaultTheme": "light", "name": "..." }
```

`hasDocs: false` pula a geração estática e o Pagefind no build. **Não autoriza remover páginas do bundle.**

### Fluxo de conteúdo

Arquivos em `src/@content/docs/**/*.mdx` e `src/@content/blog/**/*.mdx` são carregados com `import.meta.glob`. O caminho do arquivo determina a URL pública. `docs-map.ts` e `blog-map.ts` em `@presentation/` transformam frontmatter e caminhos em navegação, breadcrumb e paginação.

### Build pipeline

`bun run build` delega para a CLI, que executa em sequência:
1. `tsc -b`
2. `vite build`
3. Pós-build: geração de páginas estáticas dos docs
4. Pagefind: indexação de busca em `dist/pagefind`

### Testes

Os testes usam `bun:test` e ficam co-localizados com os módulos (ex: `packages/cli/lib/config.test.ts`). Os testes da CLI executam o binário real via `spawnSync` em diretórios temporários.

### Linter

Biome com indentação por tabs, aspas duplas em JS/TS e `organizeImports` automático. O Biome ignora `dist/` e `packages/create-doc-wrap/templates`.

## Padrão de commits

Formato obrigatório: `<tipo>(<escopo>): <emoji> <titulo>`

```
feat(docs): ✨ adiciona componente de callout
fix(build): 🐛 corrige resolução do outDir no postbuild
chore(deps): ⬆️ atualiza rehype-pretty-code
```

Use a skill `commit-pattern` ao separar mudanças em commits ou definir mensagens.

## Versionamento

O projeto usa `release-please` em modo manifest. Os PRs de release são abertos a partir de commits no padrão Conventional Commits na branch `develop-cli`. Cada pacote em `packages/` é versionado de forma independente.

---

# AGENTS

## Objetivo

Este projeto prefere componentes de página enxutos, com responsabilidades bem separadas entre apresentação, hooks e utilitários puros.

## Regras de Implementação

### Páginas

- Arquivos em `src/@presentation/pages/**/index.tsx` devem priorizar composição, roteamento e passagem de props.
- Evite helpers, transformação de dados, lógica de DOM e blocos extensos de JSX diretamente no arquivo da página.
- O `return` da página deve ser legível rapidamente, deixando claro o fluxo principal da tela.

### Componentes Locais da Página

- Quando uma página tiver blocos visuais claros, criar `src/@presentation/pages/<Page>/components`.
- Extraia blocos como `not found`, `empty state`, `aside`, `header`, `content` e seções grandes de markup.
- Extraia por responsabilidade semântica, não apenas por quantidade de linhas.
- Se o bloco for específico da tela, mantenha-o co-localizado na pasta da página.

### Hooks

- Hooks devem encapsular comportamento e sincronização, não apresentação.
- Use hooks para estado derivado, efeitos, integração com DOM, observadores e listeners.
- Hooks customizados devem expor apenas o estado e as ações necessárias para a página ou componente consumidor.

### useEffect

- `useEffect` deve ser curto e atuar como orquestrador.
- Dentro do efeito, limite-se a:
  - validar pré-condições
  - chamar funções nomeadas
  - registrar e limpar listeners, observers e subscriptions
- Não concentrar lógica longa, branching complexo ou regras de negócio diretamente dentro do efeito.

### useLayoutEffect

- Não usar `useLayoutEffect` por padrão.
- Prefira `useEffect` sempre que a lógica puder rodar após o paint.
- Só use `useLayoutEffect` quando houver necessidade real de leitura ou escrita síncrona de layout antes da pintura para evitar glitch visual.

### Utilitários

- Helpers puros como formatadores, normalizadores, comparadores e mapeadores devem ficar fora do componente.
- Se o helper for específico da página, usar `utils.ts` ou `lib.ts` local.
- Se houver reutilização real entre páginas ou componentes, extrair para `src/lib` ou módulo compartilhado equivalente.

### Nomeação

- Prefira nomes orientados à intenção, como `useDocsTableOfContents`, `useActiveDocHeadings`, `DocsNotFound`, `DocsArticle`.
- Evite nomes genéricos como `helper`, `utils2`, `handleStuff`, `dataThing`.

### Critérios de Extração

Antes de implementar, avalie:

1. Isso é apresentação ou regra?
2. Se for regra, cabe em hook ou utilitário?
3. Se for bloco visual claro, cabe em componente local da página?
4. O `useEffect` está apenas orquestrando?
5. `useLayoutEffect` é realmente necessário?

### Estrutura Recomendada

Para páginas com mais comportamento, prefira esta organização:

- `src/@presentation/pages/<Page>/index.tsx`
- `src/@presentation/pages/<Page>/components/*`
- `src/@presentation/pages/<Page>/hooks/*`
- `src/@presentation/pages/<Page>/utils.ts`

### Regra Prática

- Se uma página usa mais de um hook customizado e possui mais de um estado visual relevante, considerar obrigatoriamente uma pasta local `components/` e uma pasta local `hooks/`.

### Skills Locais

- As skills locais do projeto vivem em `.agents/skills` e complementam estas regras; elas não substituem o `AGENTS.md`.
- Use `react-page-implementation` ao implementar ou evoluir páginas React em `src/@presentation/pages`, mantendo `index.tsx` focado em composição e empurrando comportamento para hooks, utilitários e componentes locais.
- Use `docs-mdx-authoring` ao criar ou revisar documentos MDX em `src/@content/docs`, preservando frontmatter, estrutura editorial e o uso criterioso dos componentes de documentação.
- Use `shadcn` ao adicionar, ajustar ou depurar componentes baseados em shadcn/ui, seguindo a composição, os padrões de estilo e o fluxo de CLI definidos pela própria skill.
- Use `commit-pattern` quando a tarefa envolver commits, separação de mudanças por intenção ou definição de mensagens no padrão do projeto.

### Escopo das Regras

- Estas regras valem para implementações novas e também para alterações em páginas existentes.
- O padrão esperado do projeto é que novas páginas e evoluções em `src/@presentation/pages` já sejam construídas com separação clara entre composição, apresentação, hooks e utilitários puros.
