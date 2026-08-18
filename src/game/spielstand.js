/**
 * Spielzustand und Ablaufsteuerung.
 *
 * Bewusst ein reiner Reducer ohne React-Bezug: Der komplette Spielverlauf
 * lässt sich dadurch mit einer Schleife über `reduce` durchtesten, ohne
 * jemals eine Oberfläche zu rendern.
 *
 * Ablauf:
 *   TITEL → BRIEFING → SCHICHT → ABRECHNUNG → BRIEFING → … → ENDE
 */

import { tagInfo, LETZTER_TAG } from './days.js'
import { ANRUFE_PRO_TAG } from './telefon.js'

export const PHASE = {
  TITEL: 'titel',
  BRIEFING: 'briefing',
  SCHICHT: 'schicht',
  ABRECHNUNG: 'abrechnung',
  ENDE: 'ende',
}

export const ENDE = {
  ENTLASSEN: 'entlassen',
  AUFSTAND: 'aufstand',
  GESCHAFFT: 'geschafft',
  DISZIPLINAR: 'disziplinar',
}

/** Ab der dritten angenommenen Zuwendung ist sofort Schluss. */
export const BESTECHUNGSGRENZE = 3

const START_RUF = { rektor: 60, schueler: 55 }

const klemm = (n) => Math.max(0, Math.min(100, n))

export function neuerStand() {
  return {
    phase: PHASE.TITEL,
    tag: 1,
    ruf: { ...START_RUF },
    rufBeiTagesbeginn: { ...START_RUF },
    gesamt: {
      richtig: 0,
      falsch: 0,
      // Getrennt gezählt, weil im Zeugnis die interessantere Frage lautet:
      // Wie viele der tatsächlichen Verstöße hast du erwischt – und wie oft
      // hast du jemanden abgewiesen, der nichts verbrochen hatte?
      verstoesse: 0,
      erwischt: 0,
      zuUnrecht: 0,
      // Wissentlich durchgewunken: Der Verstoß war durch einen Widerspruch
      // aufgedeckt, und danach wurde trotzdem „entschuldigt" gestempelt. Das
      // ist die einzige Zahl im Spiel, die Milde von Schlamperei trennt –
      // ohne den Widerspruch sehen beide gleich aus.
      nachsicht: 0,
    },
    // Anweisungsfälle stehen bewusst außerhalb von `gesamt`: Sie sind keine
    // Leistung, die sich in einer Quote ausdrücken ließe, sondern eine
    // Haltung. Im Zeugnis erscheinen sie als eigene Zeile ohne Note.
    anweisungen: { befolgt: 0, verweigert: 0 },
    // Widersprüche am Schalter. Steht wie die Anweisungen außerhalb von
    // `gesamt`: Es ist keine Leistung mit Quote, sondern eine Arbeitsweise.
    konfrontationen: { treffer: 0, daneben: 0 },
    tagBilanz: { richtig: 0, falsch: 0, anweisung: null },
    index: 0,
    ende: null,
    // Was bei wiederkehrenden Figuren bisher entschieden wurde. Nur daraus
    // kann eine Figur sich später auf die letzte Begegnung beziehen.
    begegnungen: {},
    // Angenommene Zuwendungen. Bleiben aktenkundig, auch wenn es bei einer
    // einzigen bleibt.
    bestechungen: 0,
    // Rückfragen für heute. Wird zu jedem Schichtbeginn neu gefüllt und
    // bewusst NICHT gespeichert: Ein Vorrat, der über Nacht überlebt, wäre
    // keine Tagesration mehr.
    anrufe: ANRUFE_PRO_TAG,
    abbruch: false,
  }
}

/**
 * Warnstufe des Rektorats.
 *
 * 0 = unauffällig, 1 = beobachtet, 2 = förmlich verwarnt.
 * Bewusst gestaffelt: Ein sofortiger Rauswurf wäre billig - man lädt neu und
 * weiß Bescheid. Zu wissen, dass sie es mitbekommen haben, und nicht zu
 * wissen, wann es einen einholt, wirkt ungleich stärker. Drohung schlägt
 * Schaden.
 */
