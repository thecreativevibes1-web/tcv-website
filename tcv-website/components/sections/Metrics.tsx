'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { CounterItem } from '@/components/ui/CounterItem'
import { metricsData } from '@/lib/constants'
import { fetchMetrics } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const MetricsField = dynamic(
  () => import('@/components/three/MetricsField').then((m) => ({ default: m.MetricsField })),
  { ssr: false, loading: () => <div style={{ height: '320px' }} /> }
)

export function Metrics() {
  const [metrics, setMetrics] = useState(metricsData)

  useEffect(() => {
    fetchMetrics()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d, i) => ({
            value: d.value,
            label: d.label,
            suffix: metricsData[i]?.suffix || '',
          }))
          setMetrics(mapped)
        }
      })
      .catch((err) => {
        console.error('[Metrics] Failed to load from Supabase, using fallback:', err)
      })
  }, [])

  return (
    <section
      id="results"
      style={{
        background: 'var(--bg-secondary)',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '300px',
          background:
            'radial-gradient(ellipse, rgba(0,245,255,0.04) 0%, transparent 70%)',
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
            // SIGNAL DATA
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
            marginBottom: '0.75rem',
          }}
        >
          Numbers Don&apos;t Lie.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          Real results. Real clients. No vanity metrics.
        </motion.p>

        {/* 3D Floating Numbers */}
        <Suspense fallback={<div style={{ height: '320px' }} />}>
          <MetricsField />
        </Suspense>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, var(--cyan-glow), transparent)',
            opacity: 0.15,
            margin: '2rem 0',
          }}
        />

        {/* Counter Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0',
          }}
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                borderRight: i < metrics.length - 1 ? '1px solid var(--glass-border)' : 'none',
              }}
            >
              <CounterItem
                end={metric.value}
                label={metric.label}
                suffix={metric.suffix}
              />
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {[
            '✓ 100% Results-Based Approach',
            '✓ Zero Long-Term Contracts',
            '✓ 24h Response Guarantee',
            '✓ Dedicated Point of Contact',
          ].map((item) => (
            <span
              key={item}
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
