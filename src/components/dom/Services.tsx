'use client';
import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { audio } from '@/lib/audio';
import Magnetic from './Magnetic';
import { goToSegment } from './Chrome';

interface Service {
  id: string;
  num: string;
  title: string;
  kicker: string;
  desc: string;
  deliver: string;
  visual: 'web' | 'ai' | 'saas' | 'brand' | 'growth';
  hue: string;
}

export const SERVICES: Service[] = [
  {
    id: 'web', num: 'W.01', title: 'Web & App Development', kicker: 'INTERFACES PEOPLE FEEL',
    desc: 'Websites and applications engineered like instruments — responsive, fast and built to convert attention into action.',
    deliver: 'MARKETING SITES · WEB APPS · E-COMMERCE · CMS PLATFORMS',
    visual: 'web', hue: '#4de8ff',
  },
  {
    id: 'ai', num: 'W.02', title: 'AI Products & Solutions', kicker: 'SYSTEMS THAT LEARN',
    desc: 'Applied AI assistants, intelligent search, automation pipelines and decision systems — designed around your data, not slideware.',
    deliver: 'AI ASSISTANTS · RAG SEARCH · WORKFLOW AUTOMATION · ANALYTICS',
    visual: 'ai', hue: '#37f2d8',
  },
  {
    id: 'saas', num: 'W.03', title: 'SaaS & Software Products', kicker: 'NAPKIN SKETCH TO PLATFORM',
    desc: 'We architect, design and build multi-tenant SaaS products that survive real users, real load and real growth.',
    deliver: 'MVP BUILDS · PLATFORM ENGINEERING · API SYSTEMS · INTEGRATIONS',
    visual: 'saas', hue: '#3f8cff',
  },
  {
    id: 'brand', num: 'W.04', title: 'Branding & Creative Design', kicker: 'IDENTITIES WITH GRAVITY',
    desc: 'Naming, visual systems, art direction and motion — brands engineered to be remembered, not just recognized.',
    deliver: 'IDENTITY SYSTEMS · ART DIRECTION · MOTION DESIGN · DESIGN SYSTEMS',
    visual: 'brand', hue: '#c77dff',
  },
  {
    id: 'growth', num: 'W.05', title: 'Digital & Social Marketing', kicker: 'DISTRIBUTION BY DESIGN',
    desc: 'Content engines, social systems and growth loops that turn a launch into momentum — and momentum into market position.',
    deliver: 'CONTENT SYSTEMS · SOCIAL OPERATIONS · CAMPAIGNS · GROWTH ANALYTICS',
    visual: 'growth', hue: '#ffb454',
  },
];

/* ------------------------- distinctive mini-visuals ---------------------- */
function Visual({ kind, hue }: { kind: Service['visual']; hue: string }) {
  switch (kind) {
    case 'web':
      return (
        <div className="sv-web" style={{ ['--hue' as string]: hue }} aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="sv-screen" style={{ ['--i' as string]: i }}>
              <span className="sv-bar" style={{ width: '38%' }} />
              <span className="sv-bar" style={{ width: '72%' }} />
              <span className="sv-bar" style={{ width: '55%' }} />
              <span className="sv-dot-row"><i /><i /><i /></span>
            </div>
          ))}
        </div>
      );
    case 'ai':
      return (
        <div className="sv-ai" style={{ ['--hue' as string]: hue }} aria-hidden>
          {[0, 1, 2, 3].map((i) => <span key={i} className="sv-ring" style={{ ['--i' as string]: i }} />)}
          {[0, 1, 2, 3, 4, 5].map((i) => <span key={`n${i}`} className="sv-node" style={{ ['--a' as string]: `${i * 60}deg` }} />)}
          <span className="sv-core" />
        </div>
      );
    case 'saas':
      return (
        <div className="sv-saas" style={{ ['--hue' as string]: hue }} aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="sv-tile" style={{ ['--i' as string]: i }} />
          ))}
        </div>
      );
    case 'brand':
      return (
        <div className="sv-brand" style={{ ['--hue' as string]: hue }} aria-hidden>
          <span className="sv-aa">Aa</span>
          <span className="sv-swatches">
            {['#03040a', hue, '#ffb454', '#f2ede4'].map((c) => <i key={c} style={{ background: c }} />)}
          </span>
        </div>
      );
    case 'growth':
      return (
        <div className="sv-growth" style={{ ['--hue' as string]: hue }} aria-hidden>
          <span className="sv-hub" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="sv-spoke" style={{ ['--a' as string]: `${i * 45}deg` }}><i /></span>
          ))}
        </div>
      );
  }
}

