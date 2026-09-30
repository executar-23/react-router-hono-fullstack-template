import './assemble-editorial.mjs';
import { previewAssets } from './preview-assets.mjs';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'public/executar-editorial');
const output = join(root, 'dist-preview');
const required = previewAssets;
for (const file of required) {
  if (!existsSync(join(source, file))) throw new Error(`Arquivo ausente: ${file}`);
}
const manifest = JSON.parse(readFileSync(join(source, 'manifest.webmanifest'), 'utf8'));
if (manifest.scope !== './') throw new Error('O service worker deve ficar isolado no diretório editorial.');

// Uma nova versão dos assets precisa mudar os bytes do SW para invalidar o cache antigo.
const hash = createHash('sha256');
for (const file of required) hash.update(file).update(readFileSync(join(source, file)));
const release = hash.digest('hex').slice(0, 16);
const sw = readFileSync(join(source, 'sw.js'), 'utf8');
const cachePattern = /const CACHE=['"]executar-editorial-[^'"]+['"]/;
if (!cachePattern.test(sw)) throw new Error('Marcador de cache do service worker ausente.');

rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, 'executar-editorial'), { recursive: true });
for (const file of required) { const dest = join(output, 'executar-editorial', file); mkdirSync(join(dest, '..'), {recursive:true}); cpSync(join(source, file), dest); }
writeFileSync(join(output, 'executar-editorial/sw.js'), sw.replace(cachePattern, `const CACHE='executar-editorial-${release}'`));
writeFileSync(join(output, 'index.html'), '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./executar-editorial/index.html"><title>EXECUTAR · Preview local</title></head><body><a href="./executar-editorial/index.html">Abrir EXECUTAR</a></body></html>');
writeFileSync(join(output, '_headers'), `/\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n/executar-editorial/\n  Cache-Control: no-cache\n/executar-editorial/index.html\n  Cache-Control: no-cache\n/executar-editorial/sw.js\n  Cache-Control: no-cache\n/executar-editorial/manifest.webmanifest\n  Cache-Control: no-cache\n`);
console.log(`Preview estático pronto em dist-preview (release ${release}). Sem env ou serviços externos.`);
