# Sistema de design

## Tokens
Usar tokens semânticos de `app/globals.css`: background/foreground, card, muted, primary, success, warning, critical e info. A paleta é deliberadamente compacta: azul institucional como ação e navegação, neutros de workspace e três estados de atenção.

## Tipografia
Geist Sans para interface e Geist Mono para IDs, scores, timestamps e dados técnicos. Corpo usa line-height confortável; títulos usam `text-balance`.

## Composição
Cards usam composição completa do shadcn; layouts usam flex por padrão e grid apenas para relações bidimensionais. Espaçamento segue a escala Tailwind e estados são sempre acompanhados por texto, não apenas cor.
