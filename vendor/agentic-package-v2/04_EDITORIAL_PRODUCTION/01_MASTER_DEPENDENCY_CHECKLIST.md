# Checklist Mestre de Dependências — Linha Editorial / Assets / Store

ID: DEP-CHECK-EDITORIAL-001
VERSION: 1.0.0
STATUS: DEPENDENCY_COLLECTION

## 01 Estratégia da campanha
- [ ] CAMPAIGN_ID
- [ ] Nome da campanha
- [ ] Objetivo principal
- [ ] Pilar estratégico
- [ ] Público-alvo / ICP
- [ ] Problema central
- [ ] Proposta de valor
- [ ] Resultado esperado
- [ ] Canais
- [ ] Horizonte/duração
- [ ] Critérios de sucesso

## 02 Schema da pesquisa inicial / Wide Search
- [ ] ID do schema
- [ ] Campos obrigatórios
- [ ] Tipos e prioridade de fontes
- [ ] Período temporal / região
- [ ] Dados quantitativos e qualitativos desejados
- [ ] Perguntas que a pesquisa deve responder
- [ ] Estrutura de tópicos, argumentos, evidências e conflitos
- [ ] Registro de lacunas e citações
- [ ] Formato final
- [ ] JSON/YAML schema
- [ ] Agente/skill responsável
- [ ] Critérios de aceite

## 03 Peça-mãe / DX
- [ ] Definição formal de DX
- [ ] Schema da peça-mãe
- [ ] Campos obrigatórios
- [ ] Taxonomia editorial
- [ ] Estrutura de títulos/seções
- [ ] Citações e dados quantitativos pendentes
- [ ] Placeholders
- [ ] Padrão Markdown/frontmatter
- [ ] Critérios de DONE
- [ ] Versionamento

## 04 Storyboard
- [ ] Schema
- [ ] Granularidade cena/bloco/frame
- [ ] Relação seção→cena→frame
- [ ] Duração
- [ ] Texto/narração
- [ ] Visual
- [ ] Movimento/transição
- [ ] CTA
- [ ] IDs
- [ ] Critérios de aceite

## 05 Quick Frameworks
- [ ] Workflow oficial
- [ ] Schema entrada/saída
- [ ] Tipos de conteúdo elegíveis
- [ ] Regra de seleção
- [ ] Categorias e IDs
- [ ] Naming
- [ ] Formatos e rota
- [ ] Skill responsável
- [ ] Template visual
- [ ] Critérios de aceite

## 06 Assets e CTAs
- [ ] Schema Asset / CTA
- [ ] ASSET_ID / CTA_ID
- [ ] Relação com campanha e conteúdo
- [ ] Quantidade de HTMLs
- [ ] 3 planilhas
- [ ] 3 PDFs/e-books
- [ ] 3 prompts de IA
- [ ] 3 scripts/agentes
- [ ] 3 newsletters
- [ ] Objetivo, público, copy, CTA, destino, rota
- [ ] Critérios de aceite

## 07 PPS01 / PPS02 / PPS03
Para cada uma:
- [ ] Nome completo
- [ ] SKILL_ID
- [ ] Objetivo
- [ ] Input/output
- [ ] Schema
- [ ] Trigger
- [ ] Dependências
- [ ] Tools/permissões
- [ ] Aceite/evidência
- [ ] Erro/handoff

## 08 Loja TDH / Store
- [ ] Nome canônico / SKILL_ID
- [ ] Finalidade
- [ ] Ativos aceitos
- [ ] Categorias
- [ ] Rotas/URLs
- [ ] Schema de produto
- [ ] Metadata
- [ ] Imagens/previews
- [ ] CTAs/downloads
- [ ] Versionamento/status
- [ ] Storage

## 09 Frank's Watching Editor
- [ ] Nome oficial
- [ ] Finalidade / SKILL_ID
- [ ] Entrada/saída
- [ ] Escopo de revisão
- [ ] Regras editoriais
- [ ] Critérios de qualidade
- [ ] Permissão de alteração
- [ ] Handoff

## 10 MDX / Publicação
- [ ] Versão da skill
- [ ] Input schema / MDX schema
- [ ] Componentes permitidos
- [ ] ASCII / Quick Framework components
- [ ] Assets/embeds/links
- [ ] SEO
- [ ] Validação MDX
- [ ] Rota final

## 11 Plano Operacional Rastreável
- [ ] Versão atual
- [ ] Upgrade com vídeo
- [ ] Schema CSV definitivo
- [ ] campaign_id/content_id/asset_id/cta_id/frame_id/video_id
- [ ] platform/format/route/prompt_id/status/depends_on/evidence/duration/publish_date/analytics_id
- [ ] Máquina de estados
- [ ] Validação CSV

## 12 IP-0101
- [ ] Significado de IP
- [ ] Significado de 0101
- [ ] Lote/ordem/plano/instrução/pacote/run
- [ ] Schema
- [ ] Quem cria / quando nasce
- [ ] Conteúdo/status
- [ ] Relação com CSV/campanha/visual

## 13 Sistema de IDs
- [ ] CMP / RUN / DLV / CNT / ART / SEC / QF / AST / CTA / FRM / VID / DST / ANL / PRM
- [ ] Geração automática/manual
- [ ] Unicidade
- [ ] Imutabilidade
- [ ] Versão
- [ ] Naming de arquivos

## 14 Identidade visual
- [ ] Logo/paleta/tipografia/grid/espaçamento/bordas
- [ ] Cards/diagramas/ASCII/imagens/thumbnails/vídeo/legendas/transições
- [ ] Regras de composição
- [ ] Aspect ratios/safe areas
- [ ] Prompt base visual/restrições
- [ ] Design tokens
- [ ] Source of Truth

