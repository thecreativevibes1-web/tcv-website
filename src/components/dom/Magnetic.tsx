'use client';
import { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { store } from '@/lib/store';

/** Magnetic hover wrapper — motion capped for accessibility; disabled on touch / reduced-motion. */
export default function Magnetic({ children, strength = 0.32 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia('(pointer:fine)').matches && !store.reduced;
  }, []);

  return (
    <span
      ref={ref}
      className="inline-block will-change-transform"
      onPointerMove={(e) => {
        if (!fine.current || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        gsap.to(ref.current, { x, y, duration: 0.4, ease: 'power3.out' });
      }}
      onPointerLeave={() => {
        if (!fine.current || !ref.current) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      }}
    >
      {children}
    </span>
  );
}
