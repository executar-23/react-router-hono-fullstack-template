# Agent Prompt — DEV-STORE-ROUTES-001

VERSION: 1.0.0
ADR_ID: ADR-STORE-ROUTES-UI-001
AUTOMATION_LEVEL: A4
WIP: 1

## Objective
Implementar primeira versão funcional de Loja/Ferramentas/Skills/Assets usando componentes existentes e mock data. Validar arquitetura, rotas, composição, hierarchy, responsive, navigation, discovery e detail.

## No external dependency rule
Código existente > DS > componentes existentes > contrato > referências visuais. Inspecionar antes de criar.

## Reuse rule
Localizar e reutilizar Card, Button, Badge, Tabs, Input/Search, ScrollArea, Separator, Accordion, Collapsible, Skeleton, Spinner, Progress, Alert, AspectRatio, Dialog/Sheet/Drawer equivalentes. Criar apenas feature compositions.

## Reference patterns
Browse = busca/categorias; Plugins = Skills/Agents/Prompts; Connectors = E-books/PDFs/Workbooks/Assets; Privacy Report = detail split; component gallery = primitives.

## Routes
/ institucional, /blog, /skills ou /loja/skills conforme routing real, /loja e categorias, /loja/[type]/[slug]. Extender sem duplicar.

## Mock catalog
10 Skills, 3 E-books, 3 Prompts, 3 Workbooks/HTML/Assets combinados, apenas para testar layout.

## Implementation sequence
Inspect repo → routing → tokens → components → component map → route map → area colors → mock schema/data → store shell/home → skills → visual products → detail → search/filter → responsive/states → navigation → accessibility → route check → evidence.

## Deliverables
ADR, route map, area color map, wireframes, component map, implemented routes, feature components, mock data, search, filters, responsive, states, accessibility verification, Dev Check, implementation report.
