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
import { anweisungFuerTag } from '../game/anweisungen.js'
import { stoerungAmTag } from '../game/stoerungen.js'
import { AB_TAG as WIDERSPRUCH_AB } from '../game/widerspruch.js'
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
  const anweisung = anweisungFuerTag(info.tag)
  const stoerung = stoerungAmTag(info.tag)

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

          {/* Die Anordnung steht vor dem Regelwerk, nicht darin.
              Bewusst als eigenes, aufgeklebtes Blatt gesetzt und von Hand
              gezeichnet: Sie kommt nicht aus derselben Quelle wie die
              Paragraphen, und sie soll auch nicht so aussehen. */}
          {anweisung && (
            <div
              className="mb-5 border-2 border-ink-900/70 px-4 py-3"
              style={{ background: 'rgb(120 110 90 / 0.14)', transform: 'rotate(-0.4deg)' }}
            >
              <div className="flex items-baseline justify-between border-b border-ink-900/30 pb-1">
                <p className="font-form text-[10px] font-bold uppercase tracking-[0.2em] text-ink-900">
                  Anordnung
                </p>
                <p className="font-form text-[9px] uppercase tracking-widest text-ink-500">
                  Rektorat · nicht zur Weitergabe
                </p>
              </div>
              <p className="mt-2 text-[13px] font-bold leading-snug text-ink-900">
                {anweisung.text}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink-700 italic">
                {anweisung.begruendung}
              </p>
              <p className="mt-2 font-form text-[9px] uppercase tracking-widest text-ink-500">
                Gilt für den heutigen Tag · unabhängig vom Regelwerk
              </p>
            </div>
          )}

          {/* Störung: kein Befehl, sondern eine Mitteilung – deshalb weder
              rot noch mit Rahmen, sondern als schlichter Vermerk. Wer sie mit
              der Anordnung gleich aussehen ließe, machte aus einer defekten
              Leitung eine Zumutung des Rektorats. */}
          {stoerung && (
            <div className="mb-5 border-l-4 border-ink-500/50 bg-ink-500/5 px-4 py-3">
              <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700">
                Vermerk · {stoerung.titel}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-ink-700">{stoerung.text}</p>
              {stoerung.setztAus && (
                <p className="mt-1 font-form text-[11px] font-bold text-ink-900">
                  Die betroffene Prüfung entfällt für heute.
                </p>
              )}
            </div>
          )}

          {/* Einmalig am zweiten Tag: die Erlaubnis, nachzufragen.
              Als Erlass des Rektorats und nicht als Bedienungshinweis –
              „Zwei Felder antippen" stünde außerhalb der Welt, und ausgerechnet
              das dritte Verb des Spiels soll nicht wie eine Fußnote der
              Oberfläche wirken. Der Handgriff selbst steht klein darunter,
              weil man ihn genau einmal braucht. */}
          {info.tag === WIDERSPRUCH_AB && (
            <div
              className="mb-5 border-2 border-brass/60 px-4 py-3"
              style={{ background: 'rgb(185 150 89 / 0.10)' }}
            >
              <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-ink-900">
                Erlass · Rückfragen am Schalter
              </p>
              <p className="mt-1 text-[12px] leading-snug text-ink-700">
                Bestehen Zweifel an einem Vorgang, sind die betreffenden Angaben
                dem Antragsteller vorzuhalten und ist seine Erwiderung
                aufzunehmen. Von unbegründeten Vorhaltungen ist abzusehen.
              </p>
              <p className="mt-2 border-t border-ink-900/20 pt-2 font-form text-[10px] leading-snug text-ink-500">
                Zwei Angaben nacheinander antippen, um sie vorzuhalten.
              </p>
            </div>
          )}

          {info.neueRegeln.length > 0 && (
            <div className="mb-5 border-l-4 border-stamp-deny bg-stamp-deny/10 px-4 py-3">
              {/* Hieß früher „Neue Anweisung". Seit es Anordnungen des
                  Rektorats gibt, die neben dem Regelwerk stehen, wäre das
                  dasselbe Wort für zwei verschiedene Dinge – und ausgerechnet
                  der Unterschied zwischen ihnen ist der Kern des Spiels. */}
              <p className="font-form text-[10px] font-bold uppercase tracking-[0.16em] text-stamp-deny">
                {info.neueRegeln.length === 1 ? 'Neue Regel' : 'Neue Regeln'}
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
