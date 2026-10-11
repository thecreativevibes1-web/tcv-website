'use client';
import { useEffect, useRef, useState } from 'react';
import { store, SegmentId } from '@/lib/store';
import Magnetic from './Magnetic';
import { goToSegment } from './Chrome';

/* ------------------------- active-segment observer ---------------------- */
function useActRoot<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => el.setAttribute('data-active', e.isIntersecting ? 'true' : 'false')),
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ------------------------------ hero copy ------------------------------- */
function Hero() {
  const [stage, setStage] = useState(0);
  useEffect(() => store.on((evt, data) => { if (evt === 'stage') setStage(data as number); }), []);
  const live = stage >= 4;

  return (
    <section data-seg="hero" className="relative h-[108vh]" aria-label="Introduction">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,10,0.85)_0%,rgba(3,4,10,0.45)_42%,transparent_72%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className={`hero-copy ${live ? 'hero-live' : ''}`}>
            <p className="hero-eyebrow mb-5 flex items-center gap-3 font-mono text-[10px] tracking-widest2 text-cyanic md:text-xs">
              <span className="inline-block h-px w-10 bg-cyanic/70" aria-hidden />
              A UNIVERSE FOR AMBITIOUS IDEAS
            </p>
            <h1 className="font-display font-light leading-[0.94] tracking-tight text-warmwhite">
              <span className="hero-line block text-[13.5vw] sm:text-[11vw] lg:text-[8.2rem]"><span className="hero-mask">NEW</span></span>
              <span className="hero-line block text-[13.5vw] sm:text-[11vw] lg:text-[8.2rem]"><span className="hero-mask text-cyanic">CREATION</span></span>
              <span className="hero-line block text-[13.5vw] sm:text-[11vw] lg:text-[8.2rem]"><span className="hero-mask">HUBS</span></span>
            </h1>
            <p className="hero-tag mt-7 font-display text-sm tracking-[0.42em] text-white/85 sm:text-base md:text-lg">
              WE CREATE. WE BUILD. WE GROW.
            </p>
            <p className="hero-sub mt-5 max-w-xl font-body text-sm leading-relaxed text-white/55 md:text-base">
              Turning ambitious ideas into intelligent digital experiences,
              powerful software and businesses built for growth.
            </p>
          </div>
        </div>
        {/* technical frame details */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-6 z-10 flex justify-between font-mono text-[9px] tracking-widest2 text-white/30 md:inset-x-10">
          <span>NCH // CREATION ENGINE v2.6</span>
          <span className="hidden sm:block">FIELD: STABLE</span>
          <span>RENDER: PROCEDURAL — NO FOOTAGE</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ act section ----------------------------- */
interface ActProps {
  seg: SegmentId;
  num: string;
  name: string;
  headline: [string, string];
  body: string;
  tags: string[];
  align?: 'left' | 'right';
}

function Act({ seg, num, name, headline, body, tags, align = 'left' }: ActProps) {
  const ref = useActRoot<HTMLElement>();
  const right = align === 'right';
  return (
    <section
      ref={ref}
      data-seg={seg}
      data-active="false"
      className="act-section relative h-[200vh]"
      aria-label={`${name}`}
    >
      <span data-seg-anchor={seg} tabIndex={-1} className="absolute left-0 top-1/2 outline-none" aria-hidden />
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* side scrim for editorial negative space */}
        <div
          aria-hidden
          className={`absolute inset-0 ${right ? 'bg-[linear-gradient(-100deg,rgba(3,4,10,0.9)_0%,rgba(3,4,10,0.55)_36%,transparent_66%)]' : 'bg-[linear-gradient(100deg,rgba(3,4,10,0.9)_0%,rgba(3,4,10,0.55)_36%,transparent_66%)]'}`}
        />
        {/* monumental background numeral */}
        <div
          aria-hidden
          className={`act-bignum pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-display text-[38vw] font-light leading-none text-transparent md:text-[24rem] ${right ? '-right-6 md:right-4' : '-left-6 md:left-4'}`}
        >
          {num}
        </div>

        <div className={`relative mx-auto w-full max-w-7xl px-6 md:px-10 ${right ? 'text-right' : ''}`}>
          <div className={`max-w-2xl ${right ? 'ml-auto' : ''}`}>
            <p className="act-kicker mb-6 flex items-center gap-3 font-mono text-[10px] tracking-widest2 text-cyanic md:text-xs">
              <span className={`inline-block h-px w-10 bg-cyanic/70 ${right ? 'order-2' : ''}`} aria-hidden />
              ACT {num} — {name}
            </p>
            <h2 className="act-h font-display text-[9.5vw] font-light leading-[1.02] tracking-tight text-warmwhite sm:text-6xl md:text-7xl">
              <span className="block">
                <span className="act-mask">{headline[0]}</span>
              </span>
              <span className="block">
                <span className="act-mask act-mask2">{headline[1]}</span>
              </span>
            </h2>
            <p className="act-body mt-6 max-w-lg font-body text-sm leading-relaxed text-white/55 md:text-base" style={right ? { marginLeft: 'auto' } : undefined}>
              {body}
            </p>
            <ul className={`act-tags mt-8 flex flex-wrap gap-2 ${right ? 'justify-end' : ''}`} aria-label="Focus areas">
              {tags.map((t) => (
                <li key={t} className="rounded-full border border-white/12 px-4 py-1.5 font-mono text-[9px] tracking-widest2 text-white/60">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute bottom-6 left-6 font-mono text-[9px] tracking-widest2 text-white/25 md:left-10">
          {`SEQ.${num}`} <span className="mx-2 text-cyanic/50">//</span> STATE: {name}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- finale -------------------------------- */
function Finale() {
  const ref = useActRoot<HTMLElement>();
  return (
    <section ref={ref} data-seg="act6" data-active="false" className="act-section relative h-[170vh]" aria-label="The invitation">
      <span data-seg-anchor="act6" tabIndex={-1} className="absolute left-0 top-1/2 outline-none" aria-hidden />
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(58%_58%_at_50%_52%,rgba(3,4,10,0.88)_0%,rgba(3,4,10,0.42)_52%,transparent_78%)]" />
        <p className="act-kicker relative mb-6 font-mono text-[10px] tracking-widest2 text-amberglow md:text-xs">
          ACT 06 — THE INVITATION
        </p>
        <h2 className="act-h relative font-display text-[11vw] font-light leading-[1.0] tracking-tight text-warmwhite sm:text-7xl md:text-8xl">
          <span className="block"><span className="act-mask">WHAT WILL YOU</span></span>
          <span className="block"><span className="act-mask act-mask2 bg-gradient-to-r from-cyanic via-white to-amberglow bg-clip-text text-transparent">CREATE NEXT?</span></span>
        </h2>
        <p className="act-body relative mt-6 max-w-md font-body text-sm leading-relaxed text-white/55 md:text-base">
          The engine is complete. It is waiting for the next idea to pass through it.
        </p>
        <div className="act-tags relative mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic>
            <button
              type="button"
              onClick={() => goToSegment('contact')}
              className="cta-primary group relative overflow-hidden rounded-full bg-cyanic px-9 py-4 font-mono text-[11px] font-bold tracking-widest2 text-void transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanic"
            >
              START A PROJECT
              <span className="cta-sheen" aria-hidden />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => goToSegment('svc0')}
              className="rounded-full border border-white/25 px-9 py-4 font-mono text-[11px] tracking-widest2 text-white/80 transition hover:border-cyanic hover:text-cyanic focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
            >
              EXPLORE OUR CAPABILITIES
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- export -------------------------------- */
export function ActsOpening() {
  return (
    <>
      <Hero />
      <Act
        seg="act1" num="01" name="IMAGINATION"
        headline={['EVERYTHING BEGINS', 'WITH AN IDEA.']}
        body="Before anything is built, it is imagined. We step inside the invisible — mapping possibility into direction long before a single pixel exists."
        tags={['DISCOVERY', 'STRATEGY', 'CONCEPT']}
        align="left"
      />
      <Act
        seg="act2" num="02" name="DESIGN"
        headline={['GIVE YOUR', 'VISION A FORM.']}
        body="Shape is a decision. We translate ambition into identity, interface and motion — design systems engineered to feel inevitable, not decorated."
        tags={['IDENTITY', 'INTERFACE', 'MOTION']}
        align="right"
      />
      <Act
        seg="act3" num="03" name="ENGINEERING"
        headline={["BUILD WHAT DOESN'T", 'EXIST YET.']}
        body="Websites, applications, platforms and SaaS — architected like machinery: precise, durable and built to perform under real-world load."
        tags={['WEB', 'APPS', 'PLATFORMS', 'SAAS']}
        align="left"
      />
      <Act
        seg="act4" num="04" name="INTELLIGENCE"
        headline={['MAKE TECHNOLOGY', 'WORK SMARTER.']}
        body="Systems that think, adapt and act. Applied AI and automation woven into products that learn from every interaction — no gimmicks, only leverage."
        tags={['AI PRODUCTS', 'AUTOMATION', 'DATA SYSTEMS']}
        align="right"
      />
      <Act
        seg="act5" num="05" name="GROWTH"
        headline={['TURN CREATION', 'INTO MOMENTUM.']}
        body="From the first idea to the systems that move your business forward — we build engines of distribution, audience and revenue that keep running."
        tags={['MARKETING', 'SOCIAL', 'GROWTH LOOPS']}
        align="left"
      />
    </>
  );
}

export { Finale };
