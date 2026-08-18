/**
 * Der Apparat auf dem Schreibtisch.
 *
 * Ein Wählscheibentelefon, wie es in einem Schulsekretariat eben steht: zu
 * alt, um ersetzt zu werden, zu funktionstüchtig, um weggeworfen zu werden.
 *
 * Er nimmt bewusst wenig Platz: Der Tisch trägt schon fünf Dokumente, eine
 * Lupe, zwei Stempel und ein Kissen. Angefasst wird ohnehin nicht der Apparat,
 * sondern die Nummernliste, die daneben aufgeht.
 */

import { useEffect, useRef, useState } from 'react'
import { nummernFuer, auskunft, ANRUFE_PRO_TAG } from '../game/telefon.js'
import { spiele } from '../game/audio.js'

const KLINGEL_MS = 2200

/**
 * Wählscheibentelefon von schräg oben.
 *
 * Der erste Entwurf war anthrazit (#2a2f33) auf einer Tischplatte in #1f2326 –
 * ein Helligkeitsunterschied von elf Stufen. Auf dem Papier ein Telefon, in
 * der Praxis ein dunkler Fleck auf dunklem Holz, den man beim Spielen schlicht
 * übersieht. Ein Werkzeug, das man suchen muss, ist keins.
 *
 * Jetzt helles Bakelit (#4e585e, Abstand rund 52 Stufen) und ein Messingring
 * um die Wählscheibe – dasselbe Messing wie an Stempeln und Rahmen, damit der
 * Apparat als bedienbares Gerät liest und nicht als Dekoration.
 */
function Apparat({ abgehoben }) {
  return (
    <svg viewBox="0 0 88 62" width="82" aria-hidden="true">
      <ellipse cx="44" cy="57" rx="34" ry="5" fill="#000" opacity="0.42" />
      {/* Grundkörper: obere Fläche heller als die Schräge, sonst wirkt der
          Apparat flach aufgemalt statt aufgestellt. */}
      <path d="M 10 46 L 16 22 L 72 22 L 78 46 Z" fill="#4e585e" />
      <path d="M 16 22 L 72 22 L 70 27 L 18 27 Z" fill="#5c676e" />
      <path d="M 10 46 L 78 46 L 78 50 L 10 50 Z" fill="#333b40" />
      {/* Wählscheibe mit Messingring */}
      <circle cx="44" cy="35" r="12" fill="var(--color-brass)" opacity="0.85" />
      <circle cx="44" cy="35" r="10.2" fill="#3a4247" />
      <circle cx="44" cy="35" r="4.5" fill="#20262a" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const w = (i / 8) * Math.PI * 2 - 1.9
        return (
          <circle
            key={i}
            cx={44 + Math.cos(w) * 7.2}
            cy={35 + Math.sin(w) * 7.2}
            r="1.5"
            fill="#12161a"
          />
        )
      })}
      {/* Hörer – liegt quer auf, oder fehlt, weil er am Ohr ist */}
      {!abgehoben && (
        <g>
          <rect x="12" y="8" width="64" height="11" rx="5.5" fill="#59636a" />
          <rect x="14" y="8" width="60" height="3" rx="1.5" fill="#6d7880" />
          <rect x="10" y="6" width="16" height="15" rx="4" fill="#616c73" />
          <rect x="62" y="6" width="16" height="15" rx="4" fill="#616c73" />
          <rect x="14" y="10" width="8" height="7" rx="2" fill="#262d31" />
          <rect x="66" y="10" width="8" height="7" rx="2" fill="#262d31" />
        </g>
      )}
      {/* Kringelkabel */}
      <path
        d="M 78 30 q 7 3 3 7 q -4 4 3 7 q 6 3 2 7"
        fill="none"
        stroke="#3d454a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * @param {boolean} [wartet]
 *   Der nächste Vorgang läuft noch durch den Flur. Der Apparat bleibt stehen –
 *   er gehört dem Schreibtisch und nicht dem Schüler –, aber es gibt niemanden,
 *   nach dem sich fragen ließe. Eine Auskunft über jemanden, der noch gar nicht
 *   am Schalter steht, wäre dasselbe Vorgreifen wie Papiere ohne ihren Besitzer.
 */