export function warnstufe(stand) {
  return Math.min(2, stand.bestechungen)
}

/** Schulnote aus der Trefferquote – in einer Schule bekommt am Ende auch
 *  der Prüfende eine. */
export function note(quote) {
  if (quote >= 0.95) return { zahl: 1, wort: 'sehr gut' }
  if (quote >= 0.87) return { zahl: 2, wort: 'gut' }
  if (quote >= 0.78) return { zahl: 3, wort: 'befriedigend' }
  if (quote >= 0.67) return { zahl: 4, wort: 'ausreichend' }
  if (quote >= 0.5) return { zahl: 5, wort: 'mangelhaft' }
  return { zahl: 6, wort: 'ungenügend' }
}

/**
 * Prüft nach Schichtende, ob das Spiel vorbei ist.
 * Bewusst erst am Tagesende und nicht mitten in der Schicht: Man arbeitet
 * seinen Tag zu Ende und erfährt dann, dass es der letzte war.
 */
export function pruefeEnde(stand) {
  if (stand.bestechungen >= BESTECHUNGSGRENZE) return ENDE.DISZIPLINAR
  if (stand.ruf.rektor <= 0) return ENDE.ENTLASSEN
  if (stand.ruf.schueler <= 0) return ENDE.AUFSTAND
  if (stand.tag >= LETZTER_TAG) return ENDE.GESCHAFFT
  return null
}

