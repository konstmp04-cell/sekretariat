/**
 * Klangebene – vollständig synthetisiert, keine Audiodateien.
 *
 * Drei Grundsätze, an denen sich hier alles ausrichtet:
 *
 * 1. GESCHICHTET. Ein Stempelschlag ist kein Geräusch, sondern vier: dumpfer
 *    Aufprall, Gummi-Knack, Papier-Knirschen, heller Transient. Ein einzelner
 *    Oszillator klingt immer nach Piepser, egal wie man ihn stimmt.
 *
 * 2. NIE ZWEIMAL GLEICH. Bei identischer Wiedergabe entsteht der
 *    „Maschinengewehr-Effekt": Ab der dritten Wiederholung hört man, dass es
 *    eine Konserve ist. Jeder Klang variiert daher leicht in Tonhöhe, Härte
 *    und Timing.
 *
 * 3. EIN GEMEINSAMER RAUM. Ein kleiner Hall über allem. Beim Ton ist das
 *    exakt dasselbe Prinzip wie die begrenzte Farbpalette beim Bild – es
 *    macht aus Einzelteilen eine Welt statt einer Sammlung von Effekten.
 *
 * Die Klangbauer nehmen ihren AudioContext als Parameter entgegen, statt auf
 * einen globalen zuzugreifen. Dadurch lassen sie sich in einen
 * OfflineAudioContext rendern und tatsächlich überprüfen.
 */

const zufall = (min, max) => min + Math.random() * (max - min)

// --- Bausteine ----------------------------------------------------------

const rauschCache = new WeakMap()

/** Zwei Sekunden weißes Rauschen, pro Kontext einmal erzeugt. */
function rauschPuffer(ctx) {
  let puffer = rauschCache.get(ctx)
  if (puffer) return puffer
  const laenge = Math.floor(ctx.sampleRate * 2)
  puffer = ctx.createBuffer(1, laenge, ctx.sampleRate)
  const daten = puffer.getChannelData(0)
  for (let i = 0; i < laenge; i++) daten[i] = Math.random() * 2 - 1
  rauschCache.set(ctx, puffer)
  return puffer
}

/**
 * Rauschstoß durch ein Filter.
 * Der Startversatz im Puffer wird gewürfelt – sonst beginnt jeder Stoß mit
 * exakt derselben Wellenform und klingt wie ein Sample.
 */
function rauschen(ctx, ziel, t, { dauer, typ = 'bandpass', freq, q = 1, gain = 0.3, freqEnde }) {
  const quelle = ctx.createBufferSource()
  quelle.buffer = rauschPuffer(ctx)
  const versatz = Math.random() * 1.5

  const filter = ctx.createBiquadFilter()
  filter.type = typ
  filter.frequency.setValueAtTime(freq, t)
  if (freqEnde) filter.frequency.exponentialRampToValueAtTime(freqEnde, t + dauer)
  filter.Q.value = q

  const huelle = ctx.createGain()
  huelle.gain.setValueAtTime(0, t)
  huelle.gain.linearRampToValueAtTime(gain, t + Math.min(0.004, dauer * 0.2))
  huelle.gain.exponentialRampToValueAtTime(0.0001, t + dauer)

  quelle.connect(filter).connect(huelle).connect(ziel)
  quelle.start(t, versatz, dauer + 0.05)
  quelle.stop(t + dauer + 0.05)
}

/** Einzelner Ton mit Abklinghülle, optional mit Tonhöhensturz. */
function ton(ctx, ziel, t, { form = 'sine', freq, freqEnde, dauer, gain = 0.2 }) {
  const osz = ctx.createOscillator()
  osz.type = form
  osz.frequency.setValueAtTime(freq, t)
  if (freqEnde) osz.frequency.exponentialRampToValueAtTime(freqEnde, t + dauer)

  const huelle = ctx.createGain()
  huelle.gain.setValueAtTime(0, t)
  huelle.gain.linearRampToValueAtTime(gain, t + 0.003)
  huelle.gain.exponentialRampToValueAtTime(0.0001, t + dauer)

  osz.connect(huelle).connect(ziel)
  osz.start(t)
  osz.stop(t + dauer + 0.02)
}

// --- Die Klänge ---------------------------------------------------------

/**
 * Stempelschlag – der wichtigste Klang des Spiels.
 * Vier Schichten, dazu ein leicht variierender Anschlag: Ein zaghafter
 * Stempel klingt anders als ein wütender.
 */
