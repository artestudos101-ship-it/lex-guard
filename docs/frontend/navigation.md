# Navegação

A sidebar usa grupos Visão geral, Execução, Governança e Equipe. O item principal de execução é **Minhas análises** (`/analyses`); **Nova análise** é uma ação contextual de criação e não um destino de navegação. A topbar mantém busca global, notificações, tenant, equipe e usuário.

A navegação de uma análise segue `/analyses` → `/analyses/:id` → `/analyses/:id/processing`, com retorno preservando o contexto selecionado quando possível.
