/**
 * Tagesabrechnung nach jeder Schicht. Das Spielende hat mit dem Zeugnis
 * einen eigenen Bildschirm.
 *
 * Zeigt nicht nur Zahlen, sondern die VERÄNDERUNG gegenüber Tagesbeginn –
 * ein Ruf von 48 sagt wenig, "48, und gestern waren es noch 61" sagt alles.
 */

import { useEffect } from 'react'
import Paper from './Paper.jsx'
import { spiele } from '../game/audio.js'

function Zeile({ label, wert, delta, farbe }) {
  const zeichen = delta > 0 ? '+' : ''
  return (
    <div className="flex items-center justify-between border-b border-dotted border-ink-500/30 py-2">
      <span className="font-form text-[12px] uppercase tracking-wider text-ink-700">{label}</span>
      <span className="flex items-baseline gap-3">
        <span className="font-form text-[17px] font-bold text-ink-900">{wert}%</span>
        {delta !== 0 && (
          <span
            className="font-form text-[12px] font-bold"
            style={{ color: delta > 0 ? 'var(--color-stamp-ok)' : 'var(--color-stamp-deny)' }}
          >
            {zeichen}
            {delta}
          </span>
        )}
        <span className="h-[6px] w-20 overflow-hidden rounded-sm bg-ink-500/20">
          <span className="block h-full" style={{ width: `${wert}%`, background: farbe }} />
        </span>
      </span>
    </div>
  )
}

export default function DaySummary({ stand, info, onWeiter }) {
  const dR = stand.ruf.rektor - stand.rufBeiTagesbeginn.rektor
  const dS = stand.ruf.schueler - stand.rufBeiTagesbeginn.schueler

  // Doppelschlag zum Schichtende – dieselbe Glocke wie am Morgen, aber zweimal.
  useEffect(() => {
    spiele('glocke')
    spiele('glocke', 0.42)
  }, [])

  return (
    <div className="desk-surface flex h-full w-full items-center justify-center overflow-auto p-8">
      <div className="flex flex-col items-center">
        <Paper seed={900 + info.tag} width={480} className="p-8" animate>
          <div className="mb-5 border-b-2 border-ink-900/70 pb-2">
            <h1 className="font-form text-[15px] font-bold uppercase tracking-[0.18em] text-ink-900">
              Schichtende
            </h1>
            <p className="mt-1 font-form text-[11px] tracking-wider text-ink-500">
              Tag {info.tag} · {info.wochentag}, {info.datum}
            </p>
          </div>

          <div className="mb-6 flex gap-8">
              <div>
                <p className="font-form text-[10px] uppercase tracking-widest text-ink-500">
                  Korrekt
                </p>
                <p className="font-form text-[26px] font-bold text-stamp-ok">
                  {stand.tagBilanz.richtig}
                </p>
              </div>
              <div>
                <p className="font-form text-[10px] uppercase tracking-widest text-ink-500">
                  Beanstandet
                </p>
                <p className="font-form text-[26px] font-bold text-stamp-deny">
                  {stand.tagBilanz.falsch}
                </p>
              </div>
          </div>

          <Zeile label="Rektorat" wert={stand.ruf.rektor} delta={dR} farbe="var(--color-brass)" />
          <Zeile
            label="Schülerschaft"
            wert={stand.ruf.schueler}
            delta={dS}
            farbe="var(--color-stamp-ok)"
          />

          <p className="mt-5 font-form text-[10px] uppercase tracking-widest text-ink-500">
            Gesamt: {stand.gesamt.richtig} korrekt · {stand.gesamt.falsch} beanstandet
          </p>
        </Paper>

        <button
          onClick={() => {
            spiele('klick')
            onWeiter()
          }}
          className="mt-8 rounded-sm border-2 border-brass/70 bg-desk-800 px-12 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
        >
          Feierabend
        </button>
      </div>
    </div>
  )
}
