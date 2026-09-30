import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'public/executar-editorial');
const output = join(root, 'dist-preview');
const required = ['index.html', 'sw.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'graph.json', 'source-metadata.json'];
for (const file of required) if (!existsSync(join(source, file))) throw new Error(`Arquivo ausente: ${file}`);
const manifest = JSON.parse(readFileSync(join(source, 'manifest.webmanifest'), 'utf8'));
if (manifest.scope !== './') throw new Error('O service worker deve ficar isolado no diretório editorial.');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const file of required) cpSync(join(source, file), join(output, 'executar-editorial', file), { recursive: true });
writeFileSync(join(output, 'index.html'), '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./executar-editorial/index.html"><title>EXECUTAR · Preview local</title></head><body><a href="./executar-editorial/index.html">Abrir EXECUTAR</a></body></html>');
// Evita que um build fullstack anterior redirecione Wrangler para a configuração antiga.
rmSync(join(root, '.wrangler/deploy/config.json'), { force: true });
console.log('Preview estático pronto em dist-preview. Nenhuma env, instalação npm ou serviço externo utilizado.');
