/**
 * Das Vorzimmer hinter dem Schalter.
 *
 * Bis hierher war der obere Bildschirm ein Gang: eine flache Wand, ein
 * Lichtkegel, davor laufende Leute. Für ein Ereignis – jemand wirft etwas –
 * ist das zu dünn. Ein Ereignis braucht eine Bühne, auf der etwas passieren
 * KANN, und eine leere Wand ist keine.
 *
 * Kein voller Raum mit Perspektive: Der saubere Gang sähe besser aus als ein
 * schlecht gemalter Raum, und die Perspektive würde mit den seitlich laufenden
 * Figuren streiten. Stattdessen Tiefenhinweise, die aus dem Gang ein Vorzimmer
 * machen –
 *
 *   SCHWARZES BRETT mit Aushängen, wie es in jedem Schulflur hängt.
 *   WANDUHR, deren Zeiger mit der Schicht wandern: früh am Morgen, spät am
 *     Nachmittag. Sie erzählt dieselbe Zeit wie das Licht, nur ablesbar.
 *   TÜR mit Milchglas, hinter dem es schwach leuchtet – dahinter geht der Flur
 *     weiter, es gibt ein Dahinter.
 *   BANK, auf der die Wartenden sitzen statt im Nichts zu stehen.
 *
 * ALLES TRITT ZURÜCK. Das Vorzimmer wird VOR die Tagesfarbe gezeichnet und von
 * ihr mitgetönt; die Menschen kommen danach und bleiben ungetönt. Dadurch
 * liegt die Einrichtung hinter den Figuren, gedämpfter und flauer im Kontrast –
 * ein Hintergrund, kein Vordergrund. Die einzige Ausnahme ist die Uhr: Sie darf
 * ihr Messing behalten, weil sie das eine Detail ist, auf das man auch hinsieht.
 */

import { useEffect, useRef, useState } from 'react'

/** Wanduhr, die den Stand der Schicht zeigt (8 Uhr früh bis 14 Uhr). */
function Wanduhr({ fortschritt }) {
  const stunde = 8 + 6 * fortschritt
  const stdWinkel = (stunde % 12) * 30
  const minWinkel = (stunde % 1) * 360

  return (
    <svg viewBox="0 0 60 60" width="46" height="46" aria-hidden="true">
      {/* Messingfassung – das eine Element, das nicht zurücktreten muss. */}
      <circle cx="30" cy="30" r="28" fill="#1a1d1f" />
      <circle cx="30" cy="30" r="28" fill="none" stroke="#b99659" strokeWidth="2.4" opacity="0.85" />
      <circle cx="30" cy="30" r="24" fill="#cdc6b4" />
      {/* Stundenstriche */}
      {Array.from({ length: 12 }, (_, i) => {
        const w = (i / 12) * Math.PI * 2
        const r1 = i % 3 === 0 ? 18.5 : 21
        return (
          <line
            key={i}
            x1={30 + Math.sin(w) * r1}
            y1={30 - Math.cos(w) * r1}
            x2={30 + Math.sin(w) * 23}
            y2={30 - Math.cos(w) * 23}
            stroke="#2a2f33"
            strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
          />
        )
      })}
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="17"
        stroke="#20252a"
        strokeWidth="2.4"
        strokeLinecap="round"
        transform={`rotate(${stdWinkel} 30 30)`}
      />
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="11"
        stroke="#3a4045"
        strokeWidth="1.6"
        strokeLinecap="round"
        transform={`rotate(${minWinkel} 30 30)`}
      />
      <circle cx="30" cy="30" r="1.8" fill="#20252a" />
    </svg>
  )
}

/** Schwarzes Brett mit ein paar Aushängen. */
function Brett() {
  // Feste Zettel, kein Zufall: Das Brett hängt an der Wand, nicht am Tag, und
  // soll sich nicht bei jedem Neuzeichnen umsortieren.
  const zettel = [
    { l: 8, t: 10, w: 30, h: 22, dreh: -2 },
    { l: 44, t: 8, w: 26, h: 30, dreh: 1.5 },
    { l: 12, t: 40, w: 34, h: 20, dreh: 1 },
    { l: 52, t: 44, w: 22, h: 24, dreh: -1.5 },
  ]
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: '16%',
        left: '5%',
        width: 128,
        height: 84,
        background: '#4a3d2a',
        border: '4px solid #2c2418',
        boxShadow: '0 4px 10px rgb(0 0 0 / 0.4), inset 0 0 20px rgb(0 0 0 / 0.35)',
      }}
    >
      {zettel.map((z, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${z.l}%`,
            top: `${z.t}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: '#b8b09a',
            transform: `rotate(${z.dreh}deg)`,
            boxShadow: '0 1px 2px rgb(0 0 0 / 0.4)',
          }}
        >
          {/* Reißzwecke */}
          <span
            className="absolute left-1/2 top-[2px] block h-[3px] w-[3px] -translate-x-1/2 rounded-full"
            style={{ background: '#8a2f26' }}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Ein Schatten, der hinter dem Milchglas vorbeizieht.
 *
 * Vertikal, dunkel und weich – hinter Milchglas ist ein Mensch keine Gestalt
 * mehr, nur eine Verdunklung, die wandert. Erst startet er außerhalb der
 * Scheibe und gleitet in einem Zug hindurch; die Bewegung selbst ist die ganze
 * Aussage: Da geht der Flur weiter.
 */
function Schatten({ nachLinks, dauer, breite, onFertig }) {
  const [weg, setWeg] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setWeg(true), 30)
    const e = setTimeout(onFertig, dauer + 200)
    return () => {
      clearTimeout(a)
      clearTimeout(e)
    }
  }, [dauer, onFertig])

  const start = nachLinks ? '120%' : '-45%'
  const ziel = nachLinks ? '-45%' : '120%'
  return (
    <div
      className="absolute"
      style={{
        bottom: '-25%',
        left: weg ? ziel : start,
        width: breite,
        height: '150%',
        // Ein dunkler Balken mit ausgefransten Rändern, nicht ein Fleck: Der
        // erste Entwurf verlief nach außen zu weich und ging auf der kleinen
        // Scheibe unter, zumal der Tageslicht-Schleier darüberliegt. Solide
        // Mitte, weiche Flanken – so liest sich klar eine Verdunklung, die
        // durchzieht.
        background:
          'linear-gradient(90deg, transparent, rgb(14 18 20 / 0.92) 32%, rgb(14 18 20 / 0.92) 68%, transparent)',
        filter: 'blur(2px)',
        transition: `left ${dauer}ms linear`,
      }}
    />
  )
}

