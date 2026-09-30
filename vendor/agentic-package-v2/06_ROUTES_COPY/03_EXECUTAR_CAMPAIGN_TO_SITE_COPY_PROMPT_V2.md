# EXECUTAR — Campaign Briefing → Site Copy → Implementation Prompt
ID: PROMPT-CAMPAIGN-SITE-COPY-002
VERSION: 2.0.0
STATUS: READY_FOR_EXECUTION
LANGUAGE: pt-BR

## OBJECTIVE

Receber o briefing completo de uma campanha do Programa EXECUTAR e transformar esse briefing em copy de produção para o site, respeitando o Route/Copy Contract de `EXECUTAR_UX_COPY_ROUTE_MASTER_V2.csv`, o Design System real do repositório e as rotas existentes/planejadas.

A execução deve produzir a copy, aplicá-la no local correto do site, verificar o resultado e atualizar o registro de rastreabilidade. Não reescrever a arquitetura do produto nem remover componentes existentes.

## INPUTS

Obrigatórios:
1. `CAMPAIGN_BRIEFING` — briefing da campanha.
2. `EXECUTAR_UX_COPY_ROUTE_MASTER_V2.csv` — contrato de rotas, componentes e copy slots.
3. Repositório atual do site.

Do briefing, extraia quando disponíveis:
- campaign_id
- campaign_name
- pilar estratégico
- ICP principal e secundários
- problema
- tensão / contexto
- outcome desejado
- proposta de valor
- mecanismo
- argumentos
- evidências e links
- restrições de claim
- peça-mãe / artigo matriz
- storyboard
- Quick Frameworks
- assets
- CTAs
- oferta
- preço autorizado
- oficinas
- mapa cognitivo
- e-books
- Skills / agentes / prompts associados
- canais de distribuição
- palavras-chave / SEO
- objeções
- tom
- termos proibidos
- datas e estágio da campanha

Dados ausentes = `A_DEFINIR`. Nunca inventar.

## REPOSITORY REALITY CHECK

Antes de alterar copy:

1. Leia `CLAUDE.md`.
2. Inspecione o estado real do repositório.
3. Confirme o stack vigente.
4. Confirme as rotas e arquivos reais.
5. Confirme os componentes reutilizáveis.
6. Confirme os tokens em `packages/theme`.
7. Confirme se a URL pública fornecida pelo usuário corresponde ao Worker/deployment deste repositório.

Stack esperado atualmente:
- Astro 7
- Starlight
- Tailwind CSS 4
- `@executar/theme`
- `@executar/ui`
- Cloudflare Workers

Não substituir por React/Vite/shadcn para a implementação de produção.

Se o deployment público não corresponder ao repositório:
- continue a geração da copy;
- continue a implementação local/versionada quando segura;
- marque `DEPLOYMENT_MISMATCH`;
- bloqueie apenas a publicação da parte afetada até resolver o vínculo.

## NON-DESTRUCTIVE RULE

A página institucional atual é `RECONTENT + REMAP`.

NÃO remover:
- seções existentes;
- pricing;
- valores;
- cards;
- funcionalidades;
- CTAs existentes sem substituição válida;
- componentes reutilizáveis.

Pode:
- substituir copy;
- atualizar labels;
- remapear CTAs;
- trocar imagens quando autorizado;
- adicionar links para novas rotas;
- adicionar marcadores de área;
- reorganizar conteúdo somente quando o contrato da rota permitir.

Preço existente deve ser preservado exatamente, salvo instrução explícita no briefing.

## DESIGN SYSTEM PRIORITY

Prioridade:
1. Apple HIG / regras já aceitas no repositório.
2. Starlight shell.
3. EXECUTAR Design System.
4. Upstream themes.
5. CSS próprio apenas se necessário.

Não criar segunda paleta.

A arquitetura cromática por área é uma extensão de tokens e precisa respeitar o ADR vigente:
- Institucional → azul; mapear preferencialmente para o token de marca existente.
- Artigos → amarelo; requer token de área aprovado.
- Skills → verde; requer token de área aprovado.
- Oficinas → laranja; token de área.
- Mapa Cognitivo → roxo; token de área.
- Loja → rosa; token de área.
- Demais áreas → definir token estável, documentado e acessível.

Nunca reutilizar um token de status (`success`, `warning`, `error`) como token de área sem decisão explícita. Se os tokens ainda não existirem, registrar `ADR_ADDENDUM_REQUIRED` e implementar o mínimo seguro permitido.

## COPY WORKFLOW

Para cada linha `record_kind=COPY` do CSV cuja rota esteja no escopo da campanha:

### STEP A — CONTEXT MERGE
Combine:
- campaign briefing;
- função da rota;
- função da seção;
- objetivo do componente;
- estágio da campanha;
- funnel job;
- ICP;
- limite de caracteres;
- SEO intent;
- evidências disponíveis;
- restrições.

### STEP B — /competitive-briefing
Quando `research_required=YES`:
- executar `/competitive-briefing`;
- pesquisar padrões de mensagem, categoria, nomenclatura, expectativas e lacunas;
- priorizar fontes primárias/atuais;
- nunca copiar frases de concorrentes;
- registrar URLs/fontes;
- converter pesquisa em implicações concretas de copy.

Se a skill não estiver disponível:
- registrar `SKILL_UNAVAILABLE`;
- não inventar pesquisa;
- continuar apenas com briefing e fontes disponíveis quando isso for suficiente.