export function reduce(stand, aktion) {
  switch (aktion.typ) {
    case 'NEU':
      return { ...neuerStand(), phase: PHASE.BRIEFING }

    case 'FORTSETZEN':
      return {
        ...aktion.stand,
        phase: PHASE.BRIEFING,
        index: 0,
        tagBilanz: { richtig: 0, falsch: 0, anweisung: null },
      }

    case 'SCHICHT_STARTEN':
      return {
        ...stand,
        phase: PHASE.SCHICHT,
        index: 0,
        tagBilanz: { richtig: 0, falsch: 0, anweisung: null },
        anrufe: ANRUFE_PRO_TAG,
        rufBeiTagesbeginn: { ...stand.ruf },
      }

    case 'ANRUFEN':
      return { ...stand, anrufe: Math.max(0, stand.anrufe - 1) }

    /**
     * Jemandem zwei Felder hinhalten.
     *
     * Ein Treffer kostet trotzdem etwas: Recht zu haben macht die Sache für
     * den, der davorsteht, nicht angenehmer. Ein Fehlgriff kostet das
     * Vierfache – das ist der ganze Grund, warum sich die Paartabelle nicht
     * einfach am lebenden Objekt durchprobieren lässt.
     *
     * Ein Vergreifen in der Bedienung (zwei Felder, die miteinander nichts zu
     * tun haben) löst diese Aktion gar nicht erst aus. Bestraft wird eine
     * Anschuldigung, nicht ein Fehlklick.
     */
    case 'KONFRONTIEREN':
      return {
        ...stand,
        ruf: {
          ...stand.ruf,
          schueler: klemm(stand.ruf.schueler + (aktion.treffer ? -1 : -4)),
        },
        konfrontationen: {
          treffer: stand.konfrontationen.treffer + (aktion.treffer ? 1 : 0),
          daneben: stand.konfrontationen.daneben + (aktion.treffer ? 0 : 1),
        },
      }

    case 'ENTSCHEIDEN': {
      const { richtig, kind, hatteVerstoss, figurId, bestochen, anweisung, aufgedeckt } = aktion

      // Wissentliche Nachsicht: Der Verstoß wurde vorher durch einen
      // Widerspruch aufgedeckt und danach trotzdem durchgewunken.
      //
      // Bewusst als Zuschlag auf die normale Fehlentscheidung und nicht als
      // eigene Rechnung: Falsch bleibt falsch, das Rektorat zählt weiterhin
      // Korrektheit. Der Zuschlag bildet nur ab, dass hier ein Unterschied
      // besteht – wer erst nachfragt und dann durchwinkt, hat sich entschieden
      // und nicht bloß nicht hingesehen. Die Schülerschaft weiß das, das
      // Rektorat auch.
      const milde = aufgedeckt && kind === 'ok' && !anweisung

      // Anweisungsfälle laufen an der gesamten Trefferrechnung vorbei.
      //
      // Die Rufkosten sind gespiegelt, nicht bloß gegenläufig: Befolgen
      // bringt beim Rektorat genau so viel, wie es bei der Schülerschaft
      // kostet – und umgekehrt. Beide Wege summieren sich auf denselben Wert.
      //
      // Das ist nicht Ziererei, sondern die Bedingung dafür, dass es eine
      // Entscheidung bleibt: Wäre eine Seite unterm Strich günstiger, wäre
      // die Anweisung keine Zumutung, sondern nur eine neunte Regel mit
      // einem Rechenweg. Der frühere Entwurf (+4/−8 gegen −8/+6) war genau
      // das – Verweigern kostete zwei Punkte weniger.
      if (anweisung) {
        const befolgt = kind === 'deny'
        return {
          ...stand,
          ruf: {
            rektor: klemm(stand.ruf.rektor + (befolgt ? 4 : -6)),
            schueler: klemm(stand.ruf.schueler + (befolgt ? -6 : 4)),
          },
          tagBilanz: { ...stand.tagBilanz, anweisung: befolgt ? 'befolgt' : 'verweigert' },
          anweisungen: {
            befolgt: stand.anweisungen.befolgt + (befolgt ? 1 : 0),
            verweigert: stand.anweisungen.verweigert + (befolgt ? 0 : 1),
          },
          begegnungen: figurId
            ? {
                ...stand.begegnungen,
                [figurId]: [
                  ...(stand.begegnungen[figurId] ?? []),
                  { tag: stand.tag, entscheidung: kind, anweisung: true },
                ],
              }
            : stand.begegnungen,
        }
      }

      return {
        ...stand,
        ruf: {
          // Das Rektorat misst Korrektheit …
          rektor: klemm(stand.ruf.rektor + (richtig ? 3 : -8) + (milde ? -4 : 0)),
          // … die Schülerschaft misst Milde. Beide gleichzeitig zu bedienen
          // ist nicht vorgesehen – darin liegt der ganze Druck.
          //
          // Angenommenes Geld schlägt zusätzlich zu Buche: Es spricht sich
          // herum. Die Fehlentscheidung selbst kostet beim Rektorat ohnehin
          // schon – Bestechung ist teuer, nicht gratis.
          schueler: klemm(
            stand.ruf.schueler + (kind === 'ok' ? 3 : -4) + (bestochen ? 7 : 0) + (milde ? 4 : 0),
          ),
        },
        tagBilanz: {
          ...stand.tagBilanz,
          richtig: stand.tagBilanz.richtig + (richtig ? 1 : 0),
          falsch: stand.tagBilanz.falsch + (richtig ? 0 : 1),
        },
        gesamt: {
          richtig: stand.gesamt.richtig + (richtig ? 1 : 0),
          falsch: stand.gesamt.falsch + (richtig ? 0 : 1),
          verstoesse: stand.gesamt.verstoesse + (hatteVerstoss ? 1 : 0),
          // Erwischt: Verstoß lag vor und wurde abgewiesen.
          erwischt: stand.gesamt.erwischt + (hatteVerstoss && kind === 'deny' ? 1 : 0),
          // Zu Unrecht: kein Verstoß, trotzdem abgewiesen.
          zuUnrecht: stand.gesamt.zuUnrecht + (!hatteVerstoss && kind === 'deny' ? 1 : 0),
          nachsicht: stand.gesamt.nachsicht + (milde ? 1 : 0),
        },
        begegnungen: figurId
          ? {
              ...stand.begegnungen,
              [figurId]: [
                ...(stand.begegnungen[figurId] ?? []),
                { tag: stand.tag, entscheidung: bestochen ? 'bestochen' : kind },
              ],
            }
          : stand.begegnungen,
        bestechungen: stand.bestechungen + (bestochen ? 1 : 0),
        // Bei der dritten Zuwendung endet die Schicht sofort – der nächste
        // Schritt führt nicht mehr zum nächsten Schüler.
        abbruch: stand.bestechungen + (bestochen ? 1 : 0) >= BESTECHUNGSGRENZE,
      }
    }

    case 'NAECHSTER': {
      if (stand.abbruch) return { ...stand, phase: PHASE.ENDE, ende: ENDE.DISZIPLINAR }
      const naechster = stand.index + 1
      if (naechster >= tagInfo(stand.tag).anzahl) {
        return { ...stand, phase: PHASE.ABRECHNUNG }
      }
      return { ...stand, index: naechster }
    }

    case 'NAECHSTER_TAG': {
      const grund = pruefeEnde(stand)
      if (grund) return { ...stand, phase: PHASE.ENDE, ende: grund }
      return { ...stand, phase: PHASE.BRIEFING, tag: stand.tag + 1, index: 0 }
    }

    case 'ZURUECK_ZUM_TITEL':
      return { ...neuerStand(), phase: PHASE.TITEL }

    default:
      return stand
  }
}

