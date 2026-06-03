// =====================================================================
// VERA – gezeichnete SVG-Figur im Manga/Anime-Stil.
// Freche, überhebliche KI-Rivalin, die euch am "Tisch" gegenübersitzt.
// expression: 'smug' | 'think' | 'gloat' | 'impressed' | 'angry'
//           | 'defeated' | 'neutral'
// =====================================================================
import React from 'react'

const SKIN = '#FBEFFF'
const LASH = '#2B1A47'
const LIP = '#EC4899'

// --- Augenbrauen (dünn, manga) ---
function Brows({ expr }) {
  // [linke Braue, rechte Braue]
  const map = {
    neutral: ['M58 78 Q74 73 90 77', 'M110 77 Q126 73 142 78'],
    // smug: rechte Braue hochgezogen
    smug: ['M58 80 Q74 76 90 79', 'M110 70 Q126 63 142 69'],
    think: ['M58 81 Q74 78 90 80', 'M110 69 Q126 62 142 68'],
    angry: ['M58 74 Q74 79 92 84', 'M108 84 Q126 79 142 74'],
    impressed: ['M58 70 Q74 62 90 68', 'M110 68 Q126 62 142 70'],
    defeated: ['M58 82 Q74 74 92 78', 'M108 78 Q126 74 142 82'],
    gloat: ['M58 75 Q74 71 90 75', 'M110 75 Q126 71 142 75'],
  }
  const [l, r] = map[expr] || map.neutral
  return (
    <g stroke={LASH} strokeWidth="3.4" strokeLinecap="round" fill="none">
      <path d={l} />
      <path d={r} />
    </g>
  )
}

// --- Ein großes Manga-Auge ---
function Eye({ cx, cy, expr, side }) {
  // Geschlossene, fiese Lach-Augen (∧)
  if (expr === 'gloat') {
    return (
      <path
        d={`M${cx - 16} ${cy + 5} Q${cx} ${cy - 11} ${cx + 16} ${cy + 5}`}
        fill="none"
        stroke={LASH}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    )
  }

  const wide = expr === 'impressed'
  const rx = wide ? 18 : 16
  const ry = wide ? 24 : 22

  const half = expr === 'smug' || expr === 'angry' || expr === 'defeated'
  const lidDrop = expr === 'defeated' ? ry * 0.72 : half ? ry * 0.5 : 0
  const lookY = expr === 'think' ? -5 : expr === 'defeated' ? 4 : expr === 'smug' ? 3 : 0
  const lidY = cy - ry + lidDrop
  const outerX = side < 0 ? cx - rx : cx + rx

  return (
    <g>
      {/* Sklera */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      {/* Iris (hoch, anime) */}
      <ellipse cx={cx} cy={cy + lookY + 2} rx={rx - 3} ry={ry - 2} fill="url(#veraIris)" />
      <ellipse cx={cx} cy={cy + lookY + 4} rx={rx - 8} ry={ry - 8} fill="#3B1D6E" />
      <circle cx={cx} cy={cy + lookY + 8} r="3.4" fill="#1B0E3A" />
      {/* Glanzlichter */}
      <circle cx={cx - 5} cy={cy + lookY - 7} r="5.5" fill="#fff" />
      <circle cx={cx + 5} cy={cy + lookY + 9} r="2.6" fill="#fff" opacity="0.9" />

      {/* Oberlid (Hautfarbe) zum Abschneiden bei halb geschlossenen Augen */}
      {lidDrop > 0 && (
        <rect x={cx - rx - 4} y={cy - ry - 12} width={rx * 2 + 8} height={lidDrop + 12} fill={SKIN} />
      )}

      {/* Obere Wimpernlinie (dick) + äußerer Schwung */}
      <path
        d={
          lidDrop > 0
            ? `M${cx - rx} ${lidY + 1} Q${cx} ${lidY - 3} ${cx + rx} ${lidY + 1}`
            : `M${cx - rx} ${cy - 1} Q${cx} ${cy - ry - 3} ${cx + rx} ${cy - 1}`
        }
        fill="none"
        stroke={LASH}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Äußerer Wimpern-Flick */}
      <path
        d={`M${outerX} ${lidDrop > 0 ? lidY : cy - 1} q${side * 6} ${-7} ${side * 11} ${-9}`}
        fill="none"
        stroke={LASH}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Anime-Träne bei "besiegt" */}
      {expr === 'defeated' && (
        <path
          d={`M${cx + 9} ${cy + ry - 2} q-4 8 0 12 q4 -4 0 -12 Z`}
          fill="#7DD3FC"
          opacity="0.9"
        />
      )}
    </g>
  )
}

