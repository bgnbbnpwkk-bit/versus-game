// =====================================================================
// Sound – synthetisiert per Web Audio API (keine Sounddateien nötig).
// Auf iOS muss der AudioContext per Nutzergeste „entsperrt" werden;
// das passiert automatisch beim ersten Tippen.
// =====================================================================

const MUTE_KEY = 'versus_muted'
let ctx = null

export function isMuted() {
  try {
    return !!localStorage.getItem(MUTE_KEY)
  } catch {
    return false
  }
}

export function setMuted(m) {
  try {
    if (m) localStorage.setItem(MUTE_KEY, '1')
    else localStorage.removeItem(MUTE_KEY)
  } catch {
    /* ignore */
  }
}

function getCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

// Entsperrt Audio beim ersten Tippen (iOS).
if (typeof window !== 'undefined') {
  const unlock = () => {
    getCtx()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('touchstart', unlock)
  }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('touchstart', unlock, { once: true })
}

// Spielt einen Ton.
function tone(freq, startOffset, dur, { type = 'sine', gain = 0.18 } = {}) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + startOffset
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function play(fn) {
  if (isMuted()) return
  const c = getCtx()
  if (!c) return
  fn()
}

// Kurzes Tippen beim Auswählen einer Antwort.
export function playTap() {
  play(() => tone(540, 0, 0.07, { type: 'triangle', gain: 0.12 }))
}

// Bestätigen der Antwort.
export function playConfirm() {
  play(() => {
    tone(620, 0, 0.09, { type: 'triangle', gain: 0.14 })
    tone(880, 0.08, 0.12, { type: 'triangle', gain: 0.14 })
  })
}

// Auflösung – je nach Ausgang.
export function playReveal(outcome) {
  play(() => {
    if (outcome === 'harmony') {
      // fröhliches Arpeggio (C-E-G-C)
      ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, { type: 'triangle', gain: 0.16 }))
    } else if (outcome === 'split' || outcome === 'one') {
      tone(523, 0, 0.14, { type: 'triangle' })
      tone(784, 0.12, 0.2, { type: 'triangle' })
    } else {
      // VERA punktet: kurzer, komischer Abwärts-„Buzz"
      tone(300, 0, 0.16, { type: 'sawtooth', gain: 0.14 })
      tone(180, 0.14, 0.28, { type: 'sawtooth', gain: 0.14 })
    }
  })
}

// Spielende.
export function playFinish(teamWon) {
  play(() => {
    if (teamWon) {
      ;[523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.28, { type: 'triangle', gain: 0.17 }))
    } else {
      ;[440, 392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, { type: 'sawtooth', gain: 0.14 }))
    }
  })
}
