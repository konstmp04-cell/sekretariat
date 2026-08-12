/**
 * Vergrößerungsglas für den Schreibtisch.
 *
 * Kein Zierstück: Ab Tag 11 weicht eine Fälschung nur noch in einer einzigen
 * Schlaufe vom Original ab, und ein Passfoto unterscheidet sich womöglich nur
 * in der Brauenform. Genau dafür hat ein Dokumentenprüfer eine Lupe.
 *
 * Der entscheidende Kniff: Sie vergrößert keinen Bildschirmausschnitt, sondern
 * lässt das Dokument darunter NEU zeichnen – in groß. Unterschriften und
 * Porträts entstehen ohnehin aus einem Seed, sie lassen sich in jeder Größe
 * ausgeben. Das Ergebnis ist gestochen scharf statt vergrößert-verpixelt.
 *
 * Was unter der Linse liegt, wird über `document.elementsFromPoint` ermittelt:
 * Jeder vergrößerbare Bereich trägt ein `data-lupe`-Kennzeichen, das auf einen
 * Eintrag in `inhalte` verweist.
 *
 * Liegend ist sie kleiner als in der Hand. Das ist nicht nur Zurückhaltung
 * gegenüber dem übrigen Schreibtisch: Weil die Skalierung den ganzen Aufbau
 * erfasst, vergrößert das Glas im Liegen auch entsprechend schwächer und löst
 * erst auf, wenn man es aufnimmt – so verhält sich ein Glas, das flach auf der
 * Platte liegt, statt über dem Papier zu schweben.
 */

import { useCallback, useRef, useState } from 'react'
import { spiele } from '../game/audio.js'

const DURCHMESSER = 158
/** Ruhend, unter dem Zeiger, in der Hand. */
const SKALA = { liegt: 0.76, bereit: 0.85, hand: 1 }

