/**
 * Erzeugt die Schüler, die am Schalter stehen.
 *
 * Wichtig fürs Balancing: Verstöße werden GEZIELT eingebaut, nicht zufällig
 * gestreut. Bei reinem Zufall gibt es Tage ohne einen einzigen Fehler (fühlt
 * sich leer an) und Tage mit lauter Fälschungen (fühlt sich unfair an). Die
 * Quote wird deshalb vorgegeben und pro Tag durchgemischt.
 */

import { makeRng, hashSeed, rngHelpers } from './rng.js'
import { VERSTOSS, REGELN, neueRegeln } from './regeln.js'
import { makeFace, abweichendesFoto, fotoAbweichungFuerTag } from './face.js'
import { forgeryStrengthForDay } from './signature.js'
import { auftritteAmTag } from './figuren.js'
import { anweisungFuerTag, passendMachen } from './anweisungen.js'

// Nach Geschlecht getrennt, damit die Entschuldigung „meine Tochter Lena"
// bzw. „mein Sohn Jonas" schreiben kann. Vorher wurde Sohn/Tochter daraus
// abgeleitet, wer unterschrieben hat – dadurch stand auf den Notizen
// regelmäßig „Meine Tochter Noah". Solche Widersprüche sind Gift: Der
// Spieler sieht einen Fehler, der laut Regelwerk keiner ist, und lernt,
// seiner eigenen Beobachtung zu misstrauen.
const VORNAMEN_W = [
  'Lena', 'Mia', 'Emma', 'Hannah', 'Marie', 'Sofia', 'Clara', 'Nele', 'Ida',
  'Frieda', 'Amira', 'Leyla', 'Zoe', 'Nora', 'Ayla',
]

const VORNAMEN_M = [
  'Jonas', 'Elias', 'Noah', 'Ben', 'Luca', 'Felix', 'Paul', 'Anton', 'Moritz',
  'Theo', 'Yusuf', 'Kenan', 'Milan', 'Aaron', 'Emil',
]

const NACHNAMEN = [
  'Brandt', 'Kowalski', 'Vogt', 'Hensel', 'Ritter', 'Baumann', 'Sander', 'Kern',
  'Lindner', 'Petrov', 'Yilmaz', 'Ostermann', 'Hofer', 'Reinke', 'Wagner', 'Sturm',
  'Dietrich', 'Falk', 'Berger', 'Novak', 'Abdi', 'Krause', 'Weiss', 'Marek',
]

export const KLASSEN = ['7a', '7b', '8a', '8b', '8c', '9a', '9b', '10a', '10b', '10c']

const FAECHER = ['Mathematik', 'Deutsch', 'Englisch', 'Biologie', 'Geschichte', 'Physik', 'Chemie']

/**
 * Welche Klassen schreiben an diesem Tag Klausur?
 *
 * Anders als alle bisherigen Regeln ist das kein Vergleich zweier Dokumente,
 * sondern ein Nachschlagen: Der Plan liegt auf dem Tisch und gilt für den
 * ganzen Tag. Man muss ihn sich merken oder jedes Mal hinsehen – und er
 * wechselt jeden Morgen.
 */
export function klausurplan(day) {
  const { pick, int } = rngHelpers(makeRng(hashSeed(`klausur-${day}`)))
  const anzahl = int(2, 3)
  const gewaehlt = []
  while (gewaehlt.length < anzahl) {
    const k = pick(KLASSEN)
    if (!gewaehlt.some((e) => e.klasse === k)) gewaehlt.push({ klasse: k, fach: pick(FAECHER) })
  }
  return gewaehlt
}

export function hatKlausur(day, klasse) {
  return klausurplan(day).some((e) => e.klasse === klasse)
}

