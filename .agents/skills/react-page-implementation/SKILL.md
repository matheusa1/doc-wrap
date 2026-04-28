---
name: react-page-implementation
description: Orienta a implementação de páginas React para manter index.tsx focado em composição, com lógica extraída para hooks e utilitários e blocos visuais movidos para components locais.
---

# React Page Implementation

Use esta skill ao implementar ou evoluir páginas React, especialmente arquivos em `src/pages/**/index.tsx`.

## Objetivo

Garantir que a página principal permaneça focada em composição e leitura do fluxo, movendo desde a implementação inicial:

- helpers puros para `utils.ts` ou `lib.ts`
- lógica de comportamento para `hooks/*`
- blocos visuais claros para `components/*`

## Resultado Esperado

Ao final da implementação:

- o `index.tsx` da página deve estar curto e legível
- o `return` deve mostrar o fluxo principal da tela
- hooks devem encapsular sincronização e efeitos
- `useEffect` deve estar curto e delegando para funções nomeadas
- `useLayoutEffect` só pode permanecer com justificativa concreta

## Passo a Passo

1. Ler a página ou requisito e identificar responsabilidades necessárias.
2. Separar o que é:
   - apresentação
   - regras puras
   - lógica de comportamento
   - integração com DOM
3. Implementar helpers puros em `utils.ts` ou `lib.ts`.
4. Implementar comportamento em hooks customizados locais quando necessário.
5. Implementar blocos visuais grandes e semanticamente claros em `components/*`.
6. Manter o `index.tsx` como ponto de composição.
7. Validar build, tipos e possíveis regressões.

## Regras Operacionais

### Página

- A página não deve concentrar helpers e lógica procedural extensa.
- Ela pode:
  - resolver rota
  - buscar dados locais
  - chamar hooks
  - escolher entre estados visuais
  - compor layout

### Hooks

- Hooks podem conter efeitos e integração com DOM.
- Efeitos devem ser curtos.
- Funções auxiliares privadas devem carregar a maior parte da lógica.

### Efeitos

- Dentro de `useEffect`, evitar escrever todo o algoritmo inline.
- O efeito deve apenas orquestrar.
- Se precisar de mais de alguns passos, mover a lógica para funções nomeadas.

### Layout Effect

- Não usar `useLayoutEffect` por padrão.
- Só aceitar quando houver dependência real de layout síncrono antes da pintura.

### Componentização

- Extrair componentes quando houver um bloco visual com responsabilidade clara.
- Não extrair componentes artificiais apenas para reduzir linhas.

## Checklist de Revisão

- O `index.tsx` está focado em composição?
- Os helpers puros ficaram fora do componente?
- Existe lógica demais dentro de `useEffect`?
- `useLayoutEffect` é realmente necessário?
- Os componentes extraídos têm nomes semânticos?
- A estrutura local da página ficou previsível?
- O build e os tipos continuam válidos?

## Estrutura Recomendada

```text
src/pages/<Page>/
  index.tsx
  utils.ts
  hooks/
    use-*.ts
  components/
    *.tsx
```

## Sinais de Desvio do Padrão

- arquivo com muitos helpers locais
- mais de um `useEffect` grande
- leitura difícil do `return`
- mistura de DOM querying com apresentação
- duplicação de utilitários entre páginas