export default function Telefon({ applicant, uebrig, gestoert = false, wartet = false, onAnruf }) {
  const [offen, setOffen] = useState(false)
  const [klingelt, setKlingelt] = useState(false)
  const [notiz, setNotiz] = useState(null)
  const uhr = useRef(null)

  // Jeder neue Vorgang räumt den Zettel ab: Eine Auskunft über den
  // Vorletzten neben den Papieren des Nächsten wäre schlimmer als keine.
  useEffect(() => {
    setNotiz(null)
    setOffen(false)
    setKlingelt(false)
    clearTimeout(uhr.current)
  }, [applicant.id])

  useEffect(() => () => clearTimeout(uhr.current), [])

  const anrufen = (nummer) => {
    if (gestoert || wartet || uebrig <= 0 || klingelt) return
    setOffen(false)
    setKlingelt(true)
    spiele('waehlen')
    onAnruf()
    uhr.current = setTimeout(() => {
      setKlingelt(false)
      setNotiz(auskunft(applicant, nummer.id))
    }, KLINGEL_MS)
  }

  const nummern = nummernFuer(applicant)
  const leer = uebrig <= 0

  return (
    <div className="pointer-events-none absolute bottom-5 left-5 z-30 flex items-end gap-4">
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        <button
          onClick={() => {
            if (klingelt) return
            spiele('klick')
            setOffen((o) => !o)
          }}
          disabled={klingelt}
          aria-label="Telefon"
          className="transition-transform duration-150 hover:-translate-y-1 disabled:opacity-70"
          style={{ cursor: klingelt ? 'default' : 'pointer' }}
        >
          <Apparat abgehoben={klingelt} />
        </button>
        <span
          className="font-form text-[9px] uppercase tracking-[0.14em]"
          style={{
            color: leer || gestoert || wartet ? 'var(--color-ink-500)' : 'var(--color-brass)',
          }}
        >
          {gestoert ? 'Kein Freizeichen' : klingelt ? 'Es klingelt …' : `${uebrig} von ${ANRUFE_PRO_TAG}`}
        </span>
      </div>

      {/* Nummernliste */}
      {offen && !klingelt && (
        <div className="pointer-events-auto mb-6 w-[236px] rounded-sm border border-brass/40 bg-desk-900/95 p-2 shadow-xl">
          <p className="mb-1 px-1 font-form text-[9px] uppercase tracking-[0.16em] text-brass">
            Rückfrage
          </p>
          {/* Bei gestörter Leitung bleibt der Apparat stehen und die Liste
              öffnet sich weiter – nur kommt niemand ans andere Ende. Ein
              Telefon, das man gar nicht mehr anfassen kann, wäre kein
              defektes Telefon, sondern gar keins. */}
          {gestoert ? (
            <p className="px-1 py-2 font-form text-[10px] leading-snug text-paper-400/70">
              Kein Freizeichen. Die Amtsleitung ist seit gestern tot, die
              Technik ist verständigt.
            </p>
          ) : wartet ? (
            <p className="px-1 py-2 font-form text-[10px] leading-snug text-paper-400/70">
              Es steht noch niemand am Schalter.
            </p>
          ) : leer ? (
            <p className="px-1 py-2 font-form text-[10px] leading-snug text-paper-400/70">
              Für heute keine Rückfragen mehr. Zwei am Tag, so steht es in der
              Dienstanweisung.
            </p>
          ) : (
            nummern.map((n) => (
              <button
                key={n.id}
                onClick={() => anrufen(n)}
                className="block w-full rounded-sm px-1 py-[5px] text-left transition hover:bg-desk-700"
              >
                <span className="block font-form text-[11px] leading-tight text-paper-200">
                  {n.name}
                </span>
                <span className="block font-form text-[9px] text-paper-400/60">{n.zweck}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Notizzettel mit der Auskunft */}
      {notiz && (
        <div
          className="animate-ink-settle mb-6 w-[258px] -rotate-1 border-l-2 px-3 py-2 shadow-lg"
          style={{
            background: 'var(--color-paper-200)',
            borderColor: notiz.ergiebig ? 'var(--color-stamp-deny)' : 'var(--color-ink-500)',
          }}
        >
          <p className="font-form text-[8px] uppercase tracking-[0.16em] text-ink-500">
            {notiz.sprecher}
          </p>
          <p className="mt-[3px] text-[12px] leading-snug text-ink-900">„{notiz.text}"</p>
        </div>
      )}
    </div>
  )
}
