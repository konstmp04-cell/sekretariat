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

export { VERSTOSS, REGELN, aktiveRegeln, neueRegeln }

/**
 * Ermittelt alle Regelverstöße eines Vorgangs.
 * @returns {Array<{id: string, titel: string}>}
 */
export function findeVerstoesse(a, day) {
  const treffer = []
  for (const regel of aktiveRegeln(day)) {
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
 * War die Entscheidung richtig?
 * @param {'ok'|'deny'} entscheidung
 */
export function pruefeEntscheidung(a, day, entscheidung) {
  const verstoesse = findeVerstoesse(a, day)
  const solltePassieren = verstoesse.length === 0
  const richtig = (entscheidung === 'ok') === solltePassieren
  return { richtig, verstoesse, solltePassieren }
}
