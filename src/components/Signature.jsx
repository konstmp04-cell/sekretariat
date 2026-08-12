/**
 * Unterschrift als gezeichnete Kurve.
 *
 * `forgery` steuert die Abweichung von der hinterlegten Originalunterschrift.
 * Wichtig fürs Spielgefühl: Die Tinte hat ungleichmäßige Strichstärke, sonst
 * sieht die Kurve aus wie ein Diagramm und nicht wie ein Federstrich.
 */

import { useMemo } from 'react'
import { signaturePath } from '../game/signature.js'

export default function Signature({
  seed,
  forgery = 0,
  width = 240,
  height = 74,
  color = '#1b2a4a',
  className = '',
  animate = false,
}) {
  const sig = useMemo(
    () => signaturePath(seed, { width, height, forgery }),
    [seed, forgery, width, height],
  )
  const uid = `sig-${seed}-${Math.round(forgery * 100)}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      role="img"
      aria-label="Unterschrift"
    >
      <defs>
        {/* Leichte Verwacklung: macht aus der mathematisch glatten Kurve
            einen Strich, der von einer echten Hand stammen könnte. */}
        <filter id={`${uid}-pen`} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed={seed % 100} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter={`url(#${uid}-pen)`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        {/* Doppelter Auftrag: breiter, blasser Strich unten für den Tintenrand,
            schmaler, satter Strich oben für den Kern. */}
        <path d={sig.main} strokeWidth="3.4" opacity="0.22" />
        <path
          d={sig.main}
          strokeWidth="2"
          opacity="0.95"
          className={animate ? 'animate-ink-settle' : undefined}
        />
        {sig.extras.map((d, i) => (
          <g key={i}>
            <path d={d} strokeWidth="2.8" opacity="0.18" />
            <path d={d} strokeWidth="1.7" opacity="0.9" />
          </g>
        ))}
      </g>
    </svg>
  )
}
