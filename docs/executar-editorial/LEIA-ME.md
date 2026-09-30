# EXECUTAR · Produção editorial

## Abrir
Descompacte o pacote e abra `index.html`. O HTML contém o estilo, o aplicativo e os dados iniciais; não usa CDNs nem bibliotecas externas.

## Instalar como PWA
Na pasta extraída, execute `python iniciar.py`. Abra `http://localhost:8080/index.html`. Em navegador compatível, use “Instalar” ou o comando de instalação do navegador. Em iPhone/iPad, use Compartilhar → Adicionar à Tela de Início. Alternativamente, hospede toda a pasta em HTTPS.

O manifesto, o service worker e os ícones precisam ficar junto do HTML. PWA e cache offline não funcionam com URL `file://`. Depois do primeiro carregamento em localhost/HTTPS, os recursos principais são armazenados para uso offline. A instalação depende do navegador.

## Usar
- Scroll Task: ação, tarefa, fase ou workflow; um item central por vez.
- Anterior/Próxima, setas do teclado fora dos controles, roda deliberada ou swipe vertical.
- Timer: 15/30/45 minutos ou 10 segundos para teste. Iniciar/Pausar/Reiniciar. A expiração nunca conclui trabalho. Auto-scroll avança a visualização e prepara o timer do próximo item, sem iniciá-lo automaticamente.
- Contexto e notas: caminho completo, datas originais, pré-requisitos e itens bloqueados.
- Plano mental: mapa com pan por arraste do fundo, zoom, direção, ajuste, recolhimento de ramos, busca e alternativa em lista. Ctrl/Cmd + roda com foco no mapa ajusta zoom.
- Abrir detalhes: editar título, responsável, descrição, notas, estado e evidências; adicionar/remover dependências. Executar abre o mesmo item no Scroll Task.
- Concluir registra DECLARED_DONE. VERIFIED exige evidência informada pelo usuário. Dependências FS aceitam conclusão declarada ou verificada. Agrupamentos exigem descendentes concluídos.
- WIP=1: apenas um item IN_PROGRESS. Para iniciar outro, conclua, adie ou altere o estado do anterior.
- Exportar/Importar: backup JSON com grafo e estado local. Importação valida estrutura e pede confirmação antes de substituir.
- Relatório: snapshot para impressão/Salvar como PDF pelo navegador.

## Dados e identidade
Conversão integral de 49 nós: 1 workflow, 8 fases, 13 tarefas, 27 ações. Preservados UUIDs, títulos, hierarquia, datas, prioridades, duração de planejamento, progresso original e criador em `source-metadata.json`. Criador não foi convertido em responsável. Preservadas 14 dependências FS explícitas; hierarquia não implica sequência. Datas exibidas em America/Sao_Paulo. Datas de planejamento não são estimativas do timer.

Aliases de `tokens.json` aplicados em CSS. Cores dos ramos vêm do tema do Xmind, sem significado de estado. Registro original incluído em `handoff/`, sem substituição de IDs.

## Persistência e limites
Dados salvos em localStorage, por navegador e origem. Sem sincronização entre dispositivos ou backend. Exportar backup antes de limpar dados do navegador ou mudar a origem. O timer usa timestamp de término e sobrevive ao recarregamento. Outra aba produz aviso/conflito; exporte o rascunho e recarregue para reconciliar.

Nenhum trigger, agente, skill, upload ou agendamento externo é executado pelo aplicativo. Esses títulos são itens do plano, executados e confirmados pelo usuário. Componentes especializados de execução de agentes e decisões não são simulados.

## Verificação
21 verificações de lógica passaram: dados convertidos, timer/pausa/expiração, bloqueios, conclusão/desfazer, WIP, persistência, conflitos, renderização gerada de mapa/lista e rejeição de ciclos, IDs duplicados, endpoints ausentes e verificação sem evidência. Schema JSON inicial validado. HTML e JavaScript verificados estruturalmente.

Verificação visual, teclado real, leitor de tela, instalação/offline em navegador e paginação impressa não foram executadas: ambiente sem Chromium instalado. Não há alegação de conformidade WCAG ou de teste em dispositivos. `VERIFICACAO.json` registra a evidência e os limites.