// --- Speicherstand ------------------------------------------------------

const SCHLUESSEL = 'sekretariat.stand'

/** Nur den Fortschritt sichern, nicht die Ablaufphase – sonst lädt man
 *  mitten in einer Schicht ohne die zugehörige Warteschlange. */
export function speichern(stand) {
  try {
    localStorage.setItem(
      SCHLUESSEL,
      JSON.stringify({
        v: 1,
        tag: stand.tag,
        ruf: stand.ruf,
        gesamt: stand.gesamt,
        anweisungen: stand.anweisungen,
        konfrontationen: stand.konfrontationen,
        begegnungen: stand.begegnungen,
        bestechungen: stand.bestechungen,
      }),
    )
  } catch {
    // Privater Modus o. Ä. – ohne Speicherstand spielt es sich trotzdem.
  }
}

export function laden() {
  try {
    const roh = localStorage.getItem(SCHLUESSEL)
    if (!roh) return null
    const d = JSON.parse(roh)
    if (d?.v !== 1 || typeof d.tag !== 'number') return null
    return {
      ...neuerStand(),
      tag: Math.min(LETZTER_TAG, Math.max(1, d.tag)),
      ruf: { rektor: klemm(d.ruf?.rektor ?? 60), schueler: klemm(d.ruf?.schueler ?? 55) },
      begegnungen: d.begegnungen ?? {},
      bestechungen: d.bestechungen ?? 0,
      anweisungen: {
        befolgt: d.anweisungen?.befolgt ?? 0,
        verweigert: d.anweisungen?.verweigert ?? 0,
      },
      konfrontationen: {
        treffer: d.konfrontationen?.treffer ?? 0,
        daneben: d.konfrontationen?.daneben ?? 0,
      },
      gesamt: {
        richtig: d.gesamt?.richtig ?? 0,
        falsch: d.gesamt?.falsch ?? 0,
        verstoesse: d.gesamt?.verstoesse ?? 0,
        erwischt: d.gesamt?.erwischt ?? 0,
        zuUnrecht: d.gesamt?.zuUnrecht ?? 0,
        nachsicht: d.gesamt?.nachsicht ?? 0,
      },
    }
  } catch {
    return null
  }
}

export function loeschen() {
  try {
    localStorage.removeItem(SCHLUESSEL)
  } catch {
    // egal
  }
}
