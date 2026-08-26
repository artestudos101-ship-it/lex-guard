# Mapa de páginas

| Rota | Objetivo | Componentes/dados |
|---|---|---|
| `/` | Priorizar portfólio | `AppShell`, métricas, análises recentes |
| `/analyses` | Trabalhar análises como chats | `AnalysisWorkspace`, `MOCK_ANALYSES` |
| `/analyses/:id` | Tomar decisão | console, risco, achados, evidências |
| `/analyses/:id/processing` | Observar pipeline | progresso, timeline, eventos SSE-ready |
| `/policies` | Governar critérios | cards e versões |
| `/reports` | Compartilhar decisões | pacotes exportáveis |
| `/evaluations` | Avaliar qualidade | métricas e feedback |
| `/teams`, `/users`, `/activity` | Administrar colaboração | serviços demo tenant-scoped |
