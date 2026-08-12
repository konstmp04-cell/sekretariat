/**
 * Das Wetter – sichtbar nur am Licht.
 *
 * Der erste Gedanke war Regen am Fenster. Der geht nicht, und zwar aus einem
 * Grund, der beim Hinsehen sofort auffällt: Das Sekretariat hat kein Fenster
 * nach draußen. Was man sieht, ist der Schalter zum Flur und die Rückwand.
 * Regentropfen ließen sich nur an eine Scheibe zeichnen, die es nicht gibt.
 *
 * So merkt man Wetter in einem Innenraum aber ohnehin nicht. Man merkt es am
 * Licht: An einem grauen Tag bleibt es flach und kalt und wird nie warm, so
 * spät es auch wird. Genau das macht dieses Modul – es greift in den
 * Tagesverlauf des Lichts ein, statt etwas obendrauf zu zeichnen.
 *
 * Die Tage sind nicht frei gewählt, sondern an die Zeitung gebunden. Am
 * vierten Tag meldet der Pausenhof „Turnhalle nach Wasserschaden gesperrt" –
 * dass es an genau diesem Tag regnet, macht aus zwei Systemen eines. Bisher
 * berichtete die Zeitung über eine Welt, von der auf dem Schirm nichts zu
 * sehen war.
 */

export const WETTER = {
  1: { art: 'klar', wort: 'Klar', grad: 7 },
  2: { art: 'grau', wort: 'Bedeckt', grad: 3 }, // Heizung im Ostflügel ausgefallen
  3: { art: 'klar', wort: 'Heiter', grad: 9 },
  4: { art: 'regen', wort: 'Dauerregen', grad: 6 }, // Turnhalle nach Wasserschaden
  5: { art: 'klar', wort: 'Sonnig', grad: 12 },
  6: { art: 'grau', wort: 'Hochnebel', grad: 8 },
  7: { art: 'klar', wort: 'Heiter', grad: 11 },
  8: { art: 'klar', wort: 'Wechselhaft', grad: 10 },
  9: { art: 'regen', wort: 'Regen', grad: 5 }, // Grippewelle erreicht die Oberstufe
  10: { art: 'grau', wort: 'Bedeckt', grad: 6 },
  11: { art: 'regen', wort: 'Regenschauer', grad: 4 },
  12: { art: 'klar', wort: 'Klar und kalt', grad: 2 }, // der letzte Tag steht für sich
}

export function wetterAmTag(tag) {
  return WETTER[tag] ?? WETTER[1]
}

/**
 * Wie stark schlägt der Tagesverlauf durch?
 *
 * 1 = voller Bogen vom kalten Morgen zum warmen Nachmittag.
 * Darunter wird der warme Teil zurückgenommen: Bei Regen bleibt es den ganzen
 * Tag über bei kaltem, flachem Licht – der Nachmittag findet einfach nicht
 * statt. Zusätzlich sinkt der Raum etwas früher ab.
 */
export function lichtDaempfung(tag) {
  const { art } = wetterAmTag(tag)
  if (art === 'regen') return { waerme: 0.25, zusatzDunkel: 0.1 }
  if (art === 'grau') return { waerme: 0.55, zusatzDunkel: 0.05 }
  return { waerme: 1, zusatzDunkel: 0 }
}
