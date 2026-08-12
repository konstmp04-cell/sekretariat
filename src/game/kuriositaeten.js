/**
 * Kuriositäten – die Vorgänge, bei denen man kurz auflacht.
 *
 * Zwölf Tage Formularprüfung sind lang. Ohne Ausreißer wird aus Konzentration
 * Abstumpfung, und ein Spiel, in dem jeder Vorgang gleich aussieht, prüft
 * irgendwann nur noch die Geduld.
 *
 * Zwei Sorten, und beide sind mehr als bloß ein Gag:
 *
 * **Absurde Gründe** stehen auf einer Entschuldigung, an der sonst nichts
 * auszusetzen ist. Genau darin liegt der Witz UND die Prüfung: Im Regelwerk
 * steht kein Wort darüber, dass ein Grund glaubwürdig sein muss. Wer „Von
 * einer Möwe verfolgt" abweist, weist einen Unschuldigen ab – nach
 * Bauchgefühl statt nach Dienstanweisung. Das ist dieselbe Lektion wie bei
 * den Anordnungen, nur von der anderen Seite.
 *
 * **Dreiste Fälschungen** sitzen ausschließlich auf Vorgängen, die ohnehin
 * gefälscht sind. Sie machen einen schweren Fall zum geschenkten – ein
 * Durchatmen zwischen zwei kniffligen. Was sie NICHT tun dürfen: einen
 * gültigen Vorgang verdächtig aussehen lassen. Sonst bestraft das Spiel
 * genaues Hinsehen, und das wäre das Gegenteil von dem, was es will.
 *
 * Beide sind seedbasiert und liegen fest: Wer denselben Tag noch einmal
 * spielt, trifft dieselbe Kuriosität. Das ist Absicht – sie sollen sich wie
 * Teil der Welt anfühlen und nicht wie ein Glücksrad.
 */

import { makeRng, hashSeed, rngHelpers } from './rng.js'

/**
 * Gründe, bei denen man zweimal hinsieht.
 *
 * Bewusst trocken formuliert und in derselben Amtssprache wie alles andere:
 * Der Witz entsteht daraus, dass so etwas völlig ernsthaft in ein Formular
 * eingetragen wurde, nicht aus Albernheit. Ein Spiel, das sich über sich
 * selbst lustig macht, verliert genau die Atmosphäre, von der es lebt.
 */
export const ABSURDE_GRUENDE = [
  'Wurde auf dem Schulweg von einer Möwe verfolgt',
  'Familiäre Verpflichtungen (Schildkröte)',
  'Der Wecker hat sich entschuldigt, aber es war zu spät',
  'Aufgrund der Zeitumstellung im Oktober',
  'Konnte die Wohnungstür nicht von innen öffnen',
  'Wegen eines Missverständnisses mit dem Busfahrer',
  'Musste den Hund zur Physiotherapie begleiten',
  'Unerwarteter Besuch aus dem Ausland (Cousin)',
  'Hat verschlafen, weil er von der Schule geträumt hat',
  'Wurde im Supermarkt eingeschlossen',
]

/** Was der Schüler dazu sagt – wissend, wie das klingt. */
export const SPRUECHE_ABSURD = [
  'Ich weiß, wie das klingt. Es stimmt aber.',
  'Fragen Sie ruhig nach. Bitte nicht.',
  'Mein Vater hat das so aufgeschrieben, nicht ich.',
  'Ich hätte mir was Besseres ausgedacht, ehrlich.',
  'Das war wirklich so. Leider.',
]

/**
 * Zusätze auf dreist gefälschten Entschuldigungen.
 *
 * Der eigentliche Treffer ist nicht die Krakelei, sondern das, was jemand
 * daruntergeschrieben hat, ohne nachzudenken.
 */
