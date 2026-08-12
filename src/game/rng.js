/**
 * Deterministischer Zufall.
 *
 * Das ganze Spiel muss aus einem Seed reproduzierbar sein: derselbe Schüler
 * bekommt bei jedem Rendern dasselbe Gesicht, dieselbe Elternunterschrift.
 * Nur so lässt sich eine Fälschung überhaupt als Abweichung darstellen.
 */

/** mulberry32 – klein, schnell, gut genug verteilt für Grafik. */
export function makeRng(seed) {
  let a = seed >>> 0
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Wandelt einen beliebigen String in einen Zahlen-Seed (FNV-1a). */
export function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Bequeme Helfer rund um eine rng-Funktion. */
export function rngHelpers(rng) {
  const range = (min, max) => min + rng() * (max - min)
  return {
    rng,
    range,
    int: (min, max) => Math.floor(range(min, max + 1)),
    pick: (arr) => arr[Math.floor(rng() * arr.length)],
    chance: (p) => rng() < p,
    /** Zufallswert um 0 herum, mittige Werte wahrscheinlicher. */
    jitter: (amount) => (rng() + rng() - 1) * amount,
  }
}
