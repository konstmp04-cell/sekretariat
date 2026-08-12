/**
 * Prozedurale Gesichter für Passfotos.
 *
 * Ziel ist nicht Realismus, sondern Wiedererkennbarkeit: Der Spieler muss ein
 * Foto mit dem Menschen am Schalter vergleichen können, und wiederkehrende
 * Figuren müssen über Tage hinweg identisch aussehen. Darum alles aus dem
 * Seed – niemals aus Math.random().
 */

import { makeRng, rngHelpers } from './rng.js'
import { AUGEN_ARTEN, BRAUEN_ARTEN, NASEN_ARTEN } from './portraitArt.js'

const SKIN = ['#f2d3b8', '#e8bb96', '#d69f76', '#b97f56', '#8d5a3b', '#63402a']
// Kein Grau und kein Weiß: Auf hellem Teint lesen sich diese Töne als Glatze,
// und an einem Schüler wirkt ergrautes Haar ohnehin falsch.
const HAIR = ['#1c1512', '#2f2119', '#4a3223', '#6b4a2c', '#8d6a3f', '#c19a5b', '#7a2f2f']
const SHIRT = ['#3d4f63', '#5a5f4a', '#6b4a4a', '#414459', '#2f5350', '#6d5b3f']

/**
 * Frisuren getrennt nach Lesart.
 *
 * Auf 44x52 Pixeln entscheidet praktisch allein die Haarsilhouette darüber,
 * wie eine Figur gelesen wird - für Gesichtszüge ist schlicht kein Platz.
 * Wurde die Frisur unabhängig vom Namen gewürfelt, bekam eine Lena einen
 * Kurzhaarschnitt und wirkte damit falsch. Das sind Bildkonventionen des
 * Mediums, keine Aussage über Menschen; sie sorgen dafür, dass Foto und
 * Akteneintrag zusammenpassen.
 */
const FRISUREN_W = ['lang', 'lang', 'lang', 'zopf', 'zopf', 'mittel', 'mittel', 'pony', 'locken']
const FRISUREN_M = ['kurz', 'kurz', 'kurz', 'kurz', 'mittel', 'pony', 'locken']

export function frisurenFuer(weiblich) {
  return weiblich ? FRISUREN_W : FRISUREN_M
}

/**
 * Wie stark weicht ein falsches Passfoto vom Original ab?
 * Gegenstück zu `forgeryStrengthForDay` bei den Unterschriften.
 */
export function fotoAbweichungFuerTag(tag) {
  if (tag <= 8) return 0.85 // zwei auffällige Unterschiede
  if (tag <= 10) return 0.55 // einer
  return 0.3 // nur noch ein feines Merkmal
}

/** Wählt aus einer Liste einen anderen Wert als den aktuellen. */
function andersAls(liste, aktuell, pick) {
  const rest = [...new Set(liste)].filter((x) => x !== aktuell)
  return rest.length ? pick(rest) : aktuell
}

/**
 * Erzeugt ein Passfoto, das die Person NUR FAST zeigt.
 *
 * Genau wie bei den Unterschriften wird nicht ein fremdes Gesicht erzeugt –
 * das erkennt jeder auf Anhieb und wäre keine Prüfung. Stattdessen werden
 * gezielt einzelne Merkmale verschoben.
 *
 * Ausgewählt wird nur aus Merkmalen, die auf 44x52 Pixeln überhaupt sichtbar
 * sind. Nase, Mund und Sommersprossen sind hier drei Pixel groß – ein
 * Unterschied daran wäre nicht subtil, sondern schlicht unfair.
 */
