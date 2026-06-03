// =====================================================================
// VERA – süße Anime-Figur im gelben Hasen-Hoodie (Kigurumi-Style).
// Sitzt euch gegenüber und reagiert mit niedlicher Mimik.
// expression: 'smug' | 'think' | 'gloat' | 'impressed' | 'angry'
//           | 'defeated' | 'neutral'
// =====================================================================
import React from 'react'

const SKIN = '#FCE7D6'
const LASH = '#4A3320'
const LIP = '#D9776B'

// --- Augen (groß, rund, anime) ---
function Eye({ cx, cy, expr, side }) {
  if (expr === 'gloat') {
    // fröhlich geschlossen (^^)
    return (
      <path
        d={`M${cx - 13} ${cy + 3} Q${cx} ${cy - 9} ${cx + 13} ${cy + 3}`}
        fill="none"
        stroke={LASH}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    )
  }
  const wide = expr === 'impressed'
  const rx = wide ? 15 : 13
  const ry = wide ? 20 : 17
  const half = expr === 'smug' || expr === 'angry'
  const lidDrop = half ? ry * 0.42 : 0
  const lookX = expr === 'smug' ? side * 2 : 0
  const lookY = expr === 'think' ? -4 : 0

  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <ellipse cx={cx + lookX} cy={cy + lookY + 1} rx={rx - 1.5} ry={ry - 1.5} fill="url(#veraIris)" />
      <circle cx={cx + lookX} cy={cy + lookY + 3} r={rx - 6} fill="#3A2410" />
      <circle cx={cx + lookX - 4} cy={cy + lookY - 5} r="4.6" fill="#fff" />
      <circle cx={cx + lookX + 4} cy={cy + lookY + 6} r="2.4" fill="#fff" opacity="0.9" />

      {lidDrop > 0 && (
        <rect x={cx - rx - 3} y={cy - ry - 10} width={rx * 2 + 6} height={lidDrop + 10} fill={SKIN} />
      )}

      {/* obere Wimpernlinie */}
      <path
        d={
          lidDrop > 0
            ? `M${cx - rx} ${cy - ry + lidDrop} Q${cx} ${cy - ry + lidDrop - 3} ${cx + rx} ${cy - ry + lidDrop}`
            : `M${cx - rx - 1} ${cy - ry + 3} Q${cx} ${cy - ry - 4} ${cx + rx + 1} ${cy - ry + 3}`
        }
        fill="none"
        stroke={LASH}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Anime-Tränen bei "besiegt" */}
      {expr === 'defeated' && (
        <path d={`M${cx} ${cy + ry - 1} q-3 7 0 11 q3 -4 0 -11 Z`} fill="#7DD3FC" />
      )}
    </g>
  )
}

// --- Mund (klein, niedlich) ---
function Mouth({ expr }) {
  switch (expr) {
    case 'gloat':
      return (
        <path d="M91 137 Q100 147 109 137 Q100 141 91 137 Z" fill="#B45B4E" />
      )
    case 'impressed':
      return <ellipse cx="100" cy="138" rx="4.5" ry="6" fill="#B45B4E" />
    case 'think':
      return <path d="M94 138 Q100 136 106 139" fill="none" stroke={LIP} strokeWidth="3" strokeLinecap="round" />
    case 'defeated':
      return (
        <path d="M92 139 q4 -4 8 0 q4 4 8 0" fill="none" stroke={LIP} strokeWidth="3" strokeLinecap="round" />
      )
    case 'angry':
      return <path d="M94 140 Q100 135 106 140" fill="none" stroke={LIP} strokeWidth="3.2" strokeLinecap="round" />
    case 'smug':
      return <path d="M93 138 Q101 143 110 135" fill="none" stroke={LIP} strokeWidth="3.2" strokeLinecap="round" />
    case 'neutral':
    default:
      return <path d="M93 137 Q100 143 107 137" fill="none" stroke={LIP} strokeWidth="3.2" strokeLinecap="round" />
  }
}

function Effects({ expr }) {
  if (expr === 'think') {
    return <path d="M150 86 q-5 8 0 12 q5 -4 0 -12 Z" fill="#7DD3FC" opacity="0.9" />
  }
  if (expr === 'angry') {
    return (
      <g stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M150 70 l10 0 M155 65 l0 10" />
      </g>
    )
  }
  return null
}

