/**
 * Das Telefon auf dem Schreibtisch.
 *
 * Bis hierher gab es genau zwei Verben: links stempeln, rechts stempeln. Die
 * Lupe ist ein drittes, aber ein passives – sie zeigt nur genauer, was ohnehin
 * dasteht. Was fehlte, war ein Werkzeug, das nicht entscheidet, sondern
 * HERAUSFINDET.
 *
 * Drei Nummern, und jede beantwortet genau die Frage ihres Dokuments:
 *
 *   Praxis    – Deckt das Attest wirklich alle Fehltage ab?
 *   Eltern    – Stammt die Unterschrift von ihnen?
 *   Rektorat  – Liegt etwas gegen diesen Schüler vor?
 *
 * ZWEI ANRUFE AM TAG, und das ist die wichtigste Zahl in dieser Datei.
 *
 * Ein Telefon, das Gewissheit gibt, macht genaues Hinsehen überflüssig: Wer
 * bei jedem Zweifel anrufen darf, braucht die Lupe nie wieder, und damit wäre
 * die Kernhandlung des Spiels erledigt. Bei zwei Anrufen auf bis zu vierzehn
 * Vorgänge ist es keine Abkürzung, sondern eine Rettungsleine, die man sich
 * für den einen Fall aufspart, bei dem man wirklich nicht weiterkommt. Der
 * eigentliche Gewinn ist deshalb nicht die Auskunft, sondern die Frage davor:
 * Verbrauche ich das jetzt, oder traue ich meinen Augen?
 *
 * Die Antworten werden – wie bei der Regelprüfung – aus den tatsächlichen
 * Dokumentdaten abgeleitet und nie aus dem Feld `verstoss` des Generators.
 * Ein Telefon, das die Absicht des Generators ausplaudert statt die Papiere zu
 * lesen, würde bei jedem Fehler im Generator mitlügen.
 */

export const ANRUFE_PRO_TAG = 2

export const NUMMER = {
  PRAXIS: 'praxis',
  ELTERN: 'eltern',
  REKTORAT: 'rektorat',
}

/**
 * Welche Nummern lassen sich zu diesem Vorgang anrufen?
 *
 * Die Praxis nur, wenn überhaupt ein Attest vorliegt – sonst gäbe es dort
 * niemanden, der etwas bestätigen könnte, und die Nummer wäre eine leere
 * Verlockung.
 */
export function nummernFuer(a) {
  const liste = [
    {
      id: NUMMER.ELTERN,
      name: `${a.elternteil} ${a.nachname}`,
      zweck: 'Unterschrift bestätigen lassen',
    },
    {
      id: NUMMER.REKTORAT,
      name: 'Rektorat',
      zweck: 'Nach Vermerken fragen',
    },
  ]
  if (a.attest) {
    liste.unshift({
      id: NUMMER.PRAXIS,
      name: a.attest.praxis.name,
      zweck: 'Attest überprüfen',
    })
  }
  return liste
}

const MONAT = 'März'

/**
 * Was am anderen Ende gesagt wird.
 *
 * Bewusst in wörtlicher Rede und mit dem Tonfall der jeweiligen Stelle: Die
 * Praxis ist beflissen, das Rektorat einsilbig, Eltern sind überrascht oder
 * verlegen. Eine Auskunft, die wie eine Datenbankantwort klingt, nimmt dem
 * Anruf genau das, wofür er da ist.
 *
 * @returns {{sprecher: string, text: string, ergiebig: boolean}}
 *   `ergiebig` sagt, ob die Auskunft etwas zutage gefördert hat – sie steuert
 *   nur die Farbe des Notizzettels, nie die Bewertung.
 */
export function auskunft(a, id) {
  switch (id) {
    case NUMMER.PRAXIS: {
      const at = a.attest
      const deckt = at.von <= a.fehltagVon && at.bis >= a.fehltagBis
      if (deckt) {
        return {
          sprecher: at.praxis.name,
          text: `Moment … ja, haben wir. Vom ${at.von}. bis zum ${at.bis}. ${MONAT}. Passt das so?`,
          ergiebig: false,
        }
      }
      return {
        sprecher: at.praxis.name,
        text: `Wir haben bis zum ${at.bis}. ${MONAT} bescheinigt, nicht länger. Wenn da mehr steht, steht es nicht von uns drauf.`,
        ergiebig: true,
      }
    }

    case NUMMER.ELTERN: {
      if (a.nameAufNotiz !== a.name) {
        const anderer = a.nameAufNotiz.split(' ')[0]
        return {
          sprecher: `${a.elternteil} ${a.nachname}`,
          text: `${anderer}? Die Entschuldigung war für ${anderer}. Wieso haben Sie die von ${a.vorname}?`,
          ergiebig: true,
        }
      }
      if (a.forgery > 0) {
        return {
          sprecher: `${a.elternteil} ${a.nachname}`,
          text: 'Ich habe heute gar nichts geschrieben. Was steht denn da unten drunter?',
          ergiebig: true,
        }
      }
      return {
        sprecher: `${a.elternteil} ${a.nachname}`,
        text: `Ja, das ist von mir. ${a.vorname} war wirklich krank.`,
        ergiebig: false,
      }
    }

    case NUMMER.REKTORAT:
    default: {
      if (a.sperrvermerk) {
        return {
          sprecher: 'Rektorat',
          text: 'Zu dem Namen liegt uns etwas vor. Nichts annehmen, alles über uns.',
          ergiebig: true,
        }
      }
      return {
        sprecher: 'Rektorat',
        text: 'Nichts vermerkt. Bearbeiten Sie das nach Vorschrift.',
        ergiebig: false,
      }
    }
  }
}
