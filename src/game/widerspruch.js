/**
 * Widerspruch – jemanden mit den eigenen Papieren konfrontieren.
 *
 * Bis hierher hatte das Spiel genau zwei Entscheidungsverben: links stempeln,
 * rechts stempeln. Lupe und Telefon helfen beim Herausfinden, entscheiden aber
 * nichts. Und wenn man einen Fehler fand, stempelte man ab – der Schüler sagte
 * dazu kein Wort. Der Moment, in dem man jemandem zeigt, was man gefunden hat,
 * fehlte vollständig.
 *
 * Man tippt zwei Felder an, die sich widersprechen, und hält sie ihm hin.
 *
 * WOZU DAS GUT IST – und das ist die eigentliche Frage, denn eine Auskunft
 * gibt es hier nicht zu holen. Wer einen Verstoß gesehen hat, weiß ihn auch
 * ohne Nachfrage. Der Gewinn liegt woanders:
 *
 *   **Das Spiel kann jetzt „übersehen" von „durchgehen lassen" unterscheiden.**
 *
 * Wer blind abstempelt, hat den Fehler vielleicht nicht gesehen. Wer erst
 * konfrontiert und DANN „entschuldigt" stempelt, hat sich entschieden. Das ist
 * kein Buchhaltungsdetail, sondern der Unterschied zwischen Schlamperei und
 * Milde – und bis jetzt konnte das Spiel ihn nicht sehen. Am Ende steht er im
 * Zeugnis, und die Schülerschaft dankt ihn ganz anders als ein Versehen.
 *
 * DREI AUSGÄNGE:
 *
 *   ERTAPPT – Der Widerspruch besteht wirklich. Der Schüler knickt ein oder
 *             er lügt weiter; beides ändert an der Sachlage nichts, aber es
 *             macht aus dem Vorgang eine Person.
 *
 *   DANEBEN – Die beiden Felder gehören zusammen, aber sie widersprechen sich
 *             nicht. Man hat jemanden zu Unrecht beschuldigt, und das kostet
 *             bei der Schülerschaft.
 *
 *   KEIN PAAR – Die Felder haben miteinander nichts zu tun. Kostet nichts:
 *             Das ist ein Vergreifen in der Bedienung, keine Anschuldigung.
 *             So lässt sich die Tabelle gefahrlos lernen – und weil sie über
 *             alle Tage dieselbe bleibt, verrät das Ausprobieren nichts über
 *             den Fall, den man gerade vor sich hat.
 *
 * Die Prüfung selbst liegt weiterhin allein in validate.js. Diese Datei
 * fragt dort nach und urteilt nicht selbst – sonst gäbe es zwei Wahrheiten
 * über denselben Vorgang.
 */

import { VERSTOSS, aktiveRegeln } from './regeln.js'
import { findeVerstoesse } from './validate.js'
import { ausgesetzteRegel } from './stoerungen.js'
import { makeRng, hashSeed, rngHelpers } from './rng.js'

/** Ab wann sich am Schalter widersprechen lässt. */
export const AB_TAG = 2

export const AUSGANG = {
  ERTAPPT: 'ertappt',
  DANEBEN: 'daneben',
  KEIN_PAAR: 'keinPaar',
}

/**
 * Welche zwei Felder welche Regel betreffen.
 *
 * Jedes Paar ist eindeutig: Kein Feld bildet mit zwei verschiedenen Partnern
 * ein Paar für zwei verschiedene Regeln. `notiz-zeitraum` kommt dreimal vor,
 * `person` ebenfalls – aber nie mit demselben Gegenüber. Ohne diese
 * Eindeutigkeit müsste das Spiel raten, was gemeint war, und die Antwort
 * fiele gelegentlich auf die falsche Regel.
 */
