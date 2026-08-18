/**
 * Die Schulakte – amtlich getippt, im Gegensatz zur handgeschriebenen Notiz.
 *
 * Das ist das Referenzdokument: Hier steht die HINTERLEGTE Unterschrift des
 * Elternteils (immer forgery=0). Der Vergleich zwischen dieser Kurve und der
 * auf der Entschuldigung ist die Kernhandlung des Spiels.
 */

import Paper from './Paper.jsx'
import PixelPortrait from './PixelPortrait.jsx'
import Signature from './Signature.jsx'
import Feld from './Feld.jsx'

/** Eine Zeile der Akte. `feld` macht den WERT antippbar, nicht die Zeile –
 *  man zeigt auf den Namen, nicht auf das Wort „Name". */
function Row({ label, value, feld }) {
  const wert = <span className="font-form text-[13px] font-bold text-ink-900">{value}</span>
  return (
    <div className="flex items-baseline gap-2 border-b border-dotted border-ink-500/30 py-[3px]">
      <span className="font-form text-[9px] uppercase tracking-wider text-ink-500 w-[68px] shrink-0">
        {label}
      </span>
      {feld ? <Feld id={feld}>{wert}</Feld> : wert}
    </div>
  )
}

export default function StudentFile({ applicant: a }) {
  return (
    <Paper seed={a.seed + 999} width={340} tilt={-a.tilt * 0.6} className="p-5">
      <div className="mb-3 flex items-center justify-between border-b-2 border-ink-900/70 pb-1">
        <span className="font-form text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
          Schülerakte
        </span>
        <span className="font-form text-[9px] tracking-wider text-ink-500">
          Nr. {a.schuelerNr}
        </span>
      </div>

      <div className="flex gap-4">
        <Feld
          as="div"
          id="akte-foto"
          className="shrink-0 border border-ink-900/40 p-[3px]"
          style={{ background: '#cfc7b4' }}
        >
          {/* Bewusst das Aktenfoto, nicht die Person am Schalter: Genau
              zwischen diesen beiden Bildern liegt der Lichtbildabgleich. */}
          <div data-lupe="akte-foto">
            <PixelPortrait face={a.aktenFoto} scale={2} />
          </div>
        </Feld>

        <div className="min-w-0 flex-1">
          <Row label="Name" value={a.name} feld="akte-name" />
          <Row label="Klasse" value={a.klasse} feld="akte-klasse" />
          <Row label="Erz.-ber." value={`${a.elternteil} ${a.nachname}`} />
        </div>
      </div>

      {/* Sperrvermerk: hebt jede andere Prüfung auf. Bewusst auffällig
          gesetzt – wer ihn übersieht, hat die Akte nicht angesehen. */}
      {a.sperrvermerk && (
        <Feld
          as="div"
          id="akte-vermerk"
          className="mt-3 border-2 border-stamp-deny px-3 py-2"
          style={{ background: 'rgb(168 50 38 / 0.1)' }}
        >
          <p className="font-form text-[10px] font-bold uppercase tracking-[0.14em] text-stamp-deny">
            Sperrvermerk des Rektorats
          </p>
          <p className="mt-[2px] font-form text-[9px] leading-snug text-ink-700">
            Entschuldigungen ausschließlich über die Schulleitung.
          </p>
        </Feld>
      )}

      <div className="mt-4">
        <span className="font-form text-[9px] uppercase tracking-widest text-ink-500">
          Hinterlegte Unterschrift
        </span>
        <Feld
          as="div"
          id="akte-sig"
          className="mt-1 border border-ink-500/30 px-2"
          style={{ background: 'rgb(255 255 255 / 0.35)' }}
        >
          <div data-lupe="akte-sig">
            {/* Immer das Original: forgery bewusst nicht durchgereicht. */}
            <Signature seed={a.elternSeed} forgery={0} width={280} height={62} />
          </div>
        </Feld>
      </div>
    </Paper>
  )
}
