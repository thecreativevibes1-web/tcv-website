'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { store, ACT_LABELS, SegmentId } from '@/lib/store';
import { audio } from '@/lib/audio';
import Magnetic from './Magnetic';

/* ------------------------------- cursor -------------------------------- */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches || store.reduced) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');
    let rx = innerWidth / 2, ry = innerHeight / 2, tx = rx, ty = ry, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest?.('a,button,[role="button"],input,textarea,select,[data-cursor]');
      ring.current?.setAttribute('data-hover', t ? 'true' : 'false');
    };
    const loop = () => {
      rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} aria-hidden className="cursor-dot" />
      <div ref={ring} aria-hidden className="cursor-ring" data-hover="false" />
    </>
  );
}

/* ------------------------------ sound toggle --------------------------- */
function SoundToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      onClick={() => {
        const next = !on;
        setOn(next);
        store.sound = next;
        audio.toggle(next);
        if (next) audio.uiTick();
      }}
      className="group flex h-9 items-center gap-2 rounded-full border border-white/15 px-3 font-mono text-[10px] tracking-widest2 text-white/70 transition hover:border-cyanic/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`sound-bar ${on ? 'sound-bar-on' : ''}`} style={{ animationDelay: `${i * 0.14}s` }} />
        ))}
      </span>
      {on ? 'SOUND ON' : 'SOUND OFF'}
    </button>
  );
}

/* ------------------------------ mobile menu ---------------------------- */
const MENU_LINKS: { label: string; seg: SegmentId }[] = [
  { label: 'ORIGIN', seg: 'hero' },
  { label: 'IMAGINATION', seg: 'act1' },
  { label: 'DESIGN', seg: 'act2' },
  { label: 'ENGINEERING', seg: 'act3' },
  { label: 'INTELLIGENCE', seg: 'act4' },
  { label: 'GROWTH', seg: 'act5' },
  { label: 'CAPABILITIES', seg: 'svc0' },
  { label: 'THE INVITATION', seg: 'act6' },
  { label: 'START A PROJECT', seg: 'contact' },
];

