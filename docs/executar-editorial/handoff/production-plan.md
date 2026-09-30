# Plano de produção e checkpoint

ID: EXEC-DS-WF-001 · v0.1.0 · WIP=1

| Nó | Entrada/pré-condição | Saída | Dependência | Estado | Aceite/evidência |
|---|---|---|---|---|---|
| WF-01 | Briefing e referências | Registro + spec + schema + tokens | — | VERIFIED documental | validation.json + manifest.json |
| WF-02 | Pacote e repositório/registro destino identificados | Mapeamento de IDs, pasta destino, owners e decisões visuais | WF-01 | BLOCKED | Diff de integração sem substituir IDs existentes |
| WF-03 | Ambiente de UI disponível | Implementação P0 + catálogo de estados | WF-02 | NOT_READY | AC-01 a 04, 08 a 10 |
| WF-04 | P0 integrado | Decisões, grupos e agentes P1 | WF-03 | NOT_READY | AC-03, 05 e 07 |
| WF-05 | Contrato de relatório e motor de exportação | Formulário e impressão | WF-03 | NOT_READY | AC-06 e 08 |
| WF-06 | P0/P1 verificados | Infográficos P2 | WF-04, WF-05 | NOT_READY | AC-02, 07 e 10 |
| WF-07 | Evidências de testes e ambiente alvo | Release versionado | WF-06 | NOT_READY | Deploy real, smoke test e rollback documentado |

## Lacunas e decisões preparadas
GAP-01: destino do código/registro não indicado nesta solicitação. Afeta WF-02; não impede pacote documental. Próxima ação: identificar repositório e caminho canônicos com usuário ou fonte autorizada.
GAP-02: hex/fontes exatas não fornecidas. Solução provisória explícita: tokens propostos v0.1.0; congelamento visual exige decisão do owner, sem alegar extração exata.
GAP-03: renderer/layout e exportador não definidos. Engenharia deve selecionar após inspecionar stack, volume e ambiente. Não adicionar dependência por inferência.
GAP-04: suporte universal a “todos os tipos” não demonstrado. v0.1 cobre hierarchy, mindmap, flow e agents; novos formatos precisam de adaptador e critérios próprios.

## Gates
G1 PREPARED: pacote íntegro e verificações estruturais passam.
G2 APPROVED: owner/destino e decisões do pacote aceitos, registro reconciliado.
G3 IMPLEMENTED: componentes reais e persistência implementados; catálogo de estados.
G4 VERIFIED: ACs passam com evidências, inclusive navegador/leitor de tela/impressão.
G5 RELEASED: versão publicada em ambiente identificado e smoke test concluído.
Sem evidência, não avançar estado. Especificar um componente não o torna implementado.

## Handoff ao agente de implementação
Leia README, registro e handoff. Inspecione instruções e código do repositório destino. Preserve IDs e convenções locais. Mapeie tokens e tipos antes de editar UI. Execute um nó desbloqueado por vez. Comece por StatusBadge/NodeExpander, depois NodeCard, conectores, lista, toolbar, canvas e inspetor. Não implemente execução de ferramentas como efeito de seleção. Registre arquivos alterados, comandos de verificação e limitações reais. Pare somente o nó que exige decisão ausente.

Último estado verificado: preparação documental. Próximo workflow preparado: WF-02, integração do registro no repositório do aplicativo.
