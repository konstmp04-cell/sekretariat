/**
 * Handgesetzte Gesichtszüge.
 *
 * Alles hier ist Pixel für Pixel gezeichnet, nicht berechnet. Genau das ist
 * der Punkt: Auf so kleinem Raster entscheidet ein einzelner falscher Pixel
 * darüber, ob ein Gesicht müde, wütend oder freundlich wirkt – und das lässt
 * sich nicht aus Kurvenparametern ableiten, das muss man setzen.
 *
 * Die Silhouette (Kopf, Hals, Schultern, Haar) entsteht dagegen weiter
 * prozedural: Eine gefüllte Ellipse ist auf 44x52 Pixeln ohnehin exakt das,
 * was ein Zeichner hinsetzen würde – da gewinnt Handarbeit nichts.
 */

// --- Augen (Blickrichtung immer geradeaus) -----------------------------
//
// Sparsam mit Weiß: Große helle Flächen im Auge lesen sich sofort als
// Starren, und eine Reihe starrender Gesichter wirkt unheimlich. Die Iris
// füllt deshalb den größten Teil, Weiß bleibt ein schmaler Rand. Die frühere
// Variante `gross` hatte eine komplette weiße Zeile und war der Hauptgrund
// für den gruseligen Eindruck – sie ist ersatzlos entfallen.
export const AUGEN = {
  normal: [
    '.kkkk.',
    'kwiiwk',
    '.wiiw.',
    '..kk..',
  ],
  sanft: [
    '.kkkk.',
    'kiiiik',
    '.wiiw.',
    '..kk..',
  ],
  muede: [
    'kkkkkk',
    'kwiiwk',
    '.kiik.',
    '..kk..',
  ],
  schmal: [
    '.kkkk.',
    'kwiiwk',
    '.wiiw.',
    '..kk..',
  ],
}

// --- Brauen (in Haarfarbe) ---------------------------------------------
export const BRAUEN = {
  flach: [
    '......',
    'hhhhhh',
  ],
  schraeg: [
    '...hhh',
    'hhhh..',
  ],
  dick: [
    '.hhhh.',
    'hhhhhh',
  ],
  gebogen: [
    '.hhhh.',
    'hh..hh',
  ],
}

// --- Nasen (nur Schattenkante, keine Kontur) ---------------------------
export const NASEN = {
  klein: [
    '...',
    '..d',
    '.dd',
  ],
  breit: [
    '...',
    '.d.',
    'ddd',
  ],
  lang: [
    '..d',
    '..d',
    '.dd',
  ],
  haken: [
    '..d',
    '..d',
    '.dk',
  ],
}

// --- Münder -------------------------------------------------------------
// 'M' ist die Mundlinie – ein warmes Dunkelbraun statt des fast schwarzen
// Konturtons. Derselbe Ton wie die Außenkante ließ den Mund wie einen
// Schnitt im Gesicht wirken.
export const MUENDER = {
  neutral: [
    '.MMMM.',
  ],
  laecheln: [
    'M....M',
    '.MMMM.',
  ],
  besorgt: [
    '.MMMM.',
    'M....M',
  ],
  offen: [
    '.MMMM.',
    '.MmmM.',
    '..MM..',
  ],
}

export const AUGEN_ARTEN = Object.keys(AUGEN)
export const BRAUEN_ARTEN = Object.keys(BRAUEN)
export const NASEN_ARTEN = Object.keys(NASEN)
export const MUND_ARTEN = Object.keys(MUENDER)
