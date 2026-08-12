/**
 * Der Klausurplan des Tages.
 *
 * Anders als alle übrigen Dokumente gehört dieses Blatt keinem Schüler: Es
 * liegt den ganzen Tag auf dem Tisch und wechselt erst am nächsten Morgen.
 * Damit verlangt die zugehörige Regel etwas Neues – nicht zwei Felder
 * vergleichen, sondern nachschlagen und sich merken.
 */

import Paper from './Paper.jsx'

export default function Klausurplan({ eintraege, tag }) {
  return (
    <Paper seed={3000 + tag} width={214} tilt={1.6} className="p-4">
      <div className="mb-2 border-b-2 border-ink-900/60 pb-1">
        <p className="font-form text-[11px] font-bold uppercase tracking-[0.14em] text-ink-900">
          Klausurplan
        </p>
        <p className="font-form text-[8px] uppercase tracking-widest text-ink-500">
          heutiger Aushang
        </p>
      </div>

      <ul className="space-y-[6px]">
        {eintraege.map((e) => (
          <li key={e.klasse} className="flex items-baseline justify-between gap-2">
            <span className="font-form text-[15px] font-bold text-ink-900">{e.klasse}</span>
            <span className="truncate font-form text-[10px] text-ink-700">{e.fach}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-ink-500/25 pt-2 font-form text-[8px] leading-snug text-ink-500">
        Fehlzeiten an Klausurtagen nur mit ärztlichem Attest
      </p>
    </Paper>
  )
}
