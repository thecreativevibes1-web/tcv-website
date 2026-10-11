'use client';
import { Component, ErrorInfo, ReactNode, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { store, uni, SEG_IDX, SEGMENTS, SegmentId } from '@/lib/store';
import { audio } from '@/lib/audio';
import Universe from './scene/Universe';
import Chrome, { IntroOverlay, ScrollCue } from './dom/Chrome';
import { ActsOpening, Finale } from './dom/Acts';
import Services from './dom/Services';
import Contact from './dom/Contact';

/* --------------------------- static fallback bg ------------------------- */
function StaticBG({ notice }: { notice?: boolean }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-void" aria-hidden>
      <div className="static-orb static-orb-1" />
      <div className="static-orb static-orb-2" />
      <div className="static-orb static-orb-3" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,4,10,0.85)_75%)]" />
      {notice && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-void/70 px-4 py-2 font-mono text-[9px] tracking-widest2 text-white/45 backdrop-blur">
          3D UNIVERSE UNAVAILABLE — STATIC FIELD ACTIVE
        </p>
      )}
    </div>
  );
}

/* ------------------------------ error boundary -------------------------- */
class GLBoundary extends Component<{ children: ReactNode; onFail: () => void }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(_: Error, __: ErrorInfo) { this.props.onFail(); }
  render() { return this.state.err ? null : this.props.children; }
}

function probeWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { return false; }
}

/* -------------------------------- experience ---------------------------- */
export default function Experience() {
  const [webgl] = useState<boolean>(() => probeWebGL());
  const [glAlive, setGlAlive] = useState(true);
  const targetF = useRef(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const ready = useRef(false);

  /* quality tier from real hardware signals (not UA strings) */
  useState(() => {
    if (typeof window === 'undefined') return;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
    const coarse = window.matchMedia('(pointer:coarse)').matches;
    const small = Math.min(window.innerWidth, window.innerHeight) < 760;
    if ((coarse && small) || cores <= 4 || mem <= 4) {
      store.quality = { tier: 1, dpr: 1.25, particles: 5000, bloom: true };
    }
    if ((coarse && small && cores <= 6) || mem <= 3) {
      store.quality = { tier: 0, dpr: 1, particles: 3200, bloom: false };
    }
  });

  useEffect(() => {
    store.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!webgl) store.webgl = false;

    /* ---- measure sections → segment ranges ---- */
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-seg]'));
      store.msr = els
        .map((el) => ({
          id: el.getAttribute('data-seg') as SegmentId,
          span: Number(el.getAttribute('data-span') || 1),
          top: el.offsetTop,
          height: el.offsetHeight,
        }))
        .sort((a, b) => a.top - b.top);
    };
    measure();
    const rime = setTimeout(measure, 400);
    const rime2 = setTimeout(measure, 1500);
    document.fonts?.ready.then(measure).catch(() => {});
    let rto = 0 as unknown as ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rto); rto = setTimeout(measure, 140); };
    addEventListener('resize', onResize);

    /* ---- scroll choreography ---- */
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - innerHeight;
      const y = scrollY;
      store.progress = docH > 0 ? Math.min(1, y / docH) : 0;
      const ms = store.msr;
      let F = 0;
      for (let i = 0; i < ms.length; i++) {
        const m = ms[i];
        const trav = Math.max(1, m.height - innerHeight);
        if (y <= m.top + trav || i === ms.length - 1) {
          const local = Math.min(1, Math.max(0, (y - m.top) / trav));
          F = SEG_IDX[m.id] + Math.min(1, Math.max(0, (local - 0.08) / 0.84)) * m.span;
          break;
        }
      }
      targetF.current = Math.min(F, SEGMENTS.length - 1);
      // scrolling during the intro skips it gracefully
      if (!store.introDone && y > 60 && tlRef.current) tlRef.current.progress(1);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    /* ---- pointer ---- */
    const onPointer = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      store.pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener('pointermove', onPointer, { passive: true });

    /* ---- master rAF: phase smoothing + service commits ---- */
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (store.reduced) store.phase = targetF.current;
      else store.phase += (targetF.current - store.phase) * (1 - Math.exp(-dt * 5.2));
      const svc = Math.min(4, Math.max(0, Math.round(store.phase - 6)));
      if (store.phase >= 5.5 && svc !== store.activeService) {
        store.activeService = svc;
        store.emit('svc', svc);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ---- intro cinematic timeline ---- */
    const stage = (n: number) => { store.introStage = n; store.emit('stage', n); };
    if (store.reduced) {
      store.introT = 1; store.introDone = true; stage(5);
    } else {
      const proxy = { t: 0 };
      const tl = gsap.timeline({ delay: 0.35, onUpdate: () => { store.introT = proxy.t; } });
      tl.to(proxy, { t: 0.15, duration: 2.4, ease: 'sine.inOut' })
        .call(() => stage(1))
        .to(proxy, { t: 0.36, duration: 1.7, ease: 'sine.inOut' })
        .call(() => {
          stage(2);
          uni.uWaveT.value = store.clockTime;
          store.shake = 1;
          audio.pulse();
        })
        .to(proxy, { t: 0.64, duration: 2.3, ease: 'power2.inOut' })
        .call(() => { stage(3); store.shake = 0.55; audio.blip(); })
        .to(proxy, { t: 0.87, duration: 1.9, ease: 'sine.inOut' })
        .call(() => stage(4))
        .to(proxy, { t: 1, duration: 1.1, ease: 'sine.out' })
        .call(() => { store.introDone = true; stage(5); });
      tlRef.current = tl;
    }
    const offSkip = store.on((evt) => {
      if (evt === 'skip-intro' && tlRef.current) tlRef.current.progress(1);
      if (evt === 'webgl-lost') setGlAlive(false);
    });

    /* ---- audio lifecycle ---- */
    const onVis = () => (document.hidden ? audio.suspend() : audio.resume());
    document.addEventListener('visibilitychange', onVis);

    ready.current = true;
    return () => {
      clearTimeout(rime); clearTimeout(rime2); clearTimeout(rto);
      removeEventListener('resize', onResize);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      offSkip();
      tlRef.current?.kill();
    };
  }, [webgl]);

  const showGL = webgl && glAlive;

  return (
    <div className="relative">
      {showGL ? (
        <GLBoundary onFail={() => setGlAlive(false)}>
          <Universe />
        </GLBoundary>
      ) : (
        <StaticBG notice={!webgl} />
      )}
      <Chrome />
      <main className="pointer-events-none relative z-10">
        <div className="pointer-events-auto contents">
          <ActsOpening />
          <Services />
          <Finale />
          <Contact />
        </div>
      </main>
      <IntroOverlay />
      <ScrollCue />
    </div>
  );
}
