/**
 * Wiederkehrende Figuren.
 *
 * Bis hierher war jeder Schüler austauschbar: Du prüfst Papiere, keine
 * Menschen. Diese drei kommen mehrfach, behalten über alle Tage dasselbe
 * Gesicht und dieselbe Elternunterschrift – und sie erinnern sich daran, wie
 * du beim letzten Mal entschieden hast.
 *
 * Darin liegt der eigentliche Zweck: Eine Regel zu brechen kostet nichts,
 * solange der Fall anonym ist. Sie zu brechen, wenn jemand vor dir steht,
 * den du kennst, ist etwas völlig anderes – und genau davon lebt das Vorbild.
 *
 * Die Auftritte stehen fest im Drehbuch. Was der Spieler entschieden hat,
 * fließt nur in den Dialog ein, nicht in die Papiere: Sonst wäre das Spiel
 * nicht mehr fair prüfbar.
 */

import { VERSTOSS } from './regeln.js'

export const FIGUREN = [
  {
    id: 'milan',
    name: 'Milan Petrov',
    vorname: 'Milan',
    nachname: 'Petrov',
    klasse: '9b',
    weiblich: false,
    elternteil: 'Mutter',
    auftritte: {
      2: {
        verstoss: VERSTOSS.FAELSCHUNG,
        text: 'Morgen. Hier, von meiner Mutter.',
      },
      5: {
        verstoss: VERSTOSS.FAELSCHUNG,
        text: 'Ich bin es nochmal. Diesmal ist alles richtig.',
        wennDurchgelassen: 'Sie waren letztes Mal in Ordnung zu mir. Danke dafür.',
        wennAbgewiesen: 'Letztes Mal haben Sie mich abgewiesen. Heute passt es aber.',
      },
      8: {
        verstoss: VERSTOSS.FAELSCHUNG,
        text: 'Bitte. Nur dieses eine Mal noch.',
        wennDurchgelassen: 'Sie haben mich schon zweimal durchgelassen. Ich frag nicht gern nochmal.',
        wennAbgewiesen: 'Ich weiß, was Sie sagen werden. Schauen Sie trotzdem hin.',
      },
      11: {
        verstoss: VERSTOSS.FAELSCHUNG,
        text: 'Meine Mutter arbeitet nachts. Wenn sie schläft, wecke ich sie nicht für einen Zettel.',
        wennDurchgelassen: 'Sie wissen längst, dass die nicht von ihr sind. Sie haben trotzdem gestempelt.',
        wennAbgewiesen: 'Meine Mutter arbeitet nachts. Sie kriegt gar nicht mit, dass ich fehle.',
      },
      // Der letzte Vorgang des Spiels.
      //
      // Zum ersten Mal sind seine Papiere in Ordnung – er hat seine Mutter
      // geweckt. Und genau heute steht in der Dienstanweisung, dass von ihm
      // nichts mehr anzunehmen ist. Beide Systeme, die das Spiel aufgebaut
      // hat, treffen hier aufeinander: der Mensch, den man über elf Tage
      // kennengelernt hat, und die Anordnung, für die es keine Begründung
      // gibt.
      12: {
        verstoss: VERSTOSS.KEINER,
        letzter: true,
        text: 'Diesmal stimmt alles. Sehen Sie ruhig genau hin.',
        zeileAus: (verlauf) => {
          const durch = verlauf.filter((x) => x.entscheidung !== 'deny').length
          const ab = verlauf.filter((x) => x.entscheidung === 'deny').length
          if (durch >= 3) return 'Ich hab sie geweckt. Nach allem, was Sie für mich getan haben, war das das Mindeste.'
          if (ab >= 3) return 'Ich hab sie geweckt. Extra für Sie. Jetzt können Sie nichts mehr sagen.'
          if (durch > ab) return 'Diesmal ist es echt. Sie haben mir geglaubt, als es das nicht war.'
          return 'Diesmal ist es echt. Prüfen Sie es. Bitte.'
        },
      },
    },
  },
  {
    id: 'nora',
    name: 'Nora Weiss',
    vorname: 'Nora',
    nachname: 'Weiss',
    klasse: '10a',
    weiblich: true,
    elternteil: 'Vater',
    auftritte: {
      6: {
        verstoss: VERSTOSS.DATUM,
        text: 'Das Datum stimmt vielleicht nicht ganz. Wäre es ein Problem, wenn Sie es so nehmen?',
        bestechung: {
          betrag: 20,
          text: 'Sie legt einen zusammengefalteten Zwanziger unter die Entschuldigung.',
        },
      },
      10: {
        verstoss: VERSTOSS.KEINER,
        text: 'Heute ist alles echt. Ehrlich.',
        wennBestochen: 'Ich hab Ihnen letztes Mal was hingelegt. Das bleibt unter uns, ja?',
        wennAbgewiesen: 'Sie haben mein Geld nicht genommen. Das fand ich … überraschend.',
      },
      12: {
        verstoss: VERSTOSS.DATUM,
        text: 'Letzter Tag. Schauen Sie einmal drüber, ja?',
        zeileAus: (verlauf) => {
          if (verlauf.some((x) => x.entscheidung === 'bestochen')) {
            return 'Letzter Tag. Ich hab diesmal nichts dabei – nur den Zettel.'
          }
          return 'Letzter Tag. Ich versuchs gar nicht erst mit was anderem.'
        },
      },
    },
  },
  {
    id: 'emil',
    name: 'Emil Sander',
    vorname: 'Emil',
    nachname: 'Sander',
    klasse: '7a',
    weiblich: false,
    elternteil: 'Vater',
    auftritte: {
      4: {
        verstoss: VERSTOSS.KEINER,
        text: 'Guten Morgen. Mein Vater hat das ausgefüllt.',
      },
      9: {
        // Papiere eindeutig ungültig – und der Grund ist trotzdem wahr.
        verstoss: VERSTOSS.ATTEST_FEHLT,
        text: 'Wir waren nicht beim Arzt. Mein Vater konnte nicht, er liegt selbst flach. Es stimmt aber alles.',
        wennDurchgelassen: 'Sie waren neulich nett zu mir. Ich hab kein Attest, wir waren nicht beim Arzt.',
      },
      12: {
        verstoss: VERSTOSS.KEINER,
        text: 'Meinem Vater gehts wieder besser. Er hat das hier selbst geschrieben.',
        zeileAus: (verlauf) => {
          const ab = verlauf.filter((x) => x.entscheidung === 'deny').length
          if (ab >= 2) return 'Meinem Vater gehts wieder besser. Diesmal ist alles dabei, was Sie brauchen.'
          return 'Meinem Vater gehts wieder besser. Er hat das hier selbst geschrieben.'
        },
      },
    },
  },
]

