# DocGest

Template para publicar uma central de documentação em `/docs` e uma área de publicações em `/blog` a partir de arquivos MDX, com navegação automática, busca local no desenvolvimento e indexação com Pagefind no build.

## O que o projeto entrega

O repositório foi montado para servir como base de centrais de ajuda, manuais internos, documentação funcional, notas de versão e comunicados operacionais. A trilha `/docs` atende conteúdo permanente e navegável por árvore. A trilha `/blog` atende publicações com contexto temporal, ordenadas por data.

O conteúdo vive em `src/@content`, a interface e a experiência de navegação vivem em `src/@presentation`, e integrações do template ficam em `src/@service`.

## Tecnologias do projeto

### Base da aplicação

- `React 19`
- `TypeScript`
- `Vite`
- `React Router`

### Conteúdo e renderização

- `MDX`
- `remark-frontmatter`
- `remark-mdx-frontmatter`
- `rehype-pretty-code`
- `Mermaid`
- `KaTeX`

### Estado, formulários e feedbacks

- `@tanstack/react-query`
- `react-hook-form`
- `zod`
- `sonner`

### UI e estilos

- `Tailwind CSS v4`
- `shadcn/ui`
- `@base-ui/react`
- `lucide-react`

### Busca, qualidade e tooling

- `Pagefind`
- `Biome`
- `Bun`

## Requisitos

- `Bun` instalado
- `Node.js` compatível com as dependências do projeto

## Comandos principais

```bash
bun install
bun run dev
bun run build
bun run preview
```

Comandos de qualidade:

```bash
bun run check
bun run check:fix
bun run lint
bun run lint:fix
bun run format
```

## Estrutura atual

```text
src/
  @content/
    docs/                  Documentos MDX publicados em /docs
    blog/                  Publicações MDX publicadas em /blog
  @presentation/
    components/
      docs/                Componentes e recursos usados na experiência de docs/MDX
      ui/                  Base visual compartilhada da aplicação
    context/               Providers como tema
    hooks/                 Hooks compartilhados de apresentação
    lib/                   Utilitários e serviços de apoio da camada de UI
    pages/                 Páginas React, com composição e blocos locais por tela
    docs-map.ts            Mapa automático dos documentos
    blog-map.ts            Mapa automático das publicações
  @service/
    docs/                  Integrações e side effects ligados ao fluxo de docs
packages/
  cli/                     CLI local responsável pelos comandos do template
```

## Como a base funciona

Os arquivos em `src/@content/docs/**/*.mdx` e `src/@content/blog/**/*.mdx` são carregados automaticamente com `import.meta.glob`. Isso elimina cadastro manual de rotas para o conteúdo e faz com que o caminho do arquivo determine a URL pública.

Em `/docs`, `src/@presentation/docs-map.ts` transforma frontmatter e caminho em navegação, breadcrumb, paginação e busca local. Em `/blog`, `src/@presentation/blog-map.ts` organiza os posts principalmente por `publishedAt`.

No bootstrap da aplicação, `src/main.tsx` registra `QueryClientProvider`, `BrowserRouter`, `ThemeProvider` e `TooltipProvider`. A camada `@service` fica responsável pelas integrações consumidas pela apresentação; hoje ela já atende os envios de feedback e relato de problema técnico da documentação.

## Fluxo de build e busca

`bun run build` delega o fluxo para `doc-wrap build`, que executa quatro etapas principais:

1. `tsc -b` para validar TypeScript.
2. `vite build` para gerar a aplicação.
3. Pós-build da CLI para criar páginas estáticas dos documentos.
4. Pagefind, resolvido pela própria CLI, para montar o índice final de busca.

Durante o desenvolvimento, a busca usa os metadados já carregados em memória. Em produção, a aplicação usa o índice gerado em `dist/pagefind`.

`hasDocs` e `hasBlog`, definidos em `project.config.json`, controlam a presença dessas trilhas na navegação e no roteamento da aplicação. Eles não tornam o código-fonte dessas páginas opcional para TypeScript ou para o bundle. Em outras palavras, esconder uma feature não autoriza remover `src/@presentation/pages/Docs` ou `src/@presentation/pages/Blog` do projeto.

Existe uma exceção prática para `hasDocs`: quando ele está `false`, o pós-build pula a geração estática das páginas de documentação e a indexação do Pagefind. Isso evita gerar artefatos de busca para uma trilha que não será exposta na interface.

## Onde editar

- Conteúdo permanente da documentação: `src/@content/docs`
- Publicações e comunicados: `src/@content/blog`
- Componentes MDX e layout de docs: `src/@presentation/components/docs`
- Base visual compartilhada: `src/@presentation/components/ui`
- Páginas e composição da interface: `src/@presentation/pages`
- Navegação automática de docs: `src/@presentation/docs-map.ts`
- Navegação automática do blog: `src/@presentation/blog-map.ts`
- Integrações do fluxo de docs: `src/@service/docs`
- Aliases e pipeline de MDX: `vite.config.ts`

## Fluxo de release

O projeto usa `release-please` em modo manifest para abrir PRs de release a partir de commits no padrão Conventional Commits. Nesta etapa da trilha CLI, o workflow roda em `develop-cli`, mesmo com `develop` ainda configurada como branch padrão do repositório no GitHub.

A automação usa um Personal Access Token armazenado em `RELEASE_PLEASE_TOKEN`, configurado em `Settings > Secrets and variables > Actions`. Esse token é necessário porque recursos criados com o `GITHUB_TOKEN` padrão não disparam workflows subsequentes; com o PAT, os PRs de release abertos pelo `release-please` continuam recebendo a CI normal do repositório. O token precisa ter acesso suficiente para operar no repositório e abrir PRs e releases.

A versão controlada pelo fluxo é a versão do pacote raiz `doc-wrap` em `package.json`. Quando um PR de release é aberto e depois mergeado, o `release-please` atualiza `CHANGELOG.md`, faz o bump da versão do pacote, cria a tag Git no formato `doc-wrap-vX.Y.Z` e publica o GitHub Release correspondente.

O fluxo atual não publica automaticamente no npm. Essa publicação fica para uma issue futura, assim como a revisão da configuração quando o repositório passar a expor também o pacote `create-doc-wrap` em uma estrutura multi-package real.

Ainda não existem `schemaVersion` nem `doc-wrap migrate`. Por isso, qualquer mudança estrutural relevante no template ou em `project.config.json` que impacte projetos já gerados deve entrar no changelog com orientação de atualização manual para mantenedores.

## Fonte principal de documentação

A central em `/docs` é a documentação oficial do template. Ela explica como evoluir a base, como escrever documentos e publicações, quais componentes MDX estão disponíveis e como a arquitetura atual do projeto está organizada.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
