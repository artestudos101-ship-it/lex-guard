# Mapa de componentes

| Componente | Localização | Responsabilidade | Entrada | Saída | Usado em |
|---|---|---|---|---|---|
| AppShell | `components/shell` | Layout e topbar | título, ação | navegação | todas as rotas |
| AppSidebar | `components/shell` | Navegação tenant-scoped | pathname, sessão demo | links | AppShell |
| AnalysisWorkspace | `app/analyses` | Lista + conversa | análises | seleção, mensagem | Minhas análises |
| FindingCard | `components/decision` | Exibir achado | Finding | ações | Console |
| RiskGauge | `components/decision` | Mostrar risco | score | visual acessível | Dashboard/Console |
| ProcessingTimeline | `features/analysis-processing` | Eventos observáveis | eventos | estado visual | Processing |
| DocumentPreview | `components/pdf` | PDF e highlight | documentId/page/region | navegação | Analysis |