const PRAXEN = [
  { name: 'Praxis Dr. med. Hoffmann', zusatz: 'Allgemeinmedizin', arzt: 'Dr. med. R. Hoffmann' },
  { name: 'Gemeinschaftspraxis Am Markt', zusatz: 'Innere Medizin', arzt: 'Dr. med. S. Bauer' },
  { name: 'Kinder- und Jugendarztpraxis', zusatz: 'Pädiatrie', arzt: 'Dr. med. T. Winkler' },
  { name: 'Praxis Dr. Neumann & Kollegen', zusatz: 'Allgemeinmedizin', arzt: 'Dr. med. A. Neumann' },
  { name: 'Facharztzentrum Nordstadt', zusatz: 'HNO-Heilkunde', arzt: 'Dr. med. M. Özdemir' },
]

const GRUENDE = [
  { text: 'Magen-Darm-Infekt', tage: 2, glaubwuerdig: true },
  { text: 'Fieber und Halsschmerzen', tage: 3, glaubwuerdig: true },
  { text: 'Zahnarzttermin', tage: 1, glaubwuerdig: true },
  { text: 'Beerdigung der Großmutter', tage: 1, glaubwuerdig: false },
  { text: 'Migräne', tage: 1, glaubwuerdig: true },
  { text: 'Familiärer Notfall', tage: 2, glaubwuerdig: false },
  { text: 'Grippaler Infekt', tage: 4, glaubwuerdig: true },
  { text: 'Umzug der Familie', tage: 1, glaubwuerdig: false },
  { text: 'Arzttermin beim Facharzt', tage: 1, glaubwuerdig: true },
  { text: 'Verstauchter Knöchel', tage: 3, glaubwuerdig: true },
]

// {von} und {der} werden durch das tatsächlich unterzeichnende Elternteil
// ersetzt. Feste Nennungen führten sonst dazu, dass der Schüler „mein Vater
// hat das geschrieben" sagt, während unten die Mutter unterschrieben hat.
const SPRUECHE_NORMAL = [
  'Guten Morgen. Hier, von {von}.',
  'Ich war krank, steht alles da drin.',
  'Muss ich hier noch was unterschreiben?',
  '{der} hat das gestern geschrieben.',
  'Entschuldigung, ich bin spät dran.',
]

const SPRUECHE_NERVOES = [
  'Das … das ist echt, wirklich.',
  'Können Sie das einfach abstempeln? Ich hab gleich Klausur.',
  '{der} schreibt halt manchmal anders.',
  'Ist irgendwas nicht in Ordnung?',
  'Ich hab das nicht selbst geschrieben, falls Sie das denken.',
]

export { VERSTOSS }

/**
 * Erzeugt einen Schüler samt eingereichter Entschuldigung.
 * @param {number} day    aktueller Spieltag (steuert Fälschungsqualität)
 * @param {number} index  Position in der Warteschlange
 * @param {string} verstoss  welcher Fehler eingebaut werden soll
 */
