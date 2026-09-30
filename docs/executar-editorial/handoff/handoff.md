# Handoff Spec — mapas, processos e relatórios EXECUTAR

ID: EXEC-DS-SPEC-001 · v0.1.0 · PREPARED
Todas as medidas e decisões de interação abaixo são propostas de engenharia. As referências validam intenção visual, não valores exatos nem comportamento implementado.

## Layout e tokens
Consumir aliases de `tokens.json`, nunca raw diretamente no componente. Tela clara, texto primário escuro, acento azul proposto. Vermelho/âmbar/verde ficam reservados a estado acompanhado de texto e ícone. Alterar acento não muda estrutura ou significado.
Cards: larguras `card.width.sm/md/lg`, padding `card.padding`, raio `card.radius`, borda `stroke.subtle`, elevação `elevation.card`. Título `type.title`, corpo `type.body`, família `type.family`, entrelinha `type.lineHeight`. Chrome usa `control.radius`; alvos interativos usam `control.target`. Conectores usam `border.default` e `stroke.default`; seleção usa `focus.ring` e `stroke.selected`.
Separação entre irmãos `graph.gap.branch`; entre níveis `graph.gap.level`. O motor aumenta espaço para evitar colisões de rótulos. SVG vetorial para conectores. Layout não pode alterar IDs, arestas ou estado de execução.

| Faixa | Regra proposta |
|---|---|
| < breakpoint.tablet (768px) | OutlineView inicial, inspetor em painel de tela inteira; canvas opcional com controles explícitos |
| 768 a <1024px | Canvas e inspetor sobreposto; toolbar com quebra de linha |
| >= breakpoint.desktop (1024px) | Canvas e inspetor lateral de 360px; canvas ocupa restante |

Inspetor lateral terá token próprio `inspector.width` na implementação, derivado de `card.width.lg`. Área útil estreita troca para sobreposição mesmo em desktop. Justificativa: preservar leitura e controles tocáveis sem reduzir o grafo a texto ilegível.

## Modelo de dados e significado
`graph.schema.json` é o contrato de serialização; `types.ts` expõe tipos para adaptação ao aplicativo. IDs estáveis, sem índice de array como identidade. Escrita persistente precisa de controle de versão: conflito deve oferecer recarregar ou reconciliar, sem sobrescrever silenciosamente.
Camada de domínio deve rejeitar: IDs duplicados, endpoints ausentes, autorreferência e ciclos de hierarchy/dependency/sequence. Hierarchy tem no máximo um pai por nó. Flow/agents permitem ciclos somente em relações message/return, com rótulo explícito. Em hierarchy/mindmap, usar hierarchy e permitir vários componentes desconectados como floresta, exibindo aviso quando isso for inesperado.
Relação hierarchy = pertence a; dependency = bloqueia; sequence = acontece depois; message = troca de informação; return = retorno. Layout não implica precedência. Em modo planejamento pessoal, WIP=1 sobre tarefas IN_PROGRESS; não aplicar esse limite automaticamente a agentes concorrentes. VERIFIED requer ao menos uma evidência, além da validação de conclusão pelo domínio. Ausência de owner permanece null e aparece como “Responsável a definir”.
GroupFrame recebe membership via nodeIds; adaptador verifica unicidade de grupo e consistência com groupId. Um nó só pertence a um grupo; grupos sobrepostos/aninhados ficam fora de v0.1.0.

## BranchCanvas
Modos hierarchy e mindmap usam árvore/floresta; flow e agents usam grafo dirigido com retornos explícitos. Direção TB padrão; LR opcional. Pan por arraste de espaço vazio; zoom por botões e gesto de pinça, intervalo proposto 25–200%. Ctrl/Cmd+roda apenas quando canvas tem foco. Não capturar rolagem comum da página. “Ajustar à tela” considera bounds de nós e rótulos. Reorganizar layout é diferente de alterar relações e deve preservar dados.
Sem nós: mensagem “Nenhum item neste mapa” e ação Criar item quando editável. Loading: skeleton e aria-busy. Erro: mensagem contextual e Tentar novamente sem descartar dados anteriores. readOnly permite seleção, expansão e navegação, sem mutação. OutlineView deve conter os mesmos dados e relações.

