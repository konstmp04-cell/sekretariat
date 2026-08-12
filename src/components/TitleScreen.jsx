/**
 * Titelbildschirm.
 *
 * Setzt den Ton, bevor der erste Schüler da ist: Amtsstube, Neonlicht,
 * abgestempelte Akten. Der Stempel liegt schief über dem Titel, weil in
 * diesem Spiel nichts ordentlich ausgerichtet ist.
 */

import Stamp from './Stamp.jsx'
import TonKnopf from './TonKnopf.jsx'
import { spiele, tonFreischalten } from '../game/audio.js'

export default function TitleScreen({ gespeicherterTag, onNeu, onFortsetzen }) {
  // Browser erlauben Klang erst nach einer echten Nutzerinteraktion – der
  // erste Knopfdruck im Spiel ist genau der richtige Moment dafür.
  const start = (fn) => () => {
    tonFreischalten()
    spiele('klick')
    fn()
  }

  return (
    <div className="desk-surface relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <TonKnopf className="absolute right-5 top-5 z-10" />
      {/* Lichtkegel einer Deckenlampe */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 22%, rgb(232 200 138 / 0.16), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgb(0 0 0 / 0.62))' }}
      />

      <div className="relative flex flex-col items-center">
        <p className="mb-3 font-form text-[11px] uppercase tracking-[0.42em] text-brass/70">
          Städtisches Gymnasium
        </p>

        <div className="relative">
          <h1 className="font-form text-[64px] font-bold uppercase leading-none tracking-[0.14em] text-paper-100">
            Sekretariat
          </h1>
          {/* Unterhalb der Schriftlinie und nach außen versetzt: Direkt über
              den Buchstaben wird der Abdruck unleserlich und nimmt dem Titel
              die Wucht. So liest man beides. */}
          <div className="absolute -bottom-12 -right-24">
            <Stamp kind="deny" label="GEPRÜFT" size={150} rotate={-14} slam={false} />
          </div>
        </div>

        <p className="mt-7 max-w-[420px] text-center text-[13px] leading-relaxed text-paper-400">
          Prüfe die eingereichten Entschuldigungen. Vergleiche die Unterschrift
          mit der Schülerakte. Halte dich an die Dienstanweisung – oder an dein
          Gewissen.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3">
          {gespeicherterTag > 1 && (
            <button
              onClick={start(onFortsetzen)}
              className="rounded-sm border-2 border-brass/70 bg-desk-800 px-10 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
            >
              Dienst fortsetzen · Tag {gespeicherterTag}
            </button>
          )}
          <button
            onClick={start(onNeu)}
            className={`rounded-sm border-2 px-10 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] shadow-lg transition ${
              gespeicherterTag > 1
                ? 'border-paper-400/40 bg-desk-800 text-paper-400 hover:bg-desk-700 hover:text-paper-200'
                : 'border-brass/70 bg-desk-800 text-brass hover:bg-brass hover:text-desk-900'
            }`}
          >
            {gespeicherterTag > 1 ? 'Neu beginnen' : 'Dienst antreten'}
          </button>
        </div>

        <p className="mt-10 font-form text-[10px] uppercase tracking-[0.2em] text-paper-400/50">
          ← unentschuldigt · entschuldigt →
        </p>
      </div>
    </div>
  )
}
