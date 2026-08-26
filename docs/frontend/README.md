# LexGuard Frontend

Documentação operacional da camada UX/UI do LexGuard. O frontend é um workspace multi-tenant de análise documental: cada análise possui identidade própria, documentos, evidências, política aplicada, atividade e uma conversa contextual.

## Princípios
- Evoluir componentes existentes antes de criar duplicatas.
- Manter regras de negócio em `features/` e composição de rota em `app/`.
- Usar estados observáveis, nunca chain-of-thought ou raciocínio privado.
- Tratar a conta demo como tenant pré-populado, usando os mesmos serviços e componentes.

## Mapas
- [Arquitetura de informação](./information-architecture.md)
- [Navegação](./navigation.md)
- [Sistema de design](./design-system.md)
- [Mapa de componentes](./component-map.md)
- [Mapa de páginas](./page-map.md)
- [Mapa de interações](./interaction-map.md)
- [Mapa de estados](./state-map.md)
- [Responsividade](./responsive-strategy.md)
- [Acessibilidade](./accessibility.md)
- [Convenções](./frontend-conventions.md)

## Features
`auth`, `tenant`, `teams`, `users`, `dashboard`, `analyses`, `analysis-processing`, `evidence`, `policies`, `collaboration`, `reports` e `evaluations` devem manter contratos tipados e serviços substituíveis por API.
