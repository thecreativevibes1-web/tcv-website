'use client'

import { motion } from 'framer-motion'
import { MissionCard } from '@/components/ui/MissionCard'
import { missions, PORTFOLIO_CONTENT } from '@/lib/constants'

export function Portfolio() {
  return (
    <section
      id="work"
      style={{
        background: 'var(--bg-primary)',
        padding: '6rem 0',
        position: 'relative',
      }}
    >
      {/* Top fade from previous section */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.7rem',
              color: 'var(--cyan-glow)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {PORTFOLIO_CONTENT.sectionLabel}
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--text-primary)',
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1rem',
            whiteSpace: 'pre-line',
          }}
        >
          {PORTFOLIO_CONTENT.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            marginBottom: '3.5rem',
          }}
        >
          hover any card to reveal the full mission stack
        </motion.p>

        {/* Mission Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {missions.map((mission, i) => (
            <MissionCard key={mission.id} mission={mission} index={i} />
          ))}
        </div>

        {/* Bottom CTA prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '2rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            // ALL MISSIONS CLASSIFIED
          </p>
          <p
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
            }}
          >
            Your business could be our next success story.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
