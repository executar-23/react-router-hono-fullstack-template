# UI do blog → EXECUTAR PWA

Origem: `executar-23/Risco-cognitivo-blog`, commit `11f78e42a9c10df077b50c169b05ec4da7718f68`.
O inventário em `ui-blog-migration.json` documenta 69 arquivos: componentes ui/plain, utilitário, tokens e quatro fontes locais. 68 já eram idênticos no template. A única adaptação do sidebar é o import TypeScript de `VariantProps` como tipo. Os componentes React continuam em `app/components`; a PWA usa um adaptador HTML/CSS sem dependências de runtime.

`public/executar-editorial/ui/blog-ui.css` transporta os tokens de `src/styles/global.css`, sem diretivas do compilador Tailwind. As fontes DM Sans são locais e entram na allowlist de deploy e no cache offline. `ui/flow.css` implementa os tokens geométricos fornecidos; `ui/flow.js` expõe nós, colunas, cabeçalhos, badges, conectores, junctions e trunks como primitivas reutilizáveis.

## Uso

`npm run dev` inicia o preview Python em `http://localhost:8080/`. `npm run build` monta o HTML a partir de shell, seed, CSS, primitivas e interações e publica somente os assets permitidos em `dist-preview`. Não há `.env`, banco, login ou serviços externos.

Scroll Task tem filtro de fase/granularidade, notas, edição, conclusão manual e timer. Rolar ou deslizar a tela mantém a ação atual. Uma sessão de foco permanece ligada ao seu item durante a navegação; Encerrar libera WIP=1. O relatório pode ser impresso e o plano completo pode ser exportado/importado como JSON.

Plano mental abre uma fase, com nós fixos de 300px. Clique no cabeçalho para expandir detalhes. Nos nós expandidos, Recolher/Expandir controla descendentes. A visão Dependências usa pré-requisitos à esquerda, item central e bindings à direita. Apenas relações FS explícitas recebem setas; a hierarquia não cria precedência.

O grafo mantém sua geometria no celular: o canvas tem rolagem horizontal nativa. No desktop, também aceita arrastar o fundo. Centralizar restaura 100% sem reduzir todos os 49 nós a texto ilegível. Edição não altera a tarefa nem o escopo de execução.

## Contrato e verificação

- Dados: mesmos 49 IDs, 48 relações de hierarquia e 14 dependências; chave `executar-editorial-v1` preservada.
- Componentes e estados: `ui/flow.types.ts`; detalhes/seleção separados dos dados do plano.
- `npm run check`: domínio e assets. CI acrescenta Chromium desktop/mobile, edição, timer, backup, cache offline, largura fixa e trunks; screenshots e resultado no artifact `editorial-ui-verification`.
- `npm run check:wrangler`: empacotamento real, sem deploy remoto nem credenciais.

Publicação segue Workers Static Assets: `assets.directory=./dist-preview`, sem Worker backend nem bindings. Referências: https://developers.cloudflare.com/workers/static-assets/ e https://developers.cloudflare.com/workers/static-assets/binding/ . A verificação do navegador segue https://playwright.dev/docs/ci .
