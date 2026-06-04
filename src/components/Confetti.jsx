// Kleines, CSS-basiertes Konfetti (kein Asset). Per Portal an document.body,
// damit es garantiert den ganzen Viewport überlagert (kein transformierter
// Eltern-Container kann die fixe Positionierung „kapern").
import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'

const COLORS = ['#2563EB', '#EC4899', '#7C3AED', '#16A34A', '#F59E0B', '#EF4444']

export default function Confetti({ count = 30 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        dur: 1.3 + Math.random() * 1.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 7 + Math.random() * 5,
        h: 10 + Math.random() * 8,
      })),
    [count]
  )
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: p.left + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.dur + 's',
            background: p.color,
            width: p.w + 'px',
            height: p.h + 'px',
          }}
        />
      ))}
    </div>,
    document.body
  )
}
