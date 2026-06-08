'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlowButton } from '@/components/ui/GlowButton'
import { RadarReticle } from '@/components/three/RadarReticle'
import { ContactForm } from '@/components/ui/ContactForm'
import { CTA_CONTENT } from '@/lib/constants'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CTA() {
  const [formOpen, setFormOpen] = useState(false)
  const [locked, setLocked] = useState(false)

  return (
    <>
      <section
        id="contact"
        style={{
          background: 'var(--bg-primary)',
          padding: '8rem 0',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />

        {/* Deep glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background:
              'radial-gradient(ellipse, rgba(0,245,255,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Radar Reticle */}
        <RadarReticle locked={locked} />

        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
            zIndex: 10,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Signal label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.7rem',
                color: locked ? '#22c55e' : 'var(--cyan-glow)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                transition: 'color 0.5s ease',
              }}
            >
              {CTA_CONTENT.sectionLabel}
            </span>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 600,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            {CTA_CONTENT.subheading}
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '3rem',
            }}
          >
            {CTA_CONTENT.heading1}
            <br />
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--text-primary) 20%, var(--cyan-glow) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {CTA_CONTENT.heading2}
            </span>
          </motion.h2>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <GlowButton
              variant="filled"
              onClick={() => setFormOpen(true)}
            >
              {CTA_CONTENT.primaryCta}
            </GlowButton>
            <GlowButton
              variant="outline"
              onClick={() => scrollTo('work')}
            >
              {CTA_CONTENT.secondaryCta}
            </GlowButton>
          </motion.div>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            {CTA_CONTENT.trust}
          </motion.p>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
              margin: '4rem auto',
              maxWidth: '600px',
            }}
          />

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              TCV
              <span style={{ color: 'var(--cyan-glow)', fontSize: '1.8rem', lineHeight: 1 }}>.</span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.65rem',
                color: 'rgba(107,114,128,0.5)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Signal Active. Always.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.6rem',
                color: 'rgba(107,114,128,0.35)',
                letterSpacing: '0.06em',
              }}
            >
              © {new Date().getFullYear()} The Creative Vibes. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>

      <ContactForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => setLocked(true)}
      />
    </>
  )
}
