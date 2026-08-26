# LexGuard — Workflow de análise implementado

## Fluxo

`Minhas análises → Nova análise → Processamento no card → Abrir análise → Workspace Documento + Processo + Decision Context → Decisão`

## Estado compartilhado

- `services/analysis-runtime.ts` mantém análises iniciadas pelo usuário com persistência em `localStorage`.
- `services/analysis-orchestrator.ts` reutiliza `services/job-service.ts` para alimentar progresso, jobs e blocos observáveis.
- O mesmo estado é consumido pelo `AnalysisCard` e pelo `AnalysisWorkspace`.

## UX

- `/analyses` tornou-se a página central, preservando a lateral de conversas.
- Busca possui autocomplete com teclado e pesquisa por análise, documento, órgão, responsável e política.
- Filtros funcionais são persistidos no query string.
- Cards exibem progresso, etapa atual e ação `Abrir análise`.
- `/analyses/[id]` usa `AnalysisConversation`, `DecisionContext` e preview documental sincronizado.
- Os blocos representam somente eventos e resultados observáveis; chain-of-thought não é exposto.
- `Tema` no menu da conta agora altera o tema via `next-themes`.

## Composição administrativa

A base de tipos e workflow permanece preparada para uma camada `COMPOSE_AI` de ADMIN/MANAGER, com política, regras, documentos vinculados e versionamento como contexto controlado.

## Validação

`npx tsc --noEmit` passa sem erros.

O `next build` foi executado, mas o ambiente de execução não conseguiu baixar as fontes Geist do Google Fonts; o erro é externo ao código alterado e ocorre em `next/font/google` de `app/layout.tsx`.
