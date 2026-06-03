// VERA-Bühne: sie sitzt euch am "Tisch" gegenüber, mit Namensschild und
// optionaler Sprechblase. Reagiert per Mimik (expression) auf das Spiel.
import React from 'react'
import Vera from './Vera.jsx'

export default function VeraStage({ expression = 'smug', line, size = 132, compact = false }) {
  return (
    <div className={`vera-stage ${compact ? 'compact' : ''}`}>
      <span className="vera-nametag">VERA</span>
      <div className="vera-figure">
        <Vera expression={expression} size={size} />
      </div>
      <div className="vera-desk" />
      {line && (
        <div className="vera-speech" key={line}>
          {line}
        </div>
      )}
    </div>
  )
}
