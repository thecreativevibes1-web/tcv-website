'use client';
import dynamic from 'next/dynamic';

const Experience = dynamic(() => import('./Experience'), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-screen place-items-center bg-void">
      <p className="font-mono text-[10px] tracking-widest2 text-white/50">INITIALIZING CREATION ENGINE…</p>
    </div>
  ),
});

export default function ClientApp() {
  return <Experience />;
}
