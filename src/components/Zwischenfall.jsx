/**
 * Der Zwischenfall – jemand wirft eine Stinkbombe.
 *
 * Das Vorbild hat einen Moment, in dem einer eine Handgranate wirft und über
 * die Grenze klettert: ein Bruch in der Routine, plötzlich und mit Folgen. Die
 * schulische Entsprechung ist die Stinkbombe.
 *
 * ZWEI ENTWURFSENTSCHEIDUNGEN, an denen alles hängt:
 *
 * 1. ES IST EINE FOLGE, KEIN ZUFALL. Der Wurf kommt nicht aus dem Nichts. Er
 *    kommt, wenn der Schüler-Ruf tief gefallen ist – wenn man über Tage hart
 *    war. Damit ist er nicht Slapstick, sondern die Quittung: die Schülerschaft,
 *    die zurückschlägt, bevor aus dem tiefen Ruf ein offener Aufstand wird. Wer
 *    fair war, sieht das hier nie. Ausgelöst wird er im Reducer, nicht hier.
 *
 * 2. ER KOSTET NICHTS EXTRA. Der Ruf-Verlust hat längst stattgefunden – das
 *    hier ist sein sichtbares Echo, nicht eine zweite Strafe obendrauf. Den
 *    Spieler zusätzlich zu bestrafen, weil die Schüler etwas tun, wäre unfair.
 *    Die Wucht liegt im Bild, nicht in der Zahl.
 *
 * Der Werfer trägt, wenn möglich, ein Gesicht, das man kennt: Hat man Milan
 * wiederholt abgewiesen, ist er es. Sonst ein aufgebrachter Fremder – denn der
 * Ruf ist etwas Kollektives, und wer viele abgewiesen hat, hat sie alle gegen
 * sich, nicht einen. Welches der beiden, entscheidet der Reducer; hier wird nur
 * gespielt.
 *
 * Der Ablauf ist eine feste Abfolge aus Zeitschritten – Werfer, Wurf, Knall,
 * Wolke, Ende. Kein Spielzustand hängt daran; wenn die Wolke verzogen ist,
 * meldet die Komponente `onFertig`, und die Schicht beginnt normal.
 */

import { useEffect, useRef, useState } from 'react'
import LaufFigur from './LaufFigur.jsx'

const ABLAUF = {
  wurf: 480, // Werfer steht, holt aus
  knall: 480 + 820, // Fläschchen zerplatzt in der Mitte
  ende: 480 + 820 + 2400, // Wolke verzogen
}

export default function Zwischenfall({ face, onKnall, onFertig }) {
  const [phase, setPhase] = useState('werfer')

  // Die Rückrufe liegen in Refs, und der Zeitplan hängt an einem Effekt mit
  // leerer Abhängigkeitsliste. Beides gehört zusammen: `onKnall` löst über
  // setShake ein Neuzeichnen im Elternteil aus, und bei jedem Neuzeichnen wären
  // die Rückrufe neue Funktionen. Hinge der Effekt an ihnen, setzte er bei
  // genau diesem Neuzeichnen alle Timer zurück – der Vorfall liefe endlos und
  // meldete sein Ende nie. Der Ablauf wird deshalb einmal beim Erscheinen
  // gestartet und danach nicht mehr angefasst.
  const knall = useRef(onKnall)
  const fertig = useRef(onFertig)
  knall.current = onKnall
  fertig.current = onFertig

  useEffect(() => {
    const uhren = [
      setTimeout(() => setPhase('flug'), ABLAUF.wurf),
      setTimeout(() => {
        setPhase('knall')
        knall.current?.()
      }, ABLAUF.knall),
      setTimeout(() => fertig.current?.(), ABLAUF.ende),
    ]
    return () => uhren.forEach(clearTimeout)
  }, [])

  const geworfen = phase === 'flug' || phase === 'knall'
  const geknallt = phase === 'knall'

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* Der Werfer, rechts nahe der Tür. Flieht, sobald es geknallt hat. */}
      <div
        className={`absolute bottom-1 ${geknallt ? 'animate-fliehen' : ''}`}
        style={{ right: '20%', transform: geknallt ? undefined : 'none' }}
      >
        <LaufFigur face={face} px={2} geht={geknallt} spiegeln tempo={150} />
      </div>

      {/* Das Fläschchen auf seiner Flugbahn. Zwei geschachtelte Elemente:
          außen waagerecht, innen der Bogen. */}
      {geworfen && !geknallt && (
        <div className="animate-flug-x absolute" style={{ bottom: '46%' }}>
          <div className="animate-flug-y">
            <div
              style={{
                width: 12,
                height: 14,
                borderRadius: '46% 46% 50% 50%',
                background: 'linear-gradient(160deg, #6b7233, #3f4420)',
                boxShadow: 'inset -1px -1px 2px rgb(0 0 0 / 0.4)',
              }}
            />
          </div>
        </div>
      )}

      {/* Der Aufprall in der Mitte: Gaswolke plus aufsteigende Schwaden. */}
      {geknallt && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '8%' }}>
          <div
            className="animate-stinkwolke rounded-full"
            style={{
              width: 220,
              height: 150,
              background:
                'radial-gradient(circle, rgb(150 168 92 / 0.7) 0%, rgb(110 132 70 / 0.4) 45%, transparent 72%)',
              filter: 'blur(6px)',
            }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-schwaden absolute rounded-full"
              style={{
                left: 40 + i * 60,
                bottom: 20,
                width: 46,
                height: 46,
                background: 'radial-gradient(circle, rgb(160 176 100 / 0.5), transparent 70%)',
                filter: 'blur(5px)',
                animationDelay: `${i * 180}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Der Vermerk. Erscheint mit dem Knall und trägt die Deutung: Das hier
          ist kein Unfall, sondern eine Reaktion. */}
      {geknallt && (
        <div className="animate-ink-settle absolute left-1/2 top-4 -translate-x-1/2 rounded-sm border border-stamp-deny/50 bg-desk-900/90 px-4 py-2 text-center">
          <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-stamp-deny">
            Zwischenfall am Schalter
          </p>
          <p className="mt-[2px] font-form text-[11px] leading-snug text-paper-300">
            Jemand hat eine Stinkbombe geworfen. Die Stimmung ist gekippt.
          </p>
        </div>
      )}
    </div>
  )
}
