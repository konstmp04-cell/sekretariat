/**
 * Das Licht am Schalterfenster wandert über die Schicht.
 *
 * Der naheliegende Einfall wäre flackerndes Licht gewesen. Genau den habe ich
 * verworfen: Die Kernhandlung ist, zwei fast identische Kurven zu vergleichen.
 * Alles, was die Helligkeit ändert, WÄHREND man hinsieht, macht das schwerer
 * und liest sich, als arbeite das Spiel gegen einen.
 *
 * Der brauchbare Kern derselben Idee ist Licht, das Zeit trägt. Vom kalten
 * Morgen über den hellen Mittag zum tiefen, warmen Nachmittag – langsam genug,
 * dass es nie stört, und mit einem Nebennutzen: Man sieht ohne Zahl, wie weit
 * der Tag ist. Vorgang 12 von 14 FÜHLT sich dann spät an, statt es nur zu
 * heißen. Am letzten Tag steht Milan im Dämmerlicht.
 *
 * Entscheidend für die Verträglichkeit: Verändert wird ausschließlich die
 * Rückwand mit dem Schalterfenster. Der Schreibtisch, auf dem die Dokumente
 * liegen, behält über den ganzen Tag exakt dieselbe Beleuchtung. Das Licht
 * spielt dort, wo man nichts prüfen muss.
 */

/**
 * Farbe und Stärke des Fensterlichts an drei Punkten des Tages.
 *
 * Der erste Entwurf lag zwischen 0.13 und 0.20 Deckung bei ähnlichen Farben –
 * gemessen unterschied sich die Wand zwischen Morgen und Nachmittag um drei
 * von 255 Helligkeitsstufen. Also um nichts.
 *
 * Getragen wird der Eindruck von der FARBE, nicht von der Helligkeit: kaltes
 * Blaugrau gegen tiefes Bernstein. Helligkeit taugt hier ohnehin schlecht,
 * weil sie am Ende einfach dunkel wäre – und dunkel liest sich als Nacht,
 * nicht als später Nachmittag.
 */
const STATIONEN = [
  // Früh: flaches, kaltes Licht, die Neonröhre gibt den Ton an.
  { rot: 150, gruen: 190, blau: 232, staerke: 0.3, hoehe: 176, dunkel: 0.04 },
  // Mittag: am hellsten und am neutralsten.
  { rot: 246, gruen: 233, blau: 196, staerke: 0.34, hoehe: 196, dunkel: 0 },
  // Nachmittag: tief und warm, dazu sinkt der Raum ab.
  { rot: 232, gruen: 130, blau: 46, staerke: 0.3, hoehe: 140, dunkel: 0.22 },
]

const misch = (a, b, t) => a + (b - a) * t

/**
 * @param {number} fortschritt 0 = Schichtbeginn, 1 = letzter Vorgang
 * @param {{waerme: number, zusatzDunkel: number}} [wetter] Dämpfung aus wetter.js
 * @returns {{schein: string, hoehe: number, wandton: string}}
 */
export function lichtFuer(fortschritt, wetter = { waerme: 1, zusatzDunkel: 0 }) {
  const f = Math.max(0, Math.min(1, fortschritt))
  // Zwischen den drei Stationen linear überblenden.
  const abschnitt = f < 0.5 ? 0 : 1
  const t = f < 0.5 ? f * 2 : (f - 0.5) * 2
  const a = STATIONEN[abschnitt]
  const b = STATIONEN[abschnitt + 1]

  // Das Wetter zieht den Tagesverlauf zum Morgen zurück. Bei Regen bleibt es
  // den ganzen Tag bei kaltem, flachem Licht – der Nachmittag findet einfach
  // nicht statt. Gemischt wird gegen Station 0, nicht gegen Grau: Ein
  // entsättigter Sonnenuntergang sähe nach kaputtem Bildschirm aus, ein
  // ausbleibender nach schlechtem Wetter.
  const w = Math.max(0, Math.min(1, wetter.waerme))
  const zu = (wert, morgens) => misch(morgens, wert, w)

  const rot = Math.round(zu(misch(a.rot, b.rot, t), STATIONEN[0].rot))
  const gruen = Math.round(zu(misch(a.gruen, b.gruen, t), STATIONEN[0].gruen))
  const blau = Math.round(zu(misch(a.blau, b.blau, t), STATIONEN[0].blau))
  const staerke = zu(misch(a.staerke, b.staerke, t), STATIONEN[0].staerke)
  const hoehe = Math.round(zu(misch(a.hoehe, b.hoehe, t), STATIONEN[0].hoehe))
  const dunkel = misch(a.dunkel, b.dunkel, t) + (wetter.zusatzDunkel ?? 0)

  return {
    schein: `radial-gradient(ellipse 46% 66% at 50% 100%, rgb(${rot} ${gruen} ${blau} / ${staerke.toFixed(3)}), transparent 72%)`,
    hoehe,
    // Dieselbe Farbe über die ganze Rückwand, plus ein Absinken zum Abend hin.
    // Ohne den Anteil an der Wand leuchtet unten ein Pool in einem Zimmer,
    // das davon nichts mitbekommt.
    wandton:
      `linear-gradient(rgb(0 0 0 / ${dunkel.toFixed(3)}), rgb(0 0 0 / ${dunkel.toFixed(3)})),` +
      ` linear-gradient(rgb(${rot} ${gruen} ${blau} / ${(staerke * 0.36).toFixed(3)}), rgb(${rot} ${gruen} ${blau} / ${(staerke * 0.36).toFixed(3)}))`,
  }
}

/**
 * Wie weit ist der Tag? Bewusst über die Vorgänge und nicht über die Uhr:
 * Wer lange über einem Fall grübelt, soll dafür nicht in die Dämmerung
 * geraten – die Schicht misst sich in Arbeit, nicht in Minuten.
 */
export function fortschrittImTag(index, anzahl) {
  if (anzahl <= 1) return 0
  return index / (anzahl - 1)
}
