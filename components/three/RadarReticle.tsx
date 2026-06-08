'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RadarReticleProps {
  locked?: boolean
}

export function RadarReticle({ locked = false }: RadarReticleProps) {
  const svgRef = useRef<SVGSVGElement>(null!)
  const animRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const circles = svgRef.current.querySelectorAll('circle')
    const lines = svgRef.current.querySelectorAll('line')

    const allElements = [...Array.from(circles), ...Array.from(lines)]

    // Set initial state
    allElements.forEach((el) => {
      const length = (el as SVGGeometryElement).getTotalLength?.() || 300
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
    })

    // Draw on scroll enter
    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(allElements, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            if (!locked) {
              // Pulse after draw
              animRef.current = gsap.to(svgRef.current, {
                scale: 1.03,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                transformOrigin: 'center center',
              })
            }
          },
        })
      },
    })

    return () => {
      animRef.current?.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === '#contact') t.kill()
      })
    }
  }, [locked])

  useEffect(() => {
    if (locked && svgRef.current) {
      animRef.current?.kill()
      gsap.to(svgRef.current, {
        scale: 1,
        duration: 0.3,
      })
    }
  }, [locked])

  const color = locked ? '#22c55e' : '#00f5ff'
  const opacity = 0.35

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        ref={svgRef}
        id="radar-svg"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Outer circle */}
        <circle cx="250" cy="250" r="220" stroke={color} strokeOpacity={opacity} strokeWidth="1" />
        {/* Middle circle */}
        <circle cx="250" cy="250" r="150" stroke={color} strokeOpacity={opacity * 1.2} strokeWidth="1" />
        {/* Inner circle */}
        <circle cx="250" cy="250" r="80" stroke={color} strokeOpacity={opacity * 1.5} strokeWidth="1" />
        {/* Center dot circle */}
        <circle cx="250" cy="250" r="6" stroke={color} strokeOpacity={opacity * 2} strokeWidth="1.5" />

        {/* Crosshair horizontal */}
        <line x1="10" y1="250" x2="490" y2="250" stroke={color} strokeOpacity={opacity * 0.8} strokeWidth="0.5" />
        {/* Crosshair vertical */}
        <line x1="250" y1="10" x2="250" y2="490" stroke={color} strokeOpacity={opacity * 0.8} strokeWidth="0.5" />

        {/* Diagonal lines */}
        <line x1="100" y1="100" x2="400" y2="400" stroke={color} strokeOpacity={opacity * 0.3} strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="400" y1="100" x2="100" y2="400" stroke={color} strokeOpacity={opacity * 0.3} strokeWidth="0.5" strokeDasharray="4 8" />

        {/* Corner brackets */}
        <path d="M 30 70 L 30 30 L 70 30" stroke={color} strokeOpacity={opacity * 2} strokeWidth="2" fill="none" />
        <path d="M 430 30 L 470 30 L 470 70" stroke={color} strokeOpacity={opacity * 2} strokeWidth="2" fill="none" />
        <path d="M 30 430 L 30 470 L 70 470" stroke={color} strokeOpacity={opacity * 2} strokeWidth="2" fill="none" />
        <path d="M 470 430 L 470 470 L 430 470" stroke={color} strokeOpacity={opacity * 2} strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