export default function Vera({ expression = 'smug', size = 150, float = true }) {
  const expr = expression
  const blush = expr === 'angry' ? 0.7 : 0.5
  return (
    <svg
      className={float ? 'vera-svg vera-float' : 'vera-svg'}
      width={size}
      height={size}
      viewBox="0 0 200 210"
      role="img"
      aria-label={`VERA ist ${expr}`}
    >
      <defs>
        <radialGradient id="veraIris" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#B98A5E" />
          <stop offset="60%" stopColor="#7A4F2B" />
          <stop offset="100%" stopColor="#4A3320" />
        </radialGradient>
        <linearGradient id="veraHood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="veraHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A5636" />
          <stop offset="100%" stopColor="#4A3320" />
        </linearGradient>
      </defs>

      {/* Körper / Hoodie */}
      <path d="M34 210 Q36 168 72 158 L128 158 Q164 168 166 210 Z" fill="url(#veraHood)" />

      {/* Hasen-Ohren */}
      {/* rechtes, aufrechtes Ohr */}
      <path d="M120 64 C112 32 122 8 136 13 C152 20 149 52 138 68 Z" fill="url(#veraHood)" />
      <path d="M126 60 C122 40 128 24 135 27 C143 32 141 50 134 60 Z" fill="#F9A8D4" />
      {/* linkes, geknicktes Ohr */}
      <path d="M84 58 C74 36 64 20 50 27 C40 33 46 48 64 54 C72 57 80 60 84 58 Z" fill="url(#veraHood)" />
      <path d="M80 54 C72 40 62 30 54 34 C49 38 54 47 66 50 C72 52 78 55 80 54 Z" fill="#F9A8D4" />

      {/* Kapuze (hinter dem Gesicht) */}
      <path d="M48 168 C30 116 40 58 100 54 C160 58 170 116 152 168 C150 120 150 96 130 84 L70 84 C50 96 50 120 48 168 Z" fill="url(#veraHood)" />
      {/* kleine Hasen-Gesicht-Deko auf der Kapuze */}
      <circle cx="90" cy="52" r="2.6" fill="#4A3320" />
      <circle cx="110" cy="52" r="2.6" fill="#4A3320" />
      <path d="M97 59 Q100 62 103 59" fill="none" stroke="#B45B4E" strokeWidth="2" strokeLinecap="round" />

      {/* Fell-Kragen */}
      <g fill="#FFF7E6">
        <circle cx="74" cy="160" r="11" />
        <circle cx="90" cy="165" r="12" />
        <circle cx="110" cy="165" r="12" />
        <circle cx="126" cy="160" r="11" />
        <circle cx="100" cy="167" r="12" />
      </g>

      {/* Hals */}
      <path d="M90 150 L110 150 L107 164 L93 164 Z" fill={SKIN} />

      {/* Gesicht */}
      <ellipse cx="100" cy="112" rx="42" ry="45" fill={SKIN} />

      {/* Haar-Pony unter der Kapuze */}
      <path
        d="M60 104 C56 78 72 66 100 66 C128 66 144 78 140 104 C133 86 120 80 112 92
           C108 80 100 82 100 82 C100 82 92 80 88 92 C80 80 67 86 60 104 Z"
        fill="url(#veraHair)"
      />
      {/* seitliche Haarsträhnen */}
      <path d="M60 104 C54 120 56 138 62 148 C58 126 60 112 64 104 Z" fill="url(#veraHair)" />
      <path d="M140 104 C146 120 144 138 138 148 C142 126 140 112 136 104 Z" fill="url(#veraHair)" />

      <Eye cx="82" cy="112" expr={expr} side={-1} />
      <Eye cx="118" cy="112" expr={expr} side={1} />

      {/* Näschen */}
      <path d="M99 126 q1.5 2.5 -1 4" fill="none" stroke="#E6B89C" strokeWidth="2" strokeLinecap="round" />

      {/* Wangenröte */}
      <g opacity={blush}>
        <ellipse cx="70" cy="128" rx="9" ry="5.5" fill="#F9A8D4" />
        <ellipse cx="130" cy="128" rx="9" ry="5.5" fill="#F9A8D4" />
      </g>

      <Mouth expr={expr} />
      <Effects expr={expr} />
    </svg>
  )
}

// --- Hilfen: Ausdruck & Sprüche je nach Spielsituation ---

export function veraExpressionForPoints(lastPoints) {
  if (!lastPoints) return 'smug'
  if (lastPoints.ki > 0) return 'gloat' // beide falsch
  if (lastPoints.team >= 2) return 'impressed' // perfekte Harmonie
  return 'smug'
}

const QUESTION_TAUNTS = [
  'Na los, überrascht mich mal.',
  'Diese Frage knackt ihr eh nicht.',
  'Ich hab schon gewonnen, ihr wisst es nur noch nicht.',
  'Tick, tack… denkt nicht zu lange nach.',
  'Süß, dass ihr es überhaupt versucht.',
  'Stimmt euch ab? Ach nee, dürft ihr ja nicht. 😏',
  'Ich liebe diesen Teil. Den, wo ihr verliert.',
  'Konzentration, Kinder.',
  'Ein Tipp: ratet einfach. Ändert nichts.',
  'Ich warte… und genieße es.',
]

export function pickQuestionTaunt(seed = 0) {
  return QUESTION_TAUNTS[Math.abs(seed) % QUESTION_TAUNTS.length]
}

const WAIT_LINES = [
  'Na, traut ihr euch gegen mich?',
  'Zwei gegen eine? Wie niedlich.',
  'Ich bin bereit. Seid ihr es?',
  'Holt ruhig Verstärkung – hilft nichts.',
]

export function pickWaitLine(seed = 0) {
  return WAIT_LINES[Math.abs(seed) % WAIT_LINES.length]
}

export function veraResultExpression(teamScore, kiScore) {
  if (teamScore > kiScore) return 'defeated'
  if (kiScore > teamScore) return 'gloat'
  return 'angry'
}

export function veraResultLine(teamScore, kiScore) {
  if (teamScore > kiScore) return 'Pff. Reines Glück. Das zählt nicht!'
  if (kiScore > teamScore) return 'Hab ich doch gesagt. Ich gewinne immer. 😈'
  return 'Unentschieden? Das lasse ich nicht auf mir sitzen!'
}
