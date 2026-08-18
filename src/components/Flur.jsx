/**
 * Der Flur über dem Schalter.
 *
 * Bisher hingen dort drei verwaschene Brustbilder als Andeutung einer
 * Warteschlange – unbewegt, und dadurch eher Tapete als Warteschlange. Jetzt
 * sitzen dort Menschen auf einer Bank, und der Nächste löst sich und läuft
 * zum Fenster.
 *
 * Zwei Ebenen:
 *
 * 1. WARTENDE. Sitzen links auf der Bank, blicken zum Schalter. Ihre Zahl
 *    schrumpft mit dem Tag, und weil sie sichtbar dieselben Gesichter tragen
 *    wie die Vorgänge danach, sieht man tatsächlich, wer noch kommt.
 *
 * 2. ANMARSCH. Bei jedem neuen Vorgang löst sich einer aus der Schlange und
 *    geht zum Fenster. Erst wenn er ankommt, erscheint das große Porträt.
 *
 * Die früheren DURCHGEHENDEN – Passanten, die vorne quer durchs Bild liefen –
 * gibt es nicht mehr. Sie passten zu einem Gang; ein Vorzimmer ist kein
 * Durchgang. Das „die Schule läuft weiter"-Gefühl ist hinter die Milchglastür
 * gewandert (siehe Vorzimmer.jsx): Der Betrieb ist jetzt ein Schatten hinter
 * der Scheibe, nicht ein Läufer vor der Nase.
 *
 * Warum das keine Wartezeit erzeugt: Die Dokumente liegen vom ersten Bild an
 * auf dem Tisch. Wer will, liest schon die Entschuldigung, während der Schüler
 * noch unterwegs ist – genau wie im Vorbild. Verzögert wird das Bild, nicht
 * das Spiel.
 */

import LaufFigur from './LaufFigur.jsx'

/**
 * Wie lange der Anmarsch dauert.
 *
 * Muss mit der Dauer der Bildfolge `anmarsch` in index.css übereinstimmen –
 * dort läuft die Strecke, hier wartet das Porträt.
 */
export const ANMARSCH_MS = 2000

export default function Flur({ wartende, person, index, angekommen, pausiert = false, fliehen = false }) {
  return (
    <>
      {/* Wartende: sitzen zum Fenster hin aufgereiht.
          Umgekehrte Richtung, damit der Nächste ganz vorn steht – also rechts,
          dem Schalter am nächsten. Genau von dort startet der Anmarsch. */}
      <div className="pointer-events-none absolute bottom-1 left-[calc(50%-436px)] flex flex-row-reverse items-end gap-5">
        {wartende.map((f, i) => (
          <span
            key={f.id}
            className={fliehen ? 'animate-fliehen' : ''}
            style={{ opacity: 0.75 - i * 0.13, animationDelay: `${i * 60}ms` }}
          >
            <LaufFigur face={f.face} px={2} geht={fliehen} />
          </span>
        ))}
      </div>

      {/* Anmarsch: löst sich aus der Schlange und geht zum Fenster. Während
          eines Zwischenfalls bleibt er aus – niemand geht in die Wolke. */}
      {!angekommen && !pausiert && (
        <div
          key={index}
          className="pointer-events-none absolute bottom-1 animate-anmarsch"
          style={{ left: 0 }}
        >
          <LaufFigur face={person} px={2} tempo={190} />
        </div>
      )}
    </>
  )
}