export const PAARE = [
  { regel: VERSTOSS.FAELSCHUNG, felder: ['notiz-sig', 'akte-sig'] },
  { regel: VERSTOSS.DATUM, felder: ['notiz-datum', 'notiz-zeitraum'] },
  { regel: VERSTOSS.ATTEST_FEHLT, felder: ['notiz-zeitraum', 'person'] },
  { regel: VERSTOSS.NAME, felder: ['notiz-name', 'akte-name'] },
  { regel: VERSTOSS.KLAUSUR, felder: ['akte-klasse', 'plan'] },
  { regel: VERSTOSS.FOTO, felder: ['akte-foto', 'person'] },
  { regel: VERSTOSS.ATTEST_ZEITRAUM, felder: ['attest-zeitraum', 'notiz-zeitraum'] },
  { regel: VERSTOSS.SPERRVERMERK, felder: ['akte-vermerk', 'person'] },
]

/** Sämtliche Feldkennungen – für Prüfskripte und zum Nachschlagen. */
export const FELDER = [...new Set(PAARE.flatMap((p) => p.felder))]

/**
 * Was der Schüler sagt.
 *
 * Je Regel drei Fassungen, denn eine allgemeine Floskel („Das kann ich
 * erklären") wäre nach dem dritten Mal Tapete. Die Zeilen benennen das Feld,
 * um das es geht – erst dadurch wirkt es, als hätte er hingesehen.
 *
 * `einknicken` und `ausrede` beschreiben denselben Sachverhalt: Der Verstoß
 * besteht. Die Ausrede ändert daran nichts, sie macht die Entscheidung nur
 * schwerer – und genau dafür ist sie da.
 */
const ANTWORTEN = {
  [VERSTOSS.FAELSCHUNG]: {
    einknicken: 'Ja. … Ja, die hab ich nachgemacht. Meine Mutter ist seit Sonntag auf Montage.',
    ausrede: 'Die schreibt halt mal so und mal so. Kommt drauf an, wie eilig sie es hat.',
    daneben: 'Das ist ihre Unterschrift. Vergleichen Sie ruhig in Ruhe, ich hab Zeit.',
  },
  [VERSTOSS.DATUM]: {
    einknicken: 'Ich hab sie vorschreiben lassen, ja. Ich wusste ja vorher, dass ich nicht komme.',
    ausrede: 'Da hat meine Mutter sich vertan. Die schreibt seit Wochen noch Februar.',
    daneben: 'Da steht doch das Datum von dem Tag, an dem sie es geschrieben hat. Passt doch.',
  },
  [VERSTOSS.ATTEST_FEHLT]: {
    einknicken: 'Beim Arzt war ich nicht. Ich dachte, bei drei Tagen geht das auch so.',
    ausrede: 'Das Attest schickt die Praxis direkt hierher. Meine Mutter sagt, das machen die immer so.',
    daneben: 'Ich war doch gar nicht so lange weg. Zählen Sie nach, das sind zwei Tage.',
  },
  [VERSTOSS.NAME]: {
    einknicken: 'Das ist die von meiner Schwester. Wir haben die heute früh verwechselt.',
    ausrede: 'So nennen die mich zu Hause. In der Akte steht halt der andere Name.',
    daneben: 'Das bin ich. Da steht es, und da steht es auch. Wo ist das Problem?',
  },
  [VERSTOSS.KLAUSUR]: {
    einknicken: 'Ja, wir hatten Klausur. Deswegen bin ich ja nicht gekommen.',
    ausrede: 'Die ist verschoben worden. Hat Herr Brenner am Freitag gesagt.',
    daneben: 'Wir schreiben heute gar nichts. Das ist die Parallelklasse, gucken Sie.',
  },
  [VERSTOSS.FOTO]: {
    einknicken: '… Okay. Der auf dem Bild bin nicht ich.',
    ausrede: 'Das Foto ist von der Fünften. Da sah ich noch anders aus, das ist normal.',
    daneben: 'Das bin doch ich. Nur mit kürzeren Haaren, das ist alles.',
  },
  [VERSTOSS.ATTEST_ZEITRAUM]: {
    einknicken: 'Den letzten Tag hat er nicht mehr draufgeschrieben. Krank war ich trotzdem.',
    ausrede: 'Der Arzt schreibt immer nur bis zum Termin. Danach gilt das weiter, das weiß jeder.',
    daneben: 'Da steht doch genau drauf, von wann bis wann. Deckt sich mit dem Zettel.',
  },
  [VERSTOSS.SPERRVERMERK]: {
    einknicken: 'Ich weiß. Ich soll zur Schulleitung. Ich wollte es hier trotzdem einmal versuchen.',
    ausrede: 'Der Vermerk ist von letztem Jahr. Das ist längst geklärt, fragen Sie nach.',
    daneben: 'Über mich liegt nichts vor. Da steht nichts, sehen Sie doch selbst.',
  },
}