function stempel(ctx, ziel, t) {
  const wucht = zufall(0.85, 1.15)

  // 1. Aufprall auf der Tischplatte – tief, kurz, mit Tonhöhensturz
  ton(ctx, ziel, t, {
    form: 'triangle',
    freq: zufall(95, 115),
    freqEnde: zufall(48, 58),
    dauer: 0.13,
    gain: 0.5 * wucht,
  })

  // 2. Gummi trifft Papier – der eigentliche „Knack"
  rauschen(ctx, ziel, t, {
    dauer: 0.07,
    freq: zufall(780, 1000),
    q: 1.4,
    gain: 0.34 * wucht,
  })

  // 3. Papier knirscht unter dem Druck
  rauschen(ctx, ziel, t + 0.008, {
    dauer: 0.1,
    freq: zufall(2200, 2900),
    freqEnde: 1200,
    q: 0.8,
    gain: 0.16 * wucht,
  })

  // 4. Heller Transient – gibt dem Schlag die Kante
  rauschen(ctx, ziel, t, {
    dauer: 0.025,
    typ: 'highpass',
    freq: 4200,
    gain: 0.2 * wucht,
  })
}

/** Papierrascheln – mehrere kurze Stöße statt eines gleichmäßigen Zischens. */
function papier(ctx, ziel, t) {
  const stoesse = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < stoesse; i++) {
    rauschen(ctx, ziel, t + i * zufall(0.03, 0.075), {
      dauer: zufall(0.05, 0.13),
      freq: zufall(1800, 3600),
      freqEnde: zufall(900, 1600),
      q: 0.7,
      // Gemessen gegen den Stempelschlag: Bei 0.05 lag das Rascheln rund
      // elfmal unter dessen Pegel und war schlicht nicht zu hören.
      gain: zufall(0.17, 0.3),
    })
  }
}

/** Summer bei Fehlentscheidung – hart, elektrisch, unangenehm. */
function summer(ctx, ziel, t) {
  const dauer = 0.34
  const osz = ctx.createOscillator()
  osz.type = 'square'
  osz.frequency.value = zufall(104, 116)

  const tief = ctx.createBiquadFilter()
  tief.type = 'lowpass'
  tief.frequency.value = 900

  // Tremolo: Das Knattern macht aus einem Ton ein Warnsignal.
  const zittern = ctx.createOscillator()
  zittern.type = 'square'
  zittern.frequency.value = 32
  const zitterTiefe = ctx.createGain()
  zitterTiefe.gain.value = 0.16

  const huelle = ctx.createGain()
  huelle.gain.setValueAtTime(0, t)
  huelle.gain.linearRampToValueAtTime(0.26, t + 0.012)
  huelle.gain.setValueAtTime(0.26, t + dauer - 0.05)
  huelle.gain.exponentialRampToValueAtTime(0.0001, t + dauer)

  zittern.connect(zitterTiefe).connect(huelle.gain)
  osz.connect(tief).connect(huelle).connect(ziel)

  osz.start(t)
  osz.stop(t + dauer)
  zittern.start(t)
  zittern.stop(t + dauer)
}

/**
 * Schulglocke.
 * Glocken klingen metallisch, weil ihre Teiltöne NICHT harmonisch liegen.
 * Genau diese schiefen Verhältnisse sind hier nachgebaut – mit ganzzahligen
 * Vielfachen käme eine Orgel heraus, keine Glocke.
 */
function glocke(ctx, ziel, t) {
  const grund = zufall(505, 540)
  const teiltoene = [
    [1.0, 0.3, 1.6],
    [2.02, 0.18, 1.2],
    [2.41, 0.13, 0.9],
    [3.04, 0.1, 0.7],
    [4.14, 0.07, 0.5],
    [5.38, 0.05, 0.35],
  ]
  for (const [verhaeltnis, gain, dauer] of teiltoene) {
    ton(ctx, ziel, t, { form: 'sine', freq: grund * verhaeltnis, dauer, gain })
  }
  // Anschlag des Klöppels
  rauschen(ctx, ziel, t, { dauer: 0.03, typ: 'highpass', freq: 3000, gain: 0.12 })
}

/** Knopfdruck – trocken und kurz, darf nie auffallen. */
function klick(ctx, ziel, t) {
  rauschen(ctx, ziel, t, { dauer: 0.018, typ: 'highpass', freq: 2600, gain: 0.14 })
  ton(ctx, ziel, t, { form: 'square', freq: zufall(620, 720), dauer: 0.02, gain: 0.05 })
}

