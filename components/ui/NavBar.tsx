'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '@/lib/constants'

function scrollToSection(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
          background: scrolled ? 'rgba(5,5,16,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,245,255,0.06)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--text-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            letterSpacing: '-0.02em',
          }}
        >
          TCV
          <span style={{ color: 'var(--cyan-glow)', fontSize: '1.5rem', lineHeight: 1 }}>.</span>
        </button>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
                padding: '0.25rem 0',
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cyan-glow)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('#contact')}
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '0.75rem',
              color: 'var(--cyan-glow)',
              background: 'transparent',
              border: '1px solid rgba(0,245,255,0.3)',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              padding: '0.4rem 1rem',
              borderRadius: '3px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--cyan-glow)'
              e.currentTarget.style.color = 'var(--bg-primary)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0,245,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--cyan-glow)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            GET STARTED
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '4px',
          }}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--cyan-glow)',
              borderRadius: '1px',
              transformOrigin: 'center',
            }}
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--cyan-glow)',
              borderRadius: '1px',
            }}
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--cyan-glow)',
              borderRadius: '1px',
              transformOrigin: 'center',
            }}
          />
        </button>
      </motion.nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,5,16,0.97)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onClick={() => {
                  setMobileOpen(false)
                  setTimeout(() => scrollToSection(link.href), 300)
                }}
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.02em',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cyan-glow)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginTop: '1rem',
              }}
            >
              SIGNAL ACTIVE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
