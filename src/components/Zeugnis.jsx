/**
 * Abschlusszeugnis.
 *
 * Am Ende bekommt in einer Schule auch der Prüfende eine Note. Das ist nicht
 * nur ein Gag: Eine nackte Trefferzahl sagt wenig, eine Note ordnet sie ein –
 * und sie stammt aus derselben Welt wie das ganze Spiel.
 *
 * Die aufschlussreichste Zeile ist nicht „korrekt", sondern die Aufteilung
 * darunter: Wie viele echte Verstöße hast du erwischt, und wie oft hast du
 * jemanden abgewiesen, der nichts verbrochen hatte? Das eine ist Nachlässigkeit,
 * das andere Härte gegen Unschuldige – zwei völlig verschiedene Arten, den Job
 * schlecht zu machen.
 */

import { useEffect } from 'react'
import Paper from './Paper.jsx'
import Stamp from './Stamp.jsx'
import { ENDE, note } from '../game/spielstand.js'
import { spiele } from '../game/audio.js'

const ENDTEXTE = {
  [ENDE.ENTLASSEN]: {
    titel: 'Entlassen',
    text: 'Das Rektorat hat dein Personalblatt geschlossen. Zu viele Vorgänge falsch bearbeitet – man hat dir die Schlüssel abgenommen, noch bevor die Schicht vorbei war.',
  },
  [ENDE.AUFSTAND]: {
    titel: 'Die Schule hat sich abgewandt',
    text: 'Niemand redet mehr mit dir. Zettel bleiben ungeschrieben, Türen fallen zu, wenn du kommst. Regelkonform bist du geblieben – allein aber auch.',
  },
  [ENDE.GESCHAFFT]: {
    titel: 'Halbjahr überstanden',
    text: 'Die Akten sind abgeheftet, der Stempel liegt im Fach. Du hast beide Seiten irgendwie bei Laune gehalten – oder beide gleichmäßig enttäuscht.',
  },
  [ENDE.DISZIPLINAR]: {
    titel: 'Vom Dienst freigestellt',
    text: 'Zwei Verwarnungen lagen vor, die dritte Meldung kam noch am selben Vormittag. Man hat dich nicht ausreden lassen. Der Schalter blieb den Rest des Tages geschlossen.',
  },
}

function Posten({ label, wert, ton }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dotted border-ink-500/30 py-[6px]">
      <span className="font-form text-[11px] uppercase tracking-wider text-ink-700">{label}</span>
      <span
        className="font-form text-[15px] font-bold tabular-nums"
        style={{ color: ton ?? 'var(--color-ink-900)' }}
      >
        {wert}
      </span>
    </div>
  )
}

