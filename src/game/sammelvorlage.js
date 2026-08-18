/**
 * Die Sammelvorlage – ein Lehrer bringt einen Stapel.
 *
 * Alle 132 Vorgänge des Spiels haben dieselbe Form: eine Person, ein Zettel,
 * zwei Stempel. Störungen, Anordnungen und beschädigte Papiere ändern daran
 * nichts – sie färben den Vorgang ein, aber sie ändern nicht, was er IST.
 * Zweimal im Spiel soll deshalb etwas anderes am Schalter stehen.
 *
 * Herr Brenner ist Jahrgangsstufenleiter und reicht die Entschuldigungen
 * seines Jahrgangs gesammelt ein. Vor dir liegen fünf Vorgänge auf einmal,
 * und die Frage ist nicht mehr „ja oder nein", sondern:
 *
 *   **WELCHER von diesen fünf?**
 *
 * Das ist ein anderes Verb. Nicht entscheiden, sondern heraussuchen. Und es
 * braucht kein neues Werkzeug dafür: Wer einen Vorgang beanstandet, kennzeichnet
 * ihn und stempelt rot; wer nichts findet, nimmt den Stapel geschlossen an.
 * Dieselben zwei Stempel wie immer, nur mit einem Schritt davor.
 *
 * WARUM DER JAHRGANG UND NICHT EINE KLASSE. Ein Klassenlehrer brächte fünf
 * Zettel derselben Klasse – und dann träfe die Klausurregel entweder alle fünf
 * oder keinen. Aus „welcher von diesen" würde „alle oder keiner", und die
 * ganze Form wäre umsonst. Beim Jahrgang hat jeder Zettel seine eigene Klasse,
 * und der Aushang muss fünfmal nachgeschlagen werden. Genau dafür hängt er da.
 *
 * NUR DREI REGELN GREIFEN. Auf einem Sammelblatt steht kein Lichtbild, keine
 * hinterlegte Unterschrift und kein Sperrvermerk – es gibt zu diesen Kindern
 * keine Akte auf dem Tisch. Prüfbar sind deshalb genau die Regeln, die mit dem
 * Zettel allein auskommen:
 *
 *   §2 Ausstellungsdatum · §3 Attestpflicht · §5 Klausurtage
 *
 * Das ist keine Einschränkung, sondern der Grund für die Form: §5 ist die
 * einzige Regel, bei der man nicht zwei Felder vergleicht, sondern auf einem
 * zweiten Blatt nachschlägt – und sie kam im ganzen Spiel bisher dreimal vor.
 * Fünf Klassen gegen einen Aushang ist die Aufgabe, für die sie gemacht ist.
 *
 * ZWEI STAPEL, UND DER ZWEITE IST SAUBER. Läge in beiden ein Fehler, lernte
 * man „bei Brenner ist immer einer dabei" und suchte nur noch, bis man ihn
 * gefunden hat. Der zweite Stapel ist in Ordnung, und man erfährt das erst,
 * indem man alle fünf durchgeht.
 */

import { VERSTOSS } from './regeln.js'

export const LEHRER = {
  name: 'Herr Brenner',
  amt: 'Jahrgangsstufenleitung 8',
}

/** Wie viele Zettel auf dem Stapel liegen. */
export const BLAETTER = 5

export const SAMMELTAGE = [
  {
    tag: 8,
    // Zwei Tage nach der Einführung der Klausurregel – ausgemessen, nicht
    // gewählt. Tag 7 wäre die naheliegende Stelle gewesen (der ruhigste späte
    // Tag), kostete aber den Lichtbildabgleich zwei seiner vier Vorkommen: Der
    // Stapel belegt einen Platz, und an Tag 7 wird ausgerechnet §6 eingeführt.
    // Vier Tage durchgerechnet:
    //
    //   Tag  7   Klausur 5 · Lichtbild 2   ← frisst die neue Regel
    //   Tag  8   Klausur 4 · Lichtbild 3   ← gewählt
    //   Tag  9   Klausur 5 · Lichtbild 3, aber Attestpflicht 12→10, und
    //            Tag 9 ist mit vier Sonderereignissen ohnehin der vollste
    //   Tag 12   Attestzeitraum 3→2, und der letzte Tag gehört dem Abschied
    verstoss: VERSTOSS.KLAUSUR,
    spruch:
      'Brenner, Jahrgangsstufenleitung. Fünf Stück aus der Acht, gesammelt. Wenn einer nicht in Ordnung ist, sagen Sie mir welcher.',
  },
  {
    tag: 10,
    // Sauber. Wer inzwischen gelernt hat, dass in einem Stapel ein Fehler
    // steckt, wird hier einen finden wollen, der nicht da ist.
    verstoss: VERSTOSS.KEINER,
    spruch:
      'Ich bin es nochmal. Gleiches Spiel, fünf Vorgänge. Ich hab sie diesmal selbst durchgesehen.',
  },
]

export function sammelAmTag(tag) {
  return SAMMELTAGE.find((s) => s.tag === tag) ?? null
}

/**
 * Was auf einem Sammelblatt überhaupt prüfbar ist.
 *
 * Steht hier und nicht als Kommentar irgendwo: Der Generator darf keinen
 * Verstoß einbauen, den man auf dem Stapel gar nicht sehen kann, und ein
 * Prüfskript soll das nachrechnen können.
 */
export const PRUEFBAR = [VERSTOSS.DATUM, VERSTOSS.ATTEST_FEHLT, VERSTOSS.KLAUSUR]
