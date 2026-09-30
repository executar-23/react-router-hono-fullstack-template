# Design Handoff + PRF + FRD + Specs — Tools / Skills / Store

ID: EXECUTAR-TOOLS-STORE-UX-001
VERSION: 0.1.0
STATUS: PREPARED

## UX decision
BROWSE → CARD → DETAIL → PROBLEMA → PROCESSO → PROGRESSO → FLOWCHART DE USO → CTA

## Catalog patterns
A) Skill-like: Skills, Agents, Prompts, Frameworks, Automations. Card com símbolo, nome, descrição, tags, CTA.
B) Visual product: E-books, PDFs, HTML tools, Workbooks, Templates, Visual Assets. Card com thumbnail/capa, nome, descrição, tags, CTA.

## Detail view
Split desktop ~45/55.
LEFT: symbol, title/description, tags, flowchart, evidence/references.
RIGHT: Problem, Process (exatamente 3 passos), Progress (Plan/Do/Check/Act).
Mobile: identity → description → flowchart → problem → process → progress → CTA.

## Scroll behavior
Outer page scroll normal; content region pode usar ScrollArea; separator visível; media com aspect ratio controlado; evitar nested scrolling excessivo.

## Component specs
Reutilizar Card, Badge, Button, Tabs, Input/Search, Separator, ScrollArea, AspectRatio, Accordion, Collapsible, Skeleton, Spinner, Progress, Alert, Carousel, Resizable.
Feature components sugeridos: ToolsShell, ToolsHeader, ToolsTabs, ToolsSearch, ToolsFilters, FeaturedTool, SkillGrid, ProductGrid, SkillCard, VisualProductCard, ToolDetail, ToolIdentityPanel, ToolSymbol, ToolDescription, ToolFlowchart, ProblemCard, ProcessCard, ProgressCard, EvidenceDisclosure, ToolCTA.

## FRD core
FR-001 navegação por classes; FR-002 seus/descobrir; FR-003 busca; FR-004 SkillCard; FR-005 VisualProductCard; FR-006 detail com ITEM_ID; FR-007 coluna de contexto; FR-008 Problem; FR-009 Process=3; FR-010 Progress=PDCA; FR-011 no overflow; FR-012 CTA; FR-013 private não público; FR-014 e-books visual; FR-015 skills símbolo; FR-016 responsivo.

## PRF jobs
DESCOBRIR, ENTENDER, AVALIAR, APRENDER, EXECUTAR.

## Data contract
PublicTool: itemId, type, name, shortDescription, area, icp, relevance, executiveFunctions, symbol.iconToken, problem, process[3], progress.plan/do/check/act, flowchart, media, cta.