export function goToSegment(seg: SegmentId, frac = 0.5) {
  const m = store.msr.find((x) => x.id === seg);
  if (!m) return;
  const local = 0.08 + Math.min(0.99, frac / m.span) * 0.84;
  const y = m.top + local * Math.max(1, m.height - window.innerHeight);
  window.scrollTo({ top: y, behavior: store.reduced ? 'auto' : 'smooth' });
  const el = document.querySelector(`[data-seg-anchor="${seg}"]`);
  if (el instanceof HTMLElement) el.focus({ preventScroll: true });
}

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-void/95 px-8 pb-10 pt-28 backdrop-blur-xl transition-all duration-500 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!open}
    >
      <nav aria-label="Main">
        <ul className="space-y-1">
          {MENU_LINKS.map((l, i) => (
            <li
              key={l.seg + l.label}
              style={{ transitionDelay: `${open ? 60 + i * 40 : 0}ms` }}
              className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => { goToSegment(l.seg); onClose(); }}
                className="group flex w-full items-baseline gap-4 border-b border-white/5 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
              >
                <span className="font-mono text-[10px] text-cyanic/70">{String(i).padStart(2, '0')}</span>
                <span className="font-display text-3xl font-light tracking-wide text-white/80 transition group-hover:pl-2 group-hover:text-cyanic">
                  {l.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <p className="font-mono text-[10px] tracking-widest2 text-white/40">NEW CREATION HUBS — WE CREATE. WE BUILD. WE GROW.</p>
    </div>
  );
}

/* --------------------------------- chrome ------------------------------ */
export default function Chrome() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const [activeRail, setActiveRail] = useState<SegmentId>('hero');

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${store.progress})`;
      setScrolled(store.progress > 0.004);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const unsub = store.on((evt, data) => {
      if (evt === 'seg') setActiveRail(data as SegmentId);
    });
    return () => { cancelAnimationFrame(raf); unsub(); };
  }, []);

  const railGo = useCallback((seg: SegmentId) => goToSegment(seg), []);

  return (
    <>
      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-cyanic focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to contact
      </a>

      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-[2px] bg-white/5" aria-hidden>
        <div ref={bar} className="h-full origin-left bg-gradient-to-r from-cyanic via-ultra to-amberglow" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* top bar */}
      <header
        className={`fixed inset-x-0 top-0 z-[55] flex items-center justify-between px-5 py-4 transition-all duration-500 md:px-10 ${
          scrolled ? 'bg-void/55 backdrop-blur-md' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => railGo('hero')}
          className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
          aria-label="New Creation Hubs — back to origin"
        >
          <span className="grid h-8 w-8 place-items-center border border-cyanic/50 font-mono text-[11px] font-bold text-cyanic transition group-hover:shadow-[0_0_18px_rgba(77,232,255,0.45)]">
            N
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest2 text-white/70 sm:block">
            NEW CREATION HUBS
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <SoundToggle />
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => railGo('contact')}
              className="hidden rounded-full border border-cyanic/60 bg-cyanic/10 px-5 py-2 font-mono text-[10px] tracking-widest2 text-cyanic transition hover:bg-cyanic hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic md:block"
            >
              START A PROJECT
            </button>
          </Magnetic>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-cyanic/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition ${menuOpen ? 'top-1/2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1/2 h-px w-full bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-full h-px w-full bg-current transition ${menuOpen ? 'top-1/2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* act rail */}
      <nav aria-label="Narrative progress" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ul className="space-y-4">
          {ACT_LABELS.map((a) => {
            const active = activeRail === a.id || (a.id === 'act6' && activeRail === 'svc4');
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => railGo(a.id)}
                  aria-label={`Go to ${a.label}`}
                  aria-current={active ? 'true' : undefined}
                  className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
                >
                  <span
                    className={`block h-px transition-all duration-500 ${active ? 'w-8 bg-cyanic shadow-[0_0_8px_rgba(77,232,255,0.8)]' : 'w-4 bg-white/25 group-hover:bg-white/60'}`}
                    aria-hidden
                  />
                  <span
                    className={`font-mono text-[9px] tracking-widest2 transition-all duration-500 ${
                      active ? 'text-cyanic opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {a.num} · {a.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Cursor />
    </>
  );
}

/* --------------------------- intro overlay ------------------------------ */
const BOOT_LINES = [
  'SIGNAL ACQUIRED — LISTENING',
  'WAKING PARTICLE FIELD',
  'ENERGY RELEASE CONFIRMED',
  'ASSEMBLING CREATION ENGINE',
  'COMPOSING IDENTITY',
];

export function IntroOverlay() {
  const [stage, setStage] = useState(0);
  const [gone, setGone] = useState(false);
  const pct = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = store.on((evt, data) => {
      if (evt === 'stage') {
        const s = data as number;
        setStage(s);
        if (s >= 5) setTimeout(() => setGone(true), 900);
      }
    });
    let raf = 0;
    const loop = () => {
      const p = Math.round(store.introT * 100);
      if (pct.current) pct.current.textContent = String(p).padStart(3, '0');
      if (fill.current) fill.current.style.transform = `scaleX(${store.introT})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { unsub(); cancelAnimationFrame(raf); };
  }, []);

  if (gone) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-void transition-opacity duration-700 ${
        stage >= 4 ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={stage >= 4}
    >
      {/* the signal dot */}
      <div className={`signal-dot ${stage >= 1 ? 'signal-dot-live' : ''} ${stage >= 2 ? 'signal-dot-burst' : ''}`} aria-hidden />

      <div className="absolute bottom-10 left-1/2 w-64 -translate-x-1/2 md:w-80">
        <div className="mb-3 flex items-baseline justify-between font-mono text-[10px] tracking-widest2 text-white/50">
          <span>{BOOT_LINES[Math.min(stage, BOOT_LINES.length - 1)]}</span>
          <span className="text-cyanic">
            <span ref={pct}>000</span>%
          </span>
        </div>
        <div className="h-px w-full bg-white/10">
          <div ref={fill} className="h-full origin-left bg-cyanic shadow-[0_0_12px_rgba(77,232,255,0.9)]" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => store.emit('skip-intro')}
        className="absolute bottom-10 right-6 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-widest2 text-white/60 transition hover:border-cyanic/60 hover:text-cyanic focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic md:right-10"
      >
        SKIP INTRO →
      </button>
    </div>
  );
}

/* --------------------------- scroll indicator --------------------------- */
export function ScrollCue() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setShow(store.introDone && store.progress < 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      aria-hidden
      className={`fixed bottom-8 left-1/2 z-30 -translate-x-1/2 transition-all duration-700 ${show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] tracking-widest2 text-white/50">SCROLL TO ENTER THE ENGINE</span>
        <span className="scroll-line" />
      </div>
    </div>
  );
}