export function makeApplicant(day, index, verstoss = VERSTOSS.KEINER, figur = null, auftritt = null) {
  const seed = hashSeed(`d${day}-i${index}`)
  const { range, int, pick, chance } = rngHelpers(makeRng(seed))

  // Auch bei einer festen Figur werden alle Zufallswerte gezogen: So bleibt
  // der Strom für die übrigen Schüler des Tages unverändert.
  const gewuerfeltW = chance(0.5)
  const gVorname = pick(gewuerfeltW ? VORNAMEN_W : VORNAMEN_M)
  const gNachname = pick(NACHNAMEN)
  const gKlasse = pick(KLASSEN)

  const weiblich = figur ? figur.weiblich : gewuerfeltW
  const vorname = figur ? figur.vorname : gVorname
  const nachname = figur ? figur.nachname : gNachname
  const grund = pick(GRUENDE)
  const praxis = pick(PRAXEN)

  // Stammgäste tragen über alle Tage dasselbe Gesicht – ihre Identität hängt
  // an der Figur, nicht am Tag.
  const identSeed = figur ? hashSeed(`figur-${figur.id}`) : seed

  // Der Elternteil hat eine feste Identität – seine Unterschrift liegt in der
  // Akte und ist über alle Tage hinweg dieselbe.
  const elternSeed = hashSeed(`eltern-${vorname}-${nachname}`)

  const heute = 8 + day // Schultag im Monat, reicht für Tag 1–20
  const fehltagStart = heute - grund.tage

  const a = {
    id: `${day}-${index}`,
    seed,
    vorname,
    nachname,
    name: `${vorname} ${nachname}`,
    klasse: figur ? figur.klasse : gKlasse,
    schuelerNr: String(int(10000, 99999)),
    // Die Person am Schalter …
    face: makeFace(identSeed, weiblich),
    // … und das Foto in der Akte. Normalerweise dieselbe Person.
    aktenFoto: makeFace(identSeed, weiblich),
    elternSeed,
    elternteil: figur ? figur.elternteil : (chance(0.5) ? 'Mutter' : 'Vater'),
    figur,
    auftritt,
    // Richtet sich nach dem Kind, nicht nach dem unterschreibenden Elternteil.
    kind: weiblich ? 'Tochter' : 'Sohn',
    weiblich,
    grund: grund.text,
    tage: grund.tage,
    fehltagVon: fehltagStart,
    fehltagBis: heute - 1,
    datumNotiz: heute, // Ausstellungsdatum auf der Notiz
    // Ab drei Fehltagen liegt ein ärztliches Attest bei – als eigenes Blatt,
    // nicht als Zeile auf der Entschuldigung.
    attest:
      grund.tage >= 3
        ? {
            praxis,
            von: fehltagStart,
            bis: heute - 1,
            ausgestellt: fehltagStart,
            arztSeed: hashSeed(`arzt-${praxis.arzt}`),
          }
        : null,
    nameAufNotiz: `${vorname} ${nachname}`,
    // Vermerk des Rektorats in der Akte – hebt alle anderen Prüfungen auf.
    sperrvermerk: false,
    verstoss,
    forgery: 0,
    nervoes: false,
    spruch: '',
  }

  // --- Verstoß einbauen -------------------------------------------------
  switch (verstoss) {
    case VERSTOSS.FAELSCHUNG:
      a.forgery = forgeryStrengthForDay(day)
      a.nervoes = chance(0.7)
      break
    case VERSTOSS.DATUM:
      // Notiz ist auf ein Datum ausgestellt, das vor dem Fehltag liegt –
      // jemand hat sie also vorab geschrieben.
      a.datumNotiz = fehltagStart - int(1, 4)
      break
    case VERSTOSS.ATTEST_FEHLT:
      a.tage = int(3, 5)
      a.fehltagVon = heute - a.tage
      a.fehltagBis = heute - 1
      a.attest = null
      break

    case VERSTOSS.ATTEST_ZEITRAUM: {
      // Das Attest liegt bei und wirkt auf den ersten Blick in Ordnung –
      // es deckt nur nicht alle Fehltage ab. Wer bloß prüft, OB ein Attest
      // da ist, übersieht das.
      a.tage = int(4, 6)
      a.fehltagVon = heute - a.tage
      a.fehltagBis = heute - 1
      const fehlend = int(1, Math.max(1, a.tage - 2))
      a.attest = {
        praxis,
        von: a.fehltagVon,
        bis: a.fehltagBis - fehlend,
        ausgestellt: a.fehltagVon,
        arztSeed: hashSeed(`arzt-${praxis.arzt}`),
      }
      break
    }
    case VERSTOSS.NAME: {
      // Klassiker: Notiz des Geschwisterkinds mitgebracht. Bewusst gleiches
      // Geschlecht – sonst verriete schon das „Sohn/Tochter" den Fehler und
      // der Namensabgleich wäre keine Prüfung mehr, sondern geschenkt.
      const liste = weiblich ? VORNAMEN_W : VORNAMEN_M
      let anderer = pick(liste)
      if (anderer === vorname) anderer = pick(liste.filter((n) => n !== vorname))
      a.nameAufNotiz = `${anderer} ${nachname}`
      break
    }
    case VERSTOSS.FOTO:
      a.aktenFoto = abweichendesFoto(a.face, fotoAbweichungFuerTag(day), seed)
      a.nervoes = chance(0.5)
      break
    case VERSTOSS.KLAUSUR: {
      // Schüler aus einer Klausurklasse – Elternunterschrift reicht dafür
      // nicht, es braucht ein Attest. Der Plan liegt auf dem Tisch.
      const plan = klausurplan(day)
      a.klasse = pick(plan).klasse
      a.tage = int(1, 2)
      a.fehltagVon = heute - a.tage
      a.fehltagBis = heute - 1
      a.attest = null
      break
    }

    case VERSTOSS.SPERRVERMERK:
      // Papiere können makellos sein – dieser Fall gehört trotzdem abgelehnt.
      a.sperrvermerk = true
      break

    default:
      break
  }

  // Kollision mit dem Klausurplan auflösen.
  //
  // Die Klasse wird unabhängig vom Klausurplan gewürfelt. Ohne diese Prüfung
  // landet ein als fehlerfrei gedachter Schüler gelegentlich in einer
  // Klausurklasse ohne Attest – und ist damit nach Regel 6 doch abzuweisen.
  // Das würde die vorgegebene Fehlerquote unterlaufen: Der Tag enthielte
  // mehr Verstöße, als buildQueue eingeplant hat.
  if (verstoss !== VERSTOSS.KLAUSUR && !a.attest && hatKlausur(day, a.klasse)) {
    const frei = KLASSEN.filter((k) => !hatKlausur(day, k))
    if (frei.length) a.klasse = pick(frei)
  }

  a.spruch = (a.nervoes ? pick(SPRUECHE_NERVOES) : pick(SPRUECHE_NORMAL))
    .replace('{von}', a.elternteil === 'Mutter' ? 'meiner Mutter' : 'meinem Vater')
    .replace('{der}', a.elternteil === 'Mutter' ? 'Meine Mutter' : 'Mein Vater')
  a.tilt = range(-3, 3)

  return a
}

