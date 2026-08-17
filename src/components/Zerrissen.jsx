/**
 * Ein Blatt in zwei Stücken.
 *
 * Der Riss läuft SENKRECHT, und das ist der ganze Trick: Der Zeitraum auf dem
 * Attest steht in einer Zeile – „vom 5. bis 9. März". Ein waagerechter Riss
 * ließe sie unversehrt und wäre bloß Verzierung. Ein senkrechter trennt sie
 * mitten durch: Auf dem einen Stück steht „vom 5. b", auf dem anderen
 * „is 9. März", und keins der beiden sagt etwas aus. Erst zusammengeschoben
 * steht die Angabe wieder da.
 *
 * Kein Klebeband, kein Werkzeug, keine Wartezeit. Man zieht das eine Stück
 * ans andere, und wenn es nah genug liegt, rastet es ein. Ein Handgriff, den
 * man ohne Erklärung versteht – deshalb steht auch keine da.
 *
 * Beschnitten wird der ZIEHRAHMEN, nicht der Inhalt. Läge der Beschnitt
 * weiter innen, bliebe der weggeschnittene Teil ein unsichtbares, aber
 * greifbares Rechteck: Man zöge dann die rechte Hälfte an einer Stelle, an
 * der links nichts zu sehen ist.
 *
 * Zusammengefügt wird aus zwei Rahmen wieder EINER. Zwei Stücke, die
 * aneinanderkleben und beim Anfassen wieder auseinanderfallen, wären der
 * Ärger, den diese Datei gerade vermeiden soll – ab dem Einrasten ist es ein
 * Blatt, das nur noch eine Naht hat.
 */

import { useCallback, useMemo, useRef, useState } from 'react'
import Ziehbar from './Ziehbar.jsx'
import { makeRng, rngHelpers } from '../game/rng.js'
import { spiele } from '../game/audio.js'

/**
 * Wie nah die Stücke liegen müssen, damit sie zusammenfinden.
 *
 * 30 px auf ein 302 px breites Blatt: großzügig genug, dass niemand
 * pixelgenau zielen muss, und eng genug, dass das Einrasten wie Passen wirkt
 * und nicht wie Magnetismus.
 */
const TOLERANZ = 30

/**
 * Wo der Riss ungefähr verläuft, in Prozent der Blattbreite.
 *
 * Ausgemessen, nicht geschätzt. Der erste Entwurf riss bei 47 % – mittig, wie
 * ein Riss eben aussieht. Auf dem Bildschirm stand danach auf dem LINKEN
 * Stück „vom 15. bis 17." vollständig zu lesen, weil die Zeile bei 12 px
 * Schriftgröße nur rund 133 px breit ist und der Schnitt erst dahinter kam.
 * Der Riss war damit reine Zierde: Man konnte den Zeitraum ablesen, ohne
 * irgendetwas zusammenzuschieben.
 *
 * Bei 33 % fällt der Schnitt rund 60 bis 90 px hinter den Textanfang, also
 * mitten in die Zeitangabe. Links steht dann „vom 15", rechts „. bis 17.
 * März" – jede Hälfte für sich nennt eine Zahl und verschweigt, wofür sie
 * steht. Erst beide zusammen ergeben einen Zeitraum, und genau darum geht es.
 */
const MITTE = 33

/**
 * Die Rissspur – eine Zackenlinie von oben nach unten.
 *
 * Bewusst unregelmäßig in beiden Achsen: Ein Riss mit gleichmäßigen Zacken
 * sieht aus wie eine Perforation, also nach Absicht. Papier reißt entlang der
 * Faser und ändert dabei ständig die Richtung.
 */
function risslinie(seed) {
  const { range } = rngHelpers(makeRng(seed))
  const stufen = 13
  const punkte = []
  for (let i = 0; i <= stufen; i++) {
    // Die y-Schritte selbst schwanken, sonst liegen alle Zacken auf einem Raster.
    const y = Math.min(100, Math.max(0, (i / stufen) * 100 + (i === 0 || i === stufen ? 0 : range(-3, 3))))
    punkte.push([MITTE + range(-5.5, 5.5), y])
  }
  return punkte
}

function beschnitt(punkte) {
  const spur = punkte.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')
  return {
    links: `polygon(0% 0%, ${spur}, 0% 100%)`,
    rechts: `polygon(100% 0%, ${spur}, 100% 100%)`,
  }
}

