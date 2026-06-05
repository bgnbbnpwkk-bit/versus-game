// Visuelles Stufensystem für „Die Jagd": 11 Stufen (0–10).
// Kandidat 🏃 (grün) klettert zu 10, Jäger 🐆 (rot) jagt von 10 herab.
import React from 'react'

export default function StepTracker({ candidatePos, hunterPos }) {
  const steps = Array.from({ length: 11 }, (_, i) => i)
  return (
    <div className="steps" aria-label="Jagd-Spielfeld">
      {steps.map((i) => {
        const isCand = i === candidatePos
        const isHunt = i === hunterPos
        const isGoal = i === 10
        return (
          <div
            key={i}
            className={`step ${isGoal ? 'goal' : ''} ${isCand ? 'has-cand' : ''} ${isHunt ? 'has-hunt' : ''}`}
          >
            <span className="step-num">{i}</span>
            <span className="step-markers">
              {isCand && <span className="marker-cand">🏃</span>}
              {isHunt && <span className="marker-hunt">🐆</span>}
              {isGoal && !isCand && !isHunt && <span className="marker-goal">🏆</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}
