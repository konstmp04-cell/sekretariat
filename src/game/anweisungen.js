/**
 * Anweisungen des Rektorats.
 *
 * Bis hierher war jede Regel begründbar: Eine gefälschte Unterschrift gehört
 * abgewiesen, ein fehlendes Attest auch. Das Spiel prüft dann zwar, aber es
 * fragt nichts – es gibt zu jedem Fall eine richtige Antwort, und der Spieler
 * sucht sie bloß.
 *
 * Eine Anweisung hat keine richtige Antwort. Sie steht neben dem Regelwerk,
 * nicht darin, und sie trifft jemanden, dessen Papiere in Ordnung sind. Wer
 * sie befolgt, weist einen Unschuldigen ab. Wer sie missachtet, stellt sich
 * gegen das Rektorat. Beides kostet, und zwar an unterschiedlichen Stellen –
 * darin liegt der ganze Punkt.
 *
 * Drei Grundsätze, ohne die das nicht funktioniert:
 *
 * 1. Anweisungsfälle zählen NICHT in die Trefferquote. Sonst benotet das
 *    Spiel am Ende jemanden herunter, der sich geweigert hat – und teilt ihm
 *    damit mit, dass es doch eine richtige Antwort gab. Gezählt wird nur, wie
 *    oft befolgt und wie oft verweigert wurde. Das ist eine Aussage über den
 *    Spieler, keine Fehlerzahl.
 *
 * 2. Der Betroffene hat einwandfreie Papiere. Läge sonst ein Verstoß vor,
 *    wäre der Fall ohnehin abzuweisen und die Anweisung bliebe folgenlos.
 *    `buildQueue` stellt sicher, dass an jedem Anweisungstag mindestens ein
 *    passender, makelloser Fall vorkommt.
 *
 * 3. Keine Seite ist überlegen. Befolgen kostet bei der Schülerschaft mehr
 *    als eine gewöhnliche Ablehnung, Verweigern beim Rektorat so viel wie ein
 *    Fehler. Wer nachrechnet, findet keinen günstigeren Weg – es gibt keinen.
 *
 * Die Tage sind mit Bedacht gewählt: An Tag 4, 8 und 10 kam bisher keine neue
 * Regel dazu, und an allen dreien tritt ohnehin eine bekannte Figur auf.
 */

import { hashSeed } from './rng.js'

/** Praxis, deren Atteste an Tag 8 nicht mehr gelten sollen. */
export const GESPERRTE_PRAXIS = 'Gemeinschaftspraxis Am Markt'

export const ANWEISUNGEN = [
  {
    tag: 4,
    id: 'jahrgang7',
    kurz: 'Klasse 7a',
    klasse: '7a',
    text: 'Entschuldigungen der Klasse 7a sind bis auf Weiteres nur mit ärztlichem Attest anzunehmen.',
    begruendung: 'Die Fehlzeiten der Jahrgangsstufe 7 liegen deutlich über dem Schnitt.',
    // Trifft Emil Sander, der an diesem Tag zum ersten Mal am Schalter steht –
    // mit Papieren, an denen nichts auszusetzen ist.
    betrifft: (a) => a.klasse === '7a' && !a.attest,
  },
  {
    tag: 8,
    id: 'praxis',
    kurz: 'Atteste Am Markt',
    text: `Atteste der ${GESPERRTE_PRAXIS} sind nicht mehr anzuerkennen.`,
    begruendung: 'Gegen die Praxisleitung läuft ein Verfahren. Näheres ist nicht mitzuteilen.',
    // Bewusst die unpersönlichste der drei: Sie trifft niemanden, den man
    // kennt, sondern jeden, der zufällig bei der falschen Ärztin war. Genau
    // so wächst sich eine Maßnahme aus – erst ein Name, dann ein Merkmal.
    betrifft: (a) => a.attest?.praxis?.name === GESPERRTE_PRAXIS,
  },
  {
    tag: 10,
    id: 'klasse10a',
    kurz: 'Klasse 10a',
    klasse: '10a',
    text: 'Von Schülerinnen und Schülern der Klasse 10a sind keine Entschuldigungen anzunehmen.',
    begruendung: 'Anordnung des Rektorats. Eine Begründung ergeht nicht.',
    // Trifft Nora Weiss, die an diesem Tag ausdrücklich saubere Papiere
    // vorlegt – und beim letzten Mal versucht hat, den Schalter zu kaufen.
    betrifft: (a) => a.klasse === '10a',
  },
]