/**
 * Eine Tür mit Milchglasfenster – dahinter geht der Flur weiter.
 *
 * Und dieses „dahinter" ist jetzt bewohnt. Früher liefen die Durchgehenden im
 * Vordergrund quer durchs Bild – das passte zu einem GANG. In einem VORZIMMER
 * läuft niemand vorne durch, ein Wartezimmer ist kein Durchgang. Die Bewegung
 * ist deshalb hinter das Glas gewandert: Man sieht den Betrieb der Schule als
 * Schatten durch die Scheibe, nicht als Läufer vor der eigenen Nase.
 */
function Tuer() {
  const [schatten, setSchatten] = useState([])
  const naechste = useRef(0)

  useEffect(() => {
    let uhr = null
    const planen = () => {
      // Unregelmäßig, wie bei den früheren Passanten: Ein Takt läse sich als
      // Maschine, nicht als Schulflur.
      uhr = setTimeout(() => {
        const id = naechste.current++
        setSchatten((s) => [
          ...s.slice(-2),
          {
            id,
            nachLinks: Math.random() < 0.5,
            dauer: 2400 + Math.random() * 2400,
            breite: 18 + Math.random() * 14,
          },
        ])
        planen()
      }, 3800 + Math.random() * 7000)
    }
    planen()
    return () => clearTimeout(uhr)
  }, [])

  const entfernen = (id) => setSchatten((s) => s.filter((x) => x.id !== id))

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        bottom: 0,
        right: '3.5%',
        width: 74,
        height: '82%',
        background: '#242a2e',
        borderLeft: '3px solid #3a4045',
        borderTop: '3px solid #3a4045',
        borderRight: '3px solid #14181a',
        boxShadow: '0 0 16px rgb(0 0 0 / 0.5)',
      }}
    >
      {/* Milchglas: schwacher Schein von hinten, und davor die Schatten. Das
          overflow-hidden schneidet die Schatten an der Scheibenkante ab – sie
          sind nur IM Fenster zu sehen, nicht daneben auf dem Türblatt. */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '16%',
          top: '10%',
          width: '68%',
          height: '38%',
          // Deutlich heller als der erste Entwurf. Der Schatten davor ist dunkel,
          // und ein dunkler Schatten auf dunklem Glas hat keinen Kontrast – erst
          // wenn hinter der Scheibe wirklich Licht liegt, liest sich einer, der
          // davor vorbeigeht, als Verdunklung. Das brachte zugleich die Tür
          // besser zur Geltung: Jetzt sieht man, dass dahinter ein Flur brennt.
          background: 'linear-gradient(180deg, rgb(228 220 190 / 0.62), rgb(180 178 158 / 0.32))',
          border: '2px solid #14181a',
          boxShadow: 'inset 0 0 12px rgb(240 232 200 / 0.3)',
        }}
      >
        {schatten.map((s) => (
          <Schatten key={s.id} {...s} onFertig={() => entfernen(s.id)} />
        ))}
      </div>
      {/* Türklinke */}
      <span
        className="absolute rounded-full"
        style={{ left: '14%', top: '58%', width: 7, height: 7, background: '#8a6a3a' }}
      />
    </div>
  )
}

/** Die Bank, auf der die Wartenden sitzen. */
function Bank() {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ bottom: 0, left: 'calc(50% - 470px)', width: 236, height: 26 }}
    >
      {/* Sitzfläche */}
      <div
        className="absolute inset-x-0"
        style={{
          top: 2,
          height: 8,
          background: 'linear-gradient(180deg, #5a4830, #3d3020)',
          boxShadow: '0 2px 5px rgb(0 0 0 / 0.45)',
        }}
      />
      {/* Beine */}
      <div className="absolute" style={{ left: 14, top: 10, width: 5, height: 16, background: '#2f2618' }} />
      <div className="absolute" style={{ right: 14, top: 10, width: 5, height: 16, background: '#2f2618' }} />
    </div>
  )
}

export default function Vorzimmer({ fortschritt = 0 }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Brett />
      <div className="absolute" style={{ top: '11%', left: 'calc(50% + 150px)' }}>
        <Wanduhr fortschritt={fortschritt} />
      </div>
      <Tuer />
      <Bank />
    </div>
  )
}
