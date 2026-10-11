'use client';
import { useEffect, useState, FormEvent } from 'react';
import { store, SegmentId } from '@/lib/store';
import { audio } from '@/lib/audio';
import { SERVICES } from './Services';
import Magnetic from './Magnetic';
import { goToSegment } from './Chrome';

const EMAIL = 'hello@newcreationhubs.com';

interface Fields { name: string; email: string; company: string; service: string; message: string }
const empty: Fields = { name: '', email: '', company: '', service: '', message: '' };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Tell us who is creating';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'A reachable email is required';
  if (f.message.trim().length < 12) e.message = 'Give the idea at least one real sentence';
  return e;
}

export default function Contact() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [state, setState] = useState<'idle' | 'ready'>('idle');

  useEffect(
    () =>
      store.on((evt, data) => {
        if (evt === 'svc-pick') {
          const i = data as number;
          setF((prev) => ({ ...prev, service: SERVICES[i].title }));
          setState('idle');
        }
      }),
    []
  );

  const brief = () =>
    [
      `PROJECT INQUIRY — NEW CREATION HUBS`,
      ``,
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.company ? `Company: ${f.company}` : null,
      f.service ? `Capability: ${f.service}` : null,
      ``,
      `The idea:`,
      f.message,
    ].filter(Boolean).join('\n');

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) { audio.blip(); return; }
    setState('ready');
    audio.uiTick();
  };

  const inputCls = (bad?: string) =>
    `w-full rounded-lg border bg-white/[0.03] px-4 py-3 font-body text-sm text-warmwhite placeholder-white/25 outline-none transition focus:border-cyanic/70 focus:bg-white/[0.05] ${
      bad ? 'border-amberglow/70' : 'border-white/12'
    }`;

  return (
    <section data-seg="contact" className="relative min-h-[140vh] pb-10" aria-label="Start a project">
      <span data-seg-anchor="contact" tabIndex={-1} className="outline-none" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,10,0.6)_0%,rgba(3,4,10,0.82)_30%,rgba(3,4,10,0.9)_100%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-[16vh] md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* left copy */}
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-widest2 text-amberglow md:text-xs">
              <span className="inline-block h-px w-10 bg-amberglow/70" aria-hidden />
              THE INVITATION — FINAL SEQUENCE
            </p>
            <h2 className="font-display text-5xl font-light leading-[1.02] tracking-tight text-warmwhite md:text-6xl">
              START<br />SOMETHING<br />
              <span className="text-cyanic">REAL.</span>
            </h2>
            <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-white/55 md:text-base">
              Tell us what you want to create. No funnels, no black boxes —
              your brief opens in <em className="text-white/80">your own</em> email client,
              addressed to a human. Nothing is silently stored or sent from this page.
            </p>
            <ul className="mt-8 space-y-3 font-mono text-[10px] tracking-widest2 text-white/40">
              <li>→ RESPONSE WITHIN 1–2 WORKING DAYS</li>
              <li>→ SCOPING CALL, THEN A WRITTEN PLAN</li>
              <li>→ INDORE, IN — WORKING WORLDWIDE</li>
            </ul>
          </div>

          {/* form */}
          <div className="rounded-2xl border border-white/10 bg-void/60 p-7 backdrop-blur-md md:p-9">
            {state === 'ready' ? (
              <div role="status" className="flex min-h-[26rem] flex-col justify-center">
                <p className="font-mono text-[10px] tracking-widest2 text-cyanic">TRANSMISSION PREPARED</p>
                <h3 className="mt-4 font-display text-3xl font-light text-warmwhite">
                  Your brief is assembled<span className="text-cyanic">.</span>
                </h3>
                <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/55">
                  Honest systems only: this demo page cannot deliver email by itself.
                  Send it through your own client — it lands directly with our team.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic strength={0.2}>
                    <a
                      className="inline-block rounded-full bg-cyanic px-7 py-3.5 font-mono text-[10px] font-bold tracking-widest2 text-void transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry — ${f.name}`)}&body=${encodeURIComponent(brief())}`}
                    >
                      OPEN IN EMAIL →
                    </a>
                  </Magnetic>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(brief()).catch(() => {})}
                    className="rounded-full border border-white/20 px-7 py-3.5 font-mono text-[10px] tracking-widest2 text-white/75 transition hover:border-cyanic hover:text-cyanic focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
                  >
                    COPY BRIEF
                  </button>
                  <button
                    type="button"
                    onClick={() => setState('idle')}
                    className="rounded-full px-4 py-3.5 font-mono text-[10px] tracking-widest2 text-white/40 transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic"
                  >
                    EDIT
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nch-name" className="mb-2 block font-mono text-[9px] tracking-widest2 text-white/50">NAME *</label>
                    <input id="nch-name" className={inputCls(errors.name)} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ada Lovelace" aria-invalid={!!errors.name} />
                    {errors.name && <p role="alert" className="mt-1.5 font-mono text-[9px] tracking-wide text-amberglow">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="nch-email" className="mb-2 block font-mono text-[9px] tracking-widest2 text-white/50">EMAIL *</label>
                    <input id="nch-email" type="email" className={inputCls(errors.email)} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="ada@company.com" aria-invalid={!!errors.email} />
                    {errors.email && <p role="alert" className="mt-1.5 font-mono text-[9px] tracking-wide text-amberglow">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nch-company" className="mb-2 block font-mono text-[9px] tracking-widest2 text-white/50">COMPANY</label>
                    <input id="nch-company" className={inputCls()} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} placeholder="Optional" />
                  </div>
                  <div>
                    <label htmlFor="nch-service" className="mb-2 block font-mono text-[9px] tracking-widest2 text-white/50">CAPABILITY</label>
                    <select id="nch-service" className={`${inputCls()} appearance-none`} value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}>
                      <option value="" className="bg-midnight">Select a world…</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title} className="bg-midnight">{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="nch-message" className="mb-2 block font-mono text-[9px] tracking-widest2 text-white/50">THE IDEA *</label>
                  <textarea
                    id="nch-message" rows={5}
                    className={`${inputCls(errors.message)} resize-none`}
                    value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })}
                    placeholder="What do you want to create, and what should it change?"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p role="alert" className="mt-1.5 font-mono text-[9px] tracking-wide text-amberglow">{errors.message}</p>}
                </div>
                <Magnetic strength={0.18}>
                  <button
                    type="submit"
                    className="rounded-full bg-cyanic px-8 py-4 font-mono text-[11px] font-bold tracking-widest2 text-void transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanic"
                  >
                    PREPARE TRANSMISSION →
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="relative mt-[16vh] border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="font-display text-3xl font-light tracking-wide text-warmwhite">NEW CREATION HUBS</p>
            <p className="mt-2 font-mono text-[9px] tracking-widest2 text-white/40">WE CREATE. WE BUILD. WE GROW.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[9px] tracking-widest2 text-white/45">
              {([['act1', 'IMAGINATION'], ['act2', 'DESIGN'], ['act3', 'ENGINEERING'], ['act4', 'INTELLIGENCE'], ['act5', 'GROWTH'], ['svc0', 'CAPABILITIES']] as [SegmentId, string][]).map(([seg, label]) => (
                <li key={seg}>
                  <button type="button" onClick={() => goToSegment(seg)} className="transition hover:text-cyanic focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyanic">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-[9px] tracking-widest2 text-white/30">
            © 2026 NCH — CREATION ENGINE <span className="text-cyanic/70">ONLINE</span>
          </p>
        </div>
      </footer>
    </section>
  );
}
