# Prompt — Mapa de Dependências BPM Agentic A4

ID: PROMPT-BPM-DEPENDENCY-MAP-001
VERSION: 1.0.0

## Objective
Criar uma prancha A4 vertical pronta para impressão que represente o workflow editorial agentic como mapa de dependências. Prioridade: responder "o que precisa existir antes para que o próximo elemento aconteça?".

## Visual grammar
- Fundo branco, muito espaço negativo, tipografia sans-serif limpa, linhas finas, cards organizados.
- POSIÇÃO = dependência; SETA = sequence flow/dependência; COR = tipo; FORMA = função; BADGE = metadado.
- BPMN-inspired: start circle, end double circle, activity rounded rectangle, subprocess marker +, exclusive gateway ×, parallel gateway +, solid sequence flow, dashed rework loop.
- Agentic badges: OWNER, ORCH, AGENT, SKILL, TOOL, AUTO, EVID, ID.

## Plain Language
Uma ideia por rótulo; verbo+objeto para atividade; substantivo para entregável; máximo duas linhas por título; siglas só quando necessárias.

## Design tokens
Canvas A4 portrait 210/297, background #FFFFFF, safe margin 12mm, ink #171717, secondary #666666, surface #F5F5F5. Radius 14/22 apenas se não conflitar com DS vigente. Conectores sempre neutros.

## Semantic colors
Human #C2410C; Orchestrator #6D28D9; Phase #1D4ED8; Deliverable #15803D; Subdeliverable #14532D; Platform #BE185D; Agent #B91C1C; ID #FACC15 texto #111; Format #171717; Skill #0E7490; Tool #4B5563; Gate branco/borda #171717.

## Dependency graph
START → Definir Pilar Estratégico → G01 Pilar definido? → Trigger 1 → Orquestrar Pesquisa → Wide Search → DLV-0020 Mapa de tópicos → Analisar pesquisa → Escrever Peça-Mãe/DX → DLV-0030 → parallel split → Storyboard / Quick Frameworks / Assets+CTA → parallel join → G02 Pacote autoral completo? → Trigger 2 → coletar pacote → parallel skills (PPS01/02/03, Store/QF, Assets+CTA/Editor) → join → Plano Operacional Rastreável → DLV-0090 CSV → G03 CSV+IDs válidos? → gerar assets visuais → D7 review pending → G04 Visual OK? (não→regenerar; sim→salvar+ID+upload) → D8 verified → G05 todos os assets? → preparar vídeo → gerar vídeo master → derivados → pacote de produção IP-0101 (significado A_DEFINIR) → G06 peças finais OK? → distribuição → plataformas em paralelo → agendar/publicar → tracking form → analytics → learning → END.

## Validation
Verificar START→END, sem ambiguidade; todas as setas são dependências reais; entregáveis bloqueantes são nós; gates e loops visíveis; paralelismos convergem; aprovação visual precede upload; aprovação final precede distribuição; analytics após publicação; legível em cinza/A4; IDs amarelos; formatos pretos; plataformas rosa; brand accents secundários; sem linhas cruzadas desnecessárias.