// --- Mund (klein, manga) ---
function Mouth({ expr }) {
  switch (expr) {
    case 'gloat':
      // breites, fieses Grinsen mit kleinem Fang
      return (
        <g>
          <path d="M86 126 Q100 142 114 126 Q100 134 86 126 Z" fill="#6D1B3E" />
          <path d="M86 126 Q100 142 114 126" fill="none" stroke={LASH} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M104 130 L108 130 L106 136 Z" fill="#fff" />
        </g>
      )
    case 'impressed':
      return <ellipse cx="100" cy="130" rx="5.5" ry="7" fill="#6D1B3E" />
    case 'think':
      return (
        <path d="M92 130 Q100 127 108 131" fill="none" stroke={LIP} strokeWidth="3.4" strokeLinecap="round" />
      )
    case 'defeated':
      // zittriger Mund
      return (
        <path
          d="M90 131 q4 -4 8 0 q4 4 8 0 q3 -3 4 0"
          fill="none"
          stroke={LIP}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )
    case 'angry':
      return (
        <path d="M91 132 Q100 127 109 132" fill="none" stroke={LIP} strokeWidth="3.4" strokeLinecap="round" />
      )
    case 'smug':
      // schiefer Smirk
      return (
        <path d="M90 132 Q101 135 113 124" fill="none" stroke={LIP} strokeWidth="3.6" strokeLinecap="round" />
      )
    case 'neutral':
    default:
      return (
        <path d="M91 129 Q100 136 109 129" fill="none" stroke={LIP} strokeWidth="3.4" strokeLinecap="round" />
      )
  }
}

// --- Effekte: Schweißtropfen (think), Wut-Mark (angry) ---
function Effects({ expr }) {
  if (expr === 'think') {
    return <path d="M150 70 q-5 8 0 12 q5 -4 0 -12 Z" fill="#7DD3FC" opacity="0.9" />
  }
  if (expr === 'angry') {
    return (
      <g stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M150 56 l10 0 M155 51 l0 10" />
        <path d="M148 64 l7 -3 M150 70 l7 -2" opacity="0.8" />
      </g>
    )
  }
  return null
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
        <radialGradient id="veraIris" cx="50%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </radialGradient>
        <linearGradient id="veraHair" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="veraOutfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <radialGradient id="veraGem" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#DB2777" />
        </radialGradient>
      </defs>

      {/* Schultern / Outfit */}
      <path d="M38 220 Q40 166 72 154 L128 154 Q160 166 162 220 Z" fill="url(#veraOutfit)" />
      <path d="M88 150 L112 150 L106 168 L94 168 Z" fill={SKIN} />
      <path d="M88 150 L100 166 L112 150" fill="none" stroke="#C4B5FD" strokeWidth="2.5" />

      {/* Haar hinten (lange, spitze Manga-Strähnen) */}
      <path
        d="M44 96 Q40 40 100 32 Q160 40 156 96 Q162 150 150 176 L138 150
           Q150 120 144 100 L56 100 Q50 120 62 150 L50 176 Q38 150 44 96 Z"
        fill="url(#veraHair)"
      />
      {/* Seitliche Spitzsträhnen, die das Gesicht rahmen */}
      <path d="M52 96 L40 168 L58 132 Q56 110 60 100 Z" fill="url(#veraHair)" />
      <path d="M148 96 L160 168 L142 132 Q144 110 140 100 Z" fill="url(#veraHair)" />

      {/* Kopf (spitzes Manga-Kinn) */}
      <path
        d="M100 44 C70 44 54 64 54 92 C54 120 62 142 80 156 C88 163 95 167 100 167
           C105 167 112 163 120 156 C138 142 146 120 146 92 C146 64 130 44 100 44 Z"
        fill={SKIN}
      />

      {/* Ohr-LEDs (Anime-Ohrringe) */}
      <circle cx="55" cy="112" r="4.5" fill="#EC4899" />
      <circle cx="145" cy="112" r="4.5" fill="#EC4899" />

      {/* Pony – spitze Strähnen über der Stirn */}
      <g fill="url(#veraHair)">
        <path d="M50 60 Q56 96 70 92 Q60 74 64 56 Z" />
        <path d="M66 50 Q70 92 86 90 Q78 70 82 50 Z" />
        <path d="M86 46 Q86 88 100 86 Q96 66 100 46 Z" />
        <path d="M100 46 Q104 88 118 84 Q112 64 116 48 Z" />
        <path d="M116 48 Q124 90 138 88 Q130 70 134 52 Z" />
        <path d="M134 54 Q146 94 150 60 Q146 56 140 56 Z" />
      </g>
      {/* Haar-Glanzstreifen */}
      <path d="M74 44 Q100 36 126 44 Q100 40 74 44 Z" fill="#A78BFA" opacity="0.7" />

      {/* Stirn-Gem (zwischen den Strähnen) */}
      <g>
        <circle cx="100" cy="70" r="7" fill="#DB2777" opacity="0.35" />
        <path d="M100 64 L104 70 L100 76 L96 70 Z" fill="url(#veraGem)" />
      </g>

      {/* Headset-Mikro */}
      <path d="M146 112 Q164 124 148 150" fill="none" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
      <circle cx="148" cy="152" r="4.5" fill="#EC4899" />

      <Brows expr={expr} />
      <Eye cx="74" cy="102" expr={expr} side={-1} />
      <Eye cx="126" cy="102" expr={expr} side={1} />

      {/* Näschen */}
      <path d="M99 116 q2 3 -1 5" fill="none" stroke="#E9C6F5" strokeWidth="2.2" strokeLinecap="round" />

      {/* Dezente Anime-Wangenröte */}
      <g opacity="0.55">
        <ellipse cx="66" cy="126" rx="9" ry="4" fill="#F9A8D4" />
        <ellipse cx="134" cy="126" rx="9" ry="4" fill="#F9A8D4" />
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
