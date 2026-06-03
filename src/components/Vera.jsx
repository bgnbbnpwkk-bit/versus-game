// =====================================================================
// VERA – gezeichnete SVG-Figur (Virtual Enemy & Rival Algorithm).
// Sitzt euch am "Tisch" gegenüber und reagiert mit Mimik auf das Spiel.
// expression: 'smug' | 'think' | 'gloat' | 'impressed' | 'angry'
//           | 'defeated' | 'neutral'
// =====================================================================
import React from 'react'

const SKIN = '#F3E8FF'
const BROW = '#3B2A6B'
const LIP = '#EC4899'

// --- Augenbrauen-Paar je nach Ausdruck ---
function Brows({ expr }) {
  const paths = {
    neutral: ['M66 73 Q78 69 90 72', 'M110 72 Q122 69 134 73'],
    smug: ['M66 74 Q78 71 90 73', 'M110 68 Q122 64 134 70'],
    think: ['M66 75 Q78 73 90 74', 'M110 66 Q122 62 134 68'],
    angry: ['M66 69 Q78 73 90 78', 'M110 78 Q122 73 134 69'],
    impressed: ['M66 66 Q78 60 90 65', 'M110 65 Q122 60 134 66'],
    defeated: ['M66 77 Q78 70 90 72', 'M110 72 Q122 70 134 77'],
    gloat: ['M66 70 Q78 66 90 70', 'M110 70 Q122 66 134 70'],
  }
  const [l, r] = paths[expr] || paths.neutral
  return (
    <g stroke={BROW} strokeWidth="4" strokeLinecap="round" fill="none">
      <path d={l} />
      <path d={r} />
    </g>
  )
}

// --- Ein Auge ---
function Eye({ cx, cy, expr }) {
  if (expr === 'gloat') {
    // Lachende, geschlossene Augen (∪)
    return (
      <path
        d={`M${cx - 11} ${cy - 2} Q${cx} ${cy + 8} ${cx + 11} ${cy - 2}`}
        fill="none"
        stroke="#2A1B4A"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    )
  }
  const lookUp = expr === 'think' ? -3 : 0
  const wide = expr === 'impressed'
  const rx = wide ? 13 : 12
  const ry = wide ? 12.5 : 10
  // Lidabsenkung für lauernde/müde Ausdrücke
  const lidShift =
    expr === 'smug' || expr === 'angry' || expr === 'think'
      ? ry * 0.6
      : expr === 'defeated'
      ? ry * 0.45
      : null

  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <circle cx={cx} cy={cy + 11} r="12" fill="#A855F7" opacity="0.18" />
      <circle cx={cx} cy={cy + lookUp} r="6.6" fill="url(#veraIris)" />
      <circle cx={cx} cy={cy + lookUp} r="3" fill="#1E1B4B" />
      <circle cx={cx - 2.2} cy={cy - 2.2 + lookUp} r="1.7" fill="#fff" />
      {lidShift !== null && (
        <ellipse cx={cx} cy={cy - lidShift} rx={rx + 1.5} ry={ry} fill={SKIN} />
      )}
      {/* Blinzeln (CSS-animiert) */}
      <ellipse className="vera-eyelid" cx={cx} cy={cy} rx={rx + 1.5} ry={ry + 1} fill={SKIN} />
    </g>
  )
}

