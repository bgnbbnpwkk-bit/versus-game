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

export function randomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
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
