'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GlowButton } from '@/components/ui/GlowButton'
import { insertLead } from '@/lib/supabase'
import { FORM_GOALS } from '@/lib/constants'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ContactForm({ isOpen, onClose, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    business_type: '',
    goal: '',
    whatsapp: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      setError('Name and WhatsApp number are required.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await insertLead({
        name: formData.name.trim(),
        business_type: formData.business_type.trim(),
        goal: formData.goal,
        whatsapp: formData.whatsapp.trim(),
      })
      setSubmitted(true)
      onSuccess()
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFormData({ name: '', business_type: '', goal: '', whatsapp: '' })
      }, 3000)
    } catch (err) {
      console.error('[ContactForm] Submission error:', err)
      setError('Something went wrong. Please try WhatsApp directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,5,16,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '16px',
              padding: '2.5rem',
              position: 'relative',
              marginBottom: '2rem',
              borderColor: 'rgba(0,245,255,0.15)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.borderColor = 'var(--cyan-glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'var(--glass-border)'
              }}
            >
              <X size={14} />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(0,245,255,0.1)',
                    border: '2px solid var(--cyan-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '1.2rem',
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Signal Received.
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                  }}
                >
                  We&apos;ll reach you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: '0.65rem',
                      color: 'var(--cyan-glow)',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    // INITIATE CONTACT
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontWeight: 700,
                      fontSize: '1.6rem',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Let&apos;s Build Something.
                  </h2>
                </div>

                {/* Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Business Type
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Real Estate, E-commerce, SaaS..."
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Primary Goal
                    </label>
                    <select
                      className="form-input"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    >
                      <option value="">Select your objective...</option>
                      {FORM_GOALS.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <p
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: '0.7rem',
                      color: '#ef4444',
                      marginTop: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ⚠ {error}
                  </p>
                )}

                <div style={{ marginTop: '1.5rem', width: '100%', display: 'flex' }}>
                <GlowButton
                  onClick={handleSubmit}
                  disabled={loading}
                  variant="filled"
                  fullWidth
                >
                  {loading ? '[ Transmitting... ]' : '[ Activate Signal ]'}
                </GlowButton>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginTop: '1rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  No spam. No retainer. Just results.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
