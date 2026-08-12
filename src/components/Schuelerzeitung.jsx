/**
 * Die Schülerzeitung am Schichtbeginn.
 *
 * Liegt neben der Dienstanweisung: Erst liest man, was in der Schule los ist,
 * dann geht man an den Schalter. Zeitungssatz statt Amtssprache – enge
 * Spalten, fette Schlagzeile, dünne Unterzeile.
 */

import Paper from './Paper.jsx'

export default function Schuelerzeitung({ meldungen, info }) {
  return (
    <Paper seed={5000 + info.tag} width={268} tilt={-1.2} className="p-5">
      <div className="border-b-4 border-double border-ink-900/70 pb-1 text-center">
        <h2 className="font-form text-[17px] font-bold uppercase tracking-[0.12em] text-ink-900">
          Der Pausenhof
        </h2>
        <p className="font-form text-[7px] uppercase tracking-[0.24em] text-ink-500">
          Schülerzeitung des Städtischen Gymnasiums
        </p>
      </div>

      <div className="flex justify-between border-b border-ink-500/40 py-[3px]">
        <span className="font-form text-[7px] uppercase tracking-widest text-ink-500">
          {info.wochentag}, {info.datum}
        </span>
        <span className="font-form text-[7px] uppercase tracking-widest text-ink-500">
          Ausgabe {info.tag}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {meldungen.map((m, i) => (
          <div key={m.titel} className={i > 0 ? 'border-t border-dotted border-ink-500/35 pt-3' : ''}>
            <h3
              className={`text-[13px] font-bold leading-tight ${
                m.brisant ? 'text-stamp-deny' : 'text-ink-900'
              }`}
              style={{ textWrap: 'balance' }}
            >
              {m.titel}
            </h3>
            <p className="mt-[2px] text-[11px] leading-snug text-ink-700">{m.zeile}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-ink-500/30 pt-2 text-center font-form text-[7px] uppercase tracking-[0.18em] text-ink-500/70">
        Redaktion: Raum 108 · Erscheint täglich
      </p>
    </Paper>
  )
}
