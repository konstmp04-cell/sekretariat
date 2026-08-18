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

import { useEffect, useState } from 'react'
import Paper from './Paper.jsx'
import Stamp from './Stamp.jsx'
import { ENDE, note } from '../game/spielstand.js'
import { spiele } from '../game/audio.js'

/**
 * Das Ergebnis als Text, zum Zurückschicken.
 *
 * Zum Testen gedacht: „War ganz cool" lässt sich nicht vergleichen, zwei
 * Zeugnisse nebeneinander schon. Vor allem verrät die Aufteilung mehr als die
 * Note – wer durchwinkt und wer Unschuldige abweist, hat auf dieselbe Weise
 * schlecht gespielt und auf völlig verschiedene Art.
 */
function alsText(stand, ende, n, quote) {
  const g = stand.gesamt
  const zeilen = [
    'SEKRETARIAT – Abschlusszeugnis',
    `Ende: ${ende}`,
    `Tage im Dienst: ${stand.tag} von 12`,
    `Vorgänge: ${g.richtig + g.falsch}`,
    `Korrekt: ${g.richtig} · Beanstandet: ${g.falsch} (${Math.round(quote * 100)} %)`,
    `Note: ${n.zahl} – ${n.wort}`,
    `Verstöße erkannt: ${g.erwischt} von ${g.verstoesse}`,
    `Durchgewunken: ${g.verstoesse - g.erwischt} · Zu Unrecht abgewiesen: ${g.zuUnrecht}`,
  ]
  const anw = stand.anweisungen.befolgt + stand.anweisungen.verweigert
  if (anw > 0) {
    zeilen.push(
      `Anordnungen: ${stand.anweisungen.befolgt} befolgt, ${stand.anweisungen.verweigert} nicht`,
    )
  }
  const kon = stand.konfrontationen ?? { treffer: 0, daneben: 0 }
  if (kon.treffer + kon.daneben > 0) {
    zeilen.push(`Widersprüche: ${kon.treffer} berechtigt, ${kon.daneben} unberechtigt`)
  }
  if (g.nachsicht > 0) zeilen.push(`Wissentlich durchgewunken: ${g.nachsicht}`)
  if (stand.bestechungen > 0) zeilen.push(`Zuwendungen angenommen: ${stand.bestechungen}`)
  zeilen.push(`Ansehen: Rektorat ${Math.round(stand.ruf.rektor)} % · Schülerschaft ${Math.round(stand.ruf.schueler)} %`)
  return zeilen.join('\n')
}

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
  const anweisungenGesamt = stand.anweisungen.befolgt + stand.anweisungen.verweigert
  const kon = stand.konfrontationen ?? { treffer: 0, daneben: 0 }
  const widersprueche = kon.treffer + kon.daneben
  // Bei Freistellung wird kein Zeugnis ausgestellt, sondern ein Bescheid –
  // dasselbe Papier, dieselbe Amtssprache, aber ohne Note.
  const bescheid = ende === ENDE.DISZIPLINAR
  const [kopiert, setKopiert] = useState(false)

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
          {/* Die interessanteste Zahl des ganzen Zeugnisses – und es gibt sie
              erst, seit man jemanden mit seinen Papieren konfrontieren kann.
              Vorher sahen Übersehen und Durchgehenlassen von außen gleich aus.
              Hier steht, wie oft die Sache klar auf dem Tisch lag und trotzdem
              der grüne Stempel kam. */}
          {g.nachsicht > 0 && (
            <Posten
              label="Davon wissentlich"
              wert={g.nachsicht}
              ton="var(--color-brass)"
            />
          )}
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

          {/* Anordnungen bekommen einen eigenen Abschnitt und keine Farbe.
              Das ist der Punkt, an dem sich das Zeugnis eines Urteils
              enthält: Es zählt, wie oft man sich gefügt hat und wie oft
              nicht, und lässt beides nebeneinander stehen. Grün oder Rot
              hier wäre die Behauptung, es habe eine richtige Antwort
              gegeben – und damit wäre die ganze Entscheidung entwertet. */}
          {anweisungenGesamt > 0 && (
            <>
              <p className="mb-1 mt-5 font-form text-[10px] uppercase tracking-[0.16em] text-ink-500">
                Anordnungen des Rektorats
              </p>
              <Posten label="Befolgt" wert={stand.anweisungen.befolgt} />
              <Posten label="Nicht befolgt" wert={stand.anweisungen.verweigert} />
            </>
          )}

          {/* Auch die Widersprüche bleiben ohne Farbe. Viele davon sind kein
              Fehler und keine Leistung, sondern eine Arbeitsweise – nur die
              unberechtigten stehen für etwas, das jemandem widerfahren ist. */}
          {widersprueche > 0 && (
            <>
              <p className="mb-1 mt-5 font-form text-[10px] uppercase tracking-[0.16em] text-ink-500">
                Widersprüche am Schalter
              </p>
              <Posten label="Berechtigt" wert={kon.treffer} />
              <Posten
                label="Unberechtigt"
                wert={kon.daneben}
                ton={kon.daneben > 0 ? 'var(--color-stamp-deny)' : undefined}
              />
            </>
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

          {/* Der Schlusssatz zu den Anordnungen – in Aktenfarbe, nicht in
              Rot. Beide Fassungen sind bewusst unangenehm: Die eine hält
              fest, dass man sich widersetzt hat, die andere, dass man es
              nie getan hat. Welche davon schlimmer ist, entscheidet der
              Spieler, nicht das Spiel. */}
          {anweisungenGesamt > 0 && !bescheid && (
            <p className="mt-3 border-t border-ink-500/30 pt-2 text-center font-form text-[10px] uppercase tracking-[0.14em] text-ink-500">
              {stand.anweisungen.verweigert === 0
                ? 'Sämtliche Anordnungen wurden ausgeführt.'
                : stand.anweisungen.befolgt === 0
                  ? 'Keiner Anordnung wurde Folge geleistet.'
                  : `${stand.anweisungen.verweigert} Anordnung${
                      stand.anweisungen.verweigert === 1 ? '' : 'en'
                    } ohne Folge geblieben.`}
            </p>
          )}
        </Paper>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => {
              spiele('klick')
              onTitel()
            }}
            className="rounded-sm border-2 border-brass/70 bg-desk-800 px-12 py-3 font-form text-[13px] font-bold uppercase tracking-[0.16em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
          >
            Zurück zum Titel
          </button>

          <button
            onClick={async () => {
              spiele('klick')
              const text = alsText(stand, endText.titel, n, quote)
              try {
                await navigator.clipboard.writeText(text)
                setKopiert(true)
              } catch {
                // Ohne Zwischenablage (kein HTTPS, verweigerte Freigabe) bleibt
                // der Umweg über ein Textfeld – lieber altmodisch als gar nicht.
                const feld = document.createElement('textarea')
                feld.value = text
                feld.style.position = 'fixed'
                feld.style.opacity = '0'
                document.body.appendChild(feld)
                feld.select()
                try {
                  document.execCommand('copy')
                  setKopiert(true)
                } catch {
                  setKopiert(false)
                }
                feld.remove()
              }
              setTimeout(() => setKopiert(false), 2200)
            }}
            className="rounded-sm border border-paper-400/40 px-5 py-3 font-form text-[11px] uppercase tracking-[0.14em] text-paper-400 transition hover:border-brass/70 hover:text-brass"
          >
            {kopiert ? 'Kopiert' : 'Ergebnis kopieren'}
          </button>
        </div>
      </div>
    </div>
  )
}