/**
 * Wenn die beiden Felder nichts miteinander zu tun haben.
 *
 * Bewusst ratlos und ohne Vorwurf: Hier hat nicht der Schüler etwas falsch
 * gemacht, sondern der Spieler hat danebengetippt. Ein empörter Satz an
 * dieser Stelle bestrafte eine Bedienung, keine Entscheidung.
 */
const RATLOS = [
  'Was soll ich damit? Das eine hat mit dem anderen doch nichts zu tun.',
  'Ähm. Ja. Und?',
  'Ich versteh die Frage nicht, ehrlich gesagt.',
  'Das steht da halt. Beides.',
]

/** Findet das Paar zu zwei Feldern – reihenfolgeunabhängig. */
export function paarFuer(feldA, feldB) {
  if (!feldA || !feldB || feldA === feldB) return null
  return (
    PAARE.find((p) => p.felder.includes(feldA) && p.felder.includes(feldB)) ?? null
  )
}

/**
 * Was passiert, wenn diese beiden Felder hochgehalten werden?
 *
 * @returns {{ausgang: string, regel: string|null, text: string}}
 */
export function konfrontiere(a, tag, feldA, feldB) {
  const { pick } = rngHelpers(makeRng(hashSeed(`wid-${a.id}-${feldA}-${feldB}`)))
  const paar = paarFuer(feldA, feldB)

  // Eine Regel, die es heute noch nicht gibt oder die wegen einer Störung
  // ruht, ist kein Widerspruch, sondern eine Frage ohne Grundlage. Sie
  // kostet deshalb auch nichts – wie jedes andere Danebentippen.
  const gilt =
    paar &&
    aktiveRegeln(tag).some((r) => r.id === paar.regel) &&
    paar.regel !== ausgesetzteRegel(tag)

  if (!gilt) {
    return { ausgang: AUSGANG.KEIN_PAAR, regel: null, text: pick(RATLOS) }
  }

  // Die Sachlage kommt aus der Regelprüfung, nicht aus einer zweiten
  // Rechnung: Es darf nur eine Wahrheit über einen Vorgang geben.
  const trifft = findeVerstoesse(a, tag).some((v) => v.id === paar.regel)
  const antwort = ANTWORTEN[paar.regel]

  if (!trifft) {
    return { ausgang: AUSGANG.DANEBEN, regel: paar.regel, text: antwort.daneben }
  }

  // Stammgäste antworten mit eigener Stimme.
  //
  // Das ist nicht Ausschmückung, sondern der Grund, warum es die ganze
  // Mechanik gibt. Milan wird über vier Tage viermal mit derselben gefälschten
  // Unterschrift konfrontiert – mit der Regelzeile käme viermal derselbe Satz,
  // und aus einem Menschen würde ein Formular. So bröckelt die Lüge stattdessen
  // von Mal zu Mal, bis er beim vierten Mal die Frage zurückstellt.
  if (a.auftritt?.vorgehalten) {
    return { ausgang: AUSGANG.ERTAPPT, regel: paar.regel, text: a.auftritt.vorgehalten }
  }

  // Einknicken oder weiterlügen – fest am Vorgang, nicht am Zufall des
  // Augenblicks. Wer denselben Fall noch einmal spielt, bekommt dieselbe
  // Person, und das ist bei einem Spiel mit festen Seeds keine Kleinigkeit.
  const knickt = hashSeed(`mut-${a.id}-${paar.regel}`) % 2 === 0
  return {
    ausgang: AUSGANG.ERTAPPT,
    regel: paar.regel,
    text: knickt ? antwort.einknicken : antwort.ausrede,
  }
}
