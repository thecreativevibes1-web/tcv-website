# New Creation Hubs — Creation Engine Landing Experience

A cinematic, scroll-driven 3D landing experience for **New Creation Hubs (NCH)** —
*We Create. We Build. We Grow.*

One continuous WebGL universe (procedural core, morphing particle formations, orbital
rings, engineered networks) carries six narrative acts — Imagination, Design,
Engineering, Intelligence, Growth, The Invitation — plus five interactive service
worlds and a working project-inquiry form. Includes a skippable 10-second opening
cinematic, scroll choreography (bidirectionally safe), reduced-motion support,
WebGL fallback, an optional synthesized sound layer, and adaptive quality tiers.

## Stack

- **Next.js 14** (App Router, TypeScript, static-prerendered page)
- **React Three Fiber 8** + **Three.js** + custom **GLSL** shaders
- **GSAP 3** — intro cinematic timeline
- **@react-three/postprocessing** — bloom / chromatic aberration / vignette
- **Tailwind CSS 3**
- **Web Audio API** — synthesized ambience (no audio assets)

## Requirements

- Node.js **≥ 18.18** (Node 20 recommended)
- npm 9+
- **Network access during the first build** — `next/font/google` downloads the
  self-hosted fonts (Space Grotesk, Inter, IBM Plex Mono) at build time, then caches them.

## Install & run

```bash
npm ci          # install from the lockfile (recommended)
# or: npm install

npm run dev     # development server  → http://localhost:3000
```

## Production

```bash
npm run build   # production build → .next/
npm start       # serve the production build → http://localhost:3000
```

## Environment variables

**None required.** The site is fully client-side; the contact form delivers via the
visitor's own email client (prefilled `mailto:` brief + copy-to-clipboard) by design —
no silent backend, no fake "sent" state. See `.env.example` for optional future hooks.

## Deploy to Netlify

This is a standard Next.js 14 project — deploy as-is (do **not** use static export;
the Netlify Next.js runtime handles everything):

1. Push this folder to a Git repo (or drag-and-drop the folder in Netlify).
2. Netlify auto-detects Next.js. `netlify.toml` is already included:
   - build command: `npm run build`
   - publish: `.next`
   - plugin: `@netlify/plugin-nextjs`
   - `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` (skips the optional test-browser download)
   - `NODE_VERSION=20`
3. No environment variables need to be configured.

### Optional: pure static hosting
Every route is client-rendered/prerendered, so `output: 'export'` is *technically*
possible — but it is **not recommended or preconfigured**: it would drop the Next.js
runtime features, future API routes (e.g. a real contact endpoint) and image/font
optimisation. Deploy with the Netlify Next.js runtime instead.

## Project structure

```
nch/
├── src/
│   ├── app/                  layout, page, globals.css, icon.svg
│   ├── lib/                  store/choreography model · formations · GLSL · audio engine
│   └── components/
│       ├── Experience.tsx    scroll model, intro timeline, quality tiers, fallbacks
│       ├── scene/            Universe (rig/effects) · Particles · Engine
│       └── dom/              Chrome (nav/rail/menu/cursor) · Acts · Services · Contact
├── scripts/                  Playwright verification suites (dev only)
├── netlify.toml              Netlify deploy config
├── REPORT.md                 build + verification report
└── package.json / package-lock.json
```

## Verification scripts (optional, dev only)

Headless-browser checks used during development (requires `npx playwright install chromium`):

```bash
node scripts/verify.mjs    # full journey + screenshots → shots/
node scripts/verify2.mjs   # mobile, reduced-motion, forms, interactions
```

They are not part of the production build. To install dependencies without the
Playwright browser download: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci`.

## Notes

- All visuals are procedural (shaders + math) — there are no image/texture assets to ship.
- For the full feature/verification matrix see `REPORT.md`.