// --- Mund je nach Ausdruck ---
function Mouth({ expr }) {
  switch (expr) {
    case 'gloat':
      return (
        <g>
          <path d="M83 116 Q100 111 117 116 Q111 141 100 141 Q89 141 83 116 Z" fill="#6D1B3E" />
          <path d="M87 117 Q100 114 113 117 L111 122 Q100 120 89 122 Z" fill="#fff" />
          <ellipse cx="100" cy="135" rx="7" ry="4" fill="#E8568A" />
        </g>
      )
    case 'impressed':
      return <ellipse cx="100" cy="125" rx="7" ry="9" fill="#6D1B3E" />
    case 'think':
      return <circle cx="100" cy="125" r="5" fill="#6D1B3E" />
    case 'defeated':
      return (
        <path d="M84 131 Q100 119 116 131" fill="none" stroke={LIP} strokeWidth="4" strokeLinecap="round" />
      )
    case 'angry':
      return (
        <path d="M86 127 Q100 122 114 127" fill="none" stroke={LIP} strokeWidth="4" strokeLinecap="round" />
      )
    case 'smug':
      return (
        <path d="M83 125 Q100 129 118 115" fill="none" stroke={LIP} strokeWidth="4" strokeLinecap="round" />
      )
    case 'neutral':
    default:
      return (
        <path d="M84 120 Q100 132 116 120" fill="none" stroke={LIP} strokeWidth="4" strokeLinecap="round" />
      )
  }
}

export default function Vera({ expression = 'smug', size = 150, float = true }) {
  const expr = expression
  return (
    <svg
      className={float ? 'vera-svg vera-float' : 'vera-svg'}
      width={size}
      height={size * 1.1}
      viewBox="0 0 200 220"
      role="img"
      aria-label={`VERA ist ${expr}`}
    >
      <defs>
        <radialGradient id="veraIris" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        <linearGradient id="veraHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="veraOutfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <radialGradient id="veraGem" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#DB2777" />
        </radialGradient>
      </defs>

      {/* Schultern / Outfit */}
      <path
        d="M40 220 Q42 168 70 156 L130 156 Q158 168 160 220 Z"
        fill="url(#veraOutfit)"
      />
      <path d="M86 152 L114 152 L108 170 L92 170 Z" fill={SKIN} />
      {/* Kragen-Akzent */}
      <path d="M86 152 L100 168 L114 152" fill="none" stroke="#A5B4FC" strokeWidth="2.5" />

      {/* Haar hinten (Bob) */}
      <path
        d="M48 92 Q48 36 100 32 Q152 36 152 92 Q156 140 138 168 Q150 120 140 96 L60 96 Q50 120 62 168 Q44 140 48 92 Z"
        fill="url(#veraHair)"
      />

      {/* Kopf */}
      <ellipse cx="100" cy="98" rx="50" ry="56" fill={SKIN} />

      {/* Ohr-LEDs */}
      <circle cx="52" cy="104" r="5" fill="#A855F7" />
      <circle cx="148" cy="104" r="5" fill="#A855F7" />

      {/* Haar vorne / asymmetrischer Pony */}
      <path
        d="M50 92 Q48 40 100 34 Q152 40 150 92 Q150 70 120 64 Q140 78 138 90 Q120 60 92 64 Q58 70 56 96 Q50 78 50 92 Z"
        fill="url(#veraHair)"
      />
      <path d="M150 90 Q146 60 112 60 Q150 64 150 92 Z" fill="#312E81" />

      {/* Stirn-Gem (KI-Marker) */}
      <g>
        <circle cx="100" cy="60" r="9" fill="#DB2777" opacity="0.35" />
        <path d="M100 53 L105 60 L100 67 L95 60 Z" fill="url(#veraGem)" />
      </g>

      {/* Headset-Mikro */}
      <path d="M150 104 Q166 116 150 140" fill="none" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="142" r="5" fill="#EC4899" />

      <Brows expr={expr} />
      <Eye cx="78" cy="90" expr={expr} />
      <Eye cx="122" cy="90" expr={expr} />

      {/* Nase */}
      <path d="M99 100 Q96 110 101 112" fill="none" stroke="#D8B4FE" strokeWidth="2.5" strokeLinecap="round" />

      {/* Wangenröte */}
      <ellipse cx="70" cy="116" rx="8" ry="5" fill="#F9A8D4" opacity="0.5" />
      <ellipse cx="130" cy="116" rx="8" ry="5" fill="#F9A8D4" opacity="0.5" />

      <Mouth expr={expr} />
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
