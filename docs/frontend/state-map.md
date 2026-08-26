# Mapa de estados

Estados transversais: loading com `Skeleton`, vazio com `Empty`, erro com `Alert` e sucesso com toast. Análises possuem `draft`, `uploading`, `processing`, `review`, `completed` e `failed`; eventos de processamento possuem `pending`, `active`, `completed`, `warning` e `failed`.

A UI demo usa serviços com latência simulada e contratos que podem ser trocados por API. O estado de conversa é local à tela; documentos completos não entram em estado global.
