/**
 * Stummschalter. Klein, unauffällig, immer erreichbar.
 */

import { useState } from 'react'
import { istStumm, setzeStumm, spiele, tonFreischalten } from '../game/audio.js'

export default function TonKnopf({ className = '' }) {
  const [aus, setAus] = useState(() => istStumm())

  return (
    <button
      onClick={() => {
        const neu = !aus
        setzeStumm(neu)
        setAus(neu)
        if (!neu) {
          tonFreischalten()
          spiele('klick')
        }
      }}
      title={aus ? 'Ton einschalten' : 'Ton ausschalten'}
      aria-label={aus ? 'Ton einschalten' : 'Ton ausschalten'}
      className={`rounded-sm border border-brass/30 px-2 py-1 font-form text-[11px] text-brass/70 transition hover:border-brass/70 hover:text-brass ${className}`}
    >
      {aus ? '🔇' : '🔊'}
    </button>
  )
}