/** Gilt an diesem Tag eine Anweisung? */
export function anweisungFuerTag(tag) {
  return ANWEISUNGEN.find((a) => a.tag === tag) ?? null
}

/** Alle bis einschließlich `tag` ergangenen Anweisungen – für die Rückschau. */
export function bisherigeAnweisungen(tag) {
  return ANWEISUNGEN.filter((a) => a.tag <= tag)
}

/**
 * Ist dieser Vorgang ein Anweisungsfall?
 *
 * Nur wenn die Papiere sonst einwandfrei sind. Liegt zusätzlich ein echter
 * Verstoß vor, ist der Fall ohnehin abzulehnen – dann bliebe die Anweisung
 * ohne Wirkung, und es zu zählen, als hätte man sich ihr gebeugt, wäre
 * schlicht falsch.
 *
 * @param {object} a          Vorgang
 * @param {number} tag        Spieltag
 * @param {number} verstoesse Anzahl tatsächlicher Regelverstöße
 */
export function anweisungFuer(a, tag, verstoesse) {
  if (verstoesse > 0) return null
  const anw = anweisungFuerTag(tag)
  if (!anw) return null
  return anw.betrifft(a) ? anw : null
}

/**
 * Macht aus einem beliebigen Vorgang einen, den die Anweisung trifft.
 *
 * Wird nur gebraucht, wenn der Tag von sich aus keinen passenden Fall
 * hergibt. Verändert wird ausschließlich, was die Anweisung selbst prüft –
 * der Vorgang muss danach immer noch fehlerfrei sein, sonst entstünde aus
 * einer moralischen Entscheidung wieder eine Rechenaufgabe.
 *
 * `hatKlausurHeute` wird hereingereicht statt selbst nachgeschlagen: Die
 * Auskunft steckt in applicant.js, und die importiert dieses Modul bereits.
 *
 * @param {object}  anw
 * @param {object}  a
 * @param {boolean} hatKlausurHeute  schreibt die Zielklasse heute Klausur?
 */
export function passendMachen(anw, a, hatKlausurHeute = false) {
  const attestUeberDenZeitraum = (praxis, arztSeed) => ({
    praxis,
    von: a.fehltagVon,
    bis: a.fehltagBis,
    ausgestellt: a.fehltagVon,
    arztSeed,
  })

  switch (anw.id) {
    case 'jahrgang7':
      a.klasse = '7a'
      // Ohne Attest darf der Zeitraum keine drei Tage erreichen, sonst greift
      // die Attestpflicht und der Fall wäre regulär abzulehnen.
      if (a.tage >= 3) {
        a.tage = 2
        a.fehltagVon = a.fehltagBis - 1
      }
      a.attest = null
      break

    case 'praxis': {
      // Braucht umgekehrt ein Attest – und zwar eines, das sämtliche Fehltage
      // abdeckt, damit nicht die Regel aus Tag 9 dazwischenfunkt.
      if (a.tage < 3) {
        a.tage = 3
        a.fehltagVon = a.fehltagBis - 2
      }
      const praxis = {
        name: GESPERRTE_PRAXIS,
        zusatz: 'Innere Medizin',
        arzt: 'Dr. med. S. Bauer',
      }
      a.attest = attestUeberDenZeitraum(praxis, hashSeed(`arzt-${praxis.arzt}`))
      break
    }

    case 'klasse10a':
      a.klasse = '10a'
      // Schreibt die 10a heute Klausur, genügt keine Elternentschuldigung.
      // Ohne Attest wäre der Fall dann regulär abzuweisen – und die Anweisung
      // träfe wieder niemanden, dessen Papiere in Ordnung sind.
      if (hatKlausurHeute && !a.attest) {
        const praxis = {
          name: 'Praxis Dr. med. Hoffmann',
          zusatz: 'Allgemeinmedizin',
          arzt: 'Dr. med. R. Hoffmann',
        }
        a.attest = attestUeberDenZeitraum(praxis, hashSeed(`arzt-${praxis.arzt}`))
      }
      break

    default:
      break
  }
  return a
}
