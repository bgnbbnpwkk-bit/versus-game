// Kleines, CSS-basiertes Konfetti (kein Asset). Wird kurz eingeblendet.
import React, { useMemo } from 'react'

const COLORS = ['#2563EB', '#EC4899', '#7C3AED', '#16A34A', '#F59E0B', '#EF4444']

export default function Confetti({ count = 28 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        dur: 1.1 + Math.random() * 0.9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 7 + Math.random() * 5,
        h: 10 + Math.random() * 8,
      })),
    [count]
  )
  return (
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
    </div>
  )
}
