'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CounterItemProps {
  end: number
  label: string
  suffix?: string
  duration?: number
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function CounterItem({ end, label, suffix = '', duration = 2000 }: CounterItemProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null!)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isInView) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      const current = Math.round(easedProgress * end)

      setCount(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isInView, end, duration])

  // Format large numbers
  const displayValue =
    end >= 1000
      ? count >= 1000
        ? `${(count / 1000).toFixed(1)}K`
        : count.toString()
      : count.toString()

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          color: 'var(--cyan-glow)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          textShadow: '0 0 30px rgba(0,245,255,0.3)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayValue}
        <span
          style={{
            fontSize: '0.5em',
            color: 'var(--amber-accent)',
            marginLeft: '2px',
          }}
        >
          {suffix}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </div>
  )
}
