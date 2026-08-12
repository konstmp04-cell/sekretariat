/**
 * Die Schülerzeitung „Der Pausenhof".
 *
 * Zwei Aufgaben auf einmal. Erstens gibt sie der Schule ein Eigenleben: Die
 * Heizung fällt aus, die Turnhalle säuft ab, die Grippewelle rollt an – Dinge,
 * die ohne dein Zutun passieren und die Welt größer machen als den Schalter.
 *
 * Zweitens, und wichtiger: Sie ist der Ort, an dem die Schule auf DICH
 * reagiert. Das Rektorat sagt dir nie ins Gesicht, dass es etwas mitbekommen
 * hat. Stattdessen liest du am Morgen eine Zeile, die zu deutlich klingt, um
 * Zufall zu sein – und weißt nicht, wie viel dahintersteckt.
 */

const WELTMELDUNGEN = {
  1: { titel: 'Neues Halbjahr beginnt', zeile: '840 Schüler kehren aus den Ferien zurück.' },
  2: { titel: 'Heizung im Ostflügel erneut ausgefallen', zeile: 'Unterricht findet in Jacken statt.' },
  3: { titel: 'Mensa streicht den Nachtisch', zeile: 'Die SV sammelt Unterschriften.' },
  4: { titel: 'Turnhalle nach Wasserschaden gesperrt', zeile: 'Sport fällt bis auf Weiteres aus.' },
  5: { titel: 'Neuer Kopierer im Lehrerzimmer', zeile: 'Für Schüler bleibt er verschlossen.' },
  6: { titel: 'Klausurphase beginnt', zeile: 'In den Fluren wird es merklich stiller.' },
  7: { titel: 'Fototermin: Viele erscheinen nicht', zeile: 'Die Akten bleiben lückenhaft.' },
  8: { titel: 'Fahrradständer überfüllt', zeile: 'Das Rektorat prüft eine Erweiterung.' },
  9: { titel: 'Grippewelle erreicht die Oberstufe', zeile: 'Die Krankmeldungen häufen sich.' },
  10: { titel: 'Abschlussfahrt steht auf der Kippe', zeile: 'Es fehlt an Begleitpersonen.' },
  11: { titel: 'Rektorat kündigt strengere Kontrollen an', zeile: 'Betroffen sei „der gesamte Verwaltungsablauf".' },
  12: { titel: 'Halbjahr endet', zeile: 'Die Zeugnisse sind in Vorbereitung.' },
}

/**
 * Meldungen, die auf das Verhalten am Schalter reagieren.
 * Absichtlich vage gehalten: Ein Gerücht wirkt bedrohlicher als eine
 * Feststellung, weil man nicht weiß, wie viel man ihm ansieht.
 */
function reaktionen(stand) {
  const r = []
  const { ruf, gesamt, bestechungen } = stand

  if (bestechungen >= 2) {
    r.push({
      titel: 'SV fordert Aufklärung über Vorgänge am Schalter',
      zeile: 'Von „Gefälligkeiten" ist die Rede. Namen nennt niemand.',
      brisant: true,
    })
  } else if (bestechungen >= 1) {
    r.push({
      titel: 'Gerücht: Im Sekretariat lässt sich reden',
      zeile: 'Bestätigen will das keiner. Erzählt wird es trotzdem.',
      brisant: true,
    })
  }

  if (ruf.schueler <= 30) {
    r.push({
      titel: '„Wie beim Zoll" – Unmut über den Schalter',
      zeile: 'Wer krank war, bringt lieber gleich drei Zettel mit.',
    })
  } else if (ruf.schueler >= 80) {
    r.push({
      titel: 'Sekretariat gilt als kulant',
      zeile: 'Die Fehlzeiten steigen das dritte Mal in Folge.',
    })
  }

  if (ruf.rektor <= 30) {
    r.push({
      titel: 'Rektorat prüft Abläufe im Sekretariat',
      zeile: 'Man wolle „die Sorgfalt sicherstellen".',
    })
  }

  // Die Stammgäste tauchen in der Zeitung auf, sobald sich ihre Geschichte
  // zuspitzt. Erst dadurch wirkt es, als spräche die Schule über sie – und
  // nicht nur der Schalter mit ihnen.
  const milan = stand.begegnungen?.milan ?? []
  const abgewiesen = milan.filter((x) => x.entscheidung === 'deny').length
  const durchgelassen = milan.filter((x) => x.entscheidung !== 'deny').length
  if (abgewiesen >= 2) {
    r.push({
      titel: 'Neuntklässler wegen wiederholter Fehlzeiten vorgeladen',
      zeile: 'Die Klassenleitung spricht von einem „hängenden Fall".',
    })
  } else if (durchgelassen >= 3) {
    r.push({
      titel: 'Fehlzeiten in der 9b auffällig gestiegen',
      zeile: 'Nachfragen bleiben bislang folgenlos.',
    })
  }

  if (gesamt.zuUnrecht >= 5) {
    r.push({
      titel: 'Beschwerden über abgewiesene Atteste',
      zeile: 'Mehrere Eltern haben sich schriftlich gemeldet.',
    })
  }

  return r
}

/**
 * Die Meldungen des Tages: eine aus der Welt, dazu höchstens zwei, die auf
 * das eigene Verhalten zurückgehen. Mehr würde die Ausgabe zum Pranger
 * machen – sie soll eine Zeitung bleiben, kein Zeugnis.
 */
export function ausgabe(day, stand) {
  const welt = WELTMELDUNGEN[day] ?? WELTMELDUNGEN[12]
  return [welt, ...reaktionen(stand).slice(0, 2)]
}