/** Welche Figuren treten an diesem Tag auf? */
export function auftritteAmTag(day) {
  return FIGUREN.filter((f) => f.auftritte[day]).map((f) => ({
    figur: f,
    auftritt: f.auftritte[day],
  }))
}

/**
 * Wählt die Zeile, die zur Vorgeschichte passt.
 * @param {object} auftritt
 * @param {Array<{entscheidung: string}>} verlauf  frühere Begegnungen
 */
export function zeileFuer(auftritt, verlauf = []) {
  // Eine eigene Funktion hat Vorrang. Die drei festen Varianten unten
  // („durchgelassen / abgewiesen / bestochen") reichen für ein Wiedersehen,
  // aber nicht für einen Abschied: Am letzten Tag zählt nicht die letzte
  // Begegnung, sondern wie oft man sich insgesamt so oder so entschieden hat.
  if (typeof auftritt.zeileAus === 'function') return auftritt.zeileAus(verlauf)
  const letzte = verlauf[verlauf.length - 1]
  if (!letzte) return auftritt.text
  if (letzte.entscheidung === 'bestochen' && auftritt.wennBestochen) return auftritt.wennBestochen
  if (letzte.entscheidung === 'ok' && auftritt.wennDurchgelassen) return auftritt.wennDurchgelassen
  if (letzte.entscheidung === 'deny' && auftritt.wennAbgewiesen) return auftritt.wennAbgewiesen
  return auftritt.text
}
