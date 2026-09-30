# Brand + Web Artifact Technical Override

ID: WF-ASSET-STORE-PILOT-001
VERSION: 1.1.0
CHANGE_TYPE: DESIGN_AND_TECHNICAL_OVERRIDE

## Priority
PROJECT DESIGN CONTRACT > PROJECT BRAND OVERRIDE > /Brand Guidelines > REFERENCE MOCKUPS > DEFAULT COMPONENT STYLES.

## Brand skill usage
Usar typography/readability/spacing/shape/fallback/font discipline da Brand Guidelines, mas substituir a paleta padrão pelo sistema semântico EXECUTAR e usar a hierarquia visual XMind como referência de composição.

## EXECUTAR semantic tokens
Human #C2410C; Orchestrator #6D28D9; Phase #1D4ED8; Deliverable #15803D; Subdeliverable #14532D; Platform #BE185D; Agent #B91C1C; ID #FACC15/#111; Format #171717; Skill #0E7490; Tool #4B5563; neutrals white/gray/ink.

## Technical requirements from Web Artifact Builder
- React 18
- TypeScript
- Vite
- Tailwind CSS 3.4.1
- shadcn/ui
- Radix UI
- Parcel standalone bundle
- HTML/CSS
- Shadow DOM only when real style isolation/embedding requires it
- Web Components only when portability has concrete value
- JS/DOM for integration/runtime where appropriate

## Anti-slop
No purple gradients, centered-everything, giant rounded cards, excessive pills, glass, blobs, generic SaaS hero, icon overload, decorative metrics.

## Important later correction
Para o BLOG DE PRODUÇÃO, prevalece o stack real do repositório: Astro/Starlight/Tailwind4/@executar/theme/@executar/ui/Cloudflare. React/Vite builder é protótipo isolado, não migração do site existente.