## NodeCard
Variantes root/branch/leaf reaproveitam o mesmo contrato; DecisionNode e AgentNode especializam conteúdo. Root usa título forte; branch mostra quantidade de filhos; leaf pode mostrar descrição e metadados. Clique/toque seleciona; botão “Abrir detalhes” abre inspetor. Não fazer toda a área de um card com botões internos virar outro botão. Título até 120 caracteres; preview em duas linhas com reticências, descrição até quatro linhas; texto integral no inspetor e OutlineView. Palavras longas quebram; conteúdo de usuário é texto, nunca HTML executável.
Hover: realçar borda, sem deslocar geometria. Focus: contorno visível `focus.ring`, espessura `stroke.strong` e offset `space.xs`. Selected usa borda e indicação textual. Disabled mantém leitura, explica motivo e impede edição. Loading mantém dimensões; error mostra erro local e tentativa autorizada. Missing usa “— pendente”, itálico e text.secondary, sem simular dado.
Role: article com título associado; seleção/abertura em botões separados. Tab alcança controles; Enter/Espaço ativam botões. Leitor anuncia título, tipo, estado e relações via resumo textual. Não depender de hover para informação essencial.

## StatusBadge
Estados de trabalho preservam o vocabulário do contrato. NOT_READY “Não pronto”, READY “Pronto”, IN_PROGRESS “Em execução”, BLOCKED “Bloqueado”, DECLARED_DONE “Concluído, aguardando verificação”, VERIFIED “Verificado”. Código desconhecido: “Estado não reconhecido”, sem converter em sucesso. Badge estático não é botão. Alteração assíncrona pode ser anunciada pelo status global, sem múltiplos live regions concorrentes.

## NodeExpander
Botão com aria-expanded e aria-controls; nome “Recolher/Expandir descendentes de {título}”. Mantém filhos no dado e apenas muda visibilidade. Recolher move foco de descendente oculto para o botão pai. Contador representa filhos diretos; rótulo especifica isso. Sem filhos, não renderizar botão. Carregamento remoto falho mantém ramo e exibe repetir.

## EdgeConnector
Hierarchy e sequence sólidas; dependency sólida forte com rótulo “Bloqueia”; message e return tracejadas com rótulos. Setas indicam direção. Relações aparecem também como texto em OutlineView. Conector visual decorativo aria-hidden quando a representação textual está presente. Seleção/edição por lista de relações com botões, sem exigir apontar uma linha fina. Área de hit ampliada não muda stroke visível. Relação inválida fica em formulário com erro antes de salvar, não vira linha persistida.

## GroupFrame
Título, borda e conteúdo agrupado. Colapso conserva nós e mostra quantidade oculta; conexões externas passam por proxy visual identificado como grupo, sem reescrever endpoints. Grupo vazio mostra “Sem itens”. A seleção não implica execução conjunta.

## CanvasToolbar
Botões nomeados Zoom mais/menos, Ajustar à tela, Alternar direção, Ver em lista. Exibir percentual. Ações nos limites ficam indisponíveis com motivo. Tab em ordem de leitura; foco retorna ao controle após ação. Não esconder controles essenciais em gesto.

## NodeInspector
Cabeçalho com título e Fechar; campos com label e ajuda; ações Salvar/Cancelar. Escape fecha se limpo; se dirty, pedir descartar ou continuar editando. Saving impede submissão duplicada; erro mantém rascunho e aponta campo. Painel sobreposto usa diálogo modal, contém foco e devolve ao acionador ao fechar. Painel lateral persistente é região complementar, não prende foco. Atualização remota concorrente mostra conflito de versão antes de salvar.

## DecisionNode
Tipo decision com descrição da condição e pelo menos duas saídas sequence, cada uma com label não vazio e exclusivo dentro da decisão. Rótulo “Caso contrário” permitido. Critério não preenchido bloqueia ativação do processo, mas pode ser salvo como rascunho NOT_READY. Não inferir regras de negócio pelo desenho.

## AgentNode
Representa agente, ferramenta ou aprovação. Exibir tipo, runId quando existir, estado da execução e resultado/evidência. Estado de execução é separado de WorkStatus: succeeded não promove automaticamente tarefa a VERIFIED. Em awaitingApproval, mostrar ação humana necessária. Selecionar, expandir, mover ou conectar nunca dispara ferramenta. Execução real exige backend autorizado, escopo validado, idempotência por runId/ação e trilha de eventos; nenhuma credencial entra no grafo público. Falha permite tentar novamente apenas com política de retry definida. Cancelar exige confirmação de resultado recebido pelo backend antes de mostrar cancelled.

