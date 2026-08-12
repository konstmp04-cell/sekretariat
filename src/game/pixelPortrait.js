/**
 * Baut aus einem Gesichts-Datensatz ein fertiges Pixel-Porträt.
 *
 * Aufteilung der Arbeit:
 *   prozedural  – Kopfsilhouette, Hals, Schultern, Haaransatz. Auf 44x52
 *                 Pixeln ist eine gefüllte Ellipse exakt das, was ein
 *                 Zeichner hinsetzen würde. Handarbeit gewinnt hier nichts.
 *   handgesetzt – Augen, Brauen, Nase, Mund. Hier entscheidet ein einzelner
 *                 Pixel über den Gesichtsausdruck (siehe portraitArt.js).
 */

import { makeGrid, put, at, hLine, stampCentered, outline, LEER } from './pixelGrid.js'
import { AUGEN, BRAUEN, NASEN, MUENDER } from './portraitArt.js'

export const BREITE = 44
export const HOEHE = 52

const CX = 22
const CY = 21 // Kopfmitte
const RY_OBEN = 14
const RY_UNTEN = 14

/** Halbe Kopfbreite in einer Zeile. */
function halbbreite(y, rx, jawPow) {
  const dy = y - CY
  if (dy <= 0) {
    const t = dy / RY_OBEN
    return rx * Math.sqrt(Math.max(0, 1 - t * t))
  }
  const t = dy / RY_UNTEN
  return rx * Math.sqrt(Math.max(0, 1 - Math.pow(t, jawPow)))
}

