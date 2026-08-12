/**
 * Ein Blatt Papier.
 *
 * Der Unterschied zwischen "weißes Rechteck" und "Dokument" sind die Makel:
 * Faserstruktur, Knickfalte, Heftlöcher, ein Kaffeerand. Alles seedbasiert,
 * damit jedes Blatt eine eigene Geschichte hat, aber stabil bleibt.
 */

import { useMemo } from 'react'
import { makeRng, rngHelpers } from '../game/rng.js'

export default function Paper({
  seed = 1,
  width = 360,
  tilt = 0,
  children,
  className = '',
  style,
  animate = true,
}) {
  const marks = useMemo(() => {
    const { range, chance, int } = rngHelpers(makeRng(seed))
    return {
      crease: chance(0.55) ? range(0.3, 0.7) : null,
      creaseAngle: range(-1.5, 1.5),
      coffee: chance(0.3) ? { x: range(0.55, 0.9), y: range(0.6, 0.9), r: range(26, 44) } : null,
      staples: chance(0.45) ? int(1, 2) : 0,
      dogEar: chance(0.25),
      aged: range(0, 0.06),
    }
  }, [seed])

  const uid = `pap-${seed}`

  return (
    <div
      className={`paper-sheet relative ${animate ? 'animate-paper-in' : ''} ${className}`}
      style={{ width, '--tilt': `${tilt}deg`, transform: `rotate(${tilt}deg)`, ...style }}
    >
      {/* Faserstruktur */}
      <svg className="paper-fiber" aria-hidden="true">
        <filter id={`${uid}-fib`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed % 90} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${uid}-fib)`} opacity="0.55" />
      </svg>

      {/* Knickfalte */}
      {marks.crease !== null && (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: `${marks.crease * 100}%`,
            height: 3,
            transform: `rotate(${marks.creaseAngle}deg)`,
            background:
              'linear-gradient(180deg, rgb(120 96 60 / 0.20), rgb(255 255 255 / 0.5) 55%, transparent)',
          }}
        />
      )}

      {/* Kaffeerand */}
      {marks.coffee && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `calc(${marks.coffee.x * 100}% - ${marks.coffee.r}px)`,
            top: `calc(${marks.coffee.y * 100}% - ${marks.coffee.r}px)`,
            width: marks.coffee.r * 2,
            height: marks.coffee.r * 2,
            border: '3px solid rgb(126 88 42 / 0.20)',
            background: 'radial-gradient(circle, rgb(126 88 42 / 0.05) 60%, rgb(126 88 42 / 0.12))',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* Heftlöcher */}
      {marks.staples > 0 && (
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1">
          {Array.from({ length: marks.staples }, (_, i) => (
            <span
              key={i}
              className="block h-[5px] w-[5px] rounded-full"
              style={{ background: 'rgb(60 45 25 / 0.32)', boxShadow: 'inset 0 1px 1px rgb(0 0 0 / 0.4)' }}
            />
          ))}
        </div>
      )}

      {/* Vergilbung */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: '#8a6a34', opacity: marks.aged, mixBlendMode: 'multiply' }}
      />

      {/* Eselsohr unten rechts */}
      {marks.dogEar && (
        <div
          className="pointer-events-none absolute bottom-0 right-0"
          style={{
            width: 22,
            height: 22,
            background: 'linear-gradient(135deg, transparent 50%, #d8caa6 50%)',
            boxShadow: '-2px -2px 4px rgb(0 0 0 / 0.18)',
          }}
        />
      )}

      <div className="relative">{children}</div>
    </div>
  )
}
