/**
 * Die beiden Gummistempel als Bedienelement.
 *
 * Vorher lagen sie als Kulisse am Rand, und entschieden wurde über zwei
 * abstrakte Knöpfe – das Werkzeug war zu sehen, aber nicht zu benutzen.
 *
 * Sie stattdessen ÜBER DEN SCHREIBTISCH ZU ZIEHEN wäre die naheliegende
 * Idee gewesen, aber bei rund 120 Vorgängen über zwölf Tage wird aus Haptik
 * schnell Fleißarbeit. Ein Klick auf den Stempel kostet genauso wenig wie
 * einer auf einen Knopf – nur ist es diesmal der Gegenstand, mit dem man
 * tatsächlich arbeitet.
 */

import { useState } from 'react'

function Gummistempel({ farbe, dreh, groesse = 78 }) {
  const id = farbe.replace(/[^a-z]/gi, '')
  return (
    <svg viewBox="0 0 60 78" width={groesse} style={{ transform: `rotate(${dreh}deg)` }}>
      <defs>
        <linearGradient id={`holz-w-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b5031" />
          <stop offset="45%" stopColor="#8d6b42" />
          <stop offset="100%" stopColor="#54402a" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="74" rx="24" ry="4" fill="#000" opacity="0.42" />
      <path
        d="M 14 20 q 0 -16 16 -16 q 16 0 16 16 q 0 8 -6 10 l -20 0 q -6 -2 -6 -10 z"
        fill={`url(#holz-w-${id})`}
      />
      <rect x="24" y="28" width="12" height="14" fill="#4a3822" />
      <rect x="8" y="42" width="44" height="20" rx="2" fill={`url(#holz-w-${id})`} />
      <rect x="8" y="58" width="44" height="8" rx="1" fill="#2b2723" />
      <rect x="10" y="64" width="40" height="4" rx="1" fill={farbe} opacity="0.9" />
    </svg>
  )
}

/** Geöffnetes Stempelkissen zwischen den beiden Stempeln. */
function Stempelkissen() {
  return (
    <svg viewBox="0 0 74 46" width="66" aria-hidden="true">
      <ellipse cx="37" cy="42" rx="32" ry="4" fill="#000" opacity="0.35" />
      <rect x="4" y="12" width="66" height="26" rx="3" fill="#565d63" />
      <rect x="4" y="12" width="66" height="5" rx="3" fill="#6b737a" />
      <rect x="4" y="34" width="66" height="4" rx="2" fill="#3a4045" />
      <rect x="9" y="17" width="56" height="16" rx="2" fill="#a83226" opacity="0.55" />
      <rect x="9" y="17" width="56" height="16" rx="2" fill="#000" opacity="0.3" />
      <rect x="8" y="1" width="58" height="11" rx="2" fill="#3f464c" />
    </svg>
  )
}

function Werkzeug({ farbe, dreh, beschriftung, taste, onClick, gesperrt }) {
  const [gedrueckt, setGedrueckt] = useState(false)

  return (
    <button
      onClick={() => {
        if (gesperrt) return
        setGedrueckt(true)
        setTimeout(() => setGedrueckt(false), 220)
        onClick()
      }}
      disabled={gesperrt}
      aria-label={beschriftung}
      className="group flex flex-col items-center gap-1 disabled:opacity-40"
      style={{ cursor: gesperrt ? 'default' : 'pointer' }}
    >
      <span
        className="block transition-transform duration-150 group-hover:-translate-y-1"
        style={{ transform: gedrueckt ? 'translateY(9px) scale(0.97)' : undefined }}
      >
        <Gummistempel farbe={farbe} dreh={dreh} />
      </span>
      <span
        className="font-form text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: farbe }}
      >
        {beschriftung}
      </span>
      <span className="font-form text-[8px] uppercase tracking-widest text-paper-400/45">
        {taste}
      </span>
    </button>
  )
}

export default function Stempelwerkzeug({ onEntscheiden, gesperrt }) {
  return (
    <div className="flex items-end gap-8">
      <Werkzeug
        farbe="var(--color-stamp-deny)"
        dreh={-9}
        beschriftung="Unentschuldigt"
        taste="←"
        gesperrt={gesperrt}
        onClick={() => onEntscheiden('deny')}
      />

      <span className="mb-7 opacity-90">
        <Stempelkissen />
      </span>

      <Werkzeug
        farbe="var(--color-stamp-ok)"
        dreh={7}
        beschriftung="Entschuldigt"
        taste="→"
        gesperrt={gesperrt}
        onClick={() => onEntscheiden('ok')}
      />
    </div>
  )
}
