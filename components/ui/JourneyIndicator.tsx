'use client'

import { useEffect, useRef, useState } from 'react'

const chapters = [
  ['01', 'IDEA', 'idea'],
  ['02', 'CREATE', 'create-chapter'],
  ['03', 'BUILD', 'build-chapter'],
  ['04', 'GROW', 'grow-chapter'],
  ['05', 'WORK', 'work'],
] as const

export function JourneyIndicator() {
  const [active, setActive] = useState('idea')
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = chapters
      .map(([, , id]) => document.querySelector<HTMLElement>(`[data-motion-id="${id}"]`) || document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    let raf = 0
    const update = () => {
      raf = 0
      const probe = innerHeight * 0.46
      let best = sections[0]
      let distance = Infinity
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const d = Math.abs(rect.top + Math.min(rect.height, innerHeight) * 0.18 - probe)
        if (d < distance) { distance = d; best = section }
      })
      setActive(best.id === 'work' ? 'work' : best.dataset.motionId || best.id)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    const current = railRef.current?.querySelector<HTMLElement>('.journey-item.is-active')
    current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  const go = (id: string) => {
    const target = document.getElementById(id) || document.querySelector<HTMLElement>(`[data-motion-id="${id}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="journey" aria-label="Creation journey">
      <div className="journey-track" ref={railRef}>
        {chapters.map(([number, label, id], index) => {
          const current = active === id
          return (
            <button key={id} className={`journey-item${current ? ' is-active' : ''}`} onClick={() => go(id)} aria-current={current ? 'step' : undefined}>
              <span className="journey-number">{number}</span>
              <span className="journey-label">{label}</span>
              <i aria-hidden="true" style={{ '--journey-index': index } as React.CSSProperties} />
            </button>
          )
        })}
      </div>
    </aside>
  )
}
