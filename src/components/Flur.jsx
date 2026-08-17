/**
 * Der Flur über dem Schalter.
 *
 * Bisher hingen dort drei verwaschene Brustbilder als Andeutung einer
 * Warteschlange – unbewegt, und dadurch eher Tapete als Warteschlange. Jetzt
 * stehen dort Menschen, der Nächste läuft heran, und gelegentlich geht jemand
 * durch, der mit dem Schalter nichts zu tun hat.
 *
 * Drei Ebenen, von hinten nach vorn:
 *
 * 1. DURCHGEHENDE. Laufen quer durchs Bild, gedimmt und weiter oben – sie
 *    sind weiter weg. Sie haben keinen Zweck außer dem einen: Die Schule läuft
 *    weiter, während man Papiere prüft. Bisher leistete das nur der Ton mit
 *    der Pausenglocke.
 *
 * 2. WARTENDE. Stehen links, blicken zum Schalter. Ihre Zahl schrumpft mit dem
 *    Tag, und weil sie sichtbar dieselben Gesichter tragen wie die Vorgänge
 *    danach, sieht man tatsächlich, wer noch kommt.
 *
 * 3. ANMARSCH. Bei jedem neuen Vorgang löst sich einer aus der Schlange und
 *    geht zum Fenster. Erst wenn er ankommt, erscheint das große Porträt.
 *
 * Warum das keine Wartezeit erzeugt: Die Dokumente liegen vom ersten Bild an
 * auf dem Tisch. Wer will, liest schon die Entschuldigung, während der Schüler
 * noch unterwegs ist – genau wie im Vorbild. Verzögert wird das Bild, nicht
 * das Spiel.
 */

import { useEffect, useRef, useState } from 'react'
import LaufFigur from './LaufFigur.jsx'
import { makeFace } from '../game/face.js'
import { hashSeed } from '../game/rng.js'

/**
 * Wie lange der Anmarsch dauert.
 *
 * Muss mit der Dauer der Bildfolge `anmarsch` in index.css übereinstimmen –
 * dort läuft die Strecke, hier wartet das Porträt.
 */
export const ANMARSCH_MS = 2000

/** Ein Mensch, der nur vorbeigeht. */
function Passant({ face, nachLinks, dauer, onFertig }) {
  const [weg, setWeg] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setWeg(true), 40)
    const e = setTimeout(onFertig, dauer + 200)
    return () => {
      clearTimeout(t)
      clearTimeout(e)
    }
  }, [dauer, onFertig])

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        // Weiter oben und gedimmt: Der Flur reicht nach hinten, und wer
        // dahinten geht, ist weder gleich groß noch gleich hell.
        bottom: 92,
        left: weg ? (nachLinks ? '-6%' : '104%') : nachLinks ? '104%' : '-6%',
        opacity: 0.34,
        transition: `left ${dauer}ms linear`,
      }}
    >
      <LaufFigur face={face} px={2} spiegeln={nachLinks} tempo={215} />
    </div>
  )
}

export default function Flur({ wartende, person, index, angekommen }) {
  const [passanten, setPassanten] = useState([])
  const naechsteId = useRef(0)

  // Durchgehende erscheinen in unregelmäßigen Abständen. Regelmäßig wäre
  // schlimmer als gar nicht: Ein Takt liest sich als Maschine.
  useEffect(() => {
    let uhr = null
    const planen = () => {
      const wartezeit = 7000 + Math.random() * 11000
      uhr = setTimeout(() => {
        const id = naechsteId.current++
        setPassanten((p) => [
          ...p.slice(-1),
          {
            id,
            face: makeFace(hashSeed(`passant-${id}-${Date.now()}`), Math.random() < 0.5),
            nachLinks: Math.random() < 0.45,
            dauer: 9000 + Math.random() * 5000,
          },
        ])
        planen()
      }, wartezeit)
    }
    planen()
    return () => clearTimeout(uhr)
  }, [])

  const entfernen = (id) => setPassanten((p) => p.filter((x) => x.id !== id))

  return (
    <>
      {passanten.map((p) => (
        <Passant key={p.id} {...p} onFertig={() => entfernen(p.id)} />
      ))}

      {/* Wartende: stehen zum Fenster hin aufgereiht.
          Umgekehrte Richtung, damit der Nächste ganz vorn steht – also rechts,
          dem Schalter am nächsten. Genau von dort startet der Anmarsch. */}
      <div className="pointer-events-none absolute bottom-1 left-[calc(50%-436px)] flex flex-row-reverse items-end gap-5">
        {wartende.map((f, i) => (
          <span key={f.id} style={{ opacity: 0.75 - i * 0.13 }}>
            <LaufFigur face={f.face} px={2} geht={false} />
          </span>
        ))}
      </div>

      {/* Anmarsch: löst sich aus der Schlange und geht zum Fenster. */}
      {!angekommen && (
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