export const DREISTE_ZUSAETZE = [
  { unterschrift: 'Mutti', nachtrag: null },
  { unterschrift: 'Die Mutter', nachtrag: null },
  { unterschrift: 'Mama (echt)', nachtrag: null },
  { unterschrift: 'Erziehungsberechtigter', nachtrag: 'P.S.: Bitte nicht zu Hause anrufen.' },
  { unterschrift: 'i. A. Mutter', nachtrag: 'P.S.: Sie war beim Unterschreiben sehr müde.' },
]

export const SPRUECHE_DREIST = [
  'Meine Mutter schreibt neuerdings anders.',
  'Sie hatte es eilig. Sehr eilig.',
  'Das ist ihre Zweitunterschrift.',
  'Können Sie das trotzdem nehmen?',
  'Ich seh schon.',
]

export const KURIOSUM = {
  GRUND: 'grund',
  DREIST: 'dreist',
}

/**
 * Der Spielplan der Kuriositäten – gesetzt, nicht gewürfelt.
 *
 * Der erste Entwurf warf an jedem Tag eine Münze (55 %). Herausgekommen sind
 * fünf Kuriositäten, alle zwischen Tag 6 und Tag 10, und eine einzige dreiste
 * Fälschung im ganzen Spiel. Weil sämtliche Seeds fest liegen, wäre das für
 * jeden Spieler dieselbe Klumpung gewesen: erstes Drittel ohne einen
 * Ausreißer, letztes auch – derselbe Fehler wie bei der Verstoßquote.
 *
 * Die Tage sind stattdessen ausgesucht:
 * - Tag 1 und 2 bleiben frei. Wer die Regeln noch lernt, soll nicht an einem
 *   Sonderfall lernen, was normal ist.
 * - Tag 4, 8 und 10 bleiben frei. Dort ergeht eine Anordnung, und die soll
 *   ohne Konkurrenz wirken.
 * - Der Rest wechselt sich ab, damit keine der beiden Sorten zur Gewohnheit
 *   wird, und reicht bis Tag 12 – gerade die letzten, langen Schichten
 *   vertragen ein Durchatmen.
 */
const SPIELPLAN = {
  3: KURIOSUM.DREIST,
  5: KURIOSUM.GRUND,
  7: KURIOSUM.DREIST,
  9: KURIOSUM.GRUND,
  12: KURIOSUM.DREIST,
}

/** Welche Kuriosität gilt heute – und gilt überhaupt eine? */
export function kuriositaetAmTag(day) {
  const art = SPIELPLAN[day]
  if (!art) return null
  // Welcher Grund, welcher Zusatz: Das darf ruhig der Zufall entscheiden,
  // solange das Wann feststeht.
  const { pick } = rngHelpers(makeRng(hashSeed(`kuriosum-${day}`)))
  return {
    art,
    grund: pick(ABSURDE_GRUENDE),
    spruchAbsurd: pick(SPRUECHE_ABSURD),
    zusatz: pick(DREISTE_ZUSAETZE),
    spruchDreist: pick(SPRUECHE_DREIST),
  }
}

/**
 * Verpasst einem fertigen Vorgang die Kuriosität.
 *
 * Verändert wird ausschließlich Beiwerk – Grund, Wortlaut, Erscheinungsbild
 * der Unterschrift. Kein Datum, keine Klasse, kein Attest, keine Namen: alles
 * Felder, an denen eine Regel hängt. Ein Gag, der die Prüfung verschiebt,
 * wäre keiner.
 */
export function kuriosumAnwenden(kur, a) {
  if (kur.art === KURIOSUM.GRUND) {
    a.grund = kur.grund
    a.spruch = kur.spruchAbsurd
    a.kuriosum = KURIOSUM.GRUND
  } else {
    a.dreist = true
    a.unterschriftLabel = kur.zusatz.unterschrift
    a.nachtrag = kur.zusatz.nachtrag
    a.spruch = kur.spruchDreist
    a.kuriosum = KURIOSUM.DREIST
  }
  return a
}
