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
