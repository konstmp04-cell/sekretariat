/**
 * Prozedurale Unterschriften.
 *
 * Kernstück der Fälschungsmechanik: `signaturePath(seed)` liefert für einen
 * Seed immer exakt dieselbe Kurve – das ist die echte Unterschrift eines
 * Elternteils, wie sie in der Schulakte hinterlegt ist.
 *
 * Eine Fälschung entsteht NICHT aus einem anderen Seed (das ergäbe eine
 * völlig fremde Unterschrift, viel zu leicht zu erkennen), sondern aus
 * demselben Seed mit `forgery > 0`. Dann werden die Stützpunkte leicht
 * verschoben: derselbe Schwung, dieselbe Länge, aber die Schlaufen sitzen
 * minimal daneben. Genau die Sorte Abweichung, die der Spieler im
 * Direktvergleich mit der Akte finden muss.
 */

import { makeRng, rngHelpers } from './rng.js'

/**
 * Catmull-Rom-Spline als kubische Béziers.
 * Läuft durch alle Stützpunkte und macht aus eckigen Punkten einen Fluss –
 * ohne das sieht jede Unterschrift aus wie ein Fieberkurven-Zickzack.
 */
function splineThrough(points) {
  if (points.length < 2) return ''
  let d = `M ${r(points[0][0])} ${r(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2[0])} ${r(p2[1])}`
  }
  return d
}

const r = (n) => Math.round(n * 100) / 100

/**
 * Die dreiste Fälschung: nicht daneben, sondern gar nicht erst versucht.
 *
 * Fällt bewusst aus dem sonstigen Verfahren heraus. Alle übrigen Fälschungen
 * entstehen aus DEMSELBEN Seed wie das Original, damit Schwung und Länge
 * stimmen und nur die Schlaufen danebensitzen – das ist die eigentliche
 * Prüfung. Hier gilt das Gegenteil: wenige riesige Schlaufen, viel zu wenige
 * Buchstaben, ein Strich, der oben aus dem Feld läuft. Jemand hat sich
 * dreißig Sekunden Zeit genommen.
 *
 * Sie wird ausschließlich auf ohnehin gefälschte Vorgänge gesetzt. Auf einer
 * gültigen Entschuldigung wäre sie keine Pointe, sondern eine Falle.
 */
function kritzelPfad(seed, width, height) {
  const { range, int, chance, jitter } = rngHelpers(makeRng(seed ^ 0x5bf03635))
  const base = height * 0.6

  // Eine überhohe Anfangsschlaufe: Der erste Buchstabe war noch ambitioniert.
  const pts = [
    [width * 0.04, base + range(height * 0.05, height * 0.2)],
    [width * 0.09, base - range(height * 0.7, height * 0.95)],
    [width * 0.15, base + range(0, height * 0.15)],
  ]

  // Danach nur noch Zacken – und zwar ungleichmäßige. Gleich hohe Spitzen in
  // gleichen Abständen lesen sich als Sinuskurve und damit als etwas, das
  // jemand SORGFÄLTIG gezeichnet hat. Der Witz liegt aber genau darin, dass
  // sich niemand Mühe gegeben hat: Jede Spitze bekommt eine eigene Höhe, die
  // Abstände schwanken, und die Grundlinie sackt nach rechts weg.
  const zacken = int(3, 5)
  let x = width * 0.18
  for (let i = 0; i < zacken; i++) {
    const breite = ((width * 0.68) / zacken) * range(0.7, 1.35)
    const sacken = (height * 0.1 * i) / zacken
    pts.push([x + breite * 0.45 + jitter(breite * 0.15), base - range(height * 0.2, height * 0.8) + sacken])
    pts.push([x + breite, base + range(0, height * 0.28) + sacken])
    x += breite
  }

  // Abschluss: ein Strich, der einfach nach rechts wegläuft und dabei
  // langsam die Lust verliert.
  pts.push([Math.min(width * 0.97, x + width * 0.12), base + range(height * 0.02, height * 0.16)])

  const extras = []
  // Ein durchgestrichener Ansatz – der erste Versuch war noch schlechter.
  if (chance(0.55)) {
    const y = base - height * 0.1
    extras.push(`M ${r(width * 0.1)} ${r(y)} L ${r(width * 0.4)} ${r(y - height * 0.08)}`)
  }
  // Ein einzelner Punkt irgendwo – als hätte jemand ein i vergessen und es
  // nachträglich an die falsche Stelle gesetzt.
  if (chance(0.4)) {
    const px = range(width * 0.3, width * 0.75)
    extras.push(`M ${r(px)} ${r(base - height * 0.62)} l 1.5 1.5`)
  }
  return { main: splineThrough(pts), extras, width, height }
}

