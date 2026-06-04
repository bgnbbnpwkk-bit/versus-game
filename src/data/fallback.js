// =====================================================================
// Fallback-Inhalte, falls kein gültiger Gemini-API-Key gesetzt ist oder
// die API nicht erreichbar ist. So bleibt das Spiel immer spielbar.
// =====================================================================

export const FALLBACK_QUESTIONS = {
  allgemeinwissen: [
    { question: 'Welches ist das kleinste Land der Welt (nach Fläche)?', options: ['Monaco', 'Vatikanstadt', 'San Marino', 'Liechtenstein'], correctIndex: 1 },
    { question: 'Wie viele Bundesländer hat Deutschland?', options: ['14', '15', '16', '17'], correctIndex: 2 },
    { question: 'Welches chemische Element hat das Symbol "Au"?', options: ['Silber', 'Aluminium', 'Gold', 'Argon'], correctIndex: 2 },
    { question: 'Wie viele Kontinente gibt es?', options: ['5', '6', '7', '8'], correctIndex: 2 },
    { question: 'Wie heißt die Hauptstadt von Australien?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
    { question: 'Welches Organ produziert Insulin?', options: ['Leber', 'Bauchspeicheldrüse', 'Niere', 'Milz'], correctIndex: 1 },
    { question: 'Wie viele Beine hat eine Spinne?', options: ['6', '8', '10', '12'], correctIndex: 1 },
    { question: 'Welcher Planet ist der Sonne am nächsten?', options: ['Venus', 'Merkur', 'Erde', 'Mars'], correctIndex: 1 },
  ],
  'filme-serien': [
    { question: 'In welchem Film sagt eine Figur "Ich mache ihm ein Angebot, das er nicht ablehnen kann"?', options: ['Scarface', 'Der Pate', 'Goodfellas', 'Casino'], correctIndex: 1 },
    { question: 'Wie heißt die Bar in der Serie "How I Met Your Mother"?', options: ["MacLaren's", 'Central Perk', "Paddy's Pub", 'Cheers'], correctIndex: 0 },
    { question: 'Wer führte Regie bei "Inception" (2010)?', options: ['Steven Spielberg', 'Christopher Nolan', 'Ridley Scott', 'James Cameron'], correctIndex: 1 },
    { question: 'Wer spielt Jack in "Titanic" (1997)?', options: ['Brad Pitt', 'Leonardo DiCaprio', 'Johnny Depp', 'Tom Cruise'], correctIndex: 1 },
    { question: 'In welcher Stadt spielt die Serie "Stranger Things" (Hawkins liegt dort)?', options: ['einem fiktiven Ort in Indiana', 'New York', 'Los Angeles', 'Chicago'], correctIndex: 0 },
    { question: 'Wie heißt der Zauberer in "Der Herr der Ringe"?', options: ['Saruman', 'Gandalf', 'Radagast', 'Sauron'], correctIndex: 1 },
    { question: 'Welcher Animationsfilm dreht sich um die Schwestern Elsa und Anna?', options: ['Vaiana', 'Rapunzel', 'Die Eiskönigin', 'Encanto'], correctIndex: 2 },
    { question: 'Welches Tier jagt im Film "Der weiße Hai"?', options: ['ein Wal', 'ein Hai', 'ein Krokodil', 'ein Oktopus'], correctIndex: 1 },
  ],
  musik: [
    { question: 'Aus welchem Land kommt die Band ABBA?', options: ['Norwegen', 'Dänemark', 'Schweden', 'Finnland'], correctIndex: 2 },
    { question: 'Welches Instrument spielte Jimi Hendrix hauptsächlich?', options: ['Schlagzeug', 'Bass', 'Gitarre', 'Klavier'], correctIndex: 2 },
    { question: 'Wie hieß der Leadsänger von Queen?', options: ['Freddie Mercury', 'Brian May', 'Roger Taylor', 'John Deacon'], correctIndex: 0 },
    { question: 'Wie viele Saiten hat eine Standard-Gitarre?', options: ['4', '5', '6', '7'], correctIndex: 2 },
    { question: 'Aus welcher Stadt stammen die Beatles?', options: ['London', 'Liverpool', 'Manchester', 'Birmingham'], correctIndex: 1 },
    { question: 'Wer sang den Hit "Like a Prayer"?', options: ['Madonna', 'Cher', 'Whitney Houston', 'Tina Turner'], correctIndex: 0 },
    { question: 'Wie nennt man den Taktgeber zum Üben in der Musik?', options: ['Metronom', 'Stimmgabel', 'Taktstock', 'Diapason'], correctIndex: 0 },
    { question: 'Wie viele Töne hat eine klassische Dur-Tonleiter (ohne Oktave)?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  ],
  'mode-design': [
    { question: 'Welches Modehaus erfand das "kleine Schwarze"?', options: ['Dior', 'Chanel', 'Versace', 'Prada'], correctIndex: 1 },
    { question: 'Welche Farbe entsteht aus Blau und Gelb?', options: ['Orange', 'Violett', 'Grün', 'Braun'], correctIndex: 2 },
    { question: 'Welcher Designer ist für das doppelte "G"-Logo bekannt?', options: ['Gucci', 'Givenchy', 'Galliano', 'Gaultier'], correctIndex: 0 },
    { question: 'Welche Marke nutzt den "Swoosh"-Haken als Logo?', options: ['Adidas', 'Nike', 'Puma', 'Reebok'], correctIndex: 1 },
    { question: 'Welches edle Material gewinnt man aus dem Kokon der Seidenraupe?', options: ['Wolle', 'Seide', 'Leinen', 'Baumwolle'], correctIndex: 1 },
    { question: 'Aus welchem Land stammt das Modehaus Versace?', options: ['Frankreich', 'Italien', 'Spanien', 'USA'], correctIndex: 1 },
    { question: 'Wie nennt man Schuhe mit hohem, schlankem Absatz?', options: ['Sneaker', 'Pumps', 'Loafer', 'Mokassin'], correctIndex: 1 },
    { question: 'Welche drei Farben sind die klassischen Grundfarben (subtraktiv)?', options: ['Rot, Grün, Blau', 'Cyan, Magenta, Gelb', 'Schwarz, Weiß, Grau', 'Orange, Lila, Grün'], correctIndex: 1 },
  ],
  kochen: [
    { question: 'Welche Zutat darf in einem klassischen Pesto alla Genovese NICHT fehlen?', options: ['Petersilie', 'Basilikum', 'Koriander', 'Minze'], correctIndex: 1 },
    { question: 'Was ist die Hauptzutat von Guacamole?', options: ['Erbsen', 'Avocado', 'Zucchini', 'Brokkoli'], correctIndex: 1 },
    { question: 'Bei welcher Temperatur (ca.) kocht Wasser auf Meereshöhe?', options: ['80 °C', '90 °C', '100 °C', '120 °C'], correctIndex: 2 },
    { question: 'Welches Gewürz ist (nach Gewicht) das teuerste der Welt?', options: ['Vanille', 'Safran', 'Kardamom', 'Zimt'], correctIndex: 1 },
    { question: 'Was ist die Hauptzutat von Hummus?', options: ['Linsen', 'Kichererbsen', 'weiße Bohnen', 'Erbsen'], correctIndex: 1 },
    { question: 'Welches Treibmittel lässt Hefeteig aufgehen?', options: ['Salz', 'Hefe', 'Zucker', 'Mehl'], correctIndex: 1 },
    { question: 'Welche Pastaform ist eine kurze Röhre?', options: ['Spaghetti', 'Penne', 'Tagliatelle', 'Farfalle'], correctIndex: 1 },
    { question: 'Aus welchen Grundzutaten besteht eine klassische Béchamelsauce?', options: ['nur Sahne', 'Butter, Mehl und Milch', 'Eigelb und Öl', 'Tomaten und Knoblauch'], correctIndex: 1 },
  ],
  geschichte: [
    { question: 'In welchem Jahr fiel die Berliner Mauer?', options: ['1987', '1989', '1991', '1985'], correctIndex: 1 },
    { question: 'Wer war der erste römische Kaiser?', options: ['Julius Cäsar', 'Augustus', 'Nero', 'Konstantin'], correctIndex: 1 },
    { question: 'In welchem Jahr begann der Erste Weltkrieg?', options: ['1912', '1914', '1916', '1918'], correctIndex: 1 },
    { question: 'Wer war die erste Bundeskanzlerin Deutschlands?', options: ['Ursula von der Leyen', 'Angela Merkel', 'Manuela Schwesig', 'Annalena Baerbock'], correctIndex: 1 },
    { question: 'In welchem Jahr erreichte Kolumbus Amerika?', options: ['1392', '1492', '1592', '1692'], correctIndex: 1 },
    { question: 'Welches Volk erbaute die Pyramiden von Gizeh?', options: ['Römer', 'Griechen', 'Ägypter', 'Perser'], correctIndex: 2 },
    { question: 'Wer betrat 1969 als erster Mensch den Mond?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Juri Gagarin', 'Michael Collins'], correctIndex: 1 },
    { question: 'In wie viele Besatzungszonen wurde Deutschland nach 1945 geteilt?', options: ['2', '3', '4', '5'], correctIndex: 2 },
  ],
  astronomie: [
    { question: 'Welcher Planet ist der größte in unserem Sonnensystem?', options: ['Saturn', 'Neptun', 'Jupiter', 'Uranus'], correctIndex: 2 },
    { question: 'Wie heißt der nächstgelegene Stern zur Erde (außer der Sonne)?', options: ['Sirius', 'Proxima Centauri', 'Betelgeuse', 'Wega'], correctIndex: 1 },
    { question: 'Wie viele Monde hat der Mars?', options: ['0', '1', '2', '4'], correctIndex: 2 },
    { question: 'Welcher Planet ist der Sonne am nächsten?', options: ['Venus', 'Merkur', 'Erde', 'Mars'], correctIndex: 1 },
    { question: 'Welcher Planet wird "Roter Planet" genannt?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
    { question: 'Was ist die Milchstraße?', options: ['ein Planet', 'eine Galaxie', 'ein einzelner Stern', 'ein Komet'], correctIndex: 1 },
    { question: 'Wie lange braucht das Sonnenlicht ungefähr bis zur Erde?', options: ['8 Sekunden', '8 Minuten', '8 Stunden', '8 Tage'], correctIndex: 1 },
    { question: 'Welcher Planet besitzt das markanteste Ringsystem?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptun'], correctIndex: 1 },
  ],
  literatur: [
    { question: 'Wer schrieb "Faust"?', options: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Heinrich Heine', 'Thomas Mann'], correctIndex: 1 },
    { question: 'Wie heißt der Zauberlehrling aus J.K. Rowlings Romanen?', options: ['Frodo Beutlin', 'Harry Potter', 'Percy Jackson', 'Bilbo Beutlin'], correctIndex: 1 },
    { question: 'Welches Werk beginnt mit "Call me Ishmael"?', options: ['Moby Dick', 'Der alte Mann und das Meer', 'Robinson Crusoe', 'Die Schatzinsel'], correctIndex: 0 },
    { question: 'Wer schrieb "Romeo und Julia"?', options: ['Goethe', 'William Shakespeare', 'Schiller', 'Dante'], correctIndex: 1 },
    { question: 'Wie heißt Sherlock Holmes\' treuer Begleiter?', options: ['Dr. Watson', 'Mr. Hyde', 'Inspector Lestrade', 'Professor Moriarty'], correctIndex: 0 },
    { question: 'Welcher Autor schrieb "Die Verwandlung"?', options: ['Franz Kafka', 'Thomas Mann', 'Hermann Hesse', 'Bertolt Brecht'], correctIndex: 0 },
    { question: 'In welchem Land spielt "Don Quijote"?', options: ['Italien', 'Spanien', 'Frankreich', 'Portugal'], correctIndex: 1 },
    { question: 'Wer schrieb den Roman "Buddenbrooks"?', options: ['Thomas Mann', 'Hermann Hesse', 'Heinrich Böll', 'Günter Grass'], correctIndex: 0 },
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
