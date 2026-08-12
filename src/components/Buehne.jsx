/**
 * Die Bühne – skaliert das ganze Spiel auf die Fenstergröße.
 *
 * Der Schalter ist durchweg in festen Pixeln gebaut: 392 Pixel breite
 * Entschuldigungen, 11 Pixel hohe Schrift, ein 44x52-Porträt. Das ist für
 * Pixelkunst richtig so – eine Zeile, die auf halbe Pixel fällt, franst aus.
 *
 * Nur bleibt dadurch auf einem 27-Zoll-Monitor alles exakt so groß wie auf
 * einem 13-Zoll-Laptop, obwohl man doppelt so weit weg sitzt. Das Spiel wird
 * nicht kleiner, es wird bloß von weiter weg betrachtet, und die Schrift war
 * für Laptop-Abstand ausgelegt.
 *
 * Deshalb `zoom` und nicht `transform: scale`. Der Unterschied ist wichtig:
 * `zoom` skaliert das LAYOUT, prozentuale Positionen und Umbrüche gelten
 * weiter, und die Kulisse füllt das Fenster wie vorher. `scale` würde die
 * fertige Zeichnung nachträglich vergrößern – das ergäbe einen Briefmarken-
 * Rahmen mit schwarzen Balken drumherum.
 *
 * Wer es trotzdem anders will, kann zusätzlich die Browser-Vergrößerung
 * benutzen; sie multipliziert sich mit diesem Faktor.
 */

import { useEffect, useState } from 'react'

// Die Größe, für die die Kulisse gezeichnet wurde. Darunter wird nichts mehr
// verkleinert – ein zusammengeschobener Schreibtisch wäre schlimmer als ein
// abgeschnittener.
const ENTWURF = { breite: 1360, hoehe: 860 }

// Nach oben gedeckelt: Ab hier wird es nicht mehr besser lesbar, sondern nur
// noch grobschlächtig, und die handgesetzten Porträts fangen an zu klotzen.
const MAX = 1.6

export function skalaFuer(breite, hoehe) {
  const roh = Math.min(breite / ENTWURF.breite, hoehe / ENTWURF.hoehe)
  // Auf Viertelstufen gerundet, damit sich der Faktor beim Ziehen am
  // Fensterrand nicht bei jedem Pixel ändert.
  const gestuft = Math.round(roh * 4) / 4
  return Math.max(1, Math.min(MAX, gestuft))
}

/**
 * Um welchen Faktor ist dieses Element vergrößert?
 *
 * Wird von allem gebraucht, was mit der Maus gezogen wird. `zoom` lässt zwei
 * Koordinatensysteme auseinanderfallen: `clientX` und `getBoundingClientRect`
 * liefern SICHTBARE Pixel, `left`/`top` und `offsetWidth` dagegen die des
 * Layouts. Wer beide unbesehen verrechnet, dessen Papier läuft dem Zeiger um
 * den Faktor davon.
 *
 * Bewusst gemessen statt durchgereicht: So stimmt die Auskunft auch, wenn
 * jemand zusätzlich die Browser-Vergrößerung benutzt – die multipliziert
 * sich obendrauf und wüsste von keinem durchgereichten Wert.
 */
export function zoomFaktor(el) {
  const eltern = el?.offsetParent
  if (!eltern?.offsetWidth) return 1
  return eltern.getBoundingClientRect().width / eltern.offsetWidth
}

export default function Buehne({ children }) {
  const [skala, setSkala] = useState(() =>
    typeof window === 'undefined' ? 1 : skalaFuer(window.innerWidth, window.innerHeight),
  )

  useEffect(() => {
    const messen = () => setSkala(skalaFuer(window.innerWidth, window.innerHeight))
    messen()
    window.addEventListener('resize', messen)
    return () => window.removeEventListener('resize', messen)
  }, [])

  return (
    <div className="h-full w-full" style={{ zoom: skala }}>
      {children}
    </div>
  )
}
