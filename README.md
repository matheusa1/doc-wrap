# DocGest

Template React para criar centrais de documentação e publicações de um sistema. O projeto usa MDX para escrever conteúdos, rotas automáticas para documentos e posts, busca com Pagefind e uma interface pronta com sidebar, índice da página, tema claro/escuro e layout responsivo.

## Requisitos

- Bun instalado.
- Node.js compatível com as dependências do projeto.

## Comandos principais

```bash
bun install
bun run dev
bun run build
bun run preview
```

Comandos auxiliares:

```bash
bun run check
bun run check:fix
bun run lint
bun run format
```

## Estrutura do projeto

```text
src/
  blog/                 Posts e comunicados em MDX
  components/           Componentes da aplicação e dos documentos
  docs/                 Documentos da central em MDX
  pages/                Páginas principais da aplicação
  blog-map.ts           Mapa automático de publicações
  docs-map.ts           Mapa automático de documentos
scripts/
  build-pagefind-docs.mjs
```

## Como criar documentos

Crie arquivos `.mdx` dentro de `src/docs`. O caminho do arquivo vira a rota pública automaticamente.

Exemplo:

```text
src/docs/cadastros/usuarios.mdx -> /docs/cadastros/usuarios
```

Todo documento deve começar com frontmatter:

```mdx
---
title: Cadastro de usuários
description: Guia para criar e manter usuários do sistema.
category: Cadastros
order: 1
author: Equipe do Produto
updatedAt: 2026-04-27
---
```

Campos usados pela aplicação:

- `title`: título exibido na página, sidebar e busca.
- `description`: resumo exibido na página, sidebar e resultados de busca.
- `category`: grupo exibido na sidebar.
- `order`: posição do documento dentro do grupo.
- `author`: autor exibido no cabeçalho do documento.
- `updatedAt`: data de atualização no formato `YYYY-MM-DD`.

## Como criar publicações

Crie arquivos `.mdx` dentro de `src/blog`. O caminho do arquivo vira a rota pública automaticamente.

Exemplo:

```text
src/blog/nota-de-versao-abril.mdx -> /blog/nota-de-versao-abril
```

Frontmatter recomendado:

```mdx
---
title: Nota de versão de abril
description: Resumo das principais melhorias liberadas neste ciclo.
category: Novidades
publishedAt: 2026-04-27
eventAt: 2026-05-02
---
```

O campo `eventAt` é opcional e deve ser usado quando a publicação comunica uma data futura, como manutenção programada, treinamento ou mudança operacional.

## Busca

Durante o desenvolvimento, a busca usa os metadados carregados em memória. No build de produção, o script `scripts/build-pagefind-docs.mjs` gera páginas estáticas para os documentos e o Pagefind cria o índice de busca em `dist/pagefind`.

O comando `bun run build` já executa esse fluxo:

```bash
tsc -b && vite build && bun run docs:index && bun run pagefind:index
```

## Personalização

- Ajuste identidade visual e tokens em `src/index.css`.
- Altere textos globais em `src/components/AppHeader.tsx`, `src/pages/Home/index.tsx` e `src/pages/Blog/index.tsx`.
- Adicione componentes reutilizáveis para MDX em `src/components/docs`.
- Substitua os exemplos em `src/docs` e `src/blog` pelo conteúdo real do seu sistema.

## Publicação

Depois de executar `bun run build`, publique o conteúdo da pasta `dist` em qualquer hospedagem estática compatível com aplicações SPA.
