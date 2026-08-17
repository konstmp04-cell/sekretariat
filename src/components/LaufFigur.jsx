/**
 * Eine gehende Figur im Flur.
 *
 * Zeichnet dieselbe Symbolschrift wie die Porträts, mit derselben Palette –
 * dadurch trägt die kleine Figur automatisch Haar- und Hautton des Gesichts,
 * das gleich am Schalter steht.
 *
 * Gerendert wird als ein einziges `box-shadow` mit einem Eintrag je Pixel.
 * Das klingt nach einem Trick und ist auch einer, aber es ist der billigste
 * Weg zu gestochen scharfen Pixeln ohne Canvas: Kein Bild wird skaliert, also
 * kann auch nichts verwaschen.
 */

import { useEffect, useRef, useState } from 'react'
import { paletteFuer } from '../game/pixelPortrait.js'
import { LAUFBILDER, HUB, STEHEN, FIGUR_BREITE, FIGUR_HOEHE } from '../game/laufFigur.js'

function schatten(bild, palette, px) {
  const teile = []
  for (let y = 0; y < bild.length; y++) {
    for (let x = 0; x < bild[y].length; x++) {
      const ch = bild[y][x]
      if (ch === '.') continue
      const farbe = palette[ch] ?? palette.k ?? '#1a1a1a'
      teile.push(`${x * px}px ${y * px}px 0 0 ${farbe}`)
    }
  }
  return teile.join(',')
}

export default function LaufFigur({ face, px = 2, geht = true, spiegeln = false, tempo = 190 }) {
  const [bild, setBild] = useState(0)
  const takt = useRef(null)

  useEffect(() => {
    if (!geht) return
    takt.current = setInterval(() => setBild((b) => (b + 1) % LAUFBILDER.length), tempo)
    return () => clearInterval(takt.current)
  }, [geht, tempo])

  const palette = paletteFuer(face)
  const aktuell = geht ? LAUFBILDER[bild] : STEHEN
  const hub = geht ? HUB[bild] : 0

  return (
    <div
      style={{
        width: FIGUR_BREITE * px,
        height: FIGUR_HOEHE * px,
        position: 'relative',
        transform: `translateY(${-hub * px}px)${spiegeln ? ' scaleX(-1)' : ''}`,
      }}
    >
      <div
        style={{
          width: px,
          height: px,
          position: 'absolute',
          left: 0,
          top: 0,
          boxShadow: schatten(aktuell, palette, px),
        }}
      />
    </div>
  )
}
