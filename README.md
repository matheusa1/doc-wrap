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
scripts/
  build-pagefind-docs.mjs  Geração das páginas estáticas usadas pelo Pagefind
```

## Como a base funciona

Os arquivos em `src/@content/docs/**/*.mdx` e `src/@content/blog/**/*.mdx` são carregados automaticamente com `import.meta.glob`. Isso elimina cadastro manual de rotas para o conteúdo e faz com que o caminho do arquivo determine a URL pública.

Em `/docs`, `src/@presentation/docs-map.ts` transforma frontmatter e caminho em navegação, breadcrumb, paginação e busca local. Em `/blog`, `src/@presentation/blog-map.ts` organiza os posts principalmente por `publishedAt`.

No bootstrap da aplicação, `src/main.tsx` registra `QueryClientProvider`, `BrowserRouter`, `ThemeProvider` e `TooltipProvider`. A camada `@service` fica responsável pelas integrações consumidas pela apresentação; hoje ela já atende os envios de feedback e relato de problema técnico da documentação.

## Fluxo de build e busca

`bun run build` executa quatro etapas principais:

1. `tsc -b` para validar TypeScript.
2. `vite build` para gerar a aplicação.
3. `node scripts/build-pagefind-docs.mjs` para criar páginas estáticas dos documentos.
4. `pagefind --site dist --force-language pt` para montar o índice final de busca.

Durante o desenvolvimento, a busca usa os metadados já carregados em memória. Em produção, a aplicação usa o índice gerado em `dist/pagefind`.

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

## Fonte principal de documentação

A central em `/docs` é a documentação oficial do template. Ela explica como evoluir a base, como escrever documentos e publicações, quais componentes MDX estão disponíveis e como a arquitetura atual do projeto está organizada.
