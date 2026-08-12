/**
 * Die eingereichte Entschuldigung – handgeschrieben, geknickt, fleckig.
 */

import Paper from './Paper.jsx'
import Handwriting from './Handwriting.jsx'
import Signature from './Signature.jsx'

const MONAT = 'März'

export default function ExcuseNote({ applicant: a, stamped }) {
  return (
    <Paper seed={a.seed} width={392} tilt={a.tilt} className="p-7">
      <div className="mb-4 border-b border-ink-500/25 pb-2">
        <Handwriting seed={a.seed + 1} size={15} color="#3a4650" messy={0.7}>
          {`${a.elternteil === 'Mutter' ? 'Fam.' : 'Familie'} ${a.nachname}`}
        </Handwriting>
      </div>

      <div className="mb-3 flex justify-end">
        <Handwriting seed={a.seed + 2} size={16} color="#243a5e">
          {`${a.datumNotiz}. ${MONAT}`}
        </Handwriting>
      </div>

      <div className="mb-3">
        <Handwriting seed={a.seed + 3} size={19} color="#243a5e">
          Entschuldigung
        </Handwriting>
      </div>

      <p className="mb-1">
        <Handwriting seed={a.seed + 4} size={17} color="#243a5e">
          {`Mein${a.kind === 'Tochter' ? 'e' : ''} ${a.kind} `}
        </Handwriting>
        <Handwriting seed={a.seed + 5} size={17} color="#243a5e">
          {a.nameAufNotiz}
        </Handwriting>
      </p>

      <p className="mb-1">
        <Handwriting seed={a.seed + 6} size={17} color="#243a5e">
          {a.fehltagVon === a.fehltagBis
            ? `konnte am ${a.fehltagVon}. ${MONAT} nicht`
            : `konnte vom ${a.fehltagVon}. bis ${a.fehltagBis}. ${MONAT} nicht`}
        </Handwriting>
      </p>
      <p className="mb-1">
        <Handwriting seed={a.seed + 7} size={17} color="#243a5e">
          am Unterricht teilnehmen.
        </Handwriting>
      </p>
      <p className="mb-5">
        <Handwriting seed={a.seed + 8} size={17} color="#243a5e">
          {`Grund: ${a.grund}.`}
        </Handwriting>
      </p>

      <div className="flex items-end justify-between">
        <span className="font-form text-[10px] uppercase tracking-widest text-ink-500/70">
          Unterschrift {a.elternteil}
        </span>
      </div>
      <div className="-mt-1 border-t border-ink-500/30 pt-1" data-lupe="notiz-sig">
        <Signature seed={a.elternSeed} forgery={a.forgery} width={220} height={64} />
      </div>

      {stamped && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {stamped}
        </div>
      )}
    </Paper>
  )
}
