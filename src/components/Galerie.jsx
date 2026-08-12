/**
 * Entwickler-Ansicht unter #galerie.
 *
 * Gesichter einzeln durchzuklicken taugt nicht zur Beurteilung – Fehler im
 * Generator zeigen sich erst in der Masse (immer dieselbe Frisur, nie ein
 * Lächeln, alle gleich alt). Diese Ansicht stellt viele Porträts nebeneinander
 * und macht solche Muster sofort sichtbar.
 */

import { useMemo } from 'react'
import { makeFace } from '../game/face.js'
import { makeApplicant, VERSTOSS } from '../game/applicant.js'
import PixelPortrait from './PixelPortrait.jsx'
import Portrait from './Portrait.jsx'

/**
 * Gegenüberstellung für den Lichtbildabgleich: links die Person am Schalter,
 * rechts das Foto in der Akte. Nur so lässt sich beurteilen, ob die
 * Abweichung an einem bestimmten Tag fair erkennbar ist – im Spiel selbst
 * sieht man nie beide Fassungen desselben Falls nebeneinander.
 */
function FotoVergleich({ tag }) {
  const faelle = useMemo(
    () => Array.from({ length: 4 }, (_, i) => makeApplicant(tag, i * 3 + 1, VERSTOSS.FOTO)),
    [tag],
  )
  return (
    <div className="mb-8">
      <p className="mb-2 font-form text-[11px] uppercase tracking-widest text-paper-400">
        Tag {tag}
      </p>
      <div className="flex flex-wrap gap-6">
        {faelle.map((a) => (
          <div key={a.id} className="flex gap-1 border border-desk-600 p-1">
            <div>
              <PixelPortrait face={a.face} scale={2} />
              <p className="mt-1 text-center font-form text-[8px] text-paper-400/70">Schalter</p>
            </div>
            <div>
              <PixelPortrait face={a.aktenFoto} scale={2} />
              <p className="mt-1 text-center font-form text-[8px] text-paper-400/70">Akte</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Galerie() {
  const seeds = useMemo(() => Array.from({ length: 36 }, (_, i) => 1000 + i * 7919), [])

  return (
    <div className="h-full overflow-auto bg-desk-900 p-8">
      <h1 className="mb-1 font-form text-sm uppercase tracking-[0.2em] text-brass">
        Porträt-Galerie
      </h1>
      <p className="mb-6 font-form text-[11px] text-paper-400">
        Oben Pixel-Art, unten die alte Vektor-Fassung – gleiche Seeds.
      </p>

      <h2 className="mb-3 font-form text-[11px] uppercase tracking-widest text-paper-200">
        Lichtbildabgleich · Person gegen Aktenfoto
      </h2>
      <FotoVergleich tag={7} />
      <FotoVergleich tag={10} />
      <FotoVergleich tag={12} />

      {/* Getrennt gegenübergestellt: Ob die Lesart trägt, sieht man erst,
          wenn beide Gruppen nebeneinander stehen. */}
      {[
        { titel: 'Weiblich gelesen', weiblich: true },
        { titel: 'Männlich gelesen', weiblich: false },
      ].map((gruppe) => (
        <div key={gruppe.titel} className="mb-8">
          <h2 className="mb-3 font-form text-[11px] uppercase tracking-widest text-paper-200">
            {gruppe.titel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {seeds.slice(0, 18).map((s) => (
              <div key={s} className="border border-desk-600 p-[2px]">
                <PixelPortrait face={makeFace(s, gruppe.weiblich)} scale={2} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="mb-3 font-form text-[11px] uppercase tracking-widest text-paper-400">
        Vektor (alt)
      </h2>
      <div className="flex flex-wrap gap-2 opacity-70">
        {seeds.slice(0, 12).map((s) => (
          <div key={s} className="border border-desk-600 p-[2px]">
            <Portrait face={makeFace(s)} size={88} id={`gv-${s}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