export function abweichendesFoto(face, staerke, seed) {
  const { pick, range } = rngHelpers(makeRng((seed ^ 0x5bf03635) >>> 0))
  const kopie = { ...face }

  const AUFFAELLIG = ['haarfarbe', 'frisur', 'brille']
  const MITTEL = ['augen', 'brauen', 'kopfform']

  let merkmale
  if (staerke >= 0.7) {
    const a = pick(AUFFAELLIG)
    merkmale = [a, pick(AUFFAELLIG.filter((x) => x !== a))]
  } else if (staerke >= 0.45) {
    merkmale = [pick(AUFFAELLIG)]
  } else {
    merkmale = [pick(MITTEL)]
  }

  for (const merkmal of merkmale) {
    switch (merkmal) {
      case 'haarfarbe':
        kopie.hair = andersAls(HAIR, face.hair, pick)
        break
      case 'frisur':
        // Nur innerhalb derselben Lesart, sonst wäre die Abweichung keine
        // Feinheit mehr, sondern eine offensichtlich andere Person.
        kopie.style = andersAls(frisurenFuer(face.weiblich), face.style, pick)
        break
      case 'brille':
        kopie.glasses = !face.glasses
        break
      case 'augen':
        kopie.augen = andersAls(AUGEN_ARTEN, face.augen, pick)
        break
      case 'brauen':
        kopie.brauen = andersAls(BRAUEN_ARTEN, face.brauen, pick)
        break
      case 'kopfform':
        kopie.headW = Math.max(44, Math.min(52, face.headW + (face.headW > 48 ? -5 : 5)))
        kopie.jaw = Math.max(0.5, Math.min(0.88, face.jaw + range(0.2, 0.3) * (face.jaw > 0.7 ? -1 : 1)))
        break
      default:
        break
    }
  }

  return kopie
}

export function makeFace(seed, weiblich) {
  const { range, int, pick, chance } = rngHelpers(makeRng(seed))

  // Immer ziehen, auch wenn das Geschlecht vorgegeben ist: So bleibt der
  // Zufallsstrom identisch und ein Seed ergibt stets dieselben Merkmale.
  const gewuerfelt = chance(0.5)
  const w = weiblich === undefined ? gewuerfelt : weiblich

  const style = pick(frisurenFuer(w))

  return {
    weiblich: w,
    skin: pick(SKIN),
    hair: pick(HAIR),
    shirt: pick(SHIRT),
    style,
    // Kopfform. Breite und Höhe liegen bewusst nah beieinander: sobald die
    // Höhe deutlich überwiegt, kippt das Gesicht ins Außerirdische.
    headW: range(44, 52),
    headH: range(44, 50),
    jaw: w ? range(0.5, 0.7) : range(0.64, 0.88), // spitzes bis kantiges Kinn
    // Augen: bewusst klein gehalten. Große weiße Flächen lesen sich sofort
    // als Cartoon-Glupschaugen und zerstören den nüchternen Passfoto-Ton.
    eyeGap: range(18, 22),
    eyeSize: w ? range(2.9, 3.4) : range(2.5, 3.1),
    eyeY: range(-1, 2),
    // Brauen: dünn und flach. Steile, dicke Brauen lassen jedes Gesicht
    // grimmig wirken – bei 30 Schülern am Tag wird das schnell absurd.
    browAngle: range(-4, 5),
    browThick: range(1.1, 1.9),
    browY: range(7.5, 10),
    // Nase und Mund
    noseLen: range(6, 11),
    noseW: range(2.6, 4.6),
    mouthW: range(9, 15),
    mouthCurve: range(-1.4, 2.6), // negativ = besorgt, positiv = Grinsen
    mouthY: range(15, 19),
    // Auswahl der handgesetzten Gesichtszüge für das Pixel-Porträt.
    // Ein „müder" Blick plus „besorgter" Mund erzählt bereits eine
    // Geschichte, ohne dass eine einzige Zeile Dialog geschrieben wäre.
    augen: pick(AUGEN_ARTEN),
    // Kräftige Brauen wirken bei kleinen Gesichtern sehr männlich.
    brauen: pick(w ? ['flach', 'gebogen'] : BRAUEN_ARTEN),
    nase: pick(NASEN_ARTEN),
    // Ein flacher Strich als Mund lässt jedes Gesicht ausdruckslos wirken;
    // etwas mehr Freundlichkeit nimmt der Reihe das Puppenhafte.
    mund: pick(['laecheln', 'laecheln', 'neutral', 'besorgt', 'offen']),
    // Ein Pixel Versatz zwischen den Brauen bricht die perfekte Symmetrie.
    brauenVersatz: chance(0.55) ? 1 : 0,
    // Extras
    glasses: chance(0.22),
    freckles: chance(0.18),
    ears: range(3.0, 4.2),
    hairVolume: range(0.85, 1.25),
    fringe: int(3, 6),
  }
}
