# NEW CREATION HUBS — THE CREATION ENGINE
### AAA cinematic interactive landing experience — delivery report

**Tagline:** We Create. We Build. We Grow.
**Stack:** Next.js 14 (App Router, TypeScript) · React Three Fiber 8 · Three.js · GSAP · Tailwind CSS · Custom GLSL · Web Audio API · @react-three/postprocessing

---

## 1. What was built

A single continuous, scroll-driven 3D universe — not a website with animations,
but one world that keeps transforming while telling one story:

### Cinematic opening (first ~10 s, skippable, never blocking)
- **Scene A — Dormant Universe:** black void, faint dust, distant signal dot, slow camera advance.
- **Scene B — Activation:** radial energy burst (shader wave), particle surge, energy filaments drawing themselves, chromatic separation spike, single impact camera shake.
- **Scene C — Formation:** displaced-noise procedural core grows in, orbital rings spin up, 42 instanced orbiters begin traveling ring paths, wireframe shell materializes.
- **Scene D — Typography emergence:** `NEW / CREATION / HUBS` masked line reveal + letter-spacing settle (0.26em → tight), tagline + support copy staged rises.
- **Scene E — Living hero:** idle drift, pointer parallax on camera and scene, breathing energy, scroll cue. Skip-intro button, scroll-to-skip, auto-skip for reduced motion.

### Six scroll acts — one continuous universe
Scroll position maps to a continuous narrative phase (F = 0→12). Camera keyframes, engine
parameters, palettes, fog and particle formations all interpolate along F — so forward,
backward and fast scrolls are all continuous, with no hard cuts and no stuck states.

| Act | Scene behavior | Color state |
|---|---|---|
| I — Imagination | Core fragments outward (noise-driven vertex explosion), inner architecture (lattice lines) revealed | white-cyan |
| II — Design | Orbital rings flatten into inclined design planes, particles form layered construction grids | ultraviolet |
| III — Engineering | Rings tighten into a mechanism, 420-node lattice network with traveling light pulses | electric blue |
| IV — Intelligence | Neural branching connectome with synaptic pulses, responsive clusters | violet/teal + synapse pink |
| V — Growth | Camera pulls back, particles expand into a 4-arm spiral galaxy, orbital sync | amber/golden-white shift |
| VI — The Invitation | Complete engine state: halo torus + radiant core + far orbital ring, warm chord (if sound on) | cyan + amber |

### Five interactive service worlds (pinned sticky sequence)
Each with distinct DOM visual, interactive tab navigation (click scrolls the universe to
that world), per-service particle formation in 3D (screens grid · cortex · module lattice ·
prism monoliths · hub-and-spoke network), and a working CTA that pre-selects the service
in the contact form.

1. **Web & App Development** — stacked perspective screens with live skeleton UI
2. **AI Products & Solutions** — pulsing cortex rings + orbiting nodes
3. **SaaS & Software Products** — self-assembling modular tile grid
4. **Branding & Creative Design** — gradient type specimen + identity swatches
5. **Digital & Social Media Marketing** — hub-and-spoke distribution diagram

### Contact / CTA destinations (all functional)
- START A PROJECT (nav, finale) → contact section.
- Form: full client validation (name/email/message), then an **honest transmission state** —
  the page tells you it cannot send email itself and offers a prefilled `mailto:` brief +
  copy-to-clipboard. No fake "message sent" claims.

---

## 2. Technical architecture

```
src/
├── app/                    layout, page (metadata), globals.css, icon
├── lib/
│   ├── store.ts            segment model, camera/engine keys, palettes, shared uniforms, PRNG
│   ├── formations.ts       12 deterministic procedural particle formations
│   ├── shaders.ts          GLSL: morphing particles, displaced core, rings, pulse lines
│   └── audio.ts            fully synthesized sound layer (no assets)
├── components/
│   ├── Experience.tsx      orchestrator: scroll model, intro timeline, quality tiers, fallbacks
│   ├── scene/Universe.tsx  canvas root, camera rig, environment grading, effects, FPS guard
│   ├── scene/Particles.tsx morphing particle field (1 draw call)
│   ├── scene/Engine.tsx    core/rings/orbiters/filaments/networks/light
│   └── dom/                Chrome (nav/rail/menu/cursor/intro), Acts, Services, Contact, Magnetic
```

**Performance design:** per-frame work mutates shared uniforms only (zero React re-renders
in the render loop); ~13 draw calls total; formations precomputed once (seeded, cached);
attribute buffers reused during morphs (no GC churn); adaptive tiers from hardware signals
(cores/deviceMemory/pointer/viewport — not UA sniffing): 8k / 5k / 3.2k particles, DPR cap
1.5/1.25/1.0, bloom off on low tier; geometries/materials/textures disposed on unmount;
static CSS fallback when WebGL is missing or the context is lost.

**Accessibility:** semantic landmarks, one `h1`, keyboard-reachable controls with visible
focus, skip-to-content link, aria states on toggles/tabs/menu, `prefers-reduced-motion`
(skips intro, slows scene time 4×, removes shake/parallax/CSS motion), no scroll-jacking
—the page always scrolls natively.

**Sound (optional, off by default):** synthesized low-frequency ambient bed that adapts to
narrative position, activation pulse, per-act transition ticks, completion chord, UI blips.
Created only on explicit toggle gesture; suspends when the tab is hidden.

---

## 3. Verification performed (Playwright + Chromium/SwiftShader)

| Test | Result |
|---|---|
| Production build (`next build`) | ✓ compiles, 0 type errors |
| Runtime console/page errors (full journey) | ✓ none |
| All 9 segments render | ✓ hero→contact present |
| Scroll forward through all acts | ✓ screenshots 01–90 |
| Scroll backward | ✓ scene + typography re-form correctly |
| Fast random scrolling stress | ✓ no stuck states, no errors |
| Resize stress (1440↔900 viewports) | ✓ survived |
| Horizontal overflow (desktop + mobile 390px) | ✓ 0 px |
| Keyboard Tab reachability | ✓ focus lands on controls |
| Skip intro | ✓ jumps to living hero |
| Reduced-motion emulation (mobile ctx) | ✓ intro auto-skipped, content readable |
| Mobile menu open/close | ✓ (bug found & fixed: header z-index) |
| Sound toggle | ✓ AudioContext starts, aria-pressed correct |
| Service CTA → form prefill | ✓ "SaaS & Software Products" selected |
| Form validation | ✓ 3 errors surfaced on empty submit |
| Form submit | ✓ honest ready-state + working mailto/clipboard |

**Not verified in sandbox:** real-GPU frame rates (SwiftShader software rendering used —
on typical hardware the ~13-draw-call scene is light), actual audible output (engine is
code-verified, starts muted by design), iOS Safari hardware.

**Known limitations / trade-offs:**
- Volumetric light is faked with additive gradient sprites (true volumetrics are beyond a
  landing-page budget); reads as soft shafts in motion.
- 3D typography uses high-quality DOM text composited over the scene instead of extruded
  geometry — chosen for readability and accessibility.
- Contact delivers via the visitor's own mail client by design (no backend in this env).

## 4. Run it

```bash
npm install
npm run build && npm start   # production on :3000
# or: npm run dev
```
