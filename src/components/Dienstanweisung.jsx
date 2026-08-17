/**
 * Die Dienstanweisung am Schalter.
 *
 * Vorher eine flache Liste aus acht Regeln mit vollem Text, quer über die
 * halbe Bildschirmhöhe. Alle gleich laut, keine Ordnung – nach ein paar Tagen
 * liest man sie nicht mehr, sie ist nur noch Tapete.
 *
 * Jetzt nach Dokument gruppiert, denn das ist die Frage, die man beim Prüfen
 * tatsächlich hat: nicht „was war Regel 5?", sondern „ich sehe mir das Attest
 * an – was gilt dafür?". Standardmäßig stehen nur die Titel da; der volle
 * Wortlaut kommt erst auf Klick. Damit passt das ganze Regelwerk in ein
 * Drittel des Platzes und bleibt trotzdem vollständig nachlesbar.
 */

import { useState } from 'react'
import { regelnNachDokument, neueRegeln, paragraph } from '../game/regeln.js'
import { anweisungFuerTag } from '../game/anweisungen.js'
import { stoerungAmTag, ausgesetzteRegel } from '../game/stoerungen.js'
import { spiele } from '../game/audio.js'

export default function Dienstanweisung({ tag }) {
  const gruppen = regelnNachDokument(tag)
  const neu = new Set(neueRegeln(tag).map((r) => r.id))
  const anweisung = anweisungFuerTag(tag)
  const stoerung = stoerungAmTag(tag)
  const ruht = ausgesetzteRegel(tag)
  const [offen, setOffen] = useState(null)
  const [eingeklappt, setEingeklappt] = useState(false)

  return (
    <aside className="absolute right-6 top-6 z-20 w-[218px] rounded-sm border border-brass/30 bg-desk-900/92 shadow-xl">
      <button
        onClick={() => {
          spiele('klick')
          setEingeklappt((e) => !e)
        }}
        className="flex w-full items-center justify-between border-b border-brass/25 px-3 py-2 text-left transition hover:bg-desk-800/60"
      >
        <span className="font-form text-[10px] uppercase tracking-[0.16em] text-brass">
          Dienstanweisung · Tag {tag}
        </span>
        <span className="font-form text-[11px] text-brass/70">{eingeklappt ? '+' : '−'}</span>
      </button>

      {!eingeklappt && (
        <div className="max-h-[62vh] overflow-y-auto px-3 py-2">
          {/* Die Anweisung steht ÜBER dem Regelwerk und sieht anders aus als
              alles darunter – sie ist keine Regel, sondern eine Anordnung,
              und sie hebt sich über die Papiere hinweg. Wer sie mit den
              Paragraphen in eine Liste setzte, machte sie zu einer davon. */}
          {anweisung && (
            <div className="mb-3 rounded-sm border border-stamp-deny/70 bg-stamp-deny/10 px-2 py-[6px]">
              <p className="font-form text-[8px] uppercase tracking-[0.18em] text-stamp-deny">
                Anordnung des Rektorats
              </p>
              <p className="mt-[3px] font-form text-[10px] leading-snug text-paper-200">
                {anweisung.text}
              </p>
              <p className="mt-[3px] font-form text-[9px] leading-snug text-paper-400/60 italic">
                {anweisung.begruendung}
              </p>
            </div>
          )}

          {stoerung && (
            <div className="mb-3 border-l-2 border-paper-400/50 bg-paper-400/5 px-2 py-[6px]">
              <p className="font-form text-[8px] uppercase tracking-[0.16em] text-paper-400/80">
                Vermerk
              </p>
              <p className="mt-[2px] font-form text-[10px] leading-snug text-paper-200">
                {stoerung.titel}
              </p>
            </div>
          )}

          {gruppen.map((g) => (
            <div key={g.dokument} className="mb-2 last:mb-0">
              <p className="mb-1 font-form text-[8px] uppercase tracking-[0.18em] text-paper-400/55">
                {g.dokument}
              </p>

              {g.regeln.map((r) => {
                const auf = offen === r.id
                return (
                  <div key={r.id}>
                    <button
                      onClick={() => setOffen(auf ? null : r.id)}
                      className="flex w-full items-baseline gap-[6px] py-[3px] text-left"
                      aria-expanded={auf}
                    >
                      <span className="font-form text-[9px] text-brass/60">
                        §{paragraph(r.id)}
                      </span>
                      <span
                        className={`font-form text-[11px] leading-tight transition ${
                          r.id === ruht
                            ? 'text-paper-400/40 line-through'
                            : auf
                              ? 'text-brass'
                              : 'text-paper-200 hover:text-brass'
                        }`}
                      >
                        {r.titel}
                      </span>
                      {r.id === ruht && (
                        <span className="ml-auto shrink-0 font-form text-[7px] uppercase tracking-wider text-paper-400/50">
                          ruht
                        </span>
                      )}
                      {neu.has(r.id) && (
                        <span className="ml-auto shrink-0 rounded-sm bg-stamp-deny px-1 font-form text-[7px] uppercase tracking-wider text-paper-100">
                          neu
                        </span>
                      )}
                    </button>

                    {auf && (
                      <p className="mb-1 ml-[18px] border-l border-brass/25 pl-2 text-[10px] leading-snug text-paper-400/90">
                        {r.text}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          <p className="mt-2 border-t border-brass/15 pt-2 font-form text-[8px] uppercase tracking-wider text-paper-400/40">
            Antippen für den Wortlaut
          </p>
        </div>
      )}
    </aside>
  )
}
