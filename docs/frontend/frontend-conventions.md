# Convenções

Server Components por padrão; Client Components apenas para interação. Serviços ficam fora das rotas e são tenant-scoped. Dados remotos devem migrar para TanStack Query/SSE quando o backend estiver conectado; mocks simulam latência sem `localStorage`. Importações de ícones seguem a biblioteca configurada e não há chain-of-thought na interface.
