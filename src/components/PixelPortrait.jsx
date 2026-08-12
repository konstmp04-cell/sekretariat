/**
 * Zeichnet ein Pixel-Porträt auf ein Canvas.
 *
 * Wichtig ist die ganzzahlige Skalierung plus abgeschaltete Glättung: Sobald
 * der Browser interpolieren darf, wird aus scharfer Pixel-Art matschiger
 * Brei. `imageSmoothingEnabled = false` und ein ganzzahliger Faktor sind
 * nicht verhandelbar.
 */

import { useEffect, useMemo, useRef } from 'react'
import { buildPortrait, paletteFuer, BREITE, HOEHE } from '../game/pixelPortrait.js'
import { LEER } from '../game/pixelGrid.js'

export default function PixelPortrait({ face, scale = 3, className = '', hintergrund = '#a8ac9c' }) {
  const canvasRef = useRef(null)
  const grid = useMemo(() => buildPortrait(face), [face])
  const palette = useMemo(() => paletteFuer(face), [face])

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, cv.width, cv.height)

    // Hintergrund der Fotokabine mit leichtem Verlauf nach unten
    const grad = ctx.createLinearGradient(0, 0, 0, cv.height)
    grad.addColorStop(0, hintergrund)
    grad.addColorStop(1, '#7f8577')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cv.width, cv.height)

    for (let y = 0; y < HOEHE; y++) {
      for (let x = 0; x < BREITE; x++) {
        const ch = grid.cells[y * BREITE + x]
        if (ch === LEER) continue
        const col = palette[ch]
        if (!col) continue
        ctx.fillStyle = col
        ctx.fillRect(x * scale, y * scale, scale, scale)
      }
    }
  }, [grid, palette, scale, hintergrund])

  return (
    <canvas
      ref={canvasRef}
      width={BREITE * scale}
      height={HOEHE * scale}
      className={`block ${className}`}
      style={{ imageRendering: 'pixelated' }}
      role="img"
      aria-label="Passfoto"
    />
  )
}
