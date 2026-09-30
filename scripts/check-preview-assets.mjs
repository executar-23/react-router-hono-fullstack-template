import { previewAssets } from './preview-assets.mjs';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist-preview');
const expected = ['_headers', 'index.html', ...previewAssets.map(name => `executar-editorial/${name}`)].sort();
function list(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? list(join(dir, entry.name), `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`]);
}
assert.deepEqual(list(output).sort(), expected, 'O deploy deve conter apenas os assets permitidos.');
for (const name of expected) assert(readFileSync(join(output, name)).length, `Asset vazio: ${name}`);
const config = JSON.parse(readFileSync(join(root, 'wrangler.jsonc'), 'utf8'));
assert.equal(config.assets.directory, './dist-preview');
assert.equal(config.assets.not_found_handling, '404-page');
assert.equal(config.build, undefined, 'Workers Builds usa o comando de build configurado no painel.');
const manifest = JSON.parse(readFileSync(join(output, 'executar-editorial/manifest.webmanifest'), 'utf8'));
for (const resource of [manifest.start_url, ...manifest.icons.map(icon => icon.src)]) {
  const path = new URL(resource, 'https://example.test/executar-editorial/').pathname.slice(1);
  assert(expected.includes(path), `URL PWA sem arquivo publicado: ${path}`);
}
const html = readFileSync(join(output, 'executar-editorial/index.html'), 'utf8');
const sw = readFileSync(join(output, 'executar-editorial/sw.js'), 'utf8');
assert.match(sw, /executar-editorial-[a-f0-9]{16}/, 'Cache PWA precisa identificar o conteúdo publicado.');
assert.match(html, /register\('\.\/sw.js'\)/, 'SW precisa permanecer no escopo editorial.');
assert.match(readFileSync(join(output, '_headers'), 'utf8'), /\/executar-editorial\/sw\.js\n  Cache-Control: no-cache/);
const graph = JSON.parse(readFileSync(join(output, 'executar-editorial/graph.json'), 'utf8'));
assert.equal(graph.nodes.length, 49);
assert.equal(graph.edges.filter(edge => edge.relation === 'dependency').length, 14);
console.log('Assets: allowlist, escopo PWA, URLs, cache de release e configuração de publicação PASS.');
