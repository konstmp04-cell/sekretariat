/**
 * Kleine Figuren, die durch den Flur gehen.
 *
 * Der Schalter zeigt bisher nur Brustbilder – für jemanden, der läuft,
 * braucht es ganze Figuren. Sie sind klein gehalten (8 x 17), so wie ein
 * Mensch im Hintergrund eben aussieht, und tragen dieselbe Symbolschrift wie
 * die Porträts: 's' ist Haut, 'h' ist Haar, 'c' ist Kleidung. Dadurch bekommt
 * jede Figur automatisch die Farben ihres eigenen Gesichts.
 *
 * Drei Dinge entscheiden, ob eine Pixelfigur läuft oder gleitet:
 *
 * 1. AUF UND AB. Beim Durchschwingen ist der Körper einen Pixel höher als
 *    beim Aufsetzen. Fehlt das, schwebt die Figur über dem Boden, ganz gleich
 *    wie gut die Beine gezeichnet sind. Es ist der wichtigste Punkt und der,
 *    den man am ehesten vergisst.
 *
 * 2. GEGENSCHWUNG. Der Arm geht vor, wenn das Bein derselben Seite zurückgeht.
 *    Schwingen beide gleich, sieht es aus wie Marschieren.
 *
 * 3. RUHIGER KOPF. Auf diesem Raster ist der Kopf sechs Pixel breit – jede
 *    Bewegung darin liest sich als Zucken. Er wird deshalb nur vom
 *    Körper-Bob mitgenommen und behält sonst seine Form.
 *
 * Vier Bilder reichen: Aufsetzen links, Durchschwingen, Aufsetzen rechts,
 * Durchschwingen. Mehr Bilder helfen auf dieser Größe nicht, sie verwischen
 * nur den Unterschied zwischen den Posen.
 */

// Blickrichtung ist immer nach rechts; nach links wird gespiegelt.
//
// Legende wie bei den Porträts:
//   .  durchsichtig   s  Haut   h  Haar   c  Oberteil
//   C  Hose   A  hinterer Arm (deutlich dunkler)   k  Schuhe
//
// Zwei verworfene Entwürfe stecken hier drin:
//
// Der erste war zehn Pixel breit mit acht Pixel Rumpf – eine Tonne, keine
// Schulter –, und die Arme lagen in Rumpffarbe an der Seite, verschmolzen
// also vollständig.
//
// Der zweite bekam eine Kontur, so wie die Porträts sie haben. Das war der
// eigentliche Fehler: Bei 44 x 52 Pixeln ist ein dunkler Rand ein Prozentsatz
// der Fläche, bei acht Pixeln Breite ist er die HÄLFTE der Figur. Heraus kam
// ein schwarzes Gekritzel. Was bei großen Rastern Form gibt, zerstört sie bei
// kleinen.
//
// Getrennt wird jetzt über Farbe statt über Linien: Oberteil hell, Hose
// dunkler, Arm noch dunkler, Schuhe fast schwarz. Der dunkle Flur liefert den
// Kontrast nach außen, den sonst die Kontur liefern müsste.
//
// Der Arm bekam zunächst denselben Ton wie die Hose (24 % dunkler) und war
// damit unsichtbar: Er ist genau EIN Pixel breit, und auf einem Pixel trägt
// ein Unterschied von 24 % nichts. Jetzt sind es 50 %.

/** Aufsetzen: Beine weit auseinander, Körper am tiefsten, Arm zurück. */
const SCHRITT_A = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhsssh.',
  '..ssss..',
  '...ss...',
  '..ccccc.',
  '.Acccccc',
  '.Acccccc',
  '..cccccc',
  '..ccccc.',
  '..CCCC..',
  '..CCCC..',
  '.CC..CC.',
  '.CC..CC.',
  'CC....CC',
  'CC....CC',
  'kk....kk',
]

/** Durchschwingen: Beine beieinander, Körper einen Pixel höher, Arm neben dem Rumpf. */
const SCHRITT_B = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhsssh.',
  '..ssss..',
  '...ss...',
  '..ccccc.',
  '..cccccA',
  '..cccccA',
  '..cccccA',
  '..ccccc.',
  '..CCCC..',
  '..CCCC..',
  '..CCCC..',
  '..CCCC..',
  '..CCCC..',
  '..CC.CC.',
  '..kk.kk.',
]

/** Aufsetzen rechts: Beinstellung gespiegelt, Arm vor. */
const SCHRITT_C = [
  '..hhhh..',
  '.hhhhhh.',
  '.hhsssh.',
  '..ssss..',
  '...ss...',
  '..ccccc.',
  '..cccccA',
  '..cccccA',
  '.AccccA.',
  '.Accccc.',
  '..CCCC..',
  '..CCCC..',
  '.CC..CC.',
  '.CC..CC.',
  'CC....CC',
  'CC....CC',
  'kk....kk',
]

/**
 * Die Bildfolge. B kommt zweimal vor, einmal nach jedem Aufsetzen – so
 * entsteht der gleichmäßige Wechsel aus Schritt und Durchschwung.
 */
export const LAUFBILDER = [SCHRITT_A, SCHRITT_B, SCHRITT_C, SCHRITT_B]

/**
 * Wie viele Pixel liegt dieses Bild höher als die Grundlinie?
 * Beim Durchschwingen hebt sich der Körper – siehe Punkt 1 oben.
 */
export const HUB = [0, 1, 0, 1]

/** Stehen statt gehen: Beine zusammen, kein Hub. */
export const STEHEN = SCHRITT_B

export const FIGUR_BREITE = 8
export const FIGUR_HOEHE = 17
