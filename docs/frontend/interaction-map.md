# Interações críticas

- Selecionar uma análise na lista → atualiza a conversa sem perder o filtro.
- Abrir console → navega para o detalhe mantendo `analysisId`.
- Clicar em evidência/finding → deve selecionar documento, página e região no PDF.
- Enviar mensagem → cria turno do usuário e resposta baseada no contexto da análise.
- Processamento → eventos observáveis atualizam progresso com `aria-live="polite"`; falha de um documento não bloqueia os demais.
- Ações de colaboração → atribuir, comentar, confirmar, rejeitar e resolver refletem no serviço correspondente.