/* --------------------------------- section ------------------------------- */
export default function Services() {
  const [active, setActive] = useState(0);
  useEffect(
    () =>
      store.on((evt, data) => {
        if (evt === 'svc') setActive(data as number);
      }),
    []
  );
  const s = SERVICES[active];

  return (
    <section
      data-seg="svc0"
      data-span="5"
      className="relative h-[430vh]"
      aria-label="Five worlds of creation — our capabilities"
    >
      <span data-seg-anchor="svc0" tabIndex={-1} className="absolute left-0 top-1/2 outline-none" aria-hidden />
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,4,10,0.92)_0%,rgba(3,4,10,0.68)_34%,rgba(3,4,10,0.28)_62%,rgba(3,4,10,0.55)_100%)]" />
        {/* giant background word */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[6vh] select-none overflow-hidden">
          <div key={s.id} className="sv-bgword whitespace-nowrap font-display text-[13vw] font-light leading-none text-transparent">
            {s.title.toUpperCase()}
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          {/* left: world selector */}
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-widest2 text-cyanic md:text-xs">
              FIVE WORLDS OF CREATION
            </p>
            <p className="mb-8 font-mono text-[10px] tracking-widest2 text-white/35">
              CAPABILITIES // REAL SERVICES — NO FICTION
            </p>
            <ul className="space-y-1" role="tablist" aria-label="Services">
              {SERVICES.map((w, i) => (
                <li key={w.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => { goToSegment('svc0', i + 0.5); audio.uiTick(); }}
                    className={`group flex w-full items-baseline gap-4 border-b py-3 text-left transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic ${
                      i === active ? 'border-cyanic/40 pl-2' : 'border-white/8 hover:pl-1'
                    }`}
                  >
                    <span className={`font-mono text-[9px] tracking-widest2 ${i === active ? 'text-cyanic' : 'text-white/30'}`}>{w.num}</span>
                    <span
                      className={`font-display text-xl font-light tracking-wide transition-colors duration-500 sm:text-2xl md:text-[1.7rem] ${
                        i === active ? 'text-warmwhite' : 'text-white/35 group-hover:text-white/70'
                      }`}
                    >
                      {w.title}
                    </span>
                    <span className={`ml-auto hidden font-mono text-[9px] tracking-widest2 transition-opacity sm:block ${i === active ? 'text-cyanic opacity-100' : 'opacity-0'}`}>
                      ACTIVE
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* right: living card */}
          <div key={s.id} className="sv-card relative rounded-2xl border border-white/10 bg-void/80 p-7 backdrop-blur-md md:p-9" data-cursor>
            <Visual kind={s.visual} hue={s.hue} />
            <p className="mt-8 font-mono text-[10px] tracking-widest2" style={{ color: s.hue }}>
              {s.kicker}
            </p>
            <h3 className="mt-3 font-display text-2xl font-light text-warmwhite md:text-3xl">{s.title}</h3>
            <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/60">{s.desc}</p>
            <p className="mt-5 font-mono text-[9px] leading-relaxed tracking-widest2 text-white/40">{s.deliver}</p>
            <div className="mt-7 flex items-center gap-4">
              <Magnetic strength={0.22}>
                <button
                  type="button"
                  onClick={() => {
                    store.pendingService = active;
                    store.emit('svc-pick', active);
                    goToSegment('contact', 0.45);
                  }}
                  className="rounded-full px-6 py-3 font-mono text-[10px] font-bold tracking-widest2 text-void transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanic"
                  style={{ background: s.hue }}
                >
                  START THIS BUILD →
                </button>
              </Magnetic>
              <span className="font-mono text-[9px] tracking-widest2 text-white/30">
                {String(active + 1).padStart(2, '0')} / 05
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