function farbe(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const kanal = (v) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)))
  const r = kanal((n >> 16) & 255)
  const g = kanal((n >> 8) & 255)
  const b = kanal(n & 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function paletteFuer(face) {
  return {
    s: face.skin,
    d: farbe(face.skin, -0.2),
    l: farbe(face.skin, 0.14),
    h: face.hair,
    H: farbe(face.hair, -0.42),
    // Gedecktes Weiß: Reinweiß im Auge wirkt auf diesem Raster wie ein
    // Scheinwerfer und lässt jeden Blick starr erscheinen.
    w: '#e3dbcc',
    i: farbe(face.hair, -0.35),
    k: '#231b17',
    c: face.shirt,
    C: farbe(face.shirt, -0.24),
    m: '#a4574c', // Lippe
    M: '#5e3a30', // Mundlinie – warm statt konturschwarz
    f: '#3d352c', // Brillenfassung – dunkel, aber nicht konturschwarz
  }
}

export function buildPortrait(face) {
  const g = makeGrid(BREITE, HOEHE)

  const rx = 8.5 + ((face.headW - 44) / 8) * 2.2 // ~8.5 bis 10.7
  const jawPow = 2.0 + (face.jaw - 0.5) * 3.7 // spitzes bis kantiges Kinn

  const kopfOben = Math.round(CY - RY_OBEN)
  const kinn = Math.round(CY + RY_UNTEN)
  const haaransatz = CY - 7
  const augenY = CY - 1
  // Augenabstand: Bei zu geringem Abstand kleben die Augen in der Mitte
  // zusammen und die Brillengläser verschmelzen zu einem Balken. Echte Augen
  // sitzen weiter außen, als man beim Zeichnen intuitiv annimmt.
  // Weit genug außen, dass die Brillengläser nicht verschmelzen – aber nicht
  // so weit, dass das Auge die Gesichtskante berührt und mit der Seitenpartie
  // des Haars kollidiert.
  const augenX = Math.round(rx * 0.56)

  // --- Schultern ------------------------------------------------------
  for (let y = 42; y < HOEHE; y++) {
    const hw = Math.min(21, 8 + (y - 42) * 2.4)
    hLine(g, CX - hw, CX + hw, y, 'c')
  }
  // Kragen: heller V-Ausschnitt, bricht die Schulterfläche auf
  for (let i = 0; i < 5; i++) {
    put(g, CX - 4 + i, 42 + i, 'C')
    put(g, CX + 4 - i, 42 + i, 'C')
  }

  // --- Hals (wird oben vom Kinn überdeckt) -----------------------------
  // Zehn statt acht Pixel breit: Ein schmaler Hals lässt den Kopf darauf
  // wirken, als säße er auf einem Stiel.
  for (let y = CY + 6; y < 44; y++) hLine(g, CX - 5, CX + 4, y, 's')

  // --- Kopf ------------------------------------------------------------
  const hwProZeile = []
  for (let y = kopfOben; y <= kinn; y++) {
    const hw = halbbreite(y, rx, jawPow)
    hwProZeile[y] = hw
    hLine(g, CX - hw, CX + hw, y, 's')
    // Schattenkante rechts, Glanzkante links – das Licht kommt von links
    // oben, wie die Schreibtischlampe im Spiel.
    hLine(g, CX + hw - 1.4, CX + hw, y, 'd')
    if (y < CY + 4) hLine(g, CX - hw, CX - hw + 0.4, y, 'l')
  }
  // Schatten des Kinns auf dem Hals
  hLine(g, CX - 4, CX + 3, kinn + 1, 'd')

  // --- Ohren -----------------------------------------------------------
  const ohrY = augenY + 3
  const ohrHw = hwProZeile[ohrY] ?? rx
  for (let y = ohrY - 1; y <= ohrY + 2; y++) {
    put(g, Math.round(CX - ohrHw - 1), y, 's')
    put(g, Math.round(CX + ohrHw + 1), y, 's')
  }

  // --- Haare -----------------------------------------------------------
  const stil = face.style
  const haarRx = rx + 1.2

  // Kappe: folgt der Schädelkuppe
  for (let y = kopfOben - 2; y <= haaransatz; y++) {
    const dy = y - CY
    const t = dy / (RY_OBEN + 1.6)
    const hw = haarRx * Math.sqrt(Math.max(0, 1 - t * t))
    if (hw > 0.5) hLine(g, CX - hw, CX + hw, y, 'h')
  }

  if (stil === 'pony') {
    // Gerade abgeschnittener Pony bis knapp über die Brauen
    for (let y = haaransatz + 1; y <= haaransatz + 3; y++) {
      const hw = (hwProZeile[y] ?? rx) + 0.6
      hLine(g, CX - hw, CX + hw, y, 'h')
    }
  }

  if (stil !== 'pony') {
    // Runder Haaransatz.
    //
    // Der gerade Schnitt quer über die Stirn war der Grund, warum jede Frisur
    // wie eine übergezogene Mütze aussah. Echtes Haar steht in der Stirnmitte
    // höher und fällt zu den Schläfen hin ab – diese Wölbung wird hier aus
    // der Kappe herausgeschnitten.
    for (let x = Math.round(CX - rx); x <= Math.round(CX + rx); x++) {
      const t = (x - CX) / rx
      const hoch = Math.round(2.6 * (1 - t * t))
      for (let y = haaransatz - hoch + 1; y <= haaransatz; y++) {
        const ch = at(g, x, y)
        if (ch === 'h' || ch === 'H') put(g, x, y, 's')
      }
    }
  }

  // Seitenpartie.
  //
  // Entscheidend: Sie darf NICHT der Kieferlinie folgen. Tut sie das, läuft
  // langes Haar zum Kinn hin spitz zusammen und verschwindet – es las sich
  // dadurch wie ein Kurzhaarschnitt. Echtes langes Haar behält seine Breite,
  // fällt an der Wange vorbei und liegt am Ende auf den Schultern. Zusammen
  // mit der Strähnenbreite ist das auf diesem Raster der einzige wirklich
  // tragfähige Unterschied zwischen den Frisuren.
  // Pony und Locken hatten für sich genommen nur zwei bis vier Zeilen
  // Seitenhaar und lasen sich damit trotz weiblichen Namens kurz. Eine
  // Mindestlänge sorgt dafür, dass das Gesicht in jedem Fall von Haar
  // gerahmt wird – auf diesem Raster ist genau das der tragende Unterschied.
  const grundLaenge = { kurz: 0, pony: 2, mittel: 12, zopf: 21, lang: 27, locken: 4 }[stil] ?? 0
  const seitenLaenge = face.weiblich ? Math.max(grundLaenge, 19) : grundLaenge
  const langeHaare = seitenLaenge >= 16
  const straehne = langeHaare ? 4.2 : stil === 'mittel' ? 2.6 : 1.6

  for (let y = haaransatz; y <= haaransatz + seitenLaenge; y++) {
    const t = (y - haaransatz) / Math.max(1, seitenLaenge)
    const kopfHw = hwProZeile[y] ?? 0
    // Unterhalb der Wange die Breite halten statt dem Kinn zu folgen,
    // nach unten hin leicht ausstellen.
    const aussen = langeHaare
      ? Math.max(kopfHw, rx * (0.86 + t * 0.18))
      : Math.max(kopfHw, rx * 0.5)
    const breite = straehne + (langeHaare ? t * 1.4 : 0)
    // Die Strähne liegt NEBEN dem Kopf, nicht darüber.
    //
    // Zuvor wuchs sie von der Kopfkante nach innen und ragte damit bis zu
    // drei Pixel in die Augenpartie hinein. Weil das Haar vor den Augen
    // gezeichnet wird, landeten die Augen anschließend auf den Haaren – sie
    // wirkten dadurch aufgesetzt, als läge das Haar dahinter. Jetzt beginnt
    // die Strähne an der Silhouette und wächst nach außen.
    hLine(g, CX - aussen - breite, CX - aussen - 0.2, y, 'h')
    hLine(g, CX + aussen + 0.2, CX + aussen + breite, y, 'h')
  }

  if (stil === 'locken') {
    // Unregelmäßige Beulen auf der Kappe – Locken entstehen auf diesem
    // Raster nicht durch Kringel, sondern durch eine gestörte Außenkante.
    for (let n = 0; n < 14; n++) {
      const a = Math.PI * (0.06 + (n / 13) * 0.88)
      const bx = Math.round(CX - Math.cos(a) * (haarRx + 0.8))
      const by = Math.round(CY - 4 - Math.sin(a) * (RY_OBEN + 1))
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > 1 + (n % 2)) continue
          if (at(g, bx + dx, by + dy) === LEER || at(g, bx + dx, by + dy) === 's') {
            put(g, bx + dx, by + dy, 'h')
          }
        }
      }
    }
  }

  if (stil === 'zopf') {
    for (let y = CY + 2; y <= CY + 8; y++) {
      const hw = (hwProZeile[y] ?? rx) + 2
      hLine(g, CX + hw - 1, CX + hw + 1, y, 'h')
    }
  }

  // Haarschatten an der rechten Kante
  for (let y = kopfOben - 2; y <= haaransatz + seitenLaenge; y++) {
    for (let x = CX; x < BREITE; x++) {
      if (at(g, x, y) === 'h' && at(g, x + 1, y) !== 'h') put(g, x, y, 'H')
    }
  }

  // Kante am Haaransatz.
  //
  // Die äußere Kontur trennt nur Figur von Hintergrund – innerhalb der
  // Silhouette stößt Haar direkt auf Haut. Bei blondem Haar auf hellem Teint
  // liegen beide Töne so nah beieinander, dass die Frisur mit der Stirn
  // verschwimmt und der Kopf kahl wirkt. Eine dunklere Haarreihe entlang
  // dieser Grenze stellt die Trennung wieder her.
  const haut = new Set(['s', 'l', 'd'])
  const kanten = []
  for (let y = 0; y < HOEHE; y++) {
    for (let x = 0; x < BREITE; x++) {
      if (at(g, x, y) !== 'h') continue
      const grenzt =
        haut.has(at(g, x, y + 1)) || haut.has(at(g, x - 1, y)) || haut.has(at(g, x + 1, y))
      if (grenzt) kanten.push([x, y])
    }
  }
  for (const [x, y] of kanten) put(g, x, y, 'H')

  // --- Gesichtszüge ----------------------------------------------------
  // Eine Braue sitzt einen Pixel höher als die andere.
  //
  // Vollkommene Symmetrie ist einer der verlässlichsten Auslöser für den
  // unheimlichen Eindruck: Kein echtes Gesicht ist spiegelgleich. Ein
  // einziger Pixel Versatz genügt, um die Puppenhaftigkeit zu brechen.
  const braue = BRAUEN[face.brauen] ?? BRAUEN.flach
  stampCentered(g, braue, CX - augenX, augenY - 4)
  stampCentered(g, braue, CX + augenX, augenY - 4 + face.brauenVersatz, { mirror: true })

  stampCentered(g, AUGEN[face.augen] ?? AUGEN.normal, CX - augenX, augenY)
  stampCentered(g, AUGEN[face.augen] ?? AUGEN.normal, CX + augenX, augenY, { mirror: true })

  stampCentered(g, NASEN[face.nase] ?? NASEN.klein, CX, augenY + 5)
  // Der Mund ist auf diesem Raster fünf Pixel breit. Ihn in Lippenfarbe
  // statt in Konturschwarz zu setzen, ist deshalb einer der ganz wenigen
  // Hebel, die im Gesicht selbst überhaupt noch etwas ausmachen.
  const mundArt = (MUENDER[face.mund] ?? MUENDER.neutral).map((zeile) =>
    face.weiblich ? zeile.split('M').join('m') : zeile,
  )
  stampCentered(g, mundArt, CX, augenY + 10)

  if (face.glasses) {
    // Halbrand statt Vollrand.
    //
    // Zuvor lag der Rahmen genau auf den äußeren Zeilen und Spalten des
    // Auges: Er überschrieb die Wimpernlinie und beide Außenkanten, sodass
    // vom Auge nur ein kleines Rechteck übrig blieb – rundum eingefasst von
    // fast Schwarz. Das liest sich zwangsläufig als Schutzbrille.
    //
    // Auf diesem Raster ist für einen Vollrand schlicht kein Platz: Ein
    // Auge ist sechs mal vier Pixel groß, ein umlaufender Rahmen frisst
    // davon die Hälfte. Der Halbrand liegt vollständig ÜBER dem Auge und
    // lässt es dadurch unangetastet.
    for (const seite of [-1, 1]) {
      const ex = CX + seite * augenX
      const aussen = seite < 0 ? ex - 4 : ex + 3
      const innen = seite < 0 ? ex + 3 : ex - 4

      // Obere Schiene
      for (let x = Math.min(aussen, innen); x <= Math.max(aussen, innen); x++) {
        put(g, x, augenY - 3, 'f')
      }
      // Nur die äußere Fassung reicht nach unten – sie steht neben dem Auge
      for (let y = augenY - 2; y <= augenY + 1; y++) put(g, aussen, y, 'f')
      // Untere Ecke, unterhalb des Auges: Ohne sie bleibt von der Brille nur
      // ein Strich, und das An- oder Absetzen wäre als Fälschungsmerkmal
      // beim Lichtbildabgleich kaum zu erkennen.
      for (let i = 0; i < 3; i++) put(g, aussen - seite * i, augenY + 2, 'f')
      // Bügel Richtung Ohr
      put(g, aussen + seite, augenY - 3, 'f')
      put(g, aussen + seite * 2, augenY - 2, 'f')
    }
    // Steg über der Nase
    for (let x = CX - augenX + 3; x <= CX + augenX - 3; x++) put(g, x, augenY - 3, 'f')
  }

  if (face.freckles) {
    for (const [dx, dy] of [[-5, 1], [-3, 2], [4, 1], [6, 2], [-6, 3], [5, 3]]) {
      if (at(g, CX + dx, augenY + 3 + dy) === 's') put(g, CX + dx, augenY + 3 + dy, 'd')
    }
  }

  outline(g, 'k')
  return g
}