## ReportForm
Report conforme types.ts. Campos obrigatórios: id, version, title, generatedAt; usuário informa título, seção e período quando aplicável, sistema atribui identidade/versionamento e data de geração. Campos opcionais não são inventados. Validar título 1–120, corpo de seção até 4000, início <= fim; strings grandes não podem perder conteúdo silenciosamente. Erros aparecem junto ao campo, aria-describedby e resumo focado após envio inválido. Rascunho preservado em erro de geração. Gerar cria snapshot imutável da versão de dados usada, sem alterar tarefas.

## PrintReport
A4 retrato: print.width × print.height, safe area print.safe; proposta 210×297mm, margem interna 15mm. Paisagem inverte dimensões. @page com margin:0; padding interno controla área segura. Corpo print.body, nunca abaixo de print.min. Cabeçalho com título/id/versão/data; seções com divisórias; rodapé com paginação a ser fornecida pelo motor de exportação. Quebras evitam título isolado e bloco curto dividido; bloco maior que página pode continuar com indicação de continuidade. Expandir textos truncados. Remover toolbars, botões, sombras e affordances de tela. Status mantém texto para impressão monocromática.
Aplicar print-color-adjust:exact e -webkit-print-color-adjust:exact. Gráficos SVG; se não couberem mantendo texto legível, gerar páginas por ramo com referência à raiz e índice, ou apêndice em lista. Não encolher ilimitadamente. Nenhum QR previsto nesta versão. Exportador deve comprovar paginação e não cortar conteúdo; saída RGB não implica arquivo pronto para gráfica CMYK.

## InfographicPanel
Título, grafo, legenda e nota de fonte/evidência. Não incorporar nomes/logotipos/conteúdo comercial das referências no produto. Dados e layout separados; trocar orientação ou acento não altera relações. Conteúdo numérico deve ter fonte, unidade e regra de cálculo quando aplicável.

## OutlineView
Lista semântica aninhada para hierarchy; lista de nós com relações explícitas para grafos com ciclos. Não implementar role tree sem navegação completa de árvore. Tab nos botões; ordem estável; mesmo estado de seleção/expansão do canvas. Arestas de retorno são referências textuais, sem recursão infinita.

## Estados e motion compartilhados
Default, hover, foco, seleção, disabled, loading, error e empty devem existir no catálogo quando aplicáveis. Erro de rede mantém último conteúdo com aviso “Dados podem estar desatualizados”. Alterações relevantes anunciadas em região aria-live polite; erros de envio em resumo focado. Evitar anúncios por frame/pan.
Hover/foco usa motion.fast; expandir usa motion.normal com motion.easing; reduced-motion usa motion.reduced, sem pan/zoom animado. Não pulsar continuamente agentes em execução. Dimensões reservadas impedem saltos durante carregamento.

## Acessibilidade e regras de uso
Meta de aceite: texto comum >=4.5:1; controles/indicadores essenciais >=3:1; alvos >=control.target. Verificar pares de tokens efetivamente usados, teclado, zoom 200%, toque, modo reduzido e leitor de tela no produto. Não alegar conformidade apenas com a paleta.
Fazer: texto+ícone+cor para estado; relações nomeadas; alternativa em lista; dados ausentes explícitos; erros recuperáveis. Evitar: significado só por cor, execução ao clicar no nó, remover relações ao recolher, reduzir impressão até ilegível, usar imagem de referência como código de produção.

## Casos de aceite por família
AC-01: selecionar/abrir/recolher preserva IDs, relações e conteúdo.
AC-02: title longo/missing owner não rompe layout e texto integral é acessível.
AC-03: duplicidade/endpoints ausentes/ciclo bloqueante são rejeitados com erro local.
AC-04: todas as funções centrais disponíveis por teclado e lista.
AC-05: execução/approval são confirmadas pelo backend; edição visual não executa ferramentas.
AC-06: relatório de 1, 3 e 10 páginas preserva conteúdo, margens e ordem; sem controles de tela.
AC-07: modos hierarchy/flow/mindmap/agents mantêm semântica ao alternar projeção permitida.
AC-08: falha de rede, conflito e retry não perdem rascunho nem duplicam efeitos.
AC-09: 0/1/50/500 nós; grafo de 500 deve continuar navegável em lista. Medir desempenho em dispositivo alvo a definir antes de fixar orçamento e virtualização.
AC-10: tokens têm contraste verificado; motion reduzido não anima deslocamento.
