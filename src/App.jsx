import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { buildQueue, klausurplan } from './game/applicant.js'
import { pruefeEntscheidung } from './game/validate.js'
import { tagInfo } from './game/days.js'
import { zeileFuer } from './game/figuren.js'
import { PHASE, reduce, neuerStand, laden, speichern, loeschen } from './game/spielstand.js'
import ExcuseNote from './components/ExcuseNote.jsx'
import StudentFile from './components/StudentFile.jsx'
import Attest from './components/Attest.jsx'
import Klausurplan from './components/Klausurplan.jsx'
import Geldschein from './components/Geldschein.jsx'
import Lupe from './components/Lupe.jsx'
import Stempelwerkzeug from './components/Stempelwerkzeug.jsx'
import Signature from './components/Signature.jsx'
import Dienstanweisung from './components/Dienstanweisung.jsx'
import Schreibtischdeko from './components/Schreibtischdeko.jsx'
import PixelPortrait from './components/PixelPortrait.jsx'
import Galerie from './components/Galerie.jsx'
import Stamp from './components/Stamp.jsx'
import TitleScreen from './components/TitleScreen.jsx'
import Briefing from './components/Briefing.jsx'
import DaySummary from './components/DaySummary.jsx'
import Zeugnis from './components/Zeugnis.jsx'
import TonKnopf from './components/TonKnopf.jsx'
import Ziehbar from './components/Ziehbar.jsx'
import { spiele, ladeTonEinstellung } from './game/audio.js'

ladeTonEinstellung()

export default function App() {
  if (typeof window !== 'undefined' && window.location.hash === '#galerie') {
    return <Galerie />
  }
  return <Spiel />
}

function Spiel() {
  const [stand, dispatch] = useReducer(reduce, null, neuerStand)
  const [gespeichert] = useState(() => laden())

  const info = tagInfo(stand.tag)

  // Fortschritt sichern, sobald sich Tag oder Ruf ändern – aber nie auf dem
  // Titelbildschirm, sonst überschreibt der frische Zustand den Spielstand.
  useEffect(() => {
    if (stand.phase === PHASE.TITEL) return
    if (stand.phase === PHASE.ENDE) {
      loeschen()
      return
    }
    speichern(stand)
  }, [stand])

  switch (stand.phase) {
    case PHASE.BRIEFING:
      return (
        <Briefing info={info} stand={stand} onStart={() => dispatch({ typ: 'SCHICHT_STARTEN' })} />
      )

    case PHASE.SCHICHT:
      return <Schalter stand={stand} info={info} dispatch={dispatch} />

    case PHASE.ABRECHNUNG:
      return (
        <DaySummary
          stand={stand}
          info={info}
          ende={null}
          onWeiter={() => dispatch({ typ: 'NAECHSTER_TAG' })}
        />
      )

    case PHASE.ENDE:
      return (
        <Zeugnis
          stand={stand}
          info={info}
          ende={stand.ende}
          onTitel={() => dispatch({ typ: 'ZURUECK_ZUM_TITEL' })}
        />
      )

    default:
      return (
        <TitleScreen
          gespeicherterTag={gespeichert?.tag ?? 1}
          onNeu={() => dispatch({ typ: 'NEU' })}
          onFortsetzen={() => dispatch({ typ: 'FORTSETZEN', stand: gespeichert })}
        />
      )
  }
}

/** Zwei Balken, die sich gegenseitig im Weg stehen – die Kernspannung. */
function RufBalken({ label, wert, farbe }) {
  return (
    <div className="w-36">
      <div className="mb-1 flex justify-between font-form text-[9px] uppercase tracking-widest text-paper-400">
        <span>{label}</span>
        <span>{Math.round(wert)}%</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-sm bg-desk-900 shadow-inner">
        <div
          className="h-full transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, wert))}%`, background: farbe }}
        />
      </div>
    </div>
  )
}

