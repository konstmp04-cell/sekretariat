/**
 * Störungen – Tage, an denen etwas fehlt.
 *
 * Das Spiel hatte an Inhalt keinen Mangel: acht Regeln, drei Werkzeuge,
 * Anordnungen, Kuriositäten, wiederkehrende Figuren. Was fehlte, war
 * Abwechslung in der FORM. Jeder der zwölf Tage hatte denselben Ablauf, und
 * eine neunte Regel hätte daran nichts geändert.
 *
 * Eine Störung ändert keine Regel, sie nimmt ein Werkzeug weg. Der Gewinn
 * liegt dabei weniger im gestörten Tag als in allen anderen: **Man merkt erst,
 * was ein Werkzeug einem abnimmt, wenn es einmal fehlt.** Die Lupe benutzt man
 * nach drei Tagen automatisch; an dem Tag, an dem sie verliehen ist, sieht man
 * zum ersten Mal, wie viel sie trägt.
 *
 * Zwei Grundsätze:
 *
 * 1. IMMER ANGEKÜNDIGT. Die Störung steht am Morgen im Briefing und den
 *    ganzen Tag über im Regelwerk. Ein Werkzeug, das ohne Vorwarnung fehlt,
 *    ist kein Ereignis, sondern ein Fehler – und der Spieler würde zu Recht
 *    annehmen, dass etwas kaputt ist.
 *
 * 2. NIE EINE FALLE. Nimmt eine Störung die Grundlage einer Regel weg, wird
 *    die Regel für diesen Tag ausgesetzt – sichtbar im Regelwerk, und der
 *    Generator baut den zugehörigen Verstoß gar nicht erst ein. Ohne
 *    Lichtbilder in den Akten kann niemand einen Lichtbildabgleich verlangen.
 *
 * Drei auf zwölf Tage, nicht mehr. Eine Störung, die jeden zweiten Tag kommt,
 * ist keine Störung mehr, sondern der Normalzustand.
 */

import { VERSTOSS } from './regeln.js'

export const STOERUNG = {
  LUPE: 'lupe',
  TELEFON: 'telefon',
  LICHTBILDER: 'lichtbilder',
}

export const STOERUNGEN = [
  {
    tag: 6,
    id: STOERUNG.LUPE,
    titel: 'Lupe nicht verfügbar',
    text: 'Das Vergrößerungsglas ist an die Fachschaft Kunst verliehen. Rückgabe angeblich morgen.',
    // Keine Regel ausgesetzt: Bei einer Fälschungsstärke von 0,6 ist die
    // Abweichung an Tag 6 mit bloßem Auge noch zu finden. Es wird
    // anstrengender, nicht unmöglich.
    setztAus: null,
  },
  {
    tag: 8,
    id: STOERUNG.TELEFON,
    titel: 'Leitung gestört',
    text: 'Die Amtsleitung des Sekretariats ist seit gestern tot. Die Technik ist verständigt.',
    // Mit Bedacht auf Tag 8 gelegt: Das ist der Tag, an dem das Rektorat
    // anordnet, Atteste einer bestimmten Praxis nicht anzuerkennen – und
    // ausgerechnet dort kann man dann nicht nachfragen.
    setztAus: null,
  },
  {
    tag: 11,
    id: STOERUNG.LICHTBILDER,
    titel: 'Lichtbilder abgeholt',
    text: 'Sämtliche Passbilder wurden zur Digitalisierung eingesammelt. Die Akten sind sonst vollständig.',
    // Die einzige mit Regelwirkung. Ohne Lichtbild in der Akte lässt sich
    // nichts abgleichen – die Regel ist deshalb ausgesetzt, statt dass der
    // Spieler an einem leeren Rahmen scheitert.
    setztAus: VERSTOSS.FOTO,
  },
]

export function stoerungAmTag(tag) {
  return STOERUNGEN.find((s) => s.tag === tag) ?? null
}

/** Welche Regel ist heute ausgesetzt – falls überhaupt eine? */
export function ausgesetzteRegel(tag) {
  return stoerungAmTag(tag)?.setztAus ?? null
}

/** Steht dieses Werkzeug heute zur Verfügung? */
export function verfuegbar(werkzeug, tag) {
  return stoerungAmTag(tag)?.id !== werkzeug
}
