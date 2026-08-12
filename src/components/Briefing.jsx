/**
 * Schichtbeginn: die Dienstanweisung des Tages.
 *
 * Der wichtigste Bildschirm des ganzen Spiels. Hier wächst die Regelliste –
 * und genau dieser Moment ist der Antrieb: nicht "der Gegner wird stärker",
 * sondern "ab heute musst du auf eine Sache mehr achten". Neue Regeln stehen
 * deshalb hervorgehoben oben, nicht hinten angehängt.
 */

import Paper from './Paper.jsx'
import Schuelerzeitung from './Schuelerzeitung.jsx'
import { aktiveRegeln, paragraph } from '../game/regeln.js'
import { ausgabe } from '../game/zeitung.js'
import { warnstufe } from '../game/spielstand.js'
import { spiele, tonFreischalten } from '../game/audio.js'

const VERWARNUNG = {
  1: {
    titel: 'Interner Vermerk',
    text: 'Dem Rektorat wurden Unregelmäßigkeiten am Schalter gemeldet. Der Vorgang wird beobachtet.',
  },
  2: {
    titel: 'Förmliche Verwarnung',
    text: 'Eine weitere Unregelmäßigkeit führt zur sofortigen Freistellung vom Dienst.',
  },
}

export default function Briefing({ info, stand, onStart }) {
  const regeln = aktiveRegeln(info.tag)
  const neu = new Set(info.neueRegeln.map((r) => r.id))
  const meldungen = ausgabe(info.tag, stand)
  const warnung = VERWARNUNG[warnstufe(stand)]

  return (
    <div className="desk-surface flex h-full w-full items-center justify-center overflow-auto p-8">
      <div className="flex flex-col items-center">
        <div className="flex items-start gap-6">
        <Paper seed={400 + info.tag} width={520} className="p-8" animate>
          <div className="mb-1 flex items-baseline justify-between border-b-2 border-ink-900/70 pb-2">
            <h1 className="font-form text-[15px] font-bold uppercase tracking-[0.18em] text-ink-900">
              Dienstanweisung
            </h1>
            <span className="font-form text-[11px] tracking-wider text-ink-700">
              {info.wochentag}, {info.datum}
            </span>
          </div>

          <p className="mb-5 font-form text-[11px] uppercase tracking-widest text-ink-500">
            Tag {info.tag} · {info.anzahl} Vorgänge erwartet
          </p>

          {warnung && (
            <div className="mb-5 border-2 border-stamp-deny bg-stamp-deny/10 px-4 py-3">
              <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-stamp-deny">
                {warnung.titel}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-ink-700">{warnung.text}</p>
            </div>
          )}

          {info.neueRegeln.length > 0 && (
            <div className="mb-5 border-l-4 border-stamp-deny bg-stamp-deny/10 px-4 py-3">
              <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-stamp-deny">
                {info.neueRegeln.length === 1 ? 'Neue Anweisung' : 'Neue Anweisungen'}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-ink-700">
                Ab heute zusätzlich zu beachten. Verstöße gehen zu deinen Lasten.
              </p>
            </div>
          )}

          <ol className="space-y-3">
            {regeln.map((r) => (
              <li key={r.id} className={`flex gap-3 ${neu.has(r.id) ? '' : 'opacity-70'}`}>
                <span className="font-form text-[12px] font-bold text-ink-500">
                  §{paragraph(r.id)}
                </span>
                <div>
                  <p className="font-form text-[9px] uppercase tracking-[0.16em] text-ink-500">
                    {r.dokument}
                  </p>
                  <p className="font-form text-[13px] font-bold text-ink-900">
                    {r.titel}
                    {neu.has(r.id) && (
                      <span className="ml-2 rounded-sm bg-stamp-deny px-1.5 py-[1px] font-form text-[9px] uppercase tracking-wider text-paper-100">
                        neu
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] leading-snug text-ink-700">{r.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Paper>

        <Schuelerzeitung meldungen={meldungen} info={info} />
        </div>

        <button
          onClick={() => {
            // Die Schulglocke läutet die Schicht ein.
            tonFreischalten()
            spiele('glocke')
            onStart()
          }}
          className="mt-8 rounded-sm border-2 border-brass/70 bg-desk-800 px-12 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
        >
          Schalter öffnen
        </button>
      </div>
    </div>
  )
}
