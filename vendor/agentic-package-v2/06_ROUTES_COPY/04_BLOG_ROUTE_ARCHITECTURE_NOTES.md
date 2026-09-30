# Blog Route Architecture — Current Stack Notes

ID: BLOG-ROUTE-ARCH-001
VERSION: 1.0.0

## Repo state observed
Repository: Sas-Executar/executar-Blog.
Current stack: Astro 7 + Starlight + Tailwind 4 + @executar/theme + @executar/ui + Cloudflare Workers.
Current route middleware disables Starlight sidebar/TOC globally for showroom shell.
Current canonical color source: packages/theme/src/cores.css.
Current UI primitives found in apps/blog/src/components/ui include Botao, Campo, CartaoTransacional, Chip, DicaGuiada, Lancador, Marca, Rotulo, Selo etc.

## Route plan
/ institutional hub
/blog/ editorial index
/blog/categoria/[slug]/ categories
article route from vault/current routing (verify actual URL; do not invent)
/oficinas/ + /oficinas/[slug]/
/mapa-cognitivo/
/loja/ + skills/agentes/prompts/ebooks/pdfs/workbooks/html/assets + detail
/explorar /buscar /perguntar /salvos /preferencias existing
/guia-de-estilo/ technical/internal

## Home rule
RECONTENT + REMAP. Do not remove existing sections, pricing, functionality, cards or useful components. Update copy, identity, imagery, CTA targets, naming and area markers.

## Color governance conflict
Current ADR-019/cores.css declares blue as single accent. New area-marker palette (yellow editorial, green skills, orange workshops, purple map, pink store, etc.) requires a documented ADR addendum/new token strategy; do not silently reuse status colors.

## Deployment caveat
The public workers.dev URL supplied appeared to correspond to a template/deployment different from the connected repo main/worker naming. Verify deployment↔repo relationship before production overwrite.
