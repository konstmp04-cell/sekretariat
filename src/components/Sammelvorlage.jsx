/**
 * Der Stapel des Lehrers – fünf Vorgänge auf einem Blatt.
 *
 * DIE WICHTIGSTE FRAGE HIER IST NICHT, WIE ES AUSSIEHT, SONDERN OB MAN
 * VERSTEHT, WAS ZU TUN IST. Zwölf Tage lang bedeutete jeder Vorgang „grün
 * oder rot". Jetzt liegt einmal etwas da, bei dem erst eine Auswahl kommt –
 * und wer das nicht sofort begreift, stempelt einfach grün und erfährt nie,
 * dass es hier etwas anderes zu tun gab.
 *
 * Vier Dinge sagen es, ohne dass ein Kasten mit einer Bedienungsanleitung
 * aufgeht:
 *
 *   1. Der Lehrer sagt es beim Hinlegen („Wenn einer nicht in Ordnung ist,
 *      sagen Sie mir welcher").
 *   2. Auf dem Kopf des Formulars steht die Anweisung im Amtston, so wie sie
 *      auf einem echten Sammelbogen stünde.
 *   3. Die Zeilen sehen anklickbar aus: nummeriert, mit einem leeren
 *      Ankreuzfeld am Rand, das beim Überfahren aufleuchtet.
 *   4. Wer trotzdem rot stempelt, ohne etwas gewählt zu haben, bekommt keine
 *      Fehlentscheidung, sondern eine Rückfrage – und weiß es ab da.
 *
 * Der vierte Punkt ist der entscheidende. Eine Mechanik, die man beim ersten
 * Versuch falsch bedienen KANN, muss beim ersten Versuch nachfragen statt zu
 * bestrafen.
 */

import Paper from './Paper.jsx'
import Handwriting from './Handwriting.jsx'

const MONAT = 'März'

/**
 * Ein Vorgang auf dem Sammelbogen.
 *
 * Trägt seine Nummer als `data-zeile` und hat bewusst KEIN `onClick`.
 * Das Blatt liegt in einem Ziehbar, und das fängt den Zeiger beim Aufsetzen
 * mit `setPointerCapture` ein – ab da gehen alle Ereignisse an den
 * Blattrahmen, und der Klick erreicht diesen Knopf nie. Die Auswahl läuft
 * deshalb denselben Weg wie der Widerspruch: über `elementsFromPoint` beim
 * Loslassen. Ein Knopf bleibt es trotzdem, damit die Zeile für Vorleseprogramme
 * das ist, was sie ist.
 */
function Zeile({ blatt, nummer, gewaehlt, gesperrt }) {
  const zeitraum =
    blatt.fehltagVon === blatt.fehltagBis
      ? `${blatt.fehltagVon}.`
      : `${blatt.fehltagVon}.–${blatt.fehltagBis}.`

  return (
    <button
      type="button"
      data-zeile={gesperrt ? undefined : nummer - 1}
      disabled={gesperrt}
      aria-pressed={gewaehlt}
      className="block w-full border-b border-dotted border-ink-500/35 px-1 py-[5px] text-left last:border-b-0"
      style={{
        background: gewaehlt ? 'rgb(168 50 38 / 0.13)' : 'transparent',
        outline: gewaehlt ? '2px solid var(--color-stamp-deny)' : 'none',
        outlineOffset: -1,
        cursor: gesperrt ? 'default' : 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      <div className="flex items-baseline gap-2">
        {/* Das Kästchen ist der eigentliche Hinweis: Ein Formular mit leeren
            Ankreuzfeldern fordert dazu auf, eines anzukreuzen. */}
        <span
          className="mt-[1px] flex h-[13px] w-[13px] shrink-0 items-center justify-center border border-ink-900/55"
          style={{ background: gewaehlt ? 'var(--color-stamp-deny)' : 'transparent' }}
        >
          {gewaehlt && (
            <span className="font-form text-[10px] font-bold leading-none text-paper-100">×</span>
          )}
        </span>
        <span className="w-[14px] shrink-0 font-form text-[10px] text-ink-500">{nummer}</span>
        <span className="w-[104px] shrink-0 truncate font-form text-[12px] font-bold text-ink-900">
          {blatt.name}
        </span>
        <span className="w-[30px] shrink-0 font-form text-[12px] font-bold text-ink-900">
          {blatt.klasse}
        </span>
        <span className="w-[56px] shrink-0 font-form text-[11px] text-ink-700">{zeitraum}</span>
        <span className="w-[40px] shrink-0 font-form text-[10px] text-ink-700">
          {blatt.attest ? 'Attest' : '—'}
        </span>
        <span className="min-w-0 flex-1 truncate font-form text-[10px] text-ink-500">
          {blatt.grund}
        </span>
      </div>
      <div className="mt-[2px] flex gap-2 pl-[29px] font-form text-[9px] text-ink-500">
        <span>ausgestellt {blatt.datumNotiz}. {MONAT}</span>
      </div>
    </button>
  )
}

export default function Sammelvorlage({ applicant: a, gewaehlt, gesperrt, stamped }) {
  const { lehrer, blaetter } = a.sammel

  return (
    <Paper seed={a.seed + 77} width={438} tilt={a.tilt} className="p-6">
      <div className="mb-1 flex items-baseline justify-between border-b-2 border-ink-900/70 pb-1">
        <span className="font-form text-[12px] font-bold uppercase tracking-[0.14em] text-ink-900">
          Sammelvorlage
        </span>
        <span className="font-form text-[9px] uppercase tracking-widest text-ink-500">
          {blaetter.length} Vorgänge
        </span>
      </div>

      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-form text-[10px] text-ink-700">
          Vorgelegt durch {lehrer.name}
        </span>
        <span className="font-form text-[9px] uppercase tracking-wider text-ink-500">
          {lehrer.amt}
        </span>
      </div>

      {/* Die Anweisung steht auf dem Formular, nicht daneben. Ein
          eingeblendeter Hilfetext wäre ein Fremdkörper auf einem Schreibtisch,
          auf dem sonst alles Papier ist – und man würde ihn beim zweiten Mal
          wegklicken wollen. */}
      <p className="mb-3 border-l-2 border-ink-900/40 bg-ink-500/5 px-2 py-[5px] font-form text-[10px] leading-snug text-ink-700">
        Zu beanstandende Einzelvorgänge sind zu kennzeichnen und die Vorlage
        zurückzuweisen. Ist nichts zu beanstanden, ist geschlossen anzunehmen.
      </p>

      <div className="border-y border-ink-900/30">
        {blaetter.map((b, i) => (
          <Zeile
            key={b.id}
            blatt={b}
            nummer={i + 1}
            gewaehlt={gewaehlt === i}
            gesperrt={gesperrt}
          />
        ))}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-form text-[9px] uppercase tracking-widest text-ink-500">
            Unterschrift Vorlegende/r
          </p>
          <div className="mt-[2px] border-t border-ink-500/30 pt-[2px]">
            <Handwriting seed={a.seed + 5} size={15} color="#243a5e" messy={0.4}>
              Brenner
            </Handwriting>
          </div>
        </div>
        <p className="font-form text-[9px] text-ink-500">
          Eingang {8 + Number(a.id.split('-')[0])}. {MONAT}
        </p>
      </div>

      {stamped && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {stamped}
        </div>
      )}
    </Paper>
  )
}
