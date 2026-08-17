/**
 * Der Zustand der Papiere – nass, zerrissen, heil.
 *
 * Der Einfall: Ein Attest kommt nicht immer als sauberes Blatt über den
 * Tresen. Manche waren in einer Jackentasche, als es regnete; manche sind
 * gerissen. Die Frage bei so etwas ist immer dieselbe und sie entscheidet
 * alles:
 *
 *   Erzeugt der Zustand eine ENTSCHEIDUNG oder nur ARBEIT?
 *
 * Ein Trocknungsvorgang, bei dem man dreißig Sekunden wartet, ist Arbeit.
 * Ein Klebeband-Werkzeug, mit dem man Kanten aneinanderpinselt, ist Arbeit –
 * und dazu ein viertes Objekt auf einem Schreibtisch, der schon voll ist.
 * Beides wäre bei 132 Vorgängen eine Strafe, kein Ereignis.
 *
 * Deshalb hier die andere Fassung: **Ein beschädigtes Papier verbirgt eine
 * Angabe, und die Angabe ist auf zwei Wegen zu bekommen.** Der Zustand fügt
 * keinen Handgriff hinzu, er nimmt eine Selbstverständlichkeit weg – man kann
 * das Blatt nicht mehr einfach lesen.
 *
 *   NASS       Der Zeitraum ist verlaufen. Die Lupe holt die Striche unter
 *              der zerlaufenen Tinte hervor, oder die Praxis liest ihn am
 *              Telefon vor. Beides gibt es, keins ist geschenkt: Der Anruf
 *              kostet einen von zwei.
 *
 *   ZERRISSEN  Das Attest kommt in zwei Stücken, und der Riss läuft quer
 *              durch den Zeitraum. Getrennt steht auf der einen Hälfte
 *              „vom 5. b", auf der anderen „is 9. März" – lesbar wird das
 *              erst, wenn man die Teile zusammenschiebt. Das ist der ganze
 *              Handgriff: ein Ziehen, kein Werkzeug.
 *
 * DIE PRÜFUNG BLEIBT UNBERÜHRT. validate.js liest weiterhin die
 * Dokumentdaten; ob das Blatt nass war, weiß es nicht und soll es nicht
 * wissen. Der Zustand ist Darstellung und Handhabung, nie Bewertung.
 *
 * VIER TAGE VON ZWÖLF, und die Reihenfolge ist Absicht:
 *
 *   Tag  4  nass, einwandfreier Fall     – man lernt es an einem harmlosen
 *   Tag  6  zerrissen, einwandfreier Fall – ebenso, und ausgerechnet an dem
 *                                           Tag, an dem die Lupe verliehen
 *                                           ist: Zusammenschieben braucht
 *                                           kein Werkzeug.
 *   Tag  9  nass, Attestzeitraum stimmt nicht    – der Tag, an dem §7 neu
 *                                                  dazukommt. Der Fleck sitzt
 *                                                  genau auf dem Feld, um das
 *                                                  es geht.
 *   Tag 11  zerrissen, Attestzeitraum stimmt nicht – der Riss trennt „von"
 *                                                    und „bis".
 *
 * Erst zwei saubere Fälle, dann zwei faule. Wäre es umgekehrt, lernte man
 * „beschädigt heißt Verstoß" und bräuchte gar nicht mehr hinzusehen; wären
 * alle vier sauber, lernte man „beschädigt heißt egal". Beides wäre schlimmer
 * als gar keine Beschädigung.
 */

import { VERSTOSS } from './regeln.js'

export const ZUSTAND = {
  NASS: 'nass',
  ZERRISSEN: 'zerrissen',
}

export const ZUSTAENDE = [
  { tag: 4, art: ZUSTAND.NASS, verstoss: VERSTOSS.KEINER },
  { tag: 6, art: ZUSTAND.ZERRISSEN, verstoss: VERSTOSS.KEINER },
  { tag: 9, art: ZUSTAND.NASS, verstoss: VERSTOSS.ATTEST_ZEITRAUM },
  { tag: 11, art: ZUSTAND.ZERRISSEN, verstoss: VERSTOSS.ATTEST_ZEITRAUM },
]

export function zustandAmTag(tag) {
  return ZUSTAENDE.find((z) => z.tag === tag) ?? null
}

/**
 * Was der Schüler dazu sagt.
 *
 * Die einzige Erklärung, die das Spiel für den Zustand gibt – und sie reicht
 * auch. Ein eingeblendeter Hinweis „Ziehen Sie die Teile zusammen" wäre eine
 * Bedienungsanleitung; „Die ist mir gerissen" ist eine Entschuldigung, und
 * die versteht man ohne Anleitung.
 */
const SPRUECHE = {
  [ZUSTAND.NASS]: [
    'Die war in meiner Jacke, und dann hat es geregnet. Man sieht noch alles, glaube ich.',
    'Tut mir leid, die ist nass geworden. In der Bushaltestelle hat es reingeregnet.',
    'Da ist mir die Trinkflasche ausgelaufen. Das war schon so, als ich sie rausgeholt hab.',
  ],
  [ZUSTAND.ZERRISSEN]: [
    'Die ist mir gerissen, als ich sie aus dem Ranzen gezogen hab. Passt aber zusammen.',
    'Ich hab beide Teile dabei, ehrlich. Das eine steckte noch im Heft.',
    'Mein Bruder hat die erwischt. Ich hab alles wieder eingesammelt.',
  ],
}

/**
 * Setzt den Zustand auf einen Vorgang.
 *
 * Bekommt `pick` von außen statt sich einen eigenen Zufall zu bauen: Der
 * ganze Tag hängt an einem einzigen Strom, und ein zweiter daneben machte die
 * Schicht unreproduzierbar.
 */
export function zustandAnwenden(art, a, pick) {
  a.zustand = art
  a.spruch = pick(SPRUECHE[art])
  return a
}