## 15 Geração de imagens
- [ ] Ferramenta IA / React
- [ ] Skill responsável
- [ ] Prompt schema
- [ ] Identidade visual
- [ ] Aspect ratio/resolução
- [ ] Naming/storage temporário
- [ ] Aprovação humana OK
- [ ] Evento após OK
- [ ] Upload/destino/evidência
- [ ] Versões rejeitadas

## 16 Geração de vídeo
- [ ] Plugin/ferramenta/API
- [ ] Formatos/resoluções/aspect ratio/duração/FPS
- [ ] Áudio/locução/legendas/música
- [ ] Frames/storyboard/prompt schema
- [ ] Visual identity injection
- [ ] Master/cortes/derivados
- [ ] Naming/storage/gate

## 17 Matriz plataforma × formato
- [ ] Blog
- [ ] Newsletter
- [ ] YouTube/Shorts
- [ ] Instagram Feed/Reels/Stories
- [ ] LinkedIn
- [ ] TikTok
- [ ] X
- [ ] Threads
- [ ] Pinterest se aplicável
- [ ] Loja TDH
- [ ] Outros

Campos canônicos: PLATAFORMA → FORMATO → RESOLUÇÃO → ASPECT RATIO → DURAÇÃO → TAMANHO → COPY → CTA → FREQUÊNCIA.

## 18 Plataforma CLP MVP
- [ ] Criar campanha/salvar pilar
- [ ] Trigger 1
- [ ] Estado do Run
- [ ] Mapa de pesquisa
- [ ] Editor Markdown
- [ ] Peça-mãe/storyboard/QF/assets/CTAs
- [ ] Trigger 2
- [ ] CSV/IDs/assets
- [ ] Aprovar OK/rejeitar
- [ ] Upload/associação
- [ ] Rotas/progresso/bloqueios/distribuição/analytics

## 19 Banco de dados
Objetos: Campaign, Strategic Pillar, Run, Research, Source, Article, Storyboard, Quick Framework, Asset, CTA, Prompt, Frame, Video, Route, Distribution, Analytics, Approval, Evidence, Error, Learning.
Para cada tabela: schema, PK, FK, timestamps, versionamento, status, owner, evidence, relações.

## 20 Storage
- [ ] Provider
- [ ] Diretórios
- [ ] Naming
- [ ] Upload/download
- [ ] Versionamento/thumbnail/metadata/permissões/URLs/retenção/backup

## 21 Orchestrator CLP
- [ ] Runtime/modelos/system instructions/context loading
- [ ] Agent/skill/tool/connector registries
- [ ] Permission matrix/handoff contract
- [ ] Retries/timeouts/limits/cost/checkpoints/idempotência
- [ ] BLOCKED/USER_ACTION_REQUIRED

## 22 Subagentes
Para cada um: ID, nome, especialidade, objetivo, input/output, quando atua/não atua, skills/tools/connectors/dados, autonomia, gate, aceite, evidência, handoff.
Mínimos: Research, Editorial Strategy, Writer, Editor, Fact-check, SEO/Discovery, MDX/Publication, Visual, Video, Distribution, Analytics, QA.

## 23 Matriz de permissões
- [ ] read/create/edit/overwrite/delete/publish/email/external data/call agent/MCP/file/upload/human approval

## 24 Approval gates
- [ ] Pilar
- [ ] Pesquisa
- [ ] Peça-mãe
- [ ] Storyboard
- [ ] Assets/CTAs
- [ ] CSV operacional
- [ ] Imagem OK
- [ ] Vídeo
- [ ] Peças finais
- [ ] Distribuição/publicação

## 25 Distribuição multiplataforma
- [ ] Plataformas/contas/connectors/APIs/credenciais/permissões
- [ ] Scheduler/datas/horários/timezone
- [ ] Copy/CTA/UTM/URL
- [ ] Falha/retry/confirmação

## 26 Analytics
- [ ] APIs/connectors
- [ ] Métricas/periodicidade/janela temporal
- [ ] content_id/asset_id/distribution_id
- [ ] Normalização/storage/plataforma/e-mail/alertas
Mínimos: views, impressions, reach, engagement, clicks, CTR, leads, conversions, revenue se aplicável.

## 27 Workbook
- [ ] Workbook atual/local
- [ ] Abas/colunas/IDs
- [ ] Manual × automático
- [ ] Fórmulas/dashboards/periodicidade

## 28 Formulário de acompanhamento
- [ ] Layout impresso/digital
- [ ] Campos/linha por peça/IDs/status/analytics/observações/data/responsável

## 29 E-mail
- [ ] Remetente/destinatários/frequência/template/assunto/anexos
- [ ] Aprovação ou automação autorizada
- [ ] Falha/retry

## 30 Evidência e observabilidade
Por Run: run_id, trigger, input, agente, skill, modelo, tool calls, output, erros, retries, custo, aprovação, asset, URL, estado final, evidence, timestamp.

## 31 Critérios de DONE
DONE = produzido + armazenado + associado ao ID correto + validado + estado esperado confirmado + evidência registrada.
Aplicar a Pesquisa, Peça-mãe, Storyboard, QF, Asset, CTA, Imagem, Frame, Vídeo, Artigo, Produto Store, Publicação, Distribuição e Analytics.

## Caminho crítico
01 Pilar → 02 Wide Search schema → 03 Peça-mãe/DX → 04 Storyboard → 05 Quick Framework → 06 Assets/CTA → 07 PPS → 08 Plano Operacional → 09 IDs → 10 Identidade → 11 Matriz formatos/plataformas → 12 Imagem → 13 Vídeo → 14 Rotas/storage → 15 Banco → 16 Orchestrator/agentes/permissões → 17 Distribuição → 18 Analytics → 19 Workbook/Formulário → 20 E2E.