/**
 * @param {number} seed         Identität der Unterschrift
 * @param {object} opts
 * @param {number} opts.width   Zeichenbreite
 * @param {number} opts.height  Zeichenhöhe
 * @param {number} opts.forgery 0 = echt. 0.2–1 = zunehmend schlampige Fälschung.
 * @param {boolean} opts.dreist Gar nicht erst versucht – siehe kritzelPfad.
 * @returns {{ main: string, extras: string[], width: number, height: number }}
 */
export function signaturePath(seed, { width = 260, height = 80, forgery = 0, dreist = false } = {}) {
  // Nur wenn ohnehin gefälscht: Eine echte Unterschrift darf unter keinen
  // Umständen als Krakelei erscheinen.
  if (dreist && forgery > 0) return kritzelPfad(seed, width, height)

  const { range, int, pick, chance, jitter } = rngHelpers(makeRng(seed))

  const base = height * 0.62
  const pts = []

  // Ein eigener Zufallsstrom nur für die Fälschungs-Abweichung. Dadurch
  // bleibt die Grundform bei forgery=0 bitgenau identisch zur echten Kurve.
  const fRng = rngHelpers(makeRng(seed ^ 0x9e3779b9))
  const off = () => (forgery === 0 ? 0 : fRng.jitter(forgery * height * 0.16))

  // --- Großbuchstabe: hohe Anfangsschlaufe, die sich selbst kreuzt ---
  const capTop = range(height * 0.05, height * 0.16)
  const capW = range(width * 0.10, width * 0.17)
  pts.push([width * 0.03, base + range(height * 0.05, height * 0.16) + off()])
  pts.push([width * 0.045 + capW * 0.25, base - height * 0.22 + off()])
  pts.push([width * 0.04 + capW * 0.55, capTop + off()])
  pts.push([width * 0.03 + capW * 0.95, base - height * 0.18 + off()])
  pts.push([width * 0.05 + capW * 0.5, base - height * 0.02 + off()])
  pts.push([width * 0.06 + capW, base - height * 0.10 + off()])

  // --- Fließtext: Hügel und Täler, dazwischen Ober- und Unterlängen ---
  const humps = int(5, 9)
  const bodyStart = width * 0.08 + capW
  const bodyEnd = width * 0.86
  const step = (bodyEnd - bodyStart) / humps

  for (let i = 0; i < humps; i++) {
    const x = bodyStart + step * i
    const tall = chance(0.22) // Oberlänge wie bei l, k, h
    const deep = !tall && chance(0.16) // Unterlänge wie bei g, y, p

    pts.push([x + step * 0.35 + jitter(step * 0.12), base - (tall ? range(height * 0.34, height * 0.5) : range(height * 0.12, height * 0.24)) + off()])

    if (deep) {
      pts.push([x + step * 0.62, base + range(height * 0.14, height * 0.26) + off()])
      pts.push([x + step * 0.5, base + range(height * 0.02, height * 0.1) + off()])
    }

    pts.push([x + step * 0.85 + jitter(step * 0.1), base + range(-height * 0.02, height * 0.06) + off()])
  }

  // --- Abschlussschwung nach rechts, oft weit über den Rest hinaus ---
  const flourish = chance(0.65)
  pts.push([width * 0.9, base - range(height * 0.05, height * 0.2) + off()])
  if (flourish) {
    pts.push([width * 0.97, base - range(height * 0.25, height * 0.42) + off()])
  }

  // --- Ergänzungen: i-Punkte, t-Striche, Unterstreichung ---
  const extras = []
  if (chance(0.55)) {
    const x = range(bodyStart + step, bodyEnd - step)
    const y = base - range(height * 0.42, height * 0.56) + off()
    extras.push(`M ${r(x)} ${r(y)} L ${r(x + range(width * 0.06, width * 0.13))} ${r(y - jitter(height * 0.04))}`)
  }
  if (chance(0.35)) {
    const y = base + range(height * 0.2, height * 0.3)
    extras.push(
      splineThrough([
        [width * 0.1, y],
        [width * 0.45, y + jitter(height * 0.05)],
        [width * 0.8, y - range(0, height * 0.06)],
      ]),
    )
  }
  if (chance(0.3)) {
    const x = range(bodyStart, bodyEnd)
    extras.push(`M ${r(x)} ${r(base - height * 0.46)} l ${r(range(1, 3))} ${r(range(1, 3))}`)
  }

  void pick // Signaturform bleibt bewusst rein numerisch – keine Buchstabenwahl.

  return { main: splineThrough(pts), extras, width, height }
}

/**
 * Wie stark weicht eine Fälschung von der echten Unterschrift ab?
 * Wird für das Balancing gebraucht: zu subtil ist frustrierend, zu grob ist
 * langweilig. Der Wert speist später die Schwierigkeitskurve.
 */
export function forgeryStrengthForDay(day) {
  if (day <= 4) return 0.9 // anfangs plump: krakelig, offensichtlich daneben
  if (day <= 7) return 0.6
  if (day <= 11) return 0.42
  return 0.28 // später richtig fies
}
