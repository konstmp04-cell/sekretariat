/**
 * Regelprüfung – rein, ohne React, damit sie testbar und balancierbar bleibt.
 *
 * Die Regeln selbst stehen in regeln.js; hier wird nur geprüft. Die Prüfung
 * liest dabei stets die tatsächlichen Dokumentdaten und nie das Feld
 * `verstoss` des Generators. Dadurch bleibt der Generator austauschbar, und
 * ein Fehler in ihm fällt auf, statt sich selbst zu bestätigen.
 */

import { VERSTOSS, REGELN, aktiveRegeln, neueRegeln } from './regeln.js'
import { hatKlausur } from './applicant.js'
import { anweisungFuer } from './anweisungen.js'
import { ausgesetzteRegel } from './stoerungen.js'

export { VERSTOSS, REGELN, aktiveRegeln, neueRegeln }

/**
 * Ermittelt alle Regelverstöße eines Vorgangs.
 * @returns {Array<{id: string, titel: string}>}
 */
export function findeVerstoesse(a, day) {
  const treffer = []
  // Eine Störung kann einer Regel die Grundlage nehmen – ohne Lichtbild in
  // der Akte lässt sich nichts abgleichen. Dann wird sie für den Tag
  // ausgesetzt, statt den Spieler an einem leeren Rahmen scheitern zu lassen.
  const ruht = ausgesetzteRegel(day)
  for (const regel of aktiveRegeln(day)) {
    if (regel.id === ruht) continue
    let verletzt = false
    switch (regel.id) {
      case VERSTOSS.FAELSCHUNG:
        verletzt = a.forgery > 0
        break
      case VERSTOSS.DATUM:
        verletzt = a.datumNotiz < a.fehltagVon
        break
      case VERSTOSS.ATTEST_FEHLT:
        verletzt = a.tage >= 3 && !a.attest
        break
      case VERSTOSS.NAME:
        verletzt = a.nameAufNotiz !== a.name
        break
      case VERSTOSS.KLAUSUR:
        verletzt = hatKlausur(day, a.klasse) && !a.attest
        break
      case VERSTOSS.FOTO:
        // Vergleicht die tatsächlichen Merkmale beider Gesichter statt einer
        // Markierung – dieselbe Prüfung, die auch der Spieler anstellt.
        verletzt = JSON.stringify(a.aktenFoto) !== JSON.stringify(a.face)
        break
      case VERSTOSS.ATTEST_ZEITRAUM:
        verletzt = !!a.attest && (a.attest.von > a.fehltagVon || a.attest.bis < a.fehltagBis)
        break
      case VERSTOSS.SPERRVERMERK:
        verletzt = a.sperrvermerk === true
        break
      default:
        break
    }
    if (verletzt) treffer.push({ id: regel.id, titel: regel.titel })
  }
  return treffer
}

/**
 * Welcher Zettel eines Stapels ist zu beanstanden?
 *
 * Läuft über dieselbe `findeVerstoesse` wie jeder Einzelvorgang – die Blätter
 * tragen dafür genau die Felder, die eine Regel lesen könnte. Eine eigene
 * Prüfung nur für den Stapel gäbe zwei Wahrheiten über dieselben Papiere, und
 * eine davon wäre irgendwann die falsche.
 *
 * @returns {number} Index des fehlerhaften Blatts, oder -1
 */
export function fehlerhaftesBlatt(a, day) {
  if (!a.sammel) return -1
  return a.sammel.blaetter.findIndex((b) => findeVerstoesse(b, day).length > 0)
}

/**
 * War die Entscheidung über einen Stapel richtig?
 *
 * Drei Wege, und nur zwei davon sind richtig:
 *
 *   Fehler im Stapel  + genau dieses Blatt beanstandet  → richtig
 *   Fehler im Stapel  + ein anderes Blatt beanstandet   → falsch
 *   Fehler im Stapel  + geschlossen angenommen          → falsch
 *   Stapel sauber     + geschlossen angenommen          → richtig
 *   Stapel sauber     + irgendein Blatt beanstandet     → falsch
 *
 * @param {number|null} gewaehlt  gekennzeichnetes Blatt, oder null
 */
export function pruefeStapel(a, day, entscheidung, gewaehlt) {
  const fehler = fehlerhaftesBlatt(a, day)
  const verstoesse = fehler >= 0 ? findeVerstoesse(a.sammel.blaetter[fehler], day) : []
  const richtig =
    entscheidung === 'deny' ? gewaehlt === fehler && fehler >= 0 : fehler < 0

  return {
    richtig,
    verstoesse,
    solltePassieren: fehler < 0,
    anweisung: null,
    befolgt: null,
    fehler,
  }
}

/**
 * War die Entscheidung richtig?
 * @param {'ok'|'deny'} entscheidung
 */
export function pruefeEntscheidung(a, day, entscheidung, gewaehlt = null) {
  // Ein Stapel wird nicht bejaht oder verneint, sondern durchgesehen.
  if (a.sammel) return pruefeStapel(a, day, entscheidung, gewaehlt)

  const verstoesse = findeVerstoesse(a, day)
  const solltePassieren = verstoesse.length === 0
  const anweisung = anweisungFuer(a, day, verstoesse.length)

  // Ein Anweisungsfall hat keine richtige Antwort, also wird auch keine
  // vergeben. `richtig` bleibt null statt false – der Unterschied ist nicht
  // kosmetisch: Als false gezählt, stünde am Ende im Zeugnis, der Spieler
  // habe sich geirrt, weil er einen Unschuldigen nicht abgewiesen hat. Genau
  // die Aussage soll das Spiel nicht treffen.
  if (anweisung) {
    return {
      richtig: null,
      verstoesse,
      solltePassieren,
      anweisung,
      befolgt: entscheidung === 'deny',
    }
  }

  return {
    richtig: (entscheidung === 'ok') === solltePassieren,
    verstoesse,
    solltePassieren,
    anweisung: null,
    befolgt: null,
  }
}