export default function Lupe({ start, inhalte, z = 40 }) {
  const [pos, setPos] = useState(start)
  const [zieht, setZieht] = useState(false)
  const [ueber, setUeber] = useState(false)
  const [ziel, setZiel] = useState(null)
  const ref = useRef(null)
  const griff = useRef({ x: 0, y: 0 })

  const skala = zieht ? SKALA.hand : ueber ? SKALA.bereit : SKALA.liegt

  /**
   * Was liegt gerade unter der Linsenmitte – und an welcher Stelle davon?
   *
   * Die Relativlage ist entscheidend: Eine Lupe, die stets die Mitte des
   * Dokuments zeigt, ist keine Lupe. Der Punkt unter dem Glas muss auch im
   * Glas erscheinen, sonst fährt man über die Unterschrift und sieht immer
   * denselben Ausschnitt.
   */
  const pruefeZiel = useCallback(() => {
    const el = ref.current
    if (!el) return
    // Bewusst aus dem Rechteck statt aus DURCHMESSER: Das Glas ist je nach
    // Zustand skaliert, und getBoundingClientRect liefert die sichtbare Größe.
    const k = el.getBoundingClientRect()
    const mx = k.left + k.width / 2
    const my = k.top + k.height / 2
    // elementsFromPoint liefert den ganzen Stapel an dieser Stelle – so
    // findet sich das Dokument auch dann, wenn die Lupe selbst darüberliegt.
    const treffer = document
      .elementsFromPoint(mx, my)
      .map((e) => e.closest?.('[data-lupe]'))
      .find(Boolean)
    if (!treffer) return setZiel(null)
    const t = treffer.getBoundingClientRect()
    setZiel({
      schluessel: treffer.dataset.lupe,
      relX: (mx - t.left) / t.width,
      relY: (my - t.top) / t.height,
    })
  }, [])

  const runter = useCallback(
    (e) => {
      if (e.button !== 0) return
      // Der Griffpunkt muss im UNSKALIERTEN Kastenmaß liegen, denn `left`/`top`
      // setzen den Kasten, nicht das skalierte Bild. Über das Rechteck gemessen
      // würde die Lupe beim Aufnehmen wegspringen, weil sie im selben Moment
      // von 0,85 auf 1 wächst.
      const flaeche = ref.current.offsetParent?.getBoundingClientRect()
      if (!flaeche) return
      griff.current = {
        x: e.clientX - flaeche.left - pos.x,
        y: e.clientY - flaeche.top - pos.y,
      }
      ref.current.setPointerCapture(e.pointerId)
      setZieht(true)
      spiele('klick')
    },
    [pos],
  )

  const bewegen = useCallback(
    (e) => {
      if (!zieht) return
      const flaeche = ref.current.offsetParent?.getBoundingClientRect()
      if (!flaeche) return
      const x = Math.max(
        -DURCHMESSER * 0.4,
        Math.min(flaeche.width - DURCHMESSER * 0.6, e.clientX - flaeche.left - griff.current.x),
      )
      const y = Math.max(
        -DURCHMESSER * 0.3,
        Math.min(flaeche.height - DURCHMESSER * 0.5, e.clientY - flaeche.top - griff.current.y),
      )
      setPos({ x, y })
      pruefeZiel()
    },
    [zieht, pruefeZiel],
  )

  const hoch = useCallback(
    (e) => {
      if (!zieht) return
      ref.current.releasePointerCapture(e.pointerId)
      setZieht(false)
      pruefeZiel()
    },
    [zieht, pruefeZiel],
  )

  const inhalt = ziel ? inhalte[ziel.schluessel] : null

  return (
    <div
      ref={ref}
      onPointerDown={runter}
      onPointerMove={bewegen}
      onPointerUp={hoch}
      onPointerCancel={hoch}
      onPointerEnter={() => setUeber(true)}
      onPointerLeave={() => setUeber(false)}
      className="absolute touch-none select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: DURCHMESSER,
        height: DURCHMESSER,
        zIndex: z,
        cursor: zieht ? 'grabbing' : 'grab',
        transform: `scale(${skala})`,
        // Um die Mitte, damit der betrachtete Punkt beim Aufnehmen stehen bleibt.
        transformOrigin: 'center',
        transition: 'transform 170ms cubic-bezier(0.2, 0.8, 0.3, 1)',
      }}
    >
      {/* Griff – zeigt nach unten rechts weg von der Linse */}
      <div
        className="absolute"
        style={{
          left: DURCHMESSER * 0.78,
          top: DURCHMESSER * 0.78,
          width: 74,
          height: 15,
          borderRadius: 8,
          transform: 'rotate(42deg)',
          transformOrigin: '0 50%',
          background: 'linear-gradient(180deg, #7a5c33, #4a3620 60%, #2f2415)',
          boxShadow: '0 3px 6px rgb(0 0 0 / 0.5)',
        }}
      />

      {/* Glas mit dem vergrößerten Inhalt */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
        style={{
          background: inhalt ? 'rgb(244 236 216 / 0.97)' : 'rgb(196 200 186 / 0.34)',
          // Liegend wirft sie einen kurzen, harten Schatten, in der Hand einen
          // langen weichen – sonst schwebt sie auch im Ruhezustand über dem Tisch.
          boxShadow: zieht
            ? 'inset 0 0 26px rgb(0 0 0 / 0.28), 0 10px 22px rgb(0 0 0 / 0.55)'
            : 'inset 0 0 26px rgb(0 0 0 / 0.28), 0 3px 7px rgb(0 0 0 / 0.5)',
          transition: 'box-shadow 170ms ease',
        }}
      >
        {inhalt && (
          <div
            className="pointer-events-none absolute left-0 top-0"
            style={{
              transform: `translate(${DURCHMESSER / 2 - ziel.relX * inhalt.w}px, ${
                DURCHMESSER / 2 - ziel.relY * inhalt.h
              }px)`,
            }}
          >
            {inhalt.node}
          </div>
        )}
      </div>

      {/* Fassung aus Messing */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          border: '7px solid transparent',
          background:
            'linear-gradient(135deg, #d9b273, #8a6a3a 40%, #5c4526 65%, #c2a066) border-box',
          WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Lichtreflex auf dem Glas */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: '16%',
          top: '12%',
          width: '38%',
          height: '26%',
          background: 'linear-gradient(140deg, rgb(255 255 255 / 0.4), transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  )
}
