/**
 * Ärztliches Attest.
 *
 * Bewusst ein völlig anderes Schriftbild als die Entschuldigung: Die Notiz
 * ist handgeschrieben und krakelig, das Attest getippt, gestempelt und
 * amtlich. Beide Blätter müssen sich auf dem vollen Schreibtisch schon an
 * ihrer Erscheinung auseinanderhalten lassen – auch wenn nur eine Ecke
 * hervorschaut.
 */

import Paper from './Paper.jsx'
import Signature from './Signature.jsx'

const MONAT = 'März'

/** Praxisstempel: rund, blau, ungleichmäßig aufgetragen. */
function Praxisstempel({ praxis }) {
  const farbe = '#3d5a8a'
  return (
    <svg viewBox="0 0 108 108" width="96" height="96" style={{ transform: 'rotate(-9deg)' }} aria-hidden="true">
      <defs>
        <filter id="praxis-rau">
          <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="4" seed="12" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.02"
            result="maske"
          />
          <feComposite in="SourceGraphic" in2="maske" operator="in" />
        </filter>
      </defs>
      <g filter="url(#praxis-rau)" opacity="0.82">
        <circle cx="54" cy="54" r="50" fill="none" stroke={farbe} strokeWidth="3" />
        <circle cx="54" cy="54" r="43" fill="none" stroke={farbe} strokeWidth="1.2" />
        <text
          x="54"
          y="45"
          textAnchor="middle"
          fill={farbe}
          fontSize="10"
          fontFamily="ui-monospace, 'Courier New', monospace"
          fontWeight="700"
        >
          PRAXIS
        </text>
        <text
          x="54"
          y="60"
          textAnchor="middle"
          fill={farbe}
          fontSize="8"
          fontFamily="ui-monospace, 'Courier New', monospace"
        >
          {praxis.arzt.replace('Dr. med. ', '')}
        </text>
        <text
          x="54"
          y="73"
          textAnchor="middle"
          fill={farbe}
          fontSize="6.5"
          fontFamily="ui-monospace, 'Courier New', monospace"
          letterSpacing="0.5"
        >
          {praxis.zusatz.toUpperCase()}
        </text>
      </g>
    </svg>
  )
}

export default function Attest({ applicant: a }) {
  const at = a.attest
  if (!at) return null

  return (
    <Paper seed={a.seed + 55} width={302} tilt={a.tilt * -1.4} className="p-5">
      <div className="mb-3 border-b-2 border-ink-900/60 pb-2">
        <p className="font-form text-[12px] font-bold uppercase tracking-[0.1em] text-ink-900">
          {at.praxis.name}
        </p>
        <p className="font-form text-[9px] uppercase tracking-widest text-ink-500">
          {at.praxis.zusatz}
        </p>
      </div>

      <h3 className="mb-4 font-form text-[13px] font-bold uppercase tracking-[0.14em] text-ink-900">
        Ärztliche Bescheinigung
      </h3>

      <p className="mb-1 font-form text-[9px] uppercase tracking-widest text-ink-500">Patient/in</p>
      <p className="mb-4 font-form text-[14px] font-bold text-ink-900">{a.name}</p>

      <p className="mb-4 font-form text-[12px] leading-relaxed text-ink-700">
        war aus gesundheitlichen Gründen schulunfähig
        <br />
        <span className="font-bold text-ink-900">
          {at.von === at.bis
            ? `am ${at.von}. ${MONAT}`
            : `vom ${at.von}. bis ${at.bis}. ${MONAT}`}
        </span>
      </p>

      <div className="flex items-end justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-form text-[9px] uppercase tracking-widest text-ink-500">
            Ausgestellt {at.ausgestellt}. {MONAT}
          </p>
          <div className="mt-1 border-t border-ink-500/30 pt-1" data-lupe="attest-sig">
            <Signature seed={at.arztSeed} forgery={0} width={150} height={44} color="#3d5a8a" />
          </div>
          <p className="font-form text-[8px] text-ink-500">{at.praxis.arzt}</p>
        </div>
        <div className="-mb-2 -mr-1 shrink-0">
          <Praxisstempel praxis={at.praxis} />
        </div>
      </div>
    </Paper>
  )
}
