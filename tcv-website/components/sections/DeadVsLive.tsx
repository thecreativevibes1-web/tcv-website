'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DEAD_VS_LIVE } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export function DeadVsLive() {
  const sectionRef = useRef<HTMLElement>(null!)
  const liveCounterRef = useRef<HTMLDivElement>(null!)
  const isInView = useInView(liveCounterRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate flatline path
      const flatlinePath = sectionRef.current.querySelector('#flatline-path')
      if (flatlinePath) {
        gsap.fromTo(
          flatlinePath,
          { strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        )
      }

      // Animate dead panel text
      gsap.fromTo(
        '.dead-text',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      // Animate live panel
      gsap.fromTo(
        '.live-content',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      // Center text reveal
      gsap.fromTo(
        '.center-text',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="dead-vs-live"
      style={{
        background: 'var(--bg-primary)',
        padding: '6rem 0',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          // THE PROBLEM
        </span>
      </div>

      {/* Two columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
        className="responsive-grid"
      >
        {/* LEFT — DEAD */}
        <div
          className="dead-text"
          style={{
            background: '#080808',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '12px 0 0 12px',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
            filter: 'grayscale(80%)',
          }}
        >
          {/* Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.7rem',
                color: '#6b7280',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {DEAD_VS_LIVE.deadLabel}
            </span>
          </div>

          {/* Flatline SVG */}
          <div style={{ marginBottom: '2rem', height: '80px', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 400 80" style={{ width: '100%', height: '80px' }}>
              <path
                id="flatline-path"
                d="M 0 40 L 120 40 L 130 40 L 135 15 L 140 65 L 145 40 L 160 40 L 400 40"
                stroke="#4b5563"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#1f2937" strokeWidth="0.5" />
              <line x1="0" y1="40" x2="400" y2="40" stroke="#1f2937" strokeWidth="0.5" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#1f2937" strokeWidth="0.5" />
            </svg>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#374151',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Your Website
            <br />
            Is a Ghost.
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.8rem',
              color: '#4b5563',
              letterSpacing: '0.05em',
            }}
          >
            {DEAD_VS_LIVE.deadSubtext}
          </p>

          {/* Metrics */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['0 organic visits', '0 inquiries', '0 revenue'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.75rem',
                  color: '#374151',
                }}
              >
                <span style={{ color: '#ef4444' }}>✕</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — LIVE */}
        <div
          ref={liveCounterRef}
          className="live-content"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(0,245,255,0.12)',
            borderRadius: '0 12px 12px 0',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow bg */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.7rem',
                color: 'var(--cyan-glow)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {DEAD_VS_LIVE.liveLabel}
            </span>
          </div>

          {/* Pulse rings */}
          <div
            style={{
              position: 'relative',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="pulse-ring"
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0,245,255,0.3)',
                }}
              />
            ))}
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--cyan-glow)',
                boxShadow: '0 0 16px var(--cyan-glow)',
              }}
            />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Your Business
            <br />
            Is Everywhere.
          </h3>

          {/* Live metrics */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'var(--amber-accent)',
                  letterSpacing: '-0.03em',
                }}
              >
                {DEAD_VS_LIVE.liveMetric1}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: '0.25rem',
                }}
              >
                Qualified Leads
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'var(--amber-accent)',
                  letterSpacing: '-0.03em',
                }}
              >
                {DEAD_VS_LIVE.liveMetric2}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: '0.25rem',
                }}
              >
                Return on Investment
              </div>
            </motion.div>
          </div>

          {/* Metrics list */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Top Google rankings', 'Automated lead flow', 'Measurable growth'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ color: '#22c55e' }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center question */}
      <motion.div
        className="center-text"
        style={{
          maxWidth: '800px',
          margin: '4rem auto 0',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, transparent, var(--glass-border))',
            margin: '0 auto 2rem',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
          }}
        >
          {DEAD_VS_LIVE.centerText}
        </h2>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
          .responsive-grid > div:first-child {
            border-radius: 12px 12px 0 0 !important;
          }
          .responsive-grid > div:last-child {
            border-radius: 0 0 12px 12px !important;
          }
        }
      `}</style>
    </section>
  )
}
