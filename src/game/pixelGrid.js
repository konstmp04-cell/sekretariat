/**
 * Winziges Pixel-Raster-Werkzeug.
 *
 * Ein Porträt ist hier ein Gitter aus Zeichen, kein Bild. Jedes Zeichen ist
 * ein SYMBOL, keine Farbe – 's' heißt "Haut", nicht "#e8bb96". Erst beim
 * Rendern wird eine Palette daraufgelegt. Dadurch lässt sich dieselbe
 * handgesetzte Zeichnung mit jedem Hautton und jeder Haarfarbe ausgeben,
 * ohne sie mehrfach zu zeichnen.
 *
 * Symbole:
 *   .  durchsichtig      s  Haut          d  Haut im Schatten
 *   l  Haut Glanzlicht   h  Haar          H  Haar im Schatten
 *   w  Augenweiß         i  Iris          k  Kontur / Dunkel
 *   c  Kleidung          C  Kleidung Schatten
 *   m  Lippe             f  Brillengestell
 */

export const LEER = '.'

export function makeGrid(w, h) {
  return { w, h, cells: new Array(w * h).fill(LEER) }
}

export function put(g, x, y, ch) {
  if (x < 0 || y < 0 || x >= g.w || y >= g.h) return
  g.cells[y * g.w + x] = ch
}

export function at(g, x, y) {
  if (x < 0 || y < 0 || x >= g.w || y >= g.h) return LEER
  return g.cells[y * g.w + x]
}

/** Waagerechte Linie – Grundbaustein für alle gefüllten Formen. */
export function hLine(g, x0, x1, y, ch) {
  for (let x = Math.round(x0); x <= Math.round(x1); x++) put(g, x, y, ch)
}

export function rect(g, x0, y0, w, h, ch) {
  for (let y = y0; y < y0 + h; y++) hLine(g, x0, x0 + w - 1, y, ch)
}

/**
 * Setzt eine handgezeichnete Teilgrafik ins Gitter.
 * `art` ist ein Array von Zeilen-Strings; '.' bedeutet "hier nichts ändern".
 * Positioniert wird über die MITTE, nicht die Ecke – dadurch bleiben Augen
 * und Mund auch bei unterschiedlich breiten Varianten zentriert.
 */
export function stampCentered(g, art, cx, cy, { mirror = false, only = null } = {}) {
  const h = art.length
  const w = art[0].length
  const x0 = Math.round(cx - w / 2)
  const y0 = Math.round(cy - h / 2)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = art[y][mirror ? w - 1 - x : x]
      if (ch === LEER) continue
      if (only && at(g, x0 + x, y0 + y) !== only) continue
      put(g, x0 + x, y0 + y, ch)
    }
  }
}

/**
 * Legt eine 1 Pixel breite Kontur um alles Gefüllte.
 *
 * Das ist der Schritt, der aus einer Ansammlung von Flächen eine Figur macht:
 * Ohne dunkle Außenkante zerfließen Haar, Haut und Kleidung ineinander,
 * sobald sie ähnliche Helligkeit haben.
 */
export function outline(g, ch = 'k') {
  const nachbarn = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  const treffer = []
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      if (at(g, x, y) !== LEER) continue
      if (nachbarn.some(([dx, dy]) => at(g, x + dx, y + dy) !== LEER && at(g, x + dx, y + dy) !== ch)) {
        treffer.push([x, y])
      }
    }
  }
  for (const [x, y] of treffer) put(g, x, y, ch)
}