export default function Zeugnis({ stand, info, ende, onTitel }) {
  const g = stand.gesamt
  const bearbeitet = g.richtig + g.falsch
  const quote = bearbeitet === 0 ? 0 : g.richtig / bearbeitet
  const n = note(quote)
  const endText = ENDTEXTE[ende] ?? ENDTEXTE[ENDE.GESCHAFFT]
  const durchgewunken = g.verstoesse - g.erwischt
  // Bei Freistellung wird kein Zeugnis ausgestellt, sondern ein Bescheid –
  // dasselbe Papier, dieselbe Amtssprache, aber ohne Note.
  const bescheid = ende === ENDE.DISZIPLINAR

  useEffect(() => {
    // Ein einzelner Stempelschlag: die Akte wird geschlossen.
    spiele('stempel', 0.35)
  }, [])

  return (
    <div className="desk-surface flex h-full w-full items-center justify-center overflow-auto p-8">
      <div className="flex flex-col items-center">
        <Paper seed={7777} width={520} className="p-8" animate>
          <div className="mb-4 flex items-start justify-between border-b-2 border-ink-900/70 pb-2">
            <div>
              <h1 className="font-form text-[17px] font-bold uppercase tracking-[0.2em] text-ink-900">
                {bescheid ? 'Disziplinarbescheid' : 'Zeugnis'}
              </h1>
              <p className="mt-1 font-form text-[10px] uppercase tracking-widest text-ink-500">
                Städtisches Gymnasium · {bescheid ? 'Schulleitung' : 'Sekretariat'}
              </p>
            </div>
            <span className="font-form text-[10px] uppercase tracking-widest text-ink-500">
              {info.wochentag}, {info.datum}
            </span>
          </div>

          <h2 className="font-form text-[14px] font-bold text-ink-900">{endText.titel}</h2>
          <p className="mb-5 mt-1 text-[13px] leading-relaxed text-ink-700">{endText.text}</p>

          <Posten label="Tage im Dienst" wert={stand.tag} />
          <Posten label="Vorgänge bearbeitet" wert={bearbeitet} />
          <Posten label="Korrekt bearbeitet" wert={g.richtig} ton="var(--color-stamp-ok)" />
          <Posten label="Beanstandet" wert={g.falsch} ton="var(--color-stamp-deny)" />

          <p className="mb-1 mt-5 font-form text-[10px] uppercase tracking-[0.16em] text-ink-500">
            Im Einzelnen
          </p>
          <Posten label="Verstöße erkannt" wert={`${g.erwischt} von ${g.verstoesse}`} />
          <Posten
            label="Durchgewunken"
            wert={durchgewunken}
            ton={durchgewunken > 0 ? 'var(--color-stamp-deny)' : undefined}
          />
          <Posten
            label="Zu Unrecht abgewiesen"
            wert={g.zuUnrecht}
            ton={g.zuUnrecht > 0 ? 'var(--color-stamp-deny)' : undefined}
          />
          {stand.bestechungen > 0 && (
            <Posten
              label="Angenommene Zuwendungen"
              wert={stand.bestechungen}
              ton="var(--color-stamp-deny)"
            />
          )}

          <p className="mb-1 mt-5 font-form text-[10px] uppercase tracking-[0.16em] text-ink-500">
            Ansehen zum Schluss
          </p>
          <Posten label="Rektorat" wert={`${Math.round(stand.ruf.rektor)} %`} />
          <Posten label="Schülerschaft" wert={`${Math.round(stand.ruf.schueler)} %`} />

          {bescheid ? (
            <div className="relative mt-7 border-2 border-stamp-deny px-5 py-4">
              <p className="font-form text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Feststellung
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-900">
                Die Annahme von Zuwendungen im Zusammenhang mit der Bearbeitung von
                Entschuldigungen stellt einen schweren Verstoß gegen die Dienstpflichten
                dar. Von der Ausstellung eines Zeugnisses wird abgesehen.
              </p>
              <div className="pointer-events-none absolute -right-8 -top-14 opacity-85">
                <Stamp kind="deny" label="FREIGESTELLT" size={132} rotate={-11} slam={false} />
              </div>
            </div>
          ) : (
          /* Die Note als Stempel – ein Zeugnis wird nicht getippt, es wird
             abgezeichnet. */
          <div className="relative mt-7 flex items-center justify-between border-2 border-ink-900/70 px-5 py-4">
            <div>
              <p className="font-form text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Gesamtnote
              </p>
              <p className="font-form text-[13px] font-bold text-ink-900">{n.wort}</p>
              <p className="mt-1 font-form text-[10px] text-ink-500">
                Trefferquote {Math.round(quote * 100)} %
              </p>
            </div>
            <span className="font-form text-[54px] font-bold leading-none text-ink-900 tabular-nums">
              {n.zahl}
            </span>
            {/* Weit genug nach oben versetzt, dass die Ziffer frei bleibt –
                sie ist der Höhepunkt des Bildschirms und darf nicht unter dem
                Abdruck verschwinden. */}
            <div className="pointer-events-none absolute -right-10 -top-16 opacity-80">
              <Stamp
                kind={n.zahl <= 3 ? 'ok' : 'deny'}
                label={n.zahl <= 3 ? 'BESTANDEN' : 'NACHSITZEN'}
                size={118}
                rotate={-13}
                slam={false}
              />
            </div>
          </div>
          )}

          {/* Bleibt stehen, auch wenn es bei einer einzigen Zuwendung blieb.
              Kein Punktabzug, keine Strafe – nur der Vermerk, dass es nicht
              vergessen wurde. Das ist das Unangenehmste, was hier stehen kann. */}
          {stand.bestechungen > 0 && !bescheid && (
            <p className="mt-4 border-t border-ink-500/30 pt-2 text-center font-form text-[10px] uppercase tracking-[0.14em] text-stamp-deny">
              Ein Vorgang blieb aktenkundig.
            </p>
          )}
        </Paper>

        <button
          onClick={() => {
            spiele('klick')
            onTitel()
          }}
          className="mt-8 rounded-sm border-2 border-brass/70 bg-desk-800 px-12 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
        >
          Zurück zum Titel
        </button>
      </div>
    </div>
  )
}