### STEP C — /ux-copy
Executar `/ux-copy` para cada slot aplicável.

Regras:
- pt-BR;
- linguagem clara;
- sentence case;
- verbo concreto;
- escaneável;
- sem jargão desnecessário;
- sem “AI slop”;
- sem claims absolutos sem evidência;
- sem inventar resultado clínico, científico ou comercial;
- sem copiar concorrentes;
- preservar termos canônicos do produto;
- respeitar `max_chars`;
- CTA deve descrever a ação real;
- microcopy deve reduzir dúvida, não criar marketing vazio.

### STEP D — EVIDENCE GATE
Se `evidence_required=YES`:
- qualquer claim factual precisa de fonte aplicável;
- inserir/associar evidência;
- se a fonte não existir, reescrever para uma formulação não factual ou marcar `BLOCKED_EVIDENCE`.

### STEP E — SEO
Quando `seo_intent` estiver preenchido:
- gerar title/meta description coerentes com a copy real;
- não fazer keyword stuffing;
- manter consistência entre H1, intenção, title e description.

## ROUTE APPLICATION

Aplicar copy apenas na rota/componente indicados pelo CSV.

Regras:
- usar o `implementation_path_hint` como pista, nunca como verdade cega;
- confirmar o arquivo real antes da alteração;
- reutilizar componentes existentes;
- conteúdo dinâmico deve vir de dados/schema, não ficar hardcoded;
- mocks só são permitidos nas rotas novas cuja fonte definitiva ainda não exista;
- mocks devem estar claramente separados da produção.

## ROUTE BEHAVIOR

### `/`
Hub institucional.
Manter todas as seções atuais, incluindo pricing.
Atualizar toda a copy para a campanha ativa e conectar:
- Artigos
- Oficinas
- Mapa Cognitivo
- Loja/Ferramentas
- CTAs

### `/blog/`
Índice editorial.
A campanha pode definir:
- destaque;
- artigo matriz;
- categorias;
- descrição editorial;
- CTA contextual.

### Artigo individual
Usar o conteúdo editorial aprovado da peça-mãe.
Não inventar título, tese ou evidência.

### `/oficinas/`
Gerar copy de catálogo a partir da oferta/briefing.
Se não houver schema, usar dados mock apenas para layout e marcar como tal.

### `/mapa-cognitivo/`
Explicar problema, exploração, evidências e próximo passo sem prometer diagnóstico.

### `/loja/`
Conectar a campanha aos recursos relevantes.

### Categorias da loja
Gerar copy de categoria e cards conforme asset/skill registry.

### `/loja/[type]/[slug]/`
Gerar copy pública do item:
- identidade;
- descrição;
- problema;
- processo;
- progresso;
- evidência;
- CTA.

Não expor dados privados/internos.

## CAMPAIGN → SITE MAPPING

Crie um mapa antes de editar:

`campaign_element -> route_id -> section_id -> copy_key -> source -> evidence -> CTA`

Exemplo lógico:
- peça-mãe → `/blog/` featured + artigo;
- Quick Framework → artigo + loja;
- Skill relacionada → `/loja/skills/`;
- e-book → `/loja/ebooks/`;
- oficina → `/oficinas/`;
- mapa → `/mapa-cognitivo/`;
- CTA principal → home + artigo + detail pages;
- objeções → FAQ;
- oferta/preço → pricing, preservando valores autorizados.

## IMPLEMENTATION STATES

Para cada copy slot:
- `TO_GENERATE`
- `GENERATED`
- `REVIEW_REQUIRED`
- `BLOCKED_EVIDENCE`
- `BLOCKED_SCHEMA`
- `IMPLEMENTED`
- `VERIFIED`

Não marcar `VERIFIED` sem teste real.

## FILE/CONTENT UPDATE

Após gerar a copy:
1. atualizar o código/conteúdo da rota;
2. atualizar o CSV:
   - `current_copy`
   - `final_copy`
   - `copy_status`
   - `data_source`
   - `repo_evidence`
   - `blocker`
   - `notes`;
3. manter IDs estáveis.

## VALIDATION

Executar, quando aplicável:
- `npm run check`
- `npm run build`
- `npm run test:e2e`

Além disso verificar:
- copy sem overflow;
- navegação válida;
- CTAs válidos;
- pricing preservado;
- nenhuma seção removida sem autorização;
- contraste;
- mobile;
- headings;
- acessibilidade;
- ausência de IDs internos no conteúdo publicado;
- ausência de dados privados;
- ausência de claims sem evidência.

## OUTPUTS

Entregar:
1. `COPY_IMPLEMENTATION_REPORT.md`
2. CSV V2 atualizado com status real.
3. Lista de arquivos modificados.
4. Mapa campanha → rotas → copy slots.
5. Copy final por rota.
6. Fontes do competitive briefing.
7. Gaps e bloqueios.
8. Resultado de check/build/e2e.
9. URL/preview verificado, se houver.
10. Próxima ação desbloqueada.

## DONE WHEN

DONE exige:
- briefing mapeado;
- copy gerada;
- copy implementada;
- rotas corretas;
- componentes preservados;
- pricing preservado;
- evidências respeitadas;
- validações executadas;
- CSV atualizado;
- resultado verificado.

Gerar texto sem aplicar no site = não DONE.
Aplicar no site sem verificar = não DONE.
Declarar sucesso sem evidência = não DONE.
