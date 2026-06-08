'use client'

import { motion } from 'framer-motion'

interface Mission {
  id: string
  clientType: string
  location: string
  objective: string
  result: string
  status: 'ACTIVE' | 'DELIVERED'
  stack: string[]
  timeline: string
}

interface MissionCardProps {
  mission: Mission
  index: number
}

export function MissionCard({ mission, index }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-container"
      style={{ height: '280px', cursor: 'pointer' }}
    >
      <div className="card-inner" style={{ height: '100%' }}>
        {/* FRONT */}
        <div
          className="card-face glass"
          style={{
            borderRadius: '12px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Top row */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '0.65rem',
                  color: 'var(--cyan-glow)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                [ MISSION FILE — {mission.id} ]
              </span>

              {/* Status badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: mission.status === 'ACTIVE' ? '#22c55e' : 'var(--cyan-glow)',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: mission.status === 'ACTIVE' ? '#22c55e' : 'var(--cyan-glow)',
                    boxShadow:
                      mission.status === 'ACTIVE'
                        ? '0 0 6px #22c55e'
                        : '0 0 6px var(--cyan-glow)',
                  }}
                />
                {mission.status}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                marginBottom: '0.3rem',
                letterSpacing: '-0.01em',
              }}
            >
              {mission.clientType}
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              {mission.location}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                color: 'rgba(107,114,128,0.8)',
                lineHeight: 1.5,
              }}
            >
              {mission.objective}
            </p>
          </div>

          {/* Bottom — result */}
          <div>
            <div
              style={{
                height: '1px',
                background: 'var(--glass-border)',
                marginBottom: '1rem',
              }}
            />
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--amber-accent)',
                letterSpacing: '-0.02em',
              }}
            >
              {mission.result}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.6rem',
                color: 'rgba(107,114,128,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '0.25rem',
              }}
            >
              hover to see stack →
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="card-face card-back glass"
          style={{
            borderRadius: '12px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderColor: 'rgba(0,245,255,0.2)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.65rem',
                color: 'var(--cyan-glow)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              // TECH STACK
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {mission.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.7rem',
                    color: 'var(--cyan-glow)',
                    background: 'rgba(0,245,255,0.08)',
                    border: '1px solid rgba(0,245,255,0.2)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '3px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              // TIMELINE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: 'var(--amber-accent)',
              }}
            >
              {mission.timeline}
            </div>
          </div>

          <button
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '0.75rem',
              color: 'var(--cyan-glow)',
              background: 'rgba(0,245,255,0.06)',
              border: '1px solid rgba(0,245,255,0.2)',
              padding: '0.6rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,245,255,0.15)'
              e.currentTarget.style.borderColor = 'var(--cyan-glow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,245,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
            }}
          >
            View Case Study →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
