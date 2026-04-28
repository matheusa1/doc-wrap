# DocGest

Template em React para criar uma central de documentação em `/docs` e uma área de publicações em `/blog` usando MDX, navegação automática e busca com Pagefind.

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

Comandos de validação:

```bash
bun run check
bun run check:fix
bun run lint
bun run format
```

## Estrutura real do projeto

```text
src/
  @content/
    blog/              Publicações MDX exibidas em /blog
    docs/              Documentos MDX exibidos em /docs
  @presentation/
    components/docs/   Componentes e recursos reutilizáveis em MDX
    pages/             Páginas React da aplicação
    blog-map.ts        Mapa automático das publicações
    docs-map.ts        Mapa automático dos documentos
scripts/
  build-pagefind-docs.mjs
```

## Fluxo rápido

Depois de instalar as dependências, rode `bun run dev` para trabalhar localmente. O template carrega automaticamente os arquivos MDX em `src/@content/docs` e `src/@content/blog`, então criar ou mover arquivos já altera as rotas públicas sem cadastro manual.

O build de produção usa `bun run build`. Esse comando executa TypeScript, gera a aplicação, cria as páginas estáticas usadas na indexação e monta o índice do Pagefind em `dist/pagefind`.

## Onde alterar

- Conteúdo da documentação: `src/@content/docs`
- Conteúdo das publicações: `src/@content/blog`
- Componentes MDX: `src/@presentation/components/docs`
- Navegação dos documentos: `src/@presentation/docs-map.ts`
- Navegação das publicações: `src/@presentation/blog-map.ts`
- Configuração MDX e aliases: `vite.config.ts`

## Fonte principal da documentação

Use a central `/docs` como documentação oficial do template. Ela cobre:

- como desenvolver e alterar a base
- como escrever documentos e publicações
- quais componentes MDX existem hoje
- qual skill local orienta a escrita editorial do projeto
