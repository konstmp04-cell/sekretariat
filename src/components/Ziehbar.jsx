/**
 * Macht ein Dokument mit der Maus verschiebbar.
 *
 * Warum das mehr ist als Bequemlichkeit: Der Schreibtisch ist absichtlich zu
 * klein. Die Papiere liegen übereinander, und wer die Unterschrift mit der
 * Akte vergleichen will, muss sie erst nebeneinander schieben. Diese
 * Handarbeit ist das eigentliche Spielgefühl – ohne sie ist der Vorgang nur
 * ein Formular mit zwei Knöpfen.
 *
 * Umgesetzt mit Pointer-Events statt Maus-Events: Damit funktioniert dasselbe
 * Verschieben auch mit Finger oder Stift. `setPointerCapture` sorgt dafür,
 * dass ein schnell gezogenes Blatt nicht "abreißt", sobald der Zeiger seinen
 * Rand verlässt.
 */

import { useCallback, useRef, useState } from 'react'
import { spiele } from '../game/audio.js'

// So viel vom Blatt muss auf der Fläche sichtbar bleiben – sonst ließe sich
// ein Dokument aus dem Bild schieben und wäre nicht mehr zu greifen.
const REST_X = 140
const REST_Y = 70

export default function Ziehbar({ start, z = 1, onVorn, children }) {
  const [pos, setPos] = useState(start)
  const [zieht, setZieht] = useState(false)
  const ref = useRef(null)
  const griff = useRef({ x: 0, y: 0 })

  const runter = useCallback(
    (e) => {
      if (e.button !== 0) return
      onVorn?.()
      const el = ref.current
      const kasten = el.getBoundingClientRect()
      griff.current = { x: e.clientX - kasten.left, y: e.clientY - kasten.top }
      el.setPointerCapture(e.pointerId)
      setZieht(true)
      spiele('papier')
    },
    [onVorn],
  )

  const bewegen = useCallback(
    (e) => {
      if (!zieht) return
      const el = ref.current
      const flaeche = el.offsetParent?.getBoundingClientRect()
      if (!flaeche) return

      let x = e.clientX - flaeche.left - griff.current.x
      let y = e.clientY - flaeche.top - griff.current.y

      // Innerhalb der Schreibtischfläche halten
      x = Math.max(REST_X - el.offsetWidth, Math.min(flaeche.width - REST_X, x))
      y = Math.max(0, Math.min(flaeche.height - REST_Y, y))

      setPos({ x, y })
    },
    [zieht],
  )

  const hoch = useCallback(
    (e) => {
      if (!zieht) return
      ref.current.releasePointerCapture(e.pointerId)
      setZieht(false)
    },
    [zieht],
  )

  return (
    <div
      ref={ref}
      onPointerDown={runter}
      onPointerMove={bewegen}
      onPointerUp={hoch}
      onPointerCancel={hoch}
      className="absolute touch-none select-none"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: z,
        cursor: zieht ? 'grabbing' : 'grab',
        // Beim Anheben hebt sich das Blatt sichtbar von der Unterlage ab.
        transform: zieht ? 'scale(1.025)' : 'none',
        filter: zieht ? 'drop-shadow(0 18px 22px rgb(0 0 0 / 0.5))' : 'none',
        transition: zieht ? 'none' : 'transform 160ms ease-out, filter 160ms ease-out',
      }}
    >
      {children}
    </div>
  )
}
