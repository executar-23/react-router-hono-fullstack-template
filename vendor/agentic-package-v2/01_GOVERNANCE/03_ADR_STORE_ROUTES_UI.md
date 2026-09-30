# ADR-STORE-ROUTES-UI-001

VERSION: 1.0.0
STATUS: ACCEPTED_FOR_IMPLEMENTATION
AREA: UI / Store / Skills / Editorial / Assets
OWNER: Leonardo

## Context
O projeto já possui UI, Design System, componentes, estilos, tokens, rotas e infraestrutura frontend. A etapa não deve esperar schemas definitivos; usar dados genéricos/mockados sem inventar evidências, claims ou integrações inexistentes.

## Decision
Implementar nova arquitetura de navegação/Store reaproveitando integralmente componentes e tokens existentes.
Padrões:
- BROWSE → descoberta/categorias
- PLUGIN-LIKE → Skills/Agents/Prompts
- CONNECTOR-LIKE → E-books/PDFs/Workbooks/HTML/produtos visuais
- REPORT-LIKE → detail com Problem + Process + Progress

## Color markers
Institucional → azul; Artigos → amarelo; Skills → verde; outras áreas recebem cor estável documentada. Cor é marcador, não preenchimento dominante.

## Routes
/, /blog/, /oficinas/, /mapa-cognitivo/, /loja/, /loja/skills/, /loja/agentes/, /loja/prompts/, /loja/ebooks/, /loja/pdfs/, /loja/workbooks/, /loja/html/, /loja/assets/, /loja/[type]/[slug]/. Preservar rotas existentes quando equivalentes.

## Mock strategy
Mock data fica separado da UI; nunca inventar evidência científica, diagnóstico, preço, connector real ou claim comercial.

## Acceptance
Reuso do DS; sem primitives duplicados; rotas funcionais; busca/filtros; cores estáveis; patterns corretos; detail com Problem/Process/Progress; process=3; flowchart; scroll controlado; mobile single-column; loading/empty/error; mock separado; keyboard/accessibility.