function Schalter({ stand, info, dispatch }) {
  const queue = useMemo(() => buildQueue(info.tag, info.anzahl), [info.tag, info.anzahl])
  // Der Aushang erscheint erst, wenn die Klausurregel überhaupt gilt.
  const klausuren = useMemo(
    () => (info.tag >= 6 ? klausurplan(info.tag) : []),
    [info.tag],
  )

  const [stamp, setStamp] = useState(null) // 'ok' | 'deny'
  const [feedback, setFeedback] = useState(null)
  const [shake, setShake] = useState(false)
  const timer = useRef(null)

  // Stapelreihenfolge der Dokumente. Das zuletzt angefasste liegt oben –
  // ohne das fühlt sich Übereinanderschieben sofort falsch an.
  const [stapel, setStapel] = useState(['schein', 'plan', 'attest', 'akte', 'notiz'])
  const nachVorn = useCallback(
    (id) => setStapel((s) => [...s.filter((x) => x !== id), id]),
    [],
  )
  const zVon = (id) => stapel.indexOf(id) + 1

  // Startlage an der Fensterbreite ausgerichtet, damit auf schmalen
  // Bildschirmen nichts unter der Dienstanweisung verschwindet.
  const { startNotiz, startAkte, startAttest, startPlan, startSchein, startLupe } = useMemo(() => {
    const breite = typeof window === 'undefined' ? 1440 : window.innerWidth
    return {
      // Rechts genug Abstand, damit die Entschuldigung nicht unter der
      // Statusleiste startet.
      startNotiz: { x: Math.max(220, Math.round(breite * 0.155)), y: 10 },
      startAkte: { x: Math.max(420, Math.round(breite * 0.545)), y: 22 },
      // Liegt absichtlich quer über der unteren Hälfte der Entschuldigung:
      // Der Schreibtisch soll voll wirken, nicht aufgeräumt. Höhe so
      // gewählt, dass das Blatt die Stempelknöpfe gerade noch freilässt.
      startAttest: { x: Math.max(240, Math.round(breite * 0.33)), y: 178 },
      // Unten links, wo die Statusleiste endet – griffbereit, aber nicht im Weg.
      startPlan: { x: 34, y: 268 },
      // Halb unter der Entschuldigung: Man sieht die Ecke hervorschauen und
      // muss das Blatt anheben, um den Schein ganz zu sehen.
      startSchein: { x: Math.max(300, Math.round(breite * 0.355)), y: 306 },
      // Rechts neben den Papieren, wo sie niemandem im Weg liegt.
      startLupe: { x: Math.max(640, Math.round(breite * 0.71)), y: 384 },
    }
  }, [])

  const a = queue[Math.min(stand.index, queue.length - 1)]

  // Frühere Begegnungen mit dieser Figur – daraus entsteht ihre Zeile.
  const vorgeschichte = a.figur ? (stand.begegnungen[a.figur.id] ?? []) : []
  const gesagt = a.figur ? zeileFuer(a.auftritt, vorgeschichte) : a.spruch

  // Was die Lupe zeigt, wird neu gezeichnet statt hochskaliert – deshalb
  // hier die groß gerenderten Fassungen samt ihrer Maße.
  const lupeInhalte = useMemo(
    () => ({
      'notiz-sig': {
        node: <Signature seed={a.elternSeed} forgery={a.forgery} width={560} height={162} />,
        w: 560,
        h: 162,
      },
      'akte-sig': {
        node: <Signature seed={a.elternSeed} forgery={0} width={560} height={162} />,
        w: 560,
        h: 162,
      },
      'akte-foto': { node: <PixelPortrait face={a.aktenFoto} scale={6} />, w: 264, h: 312 },
      'attest-sig': a.attest
        ? {
            node: (
              <Signature seed={a.attest.arztSeed} forgery={0} width={420} height={124} color="#3d5a8a" />
            ),
            w: 420,
            h: 124,
          }
        : null,
    }),
    [a],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  // Der nächste Schüler legt seine Unterlagen auf den Tresen.
  useEffect(() => {
    spiele('papier')
  }, [stand.index])

  const entscheiden = useCallback(
    (kind, bestochen = false) => {
      if (stamp) return
      const { richtig, verstoesse } = pruefeEntscheidung(a, info.tag, kind)

      setStamp(kind)
      setFeedback({ richtig, verstoesse })
      spiele('stempel')
      // Die Rückmeldung kommt bewusst NACH dem Schlag, nicht gleichzeitig:
      // erst stempelt man, dann merkt man, was man angerichtet hat.
      spiele(richtig ? 'haken' : 'summer', 0.3)
      if (!richtig) {
        setShake(true)
        setTimeout(() => setShake(false), 300)
      }

      dispatch({
        typ: 'ENTSCHEIDEN',
        richtig,
        kind,
        hatteVerstoss: verstoesse.length > 0,
        figurId: a.figur?.id ?? null,
        bestochen,
      })

      timer.current = setTimeout(() => {
        setStamp(null)
        setFeedback(null)
        dispatch({ typ: 'NAECHSTER' })
      }, 1900)
    },
    [a, stamp, info.tag, dispatch],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') entscheiden('deny')
      if (e.key === 'ArrowRight' || e.key === 'd') entscheiden('ok')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entscheiden])

  return (
    <div className={`relative h-full w-full overflow-hidden ${shake ? 'animate-desk-shake' : ''}`}>
      {/* --- Rückwand mit Schalterfenster ---------------------------------- */}
      <div className="absolute inset-x-0 top-0 h-[32%] bg-desk-700">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, rgb(0 0 0 / 0.22) 0 1px, transparent 1px 44px)',
          }}
        />
        {/* Wer heute noch wartet */}
        <div className="absolute bottom-4 left-8 flex items-end gap-3 opacity-25 blur-[2px]">
          {queue.slice(stand.index + 1, stand.index + 4).map((p) => (
            <PixelPortrait key={p.id} face={p.face} scale={1} />
          ))}
        </div>

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-5">
          <div
            key={a.id}
            className="animate-paper-in border-4 border-desk-600 bg-desk-900 shadow-[0_0_40px_rgb(0_0_0/0.7)]"
          >
            <PixelPortrait face={a.face} scale={3} />
          </div>
          <div className="mb-6 max-w-[320px] rounded-sm border border-paper-400/25 bg-desk-900/85 px-4 py-3">
            {vorgeschichte.length > 0 && (
              <p className="mb-1 font-form text-[9px] uppercase tracking-[0.16em] text-brass/80">
                Schon {vorgeschichte.length === 1 ? 'einmal' : vorgeschichte.length + '-mal'} hier gewesen
              </p>
            )}
            <p className="font-form text-[13px] leading-snug text-paper-200">„{gesagt}"</p>
            {a.auftritt?.bestechung && !stamp && (
              <p className="mt-2 border-t border-brass/25 pt-2 font-form text-[11px] italic leading-snug text-brass">
                {a.auftritt.bestechung.text}
              </p>
            )}
            <p className="mt-1 font-form text-[10px] uppercase tracking-widest text-paper-400/70">
              {a.klasse} · {a.name}
            </p>
          </div>
        </div>

        {/* Lichtpool um die Person am Schalter.

            Zuvor lag hier ein Kegel über 46 % der Bildschirmbreite, ohne
            sichtbare Quelle und über die Wand hinauslaufend. Licht ohne
            erkennbaren Ursprung liest sich nicht als Beleuchtung, sondern als
            Schleier quer über die Wand. Eng gefasst und am Schalterfenster
            verankert lenkt es dagegen den Blick auf den Menschen davor. */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[430px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse 46% 66% at 50% 100%, rgb(232 200 138 / 0.17), transparent 72%)',
          }}
        />
      </div>

      {/* --- Schreibtisch -------------------------------------------------- */}
      <div className="desk-surface absolute inset-x-0 bottom-0 top-[32%] border-t-4 border-desk-600">
        <Schreibtischdeko />

        {/* Freie Ablagefläche: Die Dokumente liegen übereinander und lassen
            sich mit der Maus auseinanderschieben. */}
        <div className="relative h-full w-full">
          <Ziehbar
            key={`n-${a.id}`}
            start={startNotiz}
            z={zVon('notiz')}
            onVorn={() => nachVorn('notiz')}
          >
            <ExcuseNote
              applicant={a}
              stamped={stamp ? <Stamp kind={stamp} rotate={-11} size={168} /> : null}
            />
          </Ziehbar>

          {a.attest && (
            <Ziehbar
              key={`a-${a.id}`}
              start={startAttest}
              z={zVon('attest')}
              onVorn={() => nachVorn('attest')}
            >
              <Attest applicant={a} />
            </Ziehbar>
          )}

          <Ziehbar
            key={`f-${a.id}`}
            start={startAkte}
            z={zVon('akte')}
            onVorn={() => nachVorn('akte')}
          >
            <StudentFile applicant={a} />
          </Ziehbar>

          {/* Das Bestechungsgeld. Verschwindet mit der Entscheidung – ob
              angenommen oder nicht, danach liegt es nicht mehr da. */}
          {a.auftritt?.bestechung && !stamp && (
            <Ziehbar
              key={`g-${a.id}`}
              start={startSchein}
              z={zVon('schein')}
              onVorn={() => nachVorn('schein')}
            >
              <Geldschein betrag={a.auftritt.bestechung.betrag} />
            </Ziehbar>
          )}

          {/* Der Aushang gehört keinem Schüler: Er hängt am Tag, nicht am
              Vorgang, und behält deshalb über die ganze Schicht seine Lage. */}
          {klausuren.length > 0 && (
            <Ziehbar
              key={`k-${info.tag}`}
              start={startPlan}
              z={zVon('plan')}
              onVorn={() => nachVorn('plan')}
            >
              <Klausurplan eintraege={klausuren} tag={info.tag} />
            </Ziehbar>
          )}

          <Lupe start={startLupe} inhalte={lupeInhalte} />

          {/* Einmaliger Hinweis beim allerersten Vorgang. Danach nie wieder –
              wer es einmal gemacht hat, braucht die Erinnerung nicht. */}
          {info.tag === 1 && stand.index === 0 && !stamp && (
            <p className="pointer-events-none absolute bottom-44 left-1/2 z-10 -translate-x-1/2 text-center font-form text-[11px] uppercase tracking-[0.18em] text-paper-400/50">
              Dokumente und Lupe lassen sich verschieben
            </p>
          )}
        </div>

        <Dienstanweisung tag={info.tag} />

        {/* Statusleiste */}
        <div className="absolute left-6 top-6 z-20 flex flex-col gap-3 rounded-sm border border-brass/30 bg-desk-900/90 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <span className="font-form text-[10px] uppercase tracking-widest text-brass">
              {info.wochentag} · {info.datum}
            </span>
            <TonKnopf />
          </div>
          <RufBalken label="Rektor" wert={stand.ruf.rektor} farbe="var(--color-brass)" />
          <RufBalken label="Schüler" wert={stand.ruf.schueler} farbe="var(--color-stamp-ok)" />
          <div className="mt-1 flex items-center justify-between border-t border-brass/20 pt-2 font-form text-[10px] uppercase tracking-widest">
            <span className="text-paper-400">
              Vorgang {stand.index + 1}/{info.anzahl}
            </span>
            <span className="flex gap-3">
              <span className="text-stamp-ok">✓ {stand.tagBilanz.richtig}</span>
              <span className="text-stamp-deny">✗ {stand.tagBilanz.falsch}</span>
            </span>
          </div>
        </div>
      </div>

      {/* --- Werkzeug und Rückmeldung ------------------------------------- */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        {feedback && (
          <div
            className={`animate-ink-settle rounded-sm border px-4 py-2 text-center font-form text-[11px] ${
              feedback.richtig
                ? 'border-stamp-ok/60 bg-desk-900/90 text-stamp-ok'
                : 'border-stamp-deny/60 bg-desk-900/90 text-stamp-deny'
            }`}
          >
            {feedback.richtig ? 'Korrekt bearbeitet' : 'Verweis vom Rektorat'}
            {feedback.verstoesse.length > 0 && (
              <div className="mt-1 text-[10px] text-paper-400">
                {feedback.verstoesse.map((v) => v.titel).join(' · ')}
              </div>
            )}
          </div>
        )}

        <div className="flex items-end gap-8">
          {a.auftritt?.bestechung && !stamp && (
            <button
              onClick={() => entscheiden('ok', true)}
              className="mb-8 rounded-sm border-2 border-brass/70 bg-desk-800 px-6 py-3 font-form text-[12px] font-bold uppercase tracking-[0.14em] text-brass shadow-lg transition hover:bg-brass hover:text-desk-900"
            >
              Geld nehmen · {a.auftritt.bestechung.betrag} €
            </button>
          )}

          <Stempelwerkzeug onEntscheiden={entscheiden} gesperrt={!!stamp} />
        </div>
      </div>
    </div>
  )
}
