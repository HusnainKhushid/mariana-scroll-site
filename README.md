# Mariana — Ocean Expeditions

Multi-layer parallax dive: a hero that descends through webp depth layers to a surface scene and a carousel. Built for the Scroll Sites marketplace, iframe-ready.

- `npm run dev` / `npm run build` → `dist/` (`BASE=/repo-name/` for GitHub Pages)

## Live URLs
- Vercel (primary): https://mariana-scroll-site.vercel.app
- GitHub Pages (mirror): https://husnainkhushid.github.io/mariana-scroll-site/

Both deploy on push to `main`. Vercel uses the Vite preset with no config; the Pages workflow sets `BASE`.

## For the coding agent
Section resources live in the marketplace workspace under `02-sections/mariana/`. Section ids: `01-hero 02-surface` (`data-section` attributes). The page posts `{ source:'scroll-site', type:'sections'|'section' }` to a parent frame and accepts `{ type:'scrollTo', id }`.
