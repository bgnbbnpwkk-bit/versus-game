// =====================================================================
// Die 8 Kategorien mit Farben + Stärken-Info (für VERAs Kommentare)
// =====================================================================

export const CATEGORIES = [
  {
    id: 'allgemeinwissen',
    name: 'Allgemeinwissen',
    color: '#6B7280', // Grau
    strength: 'both', // Beide gut
  },
  {
    id: 'filme-serien',
    name: 'Filme & Serien',
    color: '#DC2626', // Crimson
    strength: 'both',
  },
  {
    id: 'musik',
    name: 'Musik',
    color: '#7C3AED', // Violett
    strength: 'both',
  },
  {
    id: 'mode-design',
    name: 'Mode & Design',
    color: '#EC4899', // Pink
    strength: 'melli', // Eher Melli
  },
  {
    id: 'kochen',
    name: 'Kochen',
    color: '#EA580C', // Orange
    strength: 'melli',
  },
  {
    id: 'geschichte',
    name: 'Geschichte',
    color: '#92400E', // Ocker
    strength: 'marc', // Eher Marc
  },
  {
    id: 'astronomie',
    name: 'Astronomie',
    color: '#2563EB', // Blau
    strength: 'marc',
  },
  {
    id: 'literatur',
    name: 'Literatur',
    color: '#059669', // Smaragd
    strength: 'weak', // Beide schwach
  },
]

export function getCategoryByName(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[0]
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
}

export function randomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Erzeugt eine faire Kategorie-Reihenfolge für eine Runde:
// jede der 8 Kategorien kommt einmal vor (gemischt), erst danach Wiederholungen –
// nie zweimal dieselbe Kategorie direkt hintereinander.
export function buildCategoryPlan(n) {
  const ids = CATEGORIES.map((c) => c.id)
  let plan = shuffle(ids)
  while (plan.length < n) {
    const extra = shuffle(ids)
    for (const id of extra) {
      if (plan.length >= n) break
      if (plan[plan.length - 1] !== id) plan.push(id)
    }
  }
  // Sicherheitscheck gegen direkte Wiederholungen
  for (let i = 1; i < plan.length; i++) {
    if (plan[i] === plan[i - 1]) {
      const swap = plan.findIndex((id, k) => k > i && id !== plan[i - 1] && id !== plan[i + 1])
      if (swap > -1) [plan[i], plan[swap]] = [plan[swap], plan[i]]
    }
  }
  return plan.slice(0, n)
}

// Liefert einen Hinweis für VERA passend zur Kategorie-Stärke.
export function categoryHint(category) {
  switch (category.strength) {
    case 'melli':
      return 'Das ist eigentlich Mellis Paradedisziplin – bei einem Fehler von Melli sei besonders spitz.'
    case 'marc':
      return 'Das ist eigentlich Marcs Paradedisziplin – bei einem Fehler von Marc sei besonders spitz.'
    case 'weak':
      return 'In dieser Kategorie sind beide schwach – sei triumphierend, betone wie wichtig Bildung ist.'
    default:
      return 'In dieser Kategorie sind beide eigentlich gut – ein Fehler ist also doppelt peinlich.'
  }
}