/** Leise Bestätigung bei korrekter Bearbeitung – bewusst unaufdringlich. */
function haken(ctx, ziel, t) {
  ton(ctx, ziel, t, { form: 'sine', freq: 880, dauer: 0.09, gain: 0.14 })
  ton(ctx, ziel, t + 0.06, { form: 'sine', freq: 1320, dauer: 0.11, gain: 0.1 })
}

/**
 * Der Flur hinter der Tür, wenn die Pause beginnt.
 *
 * Kein Einzelklang, sondern ein An- und Abschwellen über mehrere Sekunden:
 * gedämpftes Stimmengewirr durch eine geschlossene Tür, dazu vereinzelt
 * Schritte. Bewusst dumpf gefiltert – man hört, dass es nebenan ist.
 */
function flur(ctx, ziel, t) {
  const dauer = 9

  const quelle = ctx.createBufferSource()
  quelle.buffer = rauschPuffer(ctx)
  quelle.loop = true

  // Zwei Filter hintereinander: Der Tiefpass nimmt die Schärfe (die Tür), der
  // schmale Bandpass legt den Schwerpunkt in den Bereich, in dem Stimmen
  // sitzen. Rauschen allein klingt nach Wasserhahn, nicht nach Menschen.
  const tuer = ctx.createBiquadFilter()
  tuer.type = 'lowpass'
  tuer.frequency.value = 620
  const stimmen = ctx.createBiquadFilter()
  stimmen.type = 'bandpass'
  stimmen.frequency.value = 380
  stimmen.Q.value = 0.8

  // Langsames Wogen: Ohne diese Schwankung bleibt es ein gleichförmiges
  // Rauschen, und eine Menschenmenge ist nie gleichförmig.
  const wogen = ctx.createOscillator()
  wogen.type = 'sine'
  wogen.frequency.value = 0.21
  const wogenTiefe = ctx.createGain()
  wogenTiefe.gain.value = 0.35

  // Gemessen: Bei einem Scheitel von 0.9 kam der Flur auf 0.46 Spitzenpegel
  // und lag damit bei 71 % des Stempelschlags – kein Hintergrund mehr,
  // sondern ein Vordergrund, der den wichtigsten Klang des Spiels zudeckt.
  // Auf Höhe des Papierraschelns ist er da, ohne sich vorzudrängen.
  const huelle = ctx.createGain()
  huelle.gain.setValueAtTime(0, t)
  huelle.gain.linearRampToValueAtTime(0.28, t + 1.6)
  huelle.gain.setValueAtTime(0.28, t + dauer - 3.5)
  huelle.gain.linearRampToValueAtTime(0, t + dauer)

  wogen.connect(wogenTiefe).connect(huelle.gain)
  quelle.connect(tuer).connect(stimmen).connect(huelle).connect(ziel)
  quelle.start(t)
  quelle.stop(t + dauer + 0.1)
  wogen.start(t)
  wogen.stop(t + dauer + 0.1)

  // Ein paar Schritte auf dem Flur, unregelmäßig verteilt.
  for (let i = 0; i < 7; i++) {
    const wann = t + zufall(1.2, dauer - 2)
    rauschen(ctx, ziel, wann, {
      dauer: 0.05,
      typ: 'lowpass',
      freq: zufall(240, 420),
      gain: zufall(0.03, 0.07),
    })
  }
}

export const KLAENGE = { stempel, papier, summer, glocke, klick, haken, flur }

// --- Wiedergabe ---------------------------------------------------------

let ctx = null
let master = null
let hallSend = null
let stumm = false

/**
 * Kurzer Raumhall aus abklingendem Rauschen.
 * Ohne ihn klingt jeder Effekt, als käme er aus dem Nichts; mit ihm sitzen
 * alle im selben Zimmer.
 */
function baueHall(context) {
  const laenge = Math.floor(context.sampleRate * 0.8)
  const puffer = context.createBuffer(2, laenge, context.sampleRate)
  for (let k = 0; k < 2; k++) {
    const daten = puffer.getChannelData(k)
    for (let i = 0; i < laenge; i++) {
      daten[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / laenge, 2.6)
    }
  }
  const hall = context.createConvolver()
  hall.buffer = puffer
  return hall
}

