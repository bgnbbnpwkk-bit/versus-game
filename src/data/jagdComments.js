// VERA als Moderatorin von „Die Jagd" – Situations-Hinweise + Fallback-Sprüche.

// Hinweis an die KI je Situation ({c}=Kandidat:in, {h}=Jäger:in).
export const JAGD_SITUATION = {
  gameStart: 'Die Jagd beginnt gerade. Kündige sie spannend und frech an.',
  candidateCorrect: '{c} lag richtig und rückt eine Stufe Richtung Ziel vor. Sei sarkastisch anerkennend.',
  candidateWrong: '{c} lag falsch und bleibt stehen. Sei schadenfroh.',
  hunterCorrect: '{h} lag richtig und rückt näher an {c} heran. Baue bedrohlich Spannung auf.',
  hunterWrong: '{h} lag falsch und kommt nicht näher. Sei überrascht oder empört.',
  bothCorrect: 'Beide lagen richtig, der Abstand bleibt. Bleib spannungsvoll, leicht neutral.',
  bothWrong: 'Beide lagen falsch. Schäme dich fremd für beide.',
  candidateWins: '{c} hat das Ziel (Stufe 10) erreicht und entkommt der Jagd! Sei widerwillig anerkennend.',
  hunterWins: '{h} hat {c} eingeholt – gefangen! Triumphiere genüsslich.',
}

export const JAGD_FALLBACK = {
  gameStart: [
    'Die Jagd ist eröffnet! Mal sehen, wer kalte Füße bekommt. 😈',
    'Bühne frei für die Hatz – ich liebe es, wenn ihr schwitzt.',
    'Renn schon, die Jagd wartet nicht!',
  ],
  candidateCorrect: [
    'Na gut, ein Schrittchen weiter. Beeindruck mich ruhig weiter. 🙄',
    'Richtig – aber das Ziel ist noch weit, Häschen.',
    'Ein Punkt vor. Genieß den Vorsprung, solange er hält.',
  ],
  candidateWrong: [
    'Stehen geblieben! Tick, tack… die Jagd holt dich. 😏',
    'Daneben. Das war quasi eine Einladung an den Jäger.',
    'Oje, kein Schritt vor. Mutig, mutig.',
  ],
  hunterCorrect: [
    'Der Jäger kommt näher… ich rieche schon die Panik. 🐆',
    'Ein Schritt näher dran. Hörst du die Schritte?',
    'Die Falle schnappt langsam zu. Herrlich.',
  ],
  hunterWrong: [
    'Verfehlt?! Und das als Jäger – wie peinlich.',
    'Der Jäger stolpert. Glück gehabt, Kandidat:in.',
    'Daneben! So fängst du niemanden.',
  ],
  bothCorrect: [
    'Beide richtig – der Abstand bleibt. Die Spannung auch. 😬',
    'Patt. Ihr macht es mir gerade zu spannend.',
    'Kopf an Kopf. Ich hol schon mal Popcorn.',
  ],
  bothWrong: [
    'Beide falsch?! Ich moderiere hier offenbar Anfänger. 🤦',
    'Gemeinsam daneben. Wie romantisch und wie peinlich.',
    'Niemand bewegt sich. Bildung, ick hör dir trapsen.',
  ],
  candidateWins: [
    'Entkommen! Na gut… diesmal. Glückwunsch, widerwillig. 😤',
    'Das Ziel erreicht. Reines Glück, behaupte ich einfach.',
    'Geschafft. Ärgerlich, aber respektabel.',
  ],
  hunterWins: [
    'Gefangen! Die Jagd gehört dem Jäger. 😈🏆',
    'Eingeholt – Spiel vorbei, Häschen!',
    'Erwischt! Ich liebe ein Happy End… für den Jäger.',
  ],
}