/**
 * Stellt die Warteschlange eines Tages zusammen.
 * Die Fehlerquote steigt mit dem Tag, bleibt aber immer unter der Hälfte –
 * sonst kippt das Spiel von "prüfen" zu "grundsätzlich misstrauen".
 */
export function buildQueue(day, laenge = 8) {
  const { rng, pick } = rngHelpers(makeRng(hashSeed(`queue-${day}`)))

  const fehlerQuote = Math.min(0.45, 0.18 + day * 0.035)
  // Welche Verstöße heute möglich sind, steht an den Regeln selbst.
  const verfuegbar = REGELN.filter((r) => r.abTag <= day).map((r) => r.id)

  // Die Anzahl wird gesetzt, nicht gewürfelt.
  //
  // Vorher entschied ein Münzwurf je Vorgang – im Mittel stimmte die Quote
  // damit, im Einzelfall aber überhaupt nicht: An Tag 12 kamen so 11 von 14
  // Verstößen heraus, also 79 % statt der vorgesehenen 45 %. Und weil alle
  // Seeds fest sind, ist das kein Pech, das sich beim nächsten Anlauf
  // ausgleicht: JEDER Spieler bekommt denselben Tag. Genau daran kippt das
  // Spiel von „prüfen" zu „grundsätzlich misstrauen".
  //
  // Abgerundet, nicht gerundet: Aufgerundet käme an Tag 8 mit 6 von 13
  // Vorgängen wieder eine Quote von 46 % heraus – über der Grenze, die diese
  // Zeile gerade einhalten soll.
  const sollFehler = Math.floor(laenge * fehlerQuote)

  const zuteilung = Array.from({ length: laenge }, () => ({
    verstoss: VERSTOSS.KEINER,
    figur: null,
    auftritt: null,
  }))

  const freieStellen = () =>
    zuteilung.map((z, i) => (!z.figur && i > 0 ? i : -1)).filter((i) => i >= 0)

  // Stammgäste zuerst: Ihre Auftritte stehen im Drehbuch und dürfen nicht
  // von einer nachträglich eingesetzten Regel verdrängt werden. Sie zählen
  // in die Quote hinein, statt obendrauf zu kommen.
  for (const { figur, auftritt } of auftritteAmTag(day)) {
    const frei = freieStellen()
    const stelle = frei.length ? pick(frei) : 1
    zuteilung[stelle] = { verstoss: auftritt.verstoss, figur, auftritt }
  }

  const fehlerZahl = () => zuteilung.filter((z) => z.verstoss !== VERSTOSS.KEINER).length

  // Restliche Verstöße auf zufällige freie Plätze verteilen (Fisher-Yates,
  // damit jede Anordnung gleich wahrscheinlich ist).
  const offen = zuteilung
    .map((z, i) => (!z.figur && z.verstoss === VERSTOSS.KEINER ? i : -1))
    .filter((i) => i >= 0)
  for (let i = offen.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[offen[i], offen[j]] = [offen[j], offen[i]]
  }
  for (const stelle of offen) {
    if (fehlerZahl() >= sollFehler) break
    zuteilung[stelle].verstoss = pick(verfuegbar)
  }

  // Heute neu eingeführte Regeln müssen mindestens einmal vorkommen.
  //
  // Ohne diese Zusicherung kann eine Regel am Tag ihrer Einführung schlicht
  // ausbleiben – bei acht möglichen Verstoßarten und rund sechs Verstößen je
  // Schicht ist das keineswegs unwahrscheinlich. Die Dienstanweisung kündigt
  // dann etwas an, das den ganzen Tag nicht vorkommt, und genau der Moment,
  // der das Spiel antreibt, läuft ins Leere.
  //
  // Umgewidmet wird ein bestehender Verstoß, statt einen weiteren anzulegen –
  // sonst überschriebe die Zusicherung die eben erst gesetzte Quote.
  for (const regel of neueRegeln(day)) {
    if (zuteilung.some((z) => z.verstoss === regel.id)) continue
    const belegt = zuteilung
      .map((z, i) => (!z.figur && z.verstoss !== VERSTOSS.KEINER && i > 0 ? i : -1))
      .filter((i) => i >= 0)
    const stelle = belegt.length ? pick(belegt) : (freieStellen()[0] ?? 1)
    zuteilung[stelle].verstoss = regel.id
  }

  const schlange = zuteilung.map((z, i) => makeApplicant(day, i, z.verstoss, z.figur, z.auftritt))

  // Gilt heute eine Anweisung, muss sie auch jemanden treffen.
  //
  // Und zwar jemanden mit einwandfreien Papieren: Läge zusätzlich ein Verstoß
  // vor, wäre der Fall ohnehin abzulehnen, und aus der Entscheidung würde
  // wieder eine Rechenaufgabe. Ohne diese Zusicherung kann eine Anweisung am
  // Tag ihres Erlasses ins Leere laufen – dieselbe Falle wie bei den Regeln,
  // nur schlimmer: Eine Regel, die nicht vorkommt, fehlt bloß. Eine
  // Anordnung, die niemanden trifft, entwertet den ganzen Einfall.
  const anw = anweisungFuerTag(day)
  if (anw && !schlange.some((a) => a.verstoss === VERSTOSS.KEINER && anw.betrifft(a))) {
    const kandidaten = schlange
      .map((a, i) => (a.verstoss === VERSTOSS.KEINER && i > 0 ? i : -1))
      .filter((i) => i >= 0)
    if (kandidaten.length) {
      const stelle = pick(kandidaten)
      passendMachen(anw, schlange[stelle], !!anw.klasse && hatKlausur(day, anw.klasse))
    }
  }

  return schlange
}