function bereit() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null

  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.55

  // Leichte Kompression fasst die Schichten zusammen und verhindert, dass
  // gleichzeitige Klänge übersteuern.
  const glue = ctx.createDynamicsCompressor()
  glue.threshold.value = -14
  glue.ratio.value = 3
  glue.attack.value = 0.004
  glue.release.value = 0.18

  const hall = baueHall(ctx)
  hallSend = ctx.createGain()
  hallSend.gain.value = 0.16
  hallSend.connect(hall).connect(master)

  master.connect(glue).connect(ctx.destination)
  return ctx
}

/** Muss aus einer echten Nutzerinteraktion heraus aufgerufen werden. */
export function tonFreischalten() {
  const c = bereit()
  if (c && c.state === 'suspended') c.resume()
}

export function spiele(name, verzoegerung = 0) {
  if (stumm) return
  const c = bereit()
  if (!c || !KLAENGE[name]) return
  if (c.state === 'suspended') c.resume()

  const t = c.currentTime + verzoegerung
  const bus = c.createGain()
  bus.connect(master)
  bus.connect(hallSend)
  KLAENGE[name](c, bus, t)
}

// --- Raumklang ----------------------------------------------------------

/**
 * Der Grundton des Zimmers, solange die Schicht läuft.
 *
 * Bis hierher löste der Spieler jeden einzelnen Klang selbst aus: Ohne seine
 * Hand war es vollkommen still. Ein Raum, in dem nichts passiert, solange man
 * nichts tut, ist kein Raum, sondern eine Oberfläche.
 *
 * Zwei Schichten, beide sehr leise: das Brummen der Leuchtstoffröhre (ein
 * tiefer Ton mit seiner ersten Oberwelle) und ein schmales Band tiefen
 * Rauschens für das Gebäude – Lüftung, Flur, Entferntes.
 *
 * Der Pegel liegt bewusst weit unter allem anderen. Er soll auffallen, wenn
 * er WEGFÄLLT, nicht wenn er da ist.
 */
let raum = null

export function raumklangStarten() {
  if (stumm || raum) return
  const c = bereit()
  if (!c) return
  if (c.state === 'suspended') c.resume()

  const aus = c.createGain()
  aus.gain.setValueAtTime(0, c.currentTime)
  aus.gain.linearRampToValueAtTime(1, c.currentTime + 2.5)
  aus.connect(master)

  const teile = []

  // Leuchtstoffröhre: Netzbrummen plus erste Oberwelle. Die Oberwelle ist
  // das, was eine Röhre von einem Trafo unterscheidet.
  for (const [freq, gain] of [[50, 0.014], [100, 0.008]]) {
    const osz = c.createOscillator()
    osz.type = 'sine'
    osz.frequency.value = freq
    const g = c.createGain()
    g.gain.value = gain
    osz.connect(g).connect(aus)
    osz.start()
    teile.push(osz)
  }

  // Das Gebäude.
  const quelle = c.createBufferSource()
  quelle.buffer = rauschPuffer(c)
  quelle.loop = true
  const tief = c.createBiquadFilter()
  tief.type = 'lowpass'
  tief.frequency.value = 300
  const g = c.createGain()
  g.gain.value = 0.02
  quelle.connect(tief).connect(g).connect(aus)
  quelle.start()
  teile.push(quelle)

  raum = { aus, teile }
}

export function raumklangStoppen() {
  if (!raum) return
  const c = ctx
  const { aus, teile } = raum
  raum = null
  if (!c) return
  // Ausblenden statt abwürgen: Ein hart abgeschnittener Dauerton knackt.
  aus.gain.cancelScheduledValues(c.currentTime)
  aus.gain.setValueAtTime(aus.gain.value, c.currentTime)
  aus.gain.linearRampToValueAtTime(0, c.currentTime + 0.6)
  for (const t of teile) {
    try {
      t.stop(c.currentTime + 0.7)
    } catch {
      // schon gestoppt
    }
  }
}

const SCHLUESSEL = 'sekretariat.ton'

export function istStumm() {
  return stumm
}

export function setzeStumm(wert) {
  stumm = wert
  // Der Grundton ist ein Dauerklang und würde sonst weiterlaufen, obwohl
  // gerade jemand ausdrücklich Ruhe verlangt hat.
  if (wert) raumklangStoppen()
  else raumklangStarten()
  try {
    localStorage.setItem(SCHLUESSEL, wert ? 'aus' : 'an')
  } catch {
    // ohne Speicher gilt die Einstellung nur für diese Sitzung
  }
}

export function ladeTonEinstellung() {
  try {
    stumm = localStorage.getItem(SCHLUESSEL) === 'aus'
  } catch {
    stumm = false
  }
  return stumm
}
