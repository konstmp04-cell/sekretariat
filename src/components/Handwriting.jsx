/**
 * Handschrift.
 *
 * Eine Schriftart allein reicht nicht – gleichmäßig gesetzte Buchstaben lesen
 * sich sofort als "getippt in Schreibschrift". Echte Handschrift schwankt:
 * Jeder Buchstabe sitzt minimal anders, und der Stift gibt mal mehr, mal
 * weniger Tinte ab. Genau das wird hier pro Zeichen aufgetragen – seedbasiert,
 * damit dieselbe Notiz beim erneuten Rendern nicht neu zappelt.
 */

import { useMemo } from 'react'
import { makeRng, hashSeed, rngHelpers } from '../game/rng.js'

export default function Handwriting({
  children,
  seed,
  size = 20,
  color = '#243a5e',
  messy = 1,
  className = '',
  style,
}) {
  const text = String(children ?? '')
  const chars = useMemo(() => {
    const { range } = rngHelpers(makeRng(hashSeed(text + ':' + seed)))
    return [...text].map((ch) => ({
      ch,
      rot: range(-4.5, 4.5) * messy,
      dy: range(-1.6, 1.6) * messy,
      dx: range(-0.5, 0.9) * messy,
      ink: range(0.74, 1),
      scale: range(0.94, 1.08),
    }))
  }, [text, seed, messy])

  return (
    <span
      className={`font-hand leading-tight ${className}`}
      style={{ fontSize: size, color, ...style }}
      aria-label={text}
    >
      {chars.map((c, i) =>
        c.ch === ' ' ? (
          <span key={i}> </span>
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block"
            style={{
              transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.rot}deg) scale(${c.scale})`,
              opacity: c.ink,
            }}
          >
            {c.ch}
          </span>
        ),
      )}
    </span>
  )
}
