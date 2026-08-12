/**
 * Verstoßarten und Dienstanweisung.
 *
 * Bewusst ein eigenes Modul ohne jede Abhängigkeit: Sowohl der Generator
 * (applicant.js) als auch die Prüfung (validate.js) und der Dienstplan
 * (days.js) brauchen diese Liste. Läge sie in einem der drei, entstünde ein
 * Ringschluss beim Importieren.
 *
 * `abTag` ist die einzige Stelle, an der steht, wann eine Regel scharf wird –
 * Dienstplan, Generator und Prüfung lesen alle von hier.
 */

export const VERSTOSS = {
  KEINER: 'keiner',
  FAELSCHUNG: 'faelschung', // Unterschrift weicht von der Akte ab
  DATUM: 'datum', // Ausstellungsdatum liegt vor dem ersten Fehltag
  ATTEST_FEHLT: 'attest_fehlt', // ab 3 Tagen ist ein Attest Pflicht
  NAME: 'name', // Name auf der Notiz ≠ Name in der Akte
  KLAUSUR: 'klausur', // Klausurklasse ohne ärztliches Attest
  FOTO: 'foto', // Passfoto zeigt nicht die Person am Schalter
  ATTEST_ZEITRAUM: 'attest_zeitraum', // Attest deckt nicht alle Fehltage ab
  SPERRVERMERK: 'sperrvermerk', // Akte trägt einen Sperrvermerk des Rektorats
}

export const REGELN = [
  {
    id: VERSTOSS.FAELSCHUNG,
    abTag: 1,
    dokument: 'Entschuldigung',
    titel: 'Unterschrift prüfen',
    text: 'Die Unterschrift auf der Entschuldigung muss mit der in der Schülerakte hinterlegten Unterschrift übereinstimmen.',
  },
  {
    id: VERSTOSS.DATUM,
    abTag: 2,
    dokument: 'Entschuldigung',
    titel: 'Ausstellungsdatum',
    text: 'Das Datum der Entschuldigung darf nicht vor dem ersten Fehltag liegen.',
  },
  {
    id: VERSTOSS.ATTEST_FEHLT,
    abTag: 3,
    dokument: 'Ärztliches Attest',
    titel: 'Attestpflicht',
    text: 'Ab drei zusammenhängenden Fehltagen ist ein ärztliches Attest beizulegen.',
  },
  {
    id: VERSTOSS.NAME,
    abTag: 5,
    dokument: 'Entschuldigung',
    titel: 'Namensabgleich',
    text: 'Der Name auf der Entschuldigung muss dem Namen in der Schülerakte entsprechen.',
  },
  {
    id: VERSTOSS.KLAUSUR,
    abTag: 6,
    dokument: 'Klausurplan',
    titel: 'Klausurtage',
    text: 'Schreibt die Klasse laut Klausurplan heute Klausur, genügt keine Elternentschuldigung – es ist ein ärztliches Attest vorzulegen.',
  },
  {
    id: VERSTOSS.FOTO,
    abTag: 7,
    dokument: 'Schülerakte',
    titel: 'Lichtbildabgleich',
    text: 'Das Passfoto in der Schülerakte muss die Person am Schalter zeigen.',
  },
  {
    id: VERSTOSS.ATTEST_ZEITRAUM,
    abTag: 9,
    dokument: 'Ärztliches Attest',
    titel: 'Attestzeitraum',
    text: 'Das Attest muss sämtliche Fehltage abdecken, nicht nur einen Teil davon.',
  },
  {
    id: VERSTOSS.SPERRVERMERK,
    abTag: 11,
    dokument: 'Schülerakte',
    titel: 'Sperrvermerk',
    text: 'Trägt die Schülerakte einen Sperrvermerk des Rektorats, ist abzuweisen – unabhängig von den vorgelegten Papieren.',
  },
]

/**
 * Reihenfolge der Einführung – zugleich die Paragraphennummer, unter der
 * eine Regel überall im Spiel auftaucht. Bleibt stabil, auch wenn später
 * Regeln dazwischen eingeschoben werden.
 */
export function paragraph(id) {
  return REGELN.findIndex((r) => r.id === id) + 1
}

/** Die Dokumente in der Reihenfolge, in der man sie am Schalter durchgeht. */
export const DOKUMENTE = ['Entschuldigung', 'Ärztliches Attest', 'Schülerakte', 'Klausurplan']

/**
 * Regeln nach Dokument gruppiert.
 *
 * Beim Prüfen fragt man nicht "was war Regel 5?", sondern "ich sehe mir das
 * Attest an - was gilt dafür?". Eine flache Liste beantwortet diese Frage
 * nicht; nach Dokument sortiert wird die Dienstanweisung zur Landkarte.
 */
export function regelnNachDokument(day) {
  const aktiv = aktiveRegeln(day)
  return DOKUMENTE
    .map((dok) => ({ dokument: dok, regeln: aktiv.filter((r) => r.dokument === dok) }))
    .filter((g) => g.regeln.length > 0)
}

export function aktiveRegeln(day) {
  return REGELN.filter((r) => r.abTag <= day)
}

/** Regeln, die genau an diesem Tag dazukommen. */
export function neueRegeln(day) {
  return REGELN.filter((r) => r.abTag === day)
}
