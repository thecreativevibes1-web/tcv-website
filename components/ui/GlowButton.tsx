'use client'

import { motion } from 'framer-motion'

interface GlowButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'outline' | 'filled'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
}

export function GlowButton({
  children,
  onClick,
  variant = 'outline',
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={{
        border: '1px solid var(--cyan-glow)',
        background: variant === 'filled' ? 'var(--cyan-glow)' : 'transparent',
        color: variant === 'filled' ? 'var(--bg-primary)' : 'var(--cyan-glow)',
        padding: '0.75rem 2rem',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        width: fullWidth ? '100%' : 'auto',
      }}
      className={`group ${className}`}
      onMouseEnter={(e) => {
        if (disabled) return
        if (variant === 'outline') {
          e.currentTarget.style.background = 'var(--cyan-glow)'
          e.currentTarget.style.color = 'var(--bg-primary)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.4)'
        } else {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.5)'
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        if (variant === 'outline') {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--cyan-glow)'
          e.currentTarget.style.boxShadow = 'none'
        } else {
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {children}
    </motion.button>
  )
}
