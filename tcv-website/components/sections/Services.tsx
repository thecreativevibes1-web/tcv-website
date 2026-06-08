'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { services, SERVICES_CONTENT } from '@/lib/constants'

const OrbitStations = dynamic(
  () => import('@/components/three/OrbitStations').then((m) => ({ default: m.OrbitStations })),
  { ssr: false, loading: () => <div style={{ height: '360px' }} /> }
)

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' as const },
  }),
}

export function Services() {
  return (
    <section
      id="services"
      style={{
        background: 'var(--bg-secondary)',
        padding: '6rem 0',
        position: 'relative',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Section header */}
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
            {SERVICES_CONTENT.sectionLabel}
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
            marginBottom: '3rem',
            whiteSpace: 'pre-line',
          }}
        >
          {SERVICES_CONTENT.heading}
        </motion.h2>

        {/* 3D Orbit */}
        <Suspense fallback={<div style={{ height: '360px' }} />}>
          <OrbitStations />
        </Suspense>

        {/* Service Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="glass glass-hover"
              style={{
                borderRadius: '12px',
                padding: '2rem',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '60px',
                  height: '60px',
                  background:
                    'linear-gradient(135deg, transparent 50%, rgba(0,245,255,0.04) 50%)',
                  borderRadius: '0 12px 0 0',
                }}
              />

              {/* Number */}
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.65rem',
                  color: 'rgba(0,245,255,0.3)',
                  letterSpacing: '0.15em',
                  marginBottom: '1.25rem',
                  textTransform: 'uppercase',
                }}
              >
                0{service.id} /{' '}
                {service.icon === 'web'
                  ? 'WEB ARCHITECTURE'
                  : service.icon === 'ai'
                  ? 'AI AUTOMATION'
                  : 'LEAD GENERATION'}
              </div>

              {/* Headline */}
              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}
              >
                {service.headline}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                }}
              >
                {service.body}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  background: 'var(--glass-border)',
                  marginBottom: '1.25rem',
                }}
              />

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: '0.65rem',
                      color: 'var(--cyan-glow)',
                      background: 'rgba(0,245,255,0.06)',
                      border: '1px solid rgba(0,245,255,0.15)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '3px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
