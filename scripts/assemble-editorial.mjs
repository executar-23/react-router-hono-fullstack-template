import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../public/executar-editorial/', import.meta.url));
const read = name => readFileSync(source + name, 'utf8');
const app = read('app.js').replace('/* __RENDERERS__ */', read('ui/renderers.js'))
  .replace('/* __INTERACTIONS__ */', read('ui/interactions.js'));
const html = read('shell.html').replace('__CSS__', read('app.css') + '\n' + read('ui/flow.css'))
  .replace('__SEED__', read('seed.js')).replace('__FLOW__', read('ui/flow.js')).replace('__APP__', app);
writeFileSync(source + 'index.html', html);