const dicht = (a, b) => Math.abs(a.x - b.x) < TOLERANZ && Math.abs(a.y - b.y) < TOLERANZ

/** Die Naht, nachdem die Stücke zusammenliegen. */
function Naht({ punkte }) {
  const spur = punkte.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Zwei Linien: der Schatten im Spalt und die aufgestellte Faserkante
          daneben. Eine einzelne Linie liest sich als Strich, nicht als Riss. */}
      <polyline
        points={spur}
        fill="none"
        stroke="rgb(72 54 28 / 0.34)"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={spur}
        fill="none"
        stroke="rgb(255 252 240 / 0.5)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        transform="translate(0.5 0)"
      />
    </svg>
  )
}

/**
 * @param {(lage: {animiert: boolean, gefuegt: boolean}) => import('react').ReactNode} blatt
 *   Zeichnet das Blatt. Als Funktion und nicht als `children`, weil sich zwei
 *   Dinge unterscheiden müssen:
 *
 *   `animiert` – Die Einflugbewegung gehört nur zum ersten Auftauchen. Die
 *   beiden Stücke fliegen auf den Tisch, das zusammengefügte Blatt liegt
 *   schon dort. Ohne die Unterscheidung schösse das Attest beim Einrasten
 *   noch einmal von links unten herein, ausgerechnet in dem Moment, der Ruhe
 *   herstellen soll.
 *
 *   `gefuegt` – Solange die Stücke getrennt liegen, darf die Lupe die
 *   getrennte Angabe NICHT wieder ganz zeigen. Sie zeichnet ihren Inhalt neu
 *   statt Bildpunkte zu vergrößern, und ohne diesen Hinweis läse man unter
 *   dem Glas den vollständigen Zeitraum von einer Hälfte ab, auf der er
 *   physisch gar nicht steht. Der Riss wäre damit umsonst.
 */
export default function Zerrissen({ seed, startA, startB, z = 1, onVorn, blatt }) {
  const punkte = useMemo(() => risslinie(seed), [seed])
  const clip = useMemo(() => beschnitt(punkte), [punkte])

  const [ganz, setGanz] = useState(false)
  const [nah, setNah] = useState(false)
  const lage = useRef({ a: startA, b: startB })

  const meldeA = useCallback((p) => {
    lage.current.a = p
    setNah(dicht(p, lage.current.b))
  }, [])
  const meldeB = useCallback((p) => {
    lage.current.b = p
    setNah(dicht(lage.current.a, p))
  }, [])

  /** Rastet das losgelassene Stück am Gegenstück ein – oder eben nicht. */
  const fuegen = useCallback((ziel, p) => {
    if (!dicht(p, ziel)) return null
    lage.current = { a: ziel, b: ziel }
    setGanz(true)
    setNah(false)
    spiele('naht')
    return ziel
  }, [])

  const schnappA = useCallback((p) => fuegen(lage.current.b, p), [fuegen])
  const schnappB = useCallback((p) => fuegen(lage.current.a, p), [fuegen])

  // Der Leuchtsaum folgt der Rissform, weil er als Schlagschatten und nicht
  // als Rahmen gezeichnet wird – ein `outline` würde vom Beschnitt gekappt.
  const schein = nah
    ? 'drop-shadow(0 0 8px rgb(185 150 89 / 0.9)) drop-shadow(0 6px 10px rgb(0 0 0 / 0.45))'
    : 'drop-shadow(0 3px 6px rgb(0 0 0 / 0.45))'

  if (ganz) {
    return (
      <Ziehbar key="ganz" start={lage.current.a} z={z} onVorn={onVorn}>
        <div className="relative">
          {blatt({ animiert: false, gefuegt: true })}
          <Naht punkte={punkte} />
        </div>
      </Ziehbar>
    )
  }

  return (
    <>
      <Ziehbar
        key="links"
        start={startA}
        z={z}
        onVorn={onVorn}
        melde={meldeA}
        schnapp={schnappA}
        stil={{ clipPath: clip.links, filter: schein }}
      >
        {blatt({ animiert: true, gefuegt: false })}
      </Ziehbar>
      <Ziehbar
        key="rechts"
        start={startB}
        z={z + 1}
        onVorn={onVorn}
        melde={meldeB}
        schnapp={schnappB}
        stil={{ clipPath: clip.rechts, filter: schein }}
      >
        {blatt({ animiert: true, gefuegt: false })}
      </Ziehbar>
    </>
  )
}
