'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { GlowButton } from '@/components/ui/GlowButton'
import { HERO_CONTENT } from '@/lib/constants'

const SignalMesh = dynamic(
  () => import('@/components/three/SignalMesh').then((m) => ({ default: m.SignalMesh })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%' }} /> }
)

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* 3D Background */}
      <Suspense fallback={<div style={{ position: 'absolute', inset: 0 }} />}>
        <SignalMesh />
      </Suspense>

      {/* Radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(5,5,16,0) 0%, rgba(5,5,16,0.6) 70%, var(--bg-primary) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {/* Signal label */}
        <motion.div variants={itemVariants}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.7rem',
              color: 'var(--cyan-glow)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--cyan-glow)',
                boxShadow: '0 0 8px var(--cyan-glow)',
                display: 'inline-block',
                animation: 'pulse-ring-dot 2s infinite',
              }}
            />
            {HERO_CONTENT.label}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}
        >
          {HERO_CONTENT.h1Line1}
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--cyan-glow) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {HERO_CONTENT.h1Line2}
          </span>
        </motion.h1>

        {/* H2 */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-muted)',
            fontWeight: 400,
            marginBottom: '0.75rem',
            lineHeight: 1.6,
          }}
        >
          {HERO_CONTENT.h2}
        </motion.p>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.8rem',
            color: 'rgba(107,114,128,0.7)',
            letterSpacing: '0.08em',
            marginBottom: '2.5rem',
          }}
        >
          {HERO_CONTENT.subtext}
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
        >
          <GlowButton onClick={() => scrollTo('services')}>
            {HERO_CONTENT.cta}
          </GlowButton>
          <GlowButton
            onClick={() => scrollTo('work')}
            variant="outline"
          >
            [ View Our Work ]
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          scroll
        </span>
        <div
          className="scroll-indicator"
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, var(--cyan-glow), transparent)',
          }}
        />
      </div>

      {/* Corner decorations */}
      <div
        style={{
          position: 'absolute',
          top: '5rem',
          left: '1.5rem',
          zIndex: 5,
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '0.6rem',
          color: 'rgba(0,245,255,0.2)',
          letterSpacing: '0.1em',
        }}
      >
        SYS:ONLINE<br />
        NET:ACTIVE
      </div>
      <div
        style={{
          position: 'absolute',
          top: '5rem',
          right: '1.5rem',
          zIndex: 5,
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '0.6rem',
          color: 'rgba(0,245,255,0.2)',
          letterSpacing: '0.1em',
          textAlign: 'right',
        }}
      >
        V.2.4.1<br />
        BUILD:STABLE
      </div>

      <style>{`
        @keyframes pulse-ring-dot {
          0%, 100% { box-shadow: 0 0 8px var(--cyan-glow); opacity: 1; }
          50% { box-shadow: 0 0 16px var(--cyan-glow), 0 0 30px var(--cyan-glow); opacity: 0.7; }
        }
      `}</style>
    </section>
  )
}
