---
name: commit-pattern
description: "Use esta skill quando o usuário pedir para fazer commit, separar mudanças em commits lógicos, seguir o padrão de commit do projeto ou ajustar mensagens de commit. Ela orienta como agrupar alterações por intenção e como escrever mensagens no formato obrigatório `<tipo>(<escopo>): <emoji> <titulo>`."
---

# Commit Pattern

Use esta skill ao criar commits neste projeto.

## Objetivo

Garantir que os commits:

- sejam separados por intenção
- não misturem mudanças sem relação
- preservem alterações não relacionadas do usuário
- usem o padrão obrigatório de mensagem

## Padrão de Mensagem

Toda mensagem de commit deve seguir exatamente este formato:

`<tipo>(<escopo>): <emoji> <titulo>`

Regras:

- `tipo` em minúsculas
- `escopo` curto e semântico
- `emoji` obrigatório logo após `:`
- `titulo` curto, direto e no presente

## Convenções Mínimas

Tipos comuns:

- `feat`
- `fix`
- `refactor`
- `docs`
- `chore`
- `test`

Escopos comuns:

- `mdx`
- `styles`
- `docs`
- `blog`
- `build`

Boas práticas:

- priorize verbos como `ajusta`, `separa`, `padroniza`, `remove`, `adiciona`
- evite títulos vagos como `corrige coisas` ou `ajustes diversos`
- não crie um único commit se houver blocos independentes de mudança

## Fluxo Recomendado

1. Inspecionar as mudanças com `git status` e `git diff`.
2. Agrupar os arquivos e hunks por intenção.
3. Stagedar seletivamente apenas o recorte do commit atual.
4. Validar o staging antes do commit.
5. Montar a mensagem no padrão do projeto.
6. Criar o commit.
7. Repetir o processo para os próximos blocos independentes.

## Regras Operacionais

- Não misturar no mesmo commit:
  - refactor estrutural
  - conteúdo editorial
  - ajuste visual sem relação
  - correção funcional independente
- Se houver mudanças do usuário sem relação com a tarefa atual, não revertê-las e não incluí-las por acidente.
- Antes de commitar, revisar o diff staged para confirmar que o recorte está coeso.
- Se a tarefa pedir separação de commits, primeiro definir os grupos lógicos e só depois montar as mensagens.

## Exemplos

- `refactor(mdx): ♻️ padroniza tipografia entre blog e docs`
- `refactor(styles): ♻️ separa estilos globais por responsabilidade`
- `docs(docs): 📝 ajusta texto e apresentação da introdução`

## Checklist

- O commit contém apenas uma intenção principal?
- O staging exclui mudanças sem relação?
- A mensagem segue `<tipo>(<escopo>): <emoji> <titulo>`?
- O escopo está específico o suficiente?
- O título está curto e no presente?
