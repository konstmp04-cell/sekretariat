/**
 * Der Dienstplan.
 *
 * Hier wird aus einzelnen Vorgängen ein Spiel: Jeder Tag hat eine feste
 * Länge, und an bestimmten Tagen kommt eine Regel dazu. Der Moment, in dem
 * die Dienstanweisung länger wird, ist der eigentliche Motor – nicht die
 * Schüler werden schwieriger, sondern die Anzahl der Dinge, die du
 * gleichzeitig im Kopf behalten musst.
 *
 * Welche Regel wann kommt, steht bewusst NICHT hier, sondern an der Regel
 * selbst (`abTag` in regeln.js). Sonst müsste man beim Einfügen einer neuen
 * Regel mehrere Dateien gleichzeitig richtig halten.
 */

import { REGELN } from './regeln.js'

export const LETZTER_TAG = 12

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']

export function tagInfo(tag) {
  return {
    tag,
    wochentag: WOCHENTAGE[(tag - 1) % WOCHENTAGE.length],
    // Bleibt bewusst im Gleichklang mit applicant.js, wo `heute = 8 + tag`
    // das Datum auf den Entschuldigungen bestimmt.
    datum: `${8 + tag}. März`,
    // Sechs Schüler am ersten Tag, danach jeden Tag einer mehr. Ab 14 ist
    // Schluss – längere Schichten werden nicht schwerer, nur zäher.
    anzahl: Math.min(14, 5 + tag),
    neueRegeln: REGELN.filter((r) => r.abTag === tag),
  }
}

/** Alle Tage im Überblick – nützlich für Balancing und Tests. */
export function dienstplan() {
  return Array.from({ length: LETZTER_TAG }, (_, i) => tagInfo(i + 1))
}
