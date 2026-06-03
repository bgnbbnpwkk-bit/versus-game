// =====================================================================
// Fallback-Inhalte, falls kein gültiger Gemini-API-Key gesetzt ist oder
// die API nicht erreichbar ist. So bleibt das Spiel immer spielbar.
// =====================================================================

export const FALLBACK_QUESTIONS = {
  allgemeinwissen: [
    {
      question: 'Welches ist das kleinste Land der Welt (nach Fläche)?',
      options: ['Monaco', 'Vatikanstadt', 'San Marino', 'Liechtenstein'],
      correctIndex: 1,
    },
    {
      question: 'Wie viele Bundesländer hat Deutschland?',
      options: ['14', '15', '16', '17'],
      correctIndex: 2,
    },
    {
      question: 'Welches chemische Element hat das Symbol "Au"?',
      options: ['Silber', 'Aluminium', 'Gold', 'Argon'],
      correctIndex: 2,
    },
  ],
  'filme-serien': [
    {
      question: 'In welchem Film sagt eine Figur "Ich mache ihm ein Angebot, das er nicht ablehnen kann"?',
      options: ['Scarface', 'Der Pate', 'Goodfellas', 'Casino'],
      correctIndex: 1,
    },
    {
      question: 'Wie heißt die Bar in der Serie "How I Met Your Mother"?',
      options: ["MacLaren's", "Central Perk", "Paddy's Pub", "Cheers"],
      correctIndex: 0,
    },
    {
      question: 'Wer führte Regie bei "Inception" (2010)?',
      options: ['Steven Spielberg', 'Christopher Nolan', 'Ridley Scott', 'James Cameron'],
      correctIndex: 1,
    },
  ],
  musik: [
    {
      question: 'Aus welchem Land kommt die Band ABBA?',
      options: ['Norwegen', 'Dänemark', 'Schweden', 'Finnland'],
      correctIndex: 2,
    },
    {
      question: 'Welches Instrument spielte Jimi Hendrix hauptsächlich?',
      options: ['Schlagzeug', 'Bass', 'Gitarre', 'Klavier'],
      correctIndex: 2,
    },
    {
      question: 'Wie hieß der Leadsänger von Queen?',
      options: ['Freddie Mercury', 'Brian May', 'Roger Taylor', 'John Deacon'],
      correctIndex: 0,
    },
  ],
  'mode-design': [
    {
      question: 'Welches Modehaus erfand das "kleine Schwarze"?',
      options: ['Dior', 'Chanel', 'Versace', 'Prada'],
      correctIndex: 1,
    },
    {
      question: 'Welche Farbe entsteht aus Blau und Gelb?',
      options: ['Orange', 'Violett', 'Grün', 'Braun'],
      correctIndex: 2,
    },
    {
      question: 'Welcher Designer ist für das doppelte "G"-Logo bekannt?',
      options: ['Gucci', 'Givenchy', 'Galliano', 'Gaultier'],
      correctIndex: 0,
    },
  ],
  kochen: [
    {
      question: 'Welche Zutat darf in einem klassischen Pesto alla Genovese NICHT fehlen?',
      options: ['Petersilie', 'Basilikum', 'Koriander', 'Minze'],
      correctIndex: 1,
    },
    {
      question: 'Was ist die Hauptzutat von Guacamole?',
      options: ['Erbsen', 'Avocado', 'Zucchini', 'Brokkoli'],
      correctIndex: 1,
    },
    {
      question: 'Bei welcher Temperatur (ca.) kocht Wasser auf Meereshöhe?',
      options: ['80 °C', '90 °C', '100 °C', '120 °C'],
      correctIndex: 2,
    },
  ],
  geschichte: [
    {
      question: 'In welchem Jahr fiel die Berliner Mauer?',
      options: ['1987', '1989', '1991', '1985'],
      correctIndex: 1,
    },
    {
      question: 'Wer war der erste römische Kaiser?',
      options: ['Julius Cäsar', 'Augustus', 'Nero', 'Konstantin'],
      correctIndex: 1,
    },
    {
      question: 'In welchem Jahr begann der Erste Weltkrieg?',
      options: ['1912', '1914', '1916', '1918'],
      correctIndex: 1,
    },
  ],
  astronomie: [
    {
      question: 'Welcher Planet ist der größte in unserem Sonnensystem?',
      options: ['Saturn', 'Neptun', 'Jupiter', 'Uranus'],
      correctIndex: 2,
    },
    {
      question: 'Wie heißt der nächstgelegene Stern zur Erde (außer der Sonne)?',
      options: ['Sirius', 'Proxima Centauri', 'Betelgeuse', 'Wega'],
      correctIndex: 1,
    },
    {
      question: 'Wie viele Monde hat der Mars?',
      options: ['0', '1', '2', '4'],
      correctIndex: 2,
    },
  ],
  literatur: [
    {
      question: 'Wer schrieb "Faust"?',
      options: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Heinrich Heine', 'Thomas Mann'],
      correctIndex: 1,
    },
    {
      question: 'Wie heißt der Zauberlehrling aus J.K. Rowlings Romanen?',
      options: ['Frodo Beutlin', 'Harry Potter', 'Percy Jackson', 'Bilbo Beutlin'],
      correctIndex: 1,
    },
    {
      question: 'Welches Werk beginnt mit "Call me Ishmael"?',
      options: ['Moby Dick', 'Der alte Mann und das Meer', 'Robinson Crusoe', 'Die Schatzinsel'],
      correctIndex: 0,
    },
  ],
}

// Kommentare nach Ausgang der Runde (outcome):
// 'harmony'  → beide richtig & gleich (2 Punkte)
// 'split'    → beide richtig, verschieden (1 Punkt)
// 'one'      → einer richtig, einer falsch (0.5)
// 'fail'     → beide falsch (Punkt für VERA)
export const FALLBACK_COMMENTS = {
  harmony: [
    'Na gut... das war tatsächlich beeindruckend. Widerwillig anerkannt. 😒',
    'Perfekte Harmonie? Genießt es, das passiert nicht oft.',
    'Okay, okay. Ihr zwei seid eingespielt. Ärgerlich.',
  ],
  split: [
    'Beide richtig, aber uneinig. Kommuniziert ihr eigentlich? 😏',
    'Richtig geraten – nur leider nicht im Einklang.',
    'Zwei richtige Antworten, null Teamgeist. Süß.',
  ],
  one: [
    'Einer von euch hat geschlafen. Ich sage nicht wer. 🙄',
    'Halbe Sache. Halbe Punkte. Halb so wild – für mich.',
    'Einer trägt, einer wird getragen. Wie im echten Leben, oder?',
  ],
  fail: [
    'Beide daneben! Bücher sind halt doch wichtig. 😈',
    'Das war... bemerkenswert falsch. Punkt für mich, danke!',
    'Tja, und das bei eurer Kategorie. Peinlich, peinlich.',
    'Ihr macht es mir wirklich zu leicht. Weiter so! 🤖',
  ],
}
