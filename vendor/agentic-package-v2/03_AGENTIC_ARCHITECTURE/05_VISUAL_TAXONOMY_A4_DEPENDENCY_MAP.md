# Taxonomia Visual A4 — Organograma como Mapa de Dependências

ID: VISUAL-TAXONOMY-A4-001
VERSION: 1.0.0

## Regra estrutural
POSIÇÃO + LINHA = DEPENDÊNCIA
COR = TIPO DO ELEMENTO
FORMA = FUNÇÃO
BADGE = METADADO

Uma seta significa apenas: A → B = B depende de A.

## Cores semânticas
- Laranja: Leonardo / administrador / humano
- Roxo: CLP / Orchestrator
- Azul: fase / etapa
- Verde: entregável principal
- Verde escuro: subentregável
- Rosa: plataforma
- Vermelho: subagente
- Amarelo: ID
- Preto: formato
- Ciano: skill / workflow
- Cinza: tool / connector / plugin
- Branco + borda preta: gate

## Plataformas
Plataforma é semanticamente rosa. A cor da marca aparece apenas como accent secundário. Ex.: Facebook azul, X preto, YouTube vermelho, LinkedIn azul, Instagram gradiente, TikTok accents.

## Hierarquia
L0 Campanha
L1 Dependências principais
L2 Fases
L3 Atividades/entregáveis/gates
Metadados transversais: owner, orchestrator, agent, skill, tool, ID, format, platform, status, A0–A4, evidence.

## Regra de nó
Agente, skill, ID, formato e plataforma NÃO viram filhos visuais só por serem propriedades. Eles ficam como badges dentro do card, exceto quando a plataforma for uma execução real distinta na fase de distribuição.

## Gates
Gate fica na cadeia quando realmente bloqueia a continuação. Aprovação/rejeição deve mostrar loop de correção e caminho de avanço.

## A4
A folha MASTER mostra dependências principais, gates e entregáveis. Folhas STAGE mostram granularidade operacional.
